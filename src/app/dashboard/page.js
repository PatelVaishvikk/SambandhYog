"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Calendar, Compass, MessageCircle, Sparkles, Users } from "lucide-react";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useNotifications } from "@/context/NotificationContext";
import { formatRelativeTime, truncate } from "@/utils/formatters";
import ChatWidgetSkeleton from "@/components/dashboard/ChatWidgetSkeleton";
import PostFormSkeleton from "@/components/dashboard/PostFormSkeleton";
import PostListSkeleton from "@/components/dashboard/PostListSkeleton";
import MomentumLabSkeleton from "@/components/dashboard/MomentumLabSkeleton";
import StoryReelSkeleton from "@/components/dashboard/StoryReelSkeleton";
import MobileChatLauncher from "@/components/dashboard/MobileChatLauncher";
import StoryComposer from "@/components/stories/StoryComposer";

const DesktopSidebar = dynamic(() => import("@/components/layout/Sidebar"), { ssr: false, loading: () => null });
const PostForm = dynamic(() => import("@/components/posts/PostForm"), {
  ssr: false,
  loading: () => <PostFormSkeleton />,
});
const PostList = dynamic(() => import("@/components/posts/PostList"), {
  ssr: false,
  loading: () => <PostListSkeleton count={3} />,
});
const DesktopMomentumLab = dynamic(() => import("@/components/dashboard/MomentumLab"), {
  ssr: false,
  loading: () => <MomentumLabSkeleton />,
});
const StoryReel = dynamic(() => import("@/components/dashboard/StoryReel"), {
  ssr: false,
  loading: () => <StoryReelSkeleton />,
});

const DesktopChatPanel = dynamic(() => import("@/components/common/ChatPanel"), {
  ssr: false,
  loading: () => <ChatWidgetSkeleton />,
});

const QUICK_ACTIONS = [
  {
    title: "Spin up a huddle",
    description: "Open a focused chat with your inner circle to keep momentum high.",
    icon: MessageCircle,
    href: "/dashboard/chats",
    cta: "Start chatting",
    accent: "from-brand-500/80 via-brand-500/40 to-accent-400/30",
  },
  {
    title: "Celebrate a win",
    description: "Capture today's progress before it fades and inspire the group.",
    icon: Sparkles,
    href: "/dashboard/create-post",
    cta: "Share update",
    accent: "from-accent-400/70 via-accent-400/35 to-brand-500/20",
  },
  {
    title: "Welcome newcomers",
    description: "Spot fresh faces and send a quick hello to make them feel seen.",
    icon: Users,
    href: "/explore/users",
    cta: "Meet members",
    accent: "from-brand-400/70 via-brand-400/35 to-purple-400/20",
  },
  {
    title: "Plan the next move",
    description: "Drop a short session on the calendar so everyone knows what's next.",
    icon: Calendar,
    href: "/dashboard/notifications",
    cta: "Review agenda",
    accent: "from-purple-500/60 via-brand-500/40 to-brand-300/20",
  },
];

const FOCUS_PROMPTS = [
  {
    title: "Gratitude check-in",
    description: "Send a 2-line note to someone whose encouragement helped you today.",
    icon: Sparkles,
  },
  {
    title: "Momentum pulse",
    description: "Share one blocker and invite your circle to drop micro-ideas.",
    icon: Compass,
  },
  {
    title: "Office hour invite",
    description: "Pair up with a peer for a 15-minute wisdom swap this week.",
    icon: Users,
  },
];

export default function DashboardPage() {
  const { notifications, unreadCount } = useNotifications();
  const [showDesktopEnhancements, setShowDesktopEnhancements] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateMatch = () => setShowDesktopEnhancements(mediaQuery.matches);
    updateMatch();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updateMatch);
      return () => mediaQuery.removeEventListener("change", updateMatch);
    }
    mediaQuery.addListener(updateMatch);
    return () => mediaQuery.removeListener(updateMatch);
  }, []);

  const latestNotification = notifications[0];
  const highlightCopy = latestNotification?.message
    ? truncate(latestNotification.message, 160)
    : "Spark momentum by celebrating a win or dropping a quick note to your circle.";
  const highlightTime = latestNotification?.createdAt ? formatRelativeTime(latestNotification.createdAt) : null;

  const vibe =
    notifications.length > 8 ? "Buzzing" : notifications.length > 3 ? "Active" : notifications.length > 0 ? "Warming up" : "Quiet";
  const vibeHint =
    notifications.length > 8
      ? "Lots of energy in conversations right now."
      : notifications.length > 3
      ? "Keep the flow going with a quick response."
      : notifications.length > 0
      ? "Drop a follow-up to keep momentum."
      : "Break the silence with a fresh update.";

  const metrics = useMemo(
    () => [
      {
        title: "Active cheers",
        value: notifications.length,
        hint: notifications.length === 1 ? "message uplifting the circle" : "messages keeping energy high",
      },
      {
        title: "Waiting on you",
        value: unreadCount,
        hint: unreadCount ? "conversations need your reply" : "you're fully caught up",
      },
      {
        title: "Circle vibe",
        value: vibe,
        hint: vibeHint,
      },
    ],
    [notifications.length, unreadCount, vibe, vibeHint]
  );

  const visibleNotifications = notifications.slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col pb-24 lg:pb-0">
      <Header />
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-5 px-4 pb-16 pt-6 sm:gap-6 sm:px-6 sm:pb-12 sm:pt-8 lg:flex-row">
        {showDesktopEnhancements ? <DesktopSidebar /> : null}
        <main className="flex w-full flex-1 flex-col gap-6 sm:gap-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] xl:gap-8">
            <div className="flex flex-col gap-6 sm:gap-8">
              <Card
                className="border-white/10 bg-gradient-to-br from-brand-600/25 via-brand-500/20 to-night-700/70 shadow-surface-strong"
                contentClassName="flex flex-col gap-6 rounded-[26px] md:gap-8 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex-1 space-y-5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
                    Your pulse
                  </span>
                  <div className="space-y-3">
                    <h1 className="text-3xl font-semibold text-white md:text-4xl">Keep the circle moving forward</h1>
                    <p className="max-w-xl text-sm text-slate-200">
                      Drop micro-updates, respond to cheers, and co-create momentum like the best live chat teams do.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <Button as={Link} href="/dashboard/chats" size="sm" icon={MessageCircle}>
                      Jump into chats
                    </Button>
                    <Button as={Link} href="/dashboard/create-post" size="sm" variant="secondary" icon={Sparkles}>
                      Share a win
                    </Button>
                  </div>
                </div>
                <div className="w-full max-w-sm space-y-4 rounded-3xl border border-white/10 bg-night-800/80 p-5 text-sm text-slate-200 shadow-surface">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Latest cheer</p>
                  <p className="text-base font-medium text-white">{highlightCopy}</p>
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-400">
                    <span>{unreadCount ? `${unreadCount} waiting` : "All caught up"}</span>
                    {highlightTime ? <span>{highlightTime}</span> : null}
                  </div>
                </div>
              </Card>

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {metrics.map((metric) => (
                  <Card key={metric.title} interactive contentClassName="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">{metric.title}</p>
                    <p className="text-2xl font-semibold text-white">{metric.value}</p>
                    <p className="text-xs text-slate-300">{metric.hint}</p>
                  </Card>
                ))}
              </section>

              <StoryComposer />
              <StoryReel />

              <section className="grid gap-4 md:grid-cols-2">
                {QUICK_ACTIONS.map((action) => (
                  <Card key={action.title} interactive className="bg-white/[0.04]" contentClassName="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <span
                        className={`mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${action.accent} text-white shadow-lg`}
                        aria-hidden
                      >
                        <action.icon className="h-5 w-5" />
                      </span>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-white">{action.title}</p>
                        <p className="text-xs leading-relaxed text-slate-300">{action.description}</p>
                      </div>
                    </div>
                    <Button as={Link} href={action.href} size="sm" variant="secondary">
                      {action.cta}
                    </Button>
                  </Card>
                ))}
              </section>

              <PostForm />
              <PostList />
            </div>

            <div className="flex flex-col gap-6 sm:gap-8">
              <div className="space-y-6 sm:space-y-8 xl:sticky xl:top-24">
                <div className="lg:hidden">
                  <Card contentClassName="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Quick pulse</p>
                        <h3 className="text-lg font-semibold text-white">Community at a glance</h3>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                        {notifications.length} cheers
                      </span>
                    </div>
                    <ul className="grid grid-cols-2 gap-3 text-sm text-slate-300 sm:grid-cols-3">
                      {metrics.map((metric) => (
                        <li key={`mobile-${metric.title}`} className="rounded-2xl border border-white/5 bg-white/5 p-3">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{metric.title}</p>
                          <p className="mt-1 text-lg font-semibold text-white">{metric.value}</p>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>

                {showDesktopEnhancements ? (
                  <div className="hidden lg:block">
                    <DesktopMomentumLab />
                  </div>
                ) : null}

                <Card contentClassName="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Stay intentional</p>
                      <h3 className="text-lg font-semibold text-white">Today's focus cues</h3>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                      {FOCUS_PROMPTS.length} prompts
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {FOCUS_PROMPTS.map((prompt) => (
                      <li
                        key={prompt.title}
                        className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
                      >
                        <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-2xl bg-white/10 text-brand-300" aria-hidden>
                          <prompt.icon className="h-4 w-4" />
                        </span>
                        <div className="space-y-1">
                          <p className="font-medium text-white">{prompt.title}</p>
                          <p className="text-xs text-slate-300">{prompt.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card contentClassName="space-y-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Community pulse</p>
                      <h3 className="text-lg font-semibold text-white">Live encouragement</h3>
                    </div>
                    <Button as={Link} href="/dashboard/notifications" size="sm" variant="secondary">
                      View all
                    </Button>
                  </div>
                  {visibleNotifications.length ? (
                    <ul className="space-y-4 text-sm">
                      {visibleNotifications.map((notification) => (
                        <li
                          key={notification.id}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200"
                        >
                          <p className="text-sm text-white">{notification.message}</p>
                          <p className="mt-1 text-xs text-slate-400">{formatRelativeTime(notification.createdAt)}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-slate-300">
                      Your notification stream is quiet. Send a fresh update or spark a chat to invite new energy.
                    </div>
                  )}
                </Card>

                {showDesktopEnhancements ? (
                  <div className="hidden xl:block">
                    <DesktopChatPanel />
                  </div>
                ) : null}
              </div>
              <MobileChatLauncher />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

