"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useStories } from "@/context/StoriesContext";
import { STORY_BACKGROUNDS, STORY_MAX_CHARACTERS } from "@/constants/stories";
import { toast } from "@/components/ui/Toast";

export default function StoryComposer() {
  const { createStory } = useStories();
  const [content, setContent] = useState("");
  const [backgroundId, setBackgroundId] = useState(STORY_BACKGROUNDS[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPreset = useMemo(
    () => STORY_BACKGROUNDS.find((preset) => preset.id === backgroundId) ?? STORY_BACKGROUNDS[0],
    [backgroundId]
  );

  const remaining = STORY_MAX_CHARACTERS - content.length;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) {
      toast.error("Add a short update before sharing.");
      return;
    }
    if (trimmed.length > STORY_MAX_CHARACTERS) {
      toast.error(`Stories can only be ${STORY_MAX_CHARACTERS} characters long.`);
      return;
    }
    setIsSubmitting(true);
    try {
      await createStory({ content: trimmed, backgroundId });
      toast.success("Story shared with your followers.");
      setContent("");
    } catch (error) {
      console.error("Create story", error);
      toast.error(error.message ?? "Failed to publish story");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card id="story-composer" contentClassName="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Create story</p>
          <h3 className="text-lg font-semibold text-white">Drop a fast update for your circle</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
          {remaining} left
        </span>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className={`relative overflow-hidden rounded-[32px] border border-white/10 ${selectedPreset.gradient}`}>
          <div className="absolute inset-0 bg-black/20" aria-hidden />
          <textarea
            className={`relative z-10 min-h-[160px] w-full resize-none bg-transparent px-5 py-6 text-base font-medium leading-relaxed outline-none placeholder:text-white/60 ${selectedPreset.textClass}`}
            placeholder="Share a short win, spark a question, or send gratitude. Stories last 24 hours."
            maxLength={STORY_MAX_CHARACTERS}
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Background</p>
          <div className="flex flex-wrap gap-3">
            {STORY_BACKGROUNDS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`group relative h-16 w-20 overflow-hidden rounded-3xl border transition ${
                  backgroundId === preset.id ? "border-white/80 shadow-lg" : "border-white/15 hover:border-white/30"
                }`}
                onClick={() => setBackgroundId(preset.id)}
              >
                <span className={`absolute inset-0 ${preset.gradient}`} aria-hidden />
                <span className="absolute inset-0 bg-black/20 opacity-0 transition group-hover:opacity-40" aria-hidden />
                <span className="relative flex h-full items-center justify-center px-2 text-[11px] font-medium text-white text-center leading-tight">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" icon={Sparkles} disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? "Sharing..." : "Share story"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

