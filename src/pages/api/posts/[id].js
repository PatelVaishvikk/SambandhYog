import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import { requireSessionUser } from "@/lib/session";

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
          id: post.author._id?.toString?.() ?? post.author,
          name: post.author.name,
          username: post.author.username,
          headline: post.author.headline ?? "",
          avatarUrl: post.author.avatarUrl ?? "/default-avatar.png",
        }
      : null,
  };
}

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await connectToDatabase();

  if (method === "GET") {
    try {
      const post = await Post.findById(id).populate("author", "name username headline avatarUrl");
      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }
      res.status(200).json({ post: serializePost(post) });
    } catch (error) {
      console.error("Get post error", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
    return;
  }

  if (method === "DELETE") {
    const user = await requireSessionUser(req, res);
    if (!user) return;

    try {
      const post = await Post.findById(id);
      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }

      if (post.author.toString() !== user._id.toString()) {
        res.status(403).json({ message: "You cannot delete this post" });
        return;
      }

      await post.deleteOne();
      res.status(204).end();
    } catch (error) {
      console.error("Delete post error", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
    return;
  }

  res.status(405).json({ message: "Method not allowed" });
}
