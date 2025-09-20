import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import { requireSessionUser } from "@/lib/session";
import { populatePostForViewer } from "@/lib/posts";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  await connectToDatabase();

  const user = await requireSessionUser(req, res);
  if (!user) return;

  const { postId } = req.body ?? {};
  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400).json({ message: "postId is required" });
    return;
  }

  try {
    const post = await Post.findById(postId).populate([
      { path: "author", select: "name username headline avatarUrl" },
      { path: "comments.author", select: "name username headline avatarUrl" },
    ]);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const viewerId = user._id.toString();
    const likedIndex = post.likedBy.findIndex((entry) => entry.toString() === viewerId);

    if (likedIndex >= 0) {
      post.likedBy.splice(likedIndex, 1);
      post.likes = Math.max((post.likes ?? 1) - 1, 0);
    } else {
      post.likedBy.push(user._id);
      post.likes = (post.likes ?? 0) + 1;
    }

    await post.save();
    await post.populate([
      { path: "author", select: "name username headline avatarUrl" },
      { path: "comments.author", select: "name username headline avatarUrl" },
    ]);

    const serialized = await populatePostForViewer(post, user._id);
    res.status(200).json({ post: serialized });
  } catch (error) {
    console.error("Toggle like error", error);
    res.status(500).json({ message: "Failed to update reaction" });
  }
}

