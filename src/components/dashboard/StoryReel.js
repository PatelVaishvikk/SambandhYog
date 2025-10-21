"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, Clock, Edit2, Sparkles, Trash2, X } from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { useStories } from "@/context/StoriesContext";
import { STORY_BACKGROUNDS, STORY_MAX_CHARACTERS } from "@/constants/stories";
import { formatRelativeTime, truncate } from "@/utils/formatters";
import { toast } from "@/components/ui/Toast";

const BACKGROUND_MAP = STORY_BACKGROUNDS.reduce((accumulator, preset) => {
  accumulator[preset.id] = preset;
  return accumulator;
}, {});

function getPreset(backgroundId) {
  return BACKGROUND_MAP[backgroundId] ?? STORY_BACKGROUNDS[0];
}

export default function StoryReel() {
  const { stories: groups, updateStory, deleteStory } = useStories();
  const orderedGroups = useMemo(() => (Array.isArray(groups) ? groups.filter(Boolean) : []), [groups]);

  const [activeGroupIndex, setActiveGroupIndex] = useState(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editBackgroundId, setEditBackgroundId] = useState(STORY_BACKGROUNDS[0].id);
  const [isStorySaving, setIsStorySaving] = useState(false);
  const [isStoryDeleting, setIsStoryDeleting] = useState(false);

  const currentGroup = activeGroupIndex !== null ? orderedGroups[activeGroupIndex] ?? null : null;
  const currentStory =
    currentGroup && Array.isArray(currentGroup.stories) ? currentGroup.stories[activeStoryIndex] ?? null : null;

  useEffect(() => {
    if (currentStory) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
    return undefined;
  }, [currentStory]);

  useEffect(() => {
    if (currentStory && !isEditing) {
      setEditContent(currentStory.content ?? "");
      setEditBackgroundId(currentStory.backgroundId ?? STORY_BACKGROUNDS[0].id);
    }
  }, [currentStory, isEditing]);

  useEffect(() => {
    if (activeGroupIndex === null) return;
    if (!orderedGroups.length) {
      setActiveGroupIndex(null);
      setActiveStoryIndex(0);
      setIsEditing(false);
      return;
    }
    const group = orderedGroups[activeGroupIndex];
    if (!group) {
      setActiveGroupIndex(orderedGroups.length ? orderedGroups.length - 1 : null);
      setActiveStoryIndex(0);
      setIsEditing(false);
      return;
    }
    if (!group.stories?.length) {
      setActiveGroupIndex(null);
      setActiveStoryIndex(0);
      setIsEditing(false);
      return;
    }
    if (activeStoryIndex >= group.stories.length) {
      setActiveStoryIndex(group.stories.length - 1);
    }
  }, [orderedGroups, activeGroupIndex, activeStoryIndex]);

  useEffect(() => {
    if (activeGroupIndex === null) return;
    const group = orderedGroups[activeGroupIndex];
    if (!group?.user?.id) return;
    const newIndex = orderedGroups.findIndex((item) => item?.user?.id === group.user.id);
    if (newIndex !== -1 && newIndex !== activeGroupIndex) {
      setActiveGroupIndex(newIndex);
    }
  }, [orderedGroups, activeGroupIndex]);

  const openGroup = useCallback((groupIndex) => {
    setActiveGroupIndex(groupIndex);
    setActiveStoryIndex(0);
    setIsEditing(false);
  }, []);

  const closeViewer = useCallback(() => {
    setActiveGroupIndex(null);
    setActiveStoryIndex(0);
    setIsEditing(false);
  }, []);

  const goNext = useCallback(() => {
    const group = currentGroup;
    if (!group || !Array.isArray(group.stories) || !group.stories.length) return;
    setIsEditing(false);
    if (activeStoryIndex < group.stories.length - 1) {
      setActiveStoryIndex((index) => index + 1);
      return;
    }
    if (!orderedGroups.length) return;
    const nextGroupIndex = (activeGroupIndex + 1) % orderedGroups.length;
    setActiveGroupIndex(nextGroupIndex);
    setActiveStoryIndex(0);
  }, [activeStoryIndex, activeGroupIndex, currentGroup, orderedGroups]);

  const goPrev = useCallback(() => {
    const group = currentGroup;
    if (!group || !Array.isArray(group.stories) || !group.stories.length) return;
    setIsEditing(false);
    if (activeStoryIndex > 0) {
      setActiveStoryIndex((index) => index - 1);
      return;
    }
    if (!orderedGroups.length) return;
    const prevGroupIndex = activeGroupIndex === 0 ? orderedGroups.length - 1 : activeGroupIndex - 1;
    const prevGroup = orderedGroups[prevGroupIndex];
    const lastIndex = prevGroup?.stories?.length ? prevGroup.stories.length - 1 : 0;
    setActiveGroupIndex(prevGroupIndex);
    setActiveStoryIndex(lastIndex);
  }, [activeStoryIndex, activeGroupIndex, currentGroup, orderedGroups]);

  if (!orderedGroups.length) {
    return (
      <Card contentClassName="flex flex-col gap-3 text-sm text-slate-300">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Flash stories</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Keep momentum with micro-stories</h3>
        </div>
        <p>
          Stories appear as teammates share wins. Drop a short story and it will surface here for your circle in seconds.
        </p>
        <Button as={Link} href="#story-composer" size="sm" variant="secondary" icon={Sparkles}>
          Share the first story
        </Button>
      </Card>
    );
  }

  return (
    <>
      <Card contentClassName="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Flash stories</p>
            <h3 className="text-lg font-semibold text-white">Tap into the fastest updates</h3>
            <p className="text-xs text-slate-300">
              Quick wins and reflections from people you follow. Tap a card to enter the story loop.
            </p>
          </div>
          <Button as={Link} href="#story-composer" size="sm" variant="secondary" icon={Sparkles}>
            New story
          </Button>
        </div>
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
          {orderedGroups.map((group, index) => {
            const latestStory = group.stories?.[group.stories.length - 1];
            const preset = getPreset(latestStory?.backgroundId);
            const previewText = truncate(latestStory?.content ?? "", 60) || "Tap to view";
            return (
              <button
                key={group.user?.id ?? index}
                type="button"
                onClick={() => openGroup(index)}
                className="group relative h-40 w-32 shrink-0 snap-start overflow-hidden rounded-[30px] border border-white/15 text-left shadow-lg transition hover:-translate-y-1"
              >
                <span className={`absolute inset-0 ${preset.gradient}`} aria-hidden />
                <span className="absolute inset-0 bg-black/20 opacity-0 transition group-hover:opacity-100" aria-hidden />
                <div className="relative flex h-full flex-col justify-between p-4 text-white">
                  <div className="flex items-center gap-2">
                    <Avatar src={group.user?.avatarUrl} alt={group.user?.name} size={36} />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold leading-tight">{group.user?.name}</p>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">
                        {group.stories?.length ?? 1} story
                        {group.stories?.length > 1 ? "ies" : ""}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className={`text-xs font-medium leading-snug ${preset.textClass}`}>{previewText}</p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/80">
                      {formatRelativeTime(latestStory?.createdAt)}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {currentGroup && currentStory ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-night-950/90 px-4 py-10 backdrop-blur-2xl sm:px-8"
          role="dialog"
          aria-modal="true"
          aria-label="Story viewer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-night-900/80 to-night-950/80" aria-hidden />
          <div className="relative flex w-full max-w-3xl flex-col gap-5 rounded-[38px] border border-white/15 bg-night-900/95 p-6 shadow-2xl sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar src={currentGroup.user?.avatarUrl} alt={currentGroup.user?.name} size={48} />
                <div>
                  <p className="text-base font-semibold text-white leading-tight">{currentGroup.user?.name}</p>
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                    <Clock className="h-4 w-4" aria-hidden />
                    {formatRelativeTime(currentStory.createdAt)}
                    <span className="text-slate-500">{activeStoryIndex + 1} / {currentGroup.stories.length}</span>
                  </p>
                </div>
              </div>
              <Button type="button" size="sm" variant="secondary" icon={X} onClick={closeViewer}>
                Close
              </Button>
            </div>

            <div className={`relative overflow-hidden rounded-[32px] border border-white/10 ${getPreset(currentStory.backgroundId).gradient}`}>
              <div className="absolute inset-0 bg-black/30" aria-hidden />
              <div className={`relative flex min-h-[220px] items-center justify-center p-6 text-center text-lg font-medium leading-relaxed ${getPreset(currentStory.backgroundId).textClass}`}>
                <p className="whitespace-pre-line">{currentStory.content}</p>
              </div>
            </div>

            {currentGroup.isOwn ? (
              <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                {isEditing ? (
                  <>
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-400">
                      <span>Edit story</span>
                      <span>{STORY_MAX_CHARACTERS - editContent.length} left</span>
                    </div>
                    <textarea
                      className="min-h-[160px] w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300/30"
                      value={editContent}
                      maxLength={STORY_MAX_CHARACTERS}
                      onChange={(event) => setEditContent(event.target.value)}
                      placeholder="Refresh the story with a quick update."
                    />
                    <div className="flex flex-wrap gap-2">
                      {STORY_BACKGROUNDS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setEditBackgroundId(preset.id)}
                          className={`group relative h-14 w-20 overflow-hidden rounded-3xl border transition ${
                            editBackgroundId === preset.id ? "border-white/80 shadow-lg" : "border-white/15 hover:border-white/30"
                          }`}
                        >
                          <span className={`absolute inset-0 ${preset.gradient}`} aria-hidden />
                          <span className="absolute inset-0 bg-black/25 opacity-0 transition group-hover:opacity-40" aria-hidden />
                          <span className="relative flex h-full items-center justify-center px-2 text-[11px] font-medium text-white text-center leading-tight">
                            {preset.label}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="ghost" onClick={() => { setIsEditing(false); setEditContent(currentStory.content ?? ""); setEditBackgroundId(currentStory.backgroundId ?? STORY_BACKGROUNDS[0].id); }}>
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        icon={Check}
                        disabled={isStorySaving}
                        onClick={async () => {
                          const trimmed = editContent.trim();
                          if (!trimmed) {
                            toast.error("Story cannot be empty.");
                            return;
                          }
                          setIsStorySaving(true);
                          try {
                            await updateStory(currentStory.id, { content: trimmed, backgroundId: editBackgroundId });
                            toast.success("Story updated.");
                            setIsEditing(false);
                          } catch (error) {
                            console.error("Update story", error);
                            toast.error(error.message ?? "Failed to update story.");
                          } finally {
                            setIsStorySaving(false);
                          }
                        }}
                      >
                        {isStorySaving ? "Saving..." : "Save story"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-slate-300">This story is yours. Refresh it or remove it whenever you like.</p>
                    <div className="flex gap-2">
                      <Button type="button" size="sm" variant="secondary" icon={Edit2} onClick={() => setIsEditing(true)}>
                        Edit story
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        icon={Trash2}
                        disabled={isStoryDeleting}
                        onClick={async () => {
                          if (isStoryDeleting) return;
                          const confirmed = window.confirm("Delete this story? It will disappear for everyone.");
                          if (!confirmed) return;
                          setIsStoryDeleting(true);
                          try {
                            await deleteStory(currentStory.id);
                            toast.success("Story deleted.");
                            setIsEditing(false);
                          } catch (error) {
                            console.error("Delete story", error);
                            toast.error(error.message ?? "Failed to delete story.");
                          } finally {
                            setIsStoryDeleting(false);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button type="button" size="sm" variant="secondary" onClick={goPrev}>
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Prev
              </Button>
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="secondary" onClick={goNext}>
                  Next
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </Button>
                <Button as={Link} href="#story-composer" size="sm" icon={Sparkles}>
                  Share yours
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
