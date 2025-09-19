import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import Follow from "@/models/Follow";
import { requireSessionUser, getSessionUser } from "@/lib/session";

function serializePost(post) {
  return {
    id: post._id.toString(),
    title: post.title,
    content: post.content,
    tags: post.tags ?? [],
    likes: post.likes ?? 0,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: post.author
      ? {
          id: post.author._id?.toString?.() ?? post.author.id ?? post.author,
          name: post.author.name,
          username: post.author.username,
          headline: post.author.headline ?? "",
          avatarUrl: post.author.avatarUrl ?? "/default-avatar.png",
        }
      : null,
  };
}

async function getMutualFollowerIds(userId) {
  const [followingDocs, followerDocs] = await Promise.all([
    Follow.find({ follower: userId }).select("following"),
    Follow.find({ following: userId }).select("follower"),
  ]);

  const followingSet = new Set(followingDocs.map((doc) => doc.following.toString()));
  const mutualIds = followerDocs
    .map((doc) => doc.follower.toString())
    .filter((followerId) => followingSet.has(followerId));

  return mutualIds;
}

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const sessionUser = await getSessionUser(req);
      if (!sessionUser) {
        res.status(200).json({ posts: [] });
        return;
      }

      const mutualIds = await getMutualFollowerIds(sessionUser._id);
      const allowedAuthorIds = [sessionUser._id.toString(), ...mutualIds];

      const posts = await Post.find({ author: { $in: allowedAuthorIds } })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate("author", "name username headline avatarUrl");

      res.status(200).json({ posts: posts.map(serializePost) });
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
      });

      await post.populate("author", "name username headline avatarUrl");

      res.status(201).json({ post: serializePost(post) });
    } catch (error) {
      console.error("Create post error", error);
      res.status(500).json({ message: "Failed to create post" });
    }
    return;
  }

  res.status(405).json({ message: "Method not allowed" });
}
