import { connectToDatabase } from "@/lib/mongodb";
import { requireSessionUser } from "@/lib/session";
import Follow from "@/models/Follow";
import Story from "@/models/Story";
import { STORY_MAX_CHARACTERS } from "@/constants/stories";
import { getBackgroundPreset, groupStoriesByAuthor, serializeStoryGroup } from "@/lib/stories";

function normalizeObjectId(value) {
  if (!value) return null;
  return typeof value.toString === "function" ? value.toString() : value;
}

function sanitizeGroups(groups, viewerId) {
  return groups
    .map((group) => {
      if (!group) return null;
      const payload = { ...group };
      delete payload.latestCreatedAt;
      payload.isOwn = Boolean(group.isOwn ?? (payload.user?.id && payload.user.id === normalizeObjectId(viewerId)));
      return payload;
    })
    .filter(Boolean);
}

export default async function handler(req, res) {
  await connectToDatabase();

  const user = await requireSessionUser(req, res);
  if (!user) return;

  if (req.method === "GET") {
    try {
      const followDocs = await Follow.find({ follower: user._id }).select("following").lean();
      const authorIds = [
        user._id,
        ...followDocs.map((doc) => doc.following).filter(Boolean),
      ];

      const now = new Date();
      const storyDocs = await Story.find({
        author: { $in: authorIds },
        expiresAt: { $gt: now },
      })
        .sort({ createdAt: -1 })
        .populate("author", "name username headline avatarUrl")
        .lean();

      const groupedMap = groupStoriesByAuthor(storyDocs);

      const groups = [];
      groupedMap.forEach((stories, authorId) => {
        const sortedStories = stories.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        const group = serializeStoryGroup(sortedStories, user._id);
        if (group) {
          group.latestCreatedAt = sortedStories[sortedStories.length - 1]?.createdAt ?? null;
          groups.push(group);
        }
      });

      groups.sort((a, b) => {
        const aOwn = a.user?.id === normalizeObjectId(user._id);
        const bOwn = b.user?.id === normalizeObjectId(user._id);
        if (aOwn && !bOwn) return -1;
        if (!aOwn && bOwn) return 1;
        const aTime = new Date(a.latestCreatedAt || 0).getTime();
        const bTime = new Date(b.latestCreatedAt || 0).getTime();
        return bTime - aTime;
      });

      const payload = sanitizeGroups(groups, user._id);
      res.status(200).json({ stories: payload });
    } catch (error) {
      console.error("Fetch stories error", error);
      res.status(500).json({ message: "Failed to load stories" });
    }
    return;
  }

  if (req.method === "POST") {
    const { content, backgroundId } = req.body ?? {};

    const trimmed = typeof content === "string" ? content.trim() : "";
    if (!trimmed) {
      res.status(400).json({ message: "Story content is required" });
      return;
    }

    if (trimmed.length > STORY_MAX_CHARACTERS) {
      res.status(400).json({ message: `Story is too long (max ${STORY_MAX_CHARACTERS} characters)` });
      return;
    }

    const preset = getBackgroundPreset(backgroundId);

    try {
      const story = await Story.create({
        author: user._id,
        content: trimmed,
        backgroundId: preset.id,
        textClass: preset.textClass,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      await story.populate({ path: "author", select: "name username headline avatarUrl" });

      const authorStories = await Story.find({
        author: user._id,
        expiresAt: { $gt: new Date() },
      })
        .sort({ createdAt: -1 })
        .populate("author", "name username headline avatarUrl");

      const groupedMap = groupStoriesByAuthor(authorStories);
      const authorGroup = groupedMap.get(normalizeObjectId(user._id));
      const group = authorGroup ? serializeStoryGroup(authorGroup.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)), user._id) : null;

      res.status(201).json({ group });
    } catch (error) {
      console.error("Create story error", error);
      res.status(500).json({ message: "Failed to create story" });
    }
    return;
  }

  res.status(405).json({ message: "Method not allowed" });
}
