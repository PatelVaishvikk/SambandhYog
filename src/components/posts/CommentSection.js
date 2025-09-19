"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function CommentSection({ comments = [] }) {
  const [entries, setEntries] = useState(comments);
  const [draft, setDraft] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setEntries((items) => [
      {
        id: `comment_${items.length + 1}`,
        author: "You",
        body: draft.trim(),
        createdAt: new Date().toISOString(),
      },
      ...items,
    ]);
    setDraft("");
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add a supportive comment"
          className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 shadow-inner focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
        <Button type="submit" size="sm" disabled={!draft.trim()}>
          Comment
        </Button>
      </form>
      <ul className="space-y-3 text-sm text-slate-600">
        {entries.map((comment) => (
          <li key={comment.id} className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="font-semibold text-slate-900">{comment.author}</p>
            <p className="text-slate-500">{comment.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

