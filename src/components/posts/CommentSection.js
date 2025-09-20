"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function CommentSection({ comments = [], onSubmit, isSubmitting = false }) {
  const [draft, setDraft] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    try {
      await onSubmit?.(trimmed);
      setDraft("");
    } catch (error) {
      console.error("Submit comment", error);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add a supportive comment"
          className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300/30"
        />
        <Button type="submit" size="sm" disabled={!draft.trim() || isSubmitting}>
          {isSubmitting ? "Sending" : "Comment"}
        </Button>
      </form>
      <ul className="space-y-3 text-sm text-slate-200">
        {comments.map((comment) => (
          <li key={comment.id} className="rounded-2xl border border-white/10 bg-white/10 p-3">
            <p className="font-semibold text-white">{comment.author?.name ?? "Member"}</p>
            <p className="text-slate-300">{comment.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
