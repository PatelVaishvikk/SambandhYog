import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import { requireSessionUser } from "@/lib/session";
import { serializePost, ensurePostVisibility, populatePostForViewer } from "@/lib/posts";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await connectToDatabase();

  if (method === "GET") {
    const user = await requireSessionUser(req, res);
    if (!user) return;

    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid post id" });
        return;
      }

      const post = await Post.findById(id)
        .populate({ path: "author", select: "name username headline avatarUrl" })
        .populate({ path: "comments.author", select: "name username headline avatarUrl" });
      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }

      const canView = await ensurePostVisibility({ viewerId: user._id, authorId: post.author?._id ?? post.author });
      if (!canView) {
        res.status(403).json({ message: "Follow this member to view their posts" });
        return;
      }

      res.status(200).json({ post: serializePost(post, user._id) });
    } catch (error) {
      console.error("Get post error", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
    return;
  }

  if (method === "PUT") {
    const user = await requireSessionUser(req, res);
    if (!user) return;

    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid post id" });
        return;
      }

      const post = await Post.findById(id);
      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }

      if (post.author.toString() !== user._id.toString()) {
        res.status(403).json({ message: "You cannot update this post" });
        return;
      }

      const { title, content, tags } = req.body ?? {};
      const trimmedContent = typeof content === "string" ? content.trim() : "";
      if (!trimmedContent) {
        res.status(400).json({ message: "Post content is required" });
        return;
      }

      post.title = typeof title === "string" ? title.trim() : post.title;
      post.content = trimmedContent;
      if (Array.isArray(tags)) {
        post.tags = tags.filter(Boolean).map((tag) => tag.trim());
      }

      await post.save();
      const serialized = await populatePostForViewer(post, user._id);
      res.status(200).json({ post: serialized });
    } catch (error) {
      console.error("Update post error", error);
      res.status(500).json({ message: "Failed to update post" });
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
