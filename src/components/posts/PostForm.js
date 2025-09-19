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
      <Card className="text-sm text-slate-500">
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
    <Card className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Title</label>
          <Input
            placeholder="Share a win, lesson, or resource"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
          />
        </div>
        <div className="space-y-2 text-sm">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Post content</label>
          <textarea
            className="min-h-[160px] w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 shadow-inner transition focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            placeholder="Celebrate a milestone, ask for guidance, or share a reflection."
            maxLength={MAX_LENGTH}
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          <span className="text-xs text-slate-400">{content.length}/{MAX_LENGTH} characters</span>
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
