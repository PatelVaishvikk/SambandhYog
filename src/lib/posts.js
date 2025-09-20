import mongoose from "mongoose";
import Follow from "@/models/Follow";

function normalizeId(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value instanceof mongoose.Types.ObjectId) return value.toString();
  if (typeof value.toString === "function") return value.toString();
  return String(value);
}

function serializeUser(user) {
  if (!user) return null;
  return {
    id: normalizeId(user._id ?? user.id),
    name: user.name,
    username: user.username,
    headline: user.headline ?? "",
    avatarUrl: user.avatarUrl ?? "/default-avatar.png",
  };
}

export function serializePost(post, viewerId) {
  if (!post) return null;

  const likes = typeof post.likes === "number" ? post.likes : Array.isArray(post.likedBy) ? post.likedBy.length : 0;
  const likedBy = Array.isArray(post.likedBy) ? post.likedBy.map(normalizeId) : [];
  const normalizedViewerId = viewerId ? normalizeId(viewerId) : null;
  const viewerHasLiked = normalizedViewerId ? likedBy.includes(normalizedViewerId) : false;

  const comments = Array.isArray(post.comments)
    ? post.comments
        .map((comment) => ({
          id: normalizeId(comment._id ?? comment.id),
          content: comment.content ?? "",
          createdAt: comment.createdAt instanceof Date ? comment.createdAt.toISOString() : comment.createdAt,
          author: serializeUser(comment.author ?? comment.populatedAuthor ?? comment.authorId),
        }))
        .filter((comment) => comment.content)
    : [];

  const createdAt = post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt;
  const updatedAt = post.updatedAt instanceof Date ? post.updatedAt.toISOString() : post.updatedAt;

  return {
    id: normalizeId(post._id ?? post.id),
    title: post.title ?? "",
    content: post.content ?? "",
    tags: Array.isArray(post.tags) ? post.tags : [],
    likes,
    viewerHasLiked,
    comments,
    commentsCount: comments.length,
    createdAt,
    updatedAt,
    author: serializeUser(post.author),
  };
}

export async function ensurePostVisibility({ viewerId, authorId }) {
  if (!viewerId || !authorId) return false;
  const normalizedViewer = normalizeId(viewerId);
  const normalizedAuthor = normalizeId(authorId);
  if (!normalizedViewer || !normalizedAuthor) return false;
  if (normalizedViewer === normalizedAuthor) return true;
  const follow = await Follow.findOne({ follower: normalizedViewer, following: normalizedAuthor }).lean();
  return Boolean(follow);
}

export async function populatePostForViewer(post, viewerId) {
  if (!post) return null;
  if (typeof post.populate === "function") {
    await post.populate([
      { path: "author", select: "name username headline avatarUrl" },
      { path: "comments.author", select: "name username headline avatarUrl" },
    ]);
  }
  return serializePost(post, viewerId);
}
