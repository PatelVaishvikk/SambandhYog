"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import { usePosts } from "@/context/PostsContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/Toast";

const MAX_LENGTH = 400;

export default function PostForm() {
  const { addPost } = usePosts();
  const { user, isLoading: authLoading, isInitialized } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!authLoading && isInitialized && !user) {
    return (
      <Card contentClassName="text-sm text-slate-200">
        Log in to share your milestones with the community.
      </Card>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      await addPost({ title: title.trim(), content: content.trim() });
      setTitle("");
      setContent("");
      toast.success("Post shared successfully");
    } catch (error) {
      console.error("Create post", error);
      toast.error(error.message ?? "Could not share post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card contentClassName="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Share a milestone</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Inspire the circle with your progress</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
          {content.length}/{MAX_LENGTH}
        </span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Title</label>
          <Input
            placeholder="Share a win, lesson, or resource"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
          />
        </div>
        <div className="space-y-2 text-sm">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Post content</label>
          <textarea
            className="min-h-[180px] w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300/30"
            placeholder="Celebrate a milestone, ask for guidance, or share a reflection."
            maxLength={MAX_LENGTH}
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size="sm" /> Posting...
              </span>
            ) : (
              "Share update"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}


