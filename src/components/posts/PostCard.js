"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import LikeButton from "@/components/posts/LikeButton";
import CommentSection from "@/components/posts/CommentSection";
import { formatRelativeTime } from "@/utils/formatters";
import { usePosts } from "@/context/PostsContext";

export default function PostCard({ post }) {
  const { toggleReaction, addComment } = usePosts();
  const [isCommenting, setIsCommenting] = useState(false);

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
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-300">
          {formatRelativeTime(post.createdAt)}
        </span>
      </header>

      <div className="space-y-4 text-sm text-slate-200">
        {post.title ? (
          <h3 className="text-xl font-semibold text-white">{post.title}</h3>
        ) : null}
        <p className="leading-relaxed text-slate-200/90">{post.content}</p>
      </div>

      {post.tags?.length ? (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} className="border-brand-400/30 bg-brand-500/10 text-brand-100">
              #{tag}
            </Badge>
          ))}
        </div>
      ) : null}

      <footer className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <LikeButton count={post.likes ?? 0} liked={post.viewerHasLiked} onToggle={handleToggleReaction} />
        <span className="inline-flex items-center gap-1">
          <MessageCircle className="h-4 w-4" aria-hidden />
          {post.commentsCount ?? post.comments?.length ?? 0} reflections
        </span>
      </footer>

      <CommentSection comments={post.comments ?? []} onSubmit={handleSubmitComment} isSubmitting={isCommenting} />
    </Card>
  );
}


