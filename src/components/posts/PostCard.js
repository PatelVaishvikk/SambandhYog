"use client";

import { useMemo, useState } from "react";
import { Check, Edit2, MessageCircle, Trash2, X } from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import LikeButton from "@/components/posts/LikeButton";
import CommentSection from "@/components/posts/CommentSection";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { formatRelativeTime } from "@/utils/formatters";
import { usePosts } from "@/context/PostsContext";

export default function PostCard({ post }) {
  const { toggleReaction, addComment, updatePost, deletePost, currentUser } = usePosts();
  const [isCommenting, setIsCommenting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editTitle, setEditTitle] = useState(post?.title ?? "");
  const [editContent, setEditContent] = useState(post?.content ?? "");
  const [editTags, setEditTags] = useState(Array.isArray(post?.tags) ? post.tags.join(", ") : "");

  const isAuthor = useMemo(() => currentUser?.id && post?.author?.id && currentUser.id === post.author.id, [currentUser?.id, post?.author?.id]);

  if (!post) return null;

  const authorHeadline = post.author?.headline || "Uplifting professional";

  const handleToggleReaction = async () => {
    try {
      await toggleReaction?.(post.id);
    } catch (error) {
      console.error("Toggle reaction", error);
    }
  };

  const handleSubmitComment = async (content) => {
    if (!content) return;
    setIsCommenting(true);
    try {
      await addComment?.(post.id, content);
    } catch (error) {
      console.error("Add comment", error);
    } finally {
      setIsCommenting(false);
    }
  };

  const resetEditState = () => {
    setIsEditing(false);
    setEditTitle(post.title ?? "");
    setEditContent(post.content ?? "");
    setEditTags(Array.isArray(post.tags) ? post.tags.join(", ") : "");
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const trimmedContent = editContent.trim();
    if (!trimmedContent) {
      toast.error("Post content cannot be empty.");
      return;
    }
    setIsSaving(true);
    try {
      const tags = editTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      await updatePost?.(post.id, {
        title: editTitle.trim(),
        content: trimmedContent,
        tags,
      });
      toast.success("Post updated.");
      setIsEditing(false);
    } catch (error) {
      console.error("Update post", error);
      toast.error(error.message ?? "Failed to update post.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    const confirmed = window.confirm("Delete this post? This action cannot be undone.");
    if (!confirmed) return;
    setIsDeleting(true);
    try {
      await deletePost?.(post.id);
      toast.success("Post removed.");
    } catch (error) {
      console.error("Delete post", error);
      toast.error(error.message ?? "Failed to delete post.");
      setIsDeleting(false);
    }
  };

  return (
    <Card contentClassName="space-y-6" interactive>
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Avatar src={post.author?.avatarUrl} alt={post.author?.name} size={52} />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">{post.author?.name}</span>
            <span className="text-xs text-slate-400">{authorHeadline}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-300">
            {formatRelativeTime(post.createdAt)}
          </span>
          {isAuthor ? (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={resetEditState}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:text-white"
                  >
                    <X className="h-4 w-4" aria-hidden />
                    <span className="sr-only">Cancel edit</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:text-white"
                >
                  <Edit2 className="h-4 w-4" aria-hidden />
                  <span className="sr-only">Edit post</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:text-rose-200 disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                <span className="sr-only">Delete post</span>
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {isEditing ? (
        <form className="space-y-5 text-sm text-slate-200" onSubmit={handleSave}>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Title</label>
            <Input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} maxLength={120} placeholder="Post title" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Content</label>
            <textarea
              className="min-h-[160px] w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300/30"
              value={editContent}
              onChange={(event) => setEditContent(event.target.value)}
              maxLength={800}
              placeholder="Share more detail about your milestone."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Tags</label>
            <Input
              value={editTags}
              onChange={(event) => setEditTags(event.target.value)}
              placeholder="community, growth, gratitude"
            />
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Separate tags with commas</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={resetEditState}>
              Cancel
            </Button>
            <Button type="submit" icon={Check} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4 text-sm text-slate-200">
          {post.title ? <h3 className="text-xl font-semibold text-white">{post.title}</h3> : null}
          <p className="leading-relaxed text-slate-200/90 whitespace-pre-line">{post.content}</p>
        </div>
      )}

      {post.tags?.length && !isEditing ? (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} className="border-brand-400/30 bg-brand-500/10 text-brand-100">
              #{tag}
            </Badge>
          ))}
        </div>
      ) : null}

      {!isEditing ? (
        <>
          <footer className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <LikeButton count={post.likes ?? 0} liked={post.viewerHasLiked} onToggle={handleToggleReaction} />
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-4 w-4" aria-hidden />
              {post.commentsCount ?? post.comments?.length ?? 0} reflections
            </span>
          </footer>

          <CommentSection comments={post.comments ?? []} onSubmit={handleSubmitComment} isSubmitting={isCommenting} />
        </>
      ) : null}
    </Card>
  );
}

