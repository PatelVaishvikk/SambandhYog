"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Flame, Radar, Sparkles, Target } from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { usePosts } from "@/context/PostsContext";
import { useNotifications } from "@/context/NotificationContext";
import { useConnections } from "@/context/ConnectionsContext";
import { formatRelativeTime } from "@/utils/formatters";
import { extractHashtags } from "@/utils/hashtag";

function selectTimeWindow(input) {
  const date = input ? new Date(input) : null;
  if (!date || Number.isNaN(date.getTime())) {
    return "anytime";
  }
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return "early";
  if (hour >= 11 && hour < 17) return "midday";
  if (hour >= 17 && hour < 23) return "evening";
  return "late";
}

const WINDOW_COPY = {
  early: { label: "Early (5-11)", marker: "[sunrise]" },
  midday: { label: "Midday (11-17)", marker: "[daylight]" },
  evening: { label: "Evening (17-23)", marker: "[dusk]" },
  late: { label: "Night owl (23-5)", marker: "[midnight]" },
  anytime: { label: "Anytime", marker: "[flow]" },
};

export default function MomentumLab() {
  const { posts = [] } = usePosts();
  const { notifications = [], unreadCount } = useNotifications();
  const { requests = [] } = useConnections();

  const recentPosts = useMemo(() => {
    const cutoff = Date.now() - 1000 * 60 * 60 * 24 * 2;
    return posts.filter((post) => {
      const timestamp = post?.createdAt ? new Date(post.createdAt).getTime() : null;
      return timestamp ? timestamp >= cutoff : false;
    });
  }, [posts]);

  const trendingHashtags = useMemo(() => {
    const counts = new Map();
    posts.forEach((post) => {
      const tags = Array.isArray(post?.tags) && post.tags.length ? post.tags : extractHashtags(post?.content ?? "");
      tags.forEach((tag) => {
        const normalized = tag?.toLowerCase();
        if (!normalized) return;
        counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
      });
    });
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));
  }, [posts]);

  const rhythmMap = useMemo(() => {
    const windows = { early: 0, midday: 0, evening: 0, late: 0, anytime: 0 };
    posts.forEach((post) => {
      const bucket = selectTimeWindow(post?.createdAt);
      windows[bucket] += 1;
    });
    const max = Math.max(...Object.values(windows), 1);
    return Object.entries(windows).map(([window, count]) => ({
      id: window,
      count,
      percent: Math.round((count / max) * 100),
    }));
  }, [posts]);

  const freshestNotification = notifications[0] ?? null;

  const loops = useMemo(() => {
    const items = [];

    if (unreadCount > 0) {
      items.push({
        id: "reply",
        title: "Cheer responder",
        description: `You have ${unreadCount} open encouragements waiting for a reply.`,
        href: "/dashboard/notifications",
        icon: Sparkles,
        cta: "Respond now",
      });
    }

    if (requests?.length) {
      items.push({
        id: "welcome",
        title: "Welcome queue",
        description: `${requests.length} new members want to connect - give them a warm arrival.`,
        href: "/dashboard/notifications",
        icon: Flame,
        cta: "Review requests",
      });
    }

    if (trendingHashtags.length) {
      const topTag = trendingHashtags[0];
      items.push({
        id: "amplify",
        title: "Amplify a theme",
        description: `#${topTag.tag} is resonating across ${topTag.count} posts - spark a follow-up story.`,
        href: "/dashboard/create-post",
        icon: Radar,
        cta: "Add your voice",
      });
    }

    if (!recentPosts.length) {
      items.push({
        id: "spark",
        title: "Restart momentum",
        description: "No fresh updates in the last 48 hours. Drop a micro-reflection to reboot the loop.",
        href: "/dashboard/create-post",
        icon: BrainCircuit,
        cta: "Launch reflection",
      });
    }

    const unique = [];
    const seen = new Set();
    for (const loop of items) {
      if (seen.has(loop.id)) continue;
      unique.push(loop);
      seen.add(loop.id);
      if (unique.length === 3) break;
    }

    if (unique.length < 3) {
      unique.push({
        id: "gratitude",
        title: "Gratitude ripple",
        description: "Send a micro-note to someone whose support lifted the circle this week.",
        href: "/dashboard/chats",
        icon: Target,
        cta: "Ping gratitude",
      });
    }

    return unique;
  }, [unreadCount, requests?.length, trendingHashtags, recentPosts.length]);

  return (
    <Card contentClassName="space-y-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
          <Flame className="h-4 w-4 text-brand-300" aria-hidden /> Momentum lab
        </div>
        <h3 className="text-lg font-semibold text-white">Create loops that mainstream social skips</h3>
        <p className="text-xs text-slate-300">
          Tune your community rituals with real-time signals only your circle can feel.
        </p>
      </header>

      {trendingHashtags.length ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-400">
            <span>Emerging themes</span>
            <span>{trendingHashtags.length} tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingHashtags.map((item) => (
              <span
                key={item.tag}
                className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-1 text-sm text-brand-100"
              >
                #{item.tag}
                <span className="text-xs text-brand-200/80">{item.count}</span>
              </span>
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-xs text-slate-300">
          No themes detected yet. Drop a tagged story to start the next shared ritual.
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-400">
          <span>Next loops</span>
          <span>{loops.length} ready</span>
        </div>
        <ul className="space-y-3">
          {loops.map((loop) => (
            <li key={loop.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-brand-200" aria-hidden>
                  <loop.icon className="h-4 w-4" />
                </span>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-semibold text-white">{loop.title}</h4>
                    <ArrowRight className="h-4 w-4 text-slate-400" aria-hidden />
                  </div>
                  <p className="text-xs text-slate-300">{loop.description}</p>
                  <Button as={Link} href={loop.href} size="sm" variant="secondary">
                    {loop.cta}
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-400">
          <span>Circle rhythm</span>
          <span>{posts.length} signals</span>
        </div>
        <ul className="space-y-3 text-xs text-slate-300">
          {rhythmMap.map((window) => {
            const copy = WINDOW_COPY[window.id];
            return (
              <li key={window.id} className="space-y-2">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em]">
                  <span className="flex items-center gap-2 text-slate-200">
                    <span aria-hidden>{copy?.marker ?? "[flow]"}</span>
                    {copy?.label ?? WINDOW_COPY.anytime.label}
                  </span>
                  <span>{window.count} drops</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500/70 via-brand-400/50 to-accent-400/40"
                    style={{ width: `${window.percent}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
        {freshestNotification ? (
          <div className="rounded-xl border border-brand-400/20 bg-brand-500/10 p-3 text-xs text-brand-100">
            <p className="font-semibold uppercase tracking-[0.2em] text-brand-200">Latest signal</p>
            <p className="mt-1 text-sm text-white">{freshestNotification.message}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-brand-200/70">
              {formatRelativeTime(freshestNotification.createdAt)}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-3 text-xs text-slate-300">
            Stay attentive to new cheers - they appear here the second they land.
          </div>
        )}
      </section>
    </Card>
  );
}
