import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import Follow from "@/models/Follow";
import { requireSessionUser, getSessionUser } from "@/lib/session";
import { serializePost, populatePostForViewer } from "@/lib/posts";

async function getMutualFollowerIds(userId) {
  const [followingIds, followerIds] = await Promise.all([
    Follow.distinct("following", { follower: userId }),
    Follow.distinct("follower", { following: userId }),
  ]);

  if (!followingIds.length || !followerIds.length) {
    return [];
  }

  const followerSet = new Set(followerIds.map((id) => id.toString()));
  return followingIds.map((id) => id.toString()).filter((id) => followerSet.has(id));
}

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const sessionUser = await getSessionUser(req);
      if (!sessionUser) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const mutualIds = await getMutualFollowerIds(sessionUser._id);
      const authorIds = Array.from(new Set([sessionUser._id.toString(), ...mutualIds]));

      const posts = await Post.find({ author: { $in: authorIds } })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate({ path: "author", select: "name username headline avatarUrl" })
        .populate({ path: "comments.author", select: "name username headline avatarUrl" });

      const payload = posts.map((post) => serializePost(post, sessionUser._id));
      res.status(200).json({ posts: payload });
    } catch (error) {
      console.error("Fetch posts error", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
    return;
  }

  if (req.method === "POST") {
    const user = await requireSessionUser(req, res);
    if (!user) return;

    try {
      const { title, content, tags } = req.body ?? {};
      if (!content || !content.trim()) {
        res.status(400).json({ message: "Post content is required" });
        return;
      }

      const post = await Post.create({
        author: user._id,
        title: title?.trim() ?? "",
        content: content.trim(),
        tags: Array.isArray(tags) ? tags.filter(Boolean).map((tag) => tag.trim()) : [],
        comments: [],
        likedBy: [],
        likes: 0,
      });

      const serialized = await populatePostForViewer(post, user._id);
      res.status(201).json({ post: serialized });
    } catch (error) {
      console.error("Create post error", error);
      res.status(500).json({ message: "Failed to create post" });
    }
    return;
  }

  res.status(405).json({ message: "Method not allowed" });
}
