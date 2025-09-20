import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import { requireSessionUser } from "@/lib/session";
import { ensurePostVisibility, populatePostForViewer } from "@/lib/posts";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  await connectToDatabase();

  const user = await requireSessionUser(req, res);
  if (!user) return;

  const { postId, content } = req.body ?? {};
  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400).json({ message: "postId is required" });
    return;
  }

  const trimmed = typeof content === "string" ? content.trim() : "";
  if (!trimmed) {
    res.status(400).json({ message: "Comment content is required" });
    return;
  }

  try {
    const post = await Post.findById(postId).populate({ path: "author", select: "name username headline avatarUrl" });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const canView = await ensurePostVisibility({ viewerId: user._id, authorId: post.author?._id ?? post.author });
    if (!canView) {
      res.status(403).json({ message: "Follow this member to interact with their posts" });
      return;
    }

    post.comments.push({ author: user._id, content: trimmed });
    await post.save();

    await post.populate([
      { path: "author", select: "name username headline avatarUrl" },
      { path: "comments.author", select: "name username headline avatarUrl" },
    ]);

    const serialized = await populatePostForViewer(post, user._id);
    res.status(200).json({ post: serialized });
  } catch (error) {
    console.error("Create comment error", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
}
