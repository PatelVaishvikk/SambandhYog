"use client";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import PostForm from "@/components/posts/PostForm";
import PostList from "@/components/posts/PostList";
import Card from "@/components/ui/Card";
import ChatPanel from "@/components/common/ChatPanel";
import { useNotifications } from "@/context/NotificationContext";

export default function DashboardPage() {
  const { notifications } = useNotifications();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-6 pb-12 pt-8">
        <Sidebar />
        <main className="flex w-full flex-1 flex-col gap-8">
          <section className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
              Your feed
            </span>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-white md:text-4xl">Celebrate purposeful progress</h1>
                <p className="max-w-xl text-sm text-slate-300">
                  Share milestones, reflect on lessons, and uplift the peers building kind careers alongside you.
                </p>
              </div>
              <Card className="flex items-center gap-4 rounded-[22px] border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-200 md:w-72">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Live encouragement</p>
                  <p className="text-base font-semibold text-white">{notifications.length}</p>
                  <p className="text-xs text-slate-400">new cheers in your circle</p>
                </div>
              </Card>
            </div>
          </section>

          <PostForm />
          <PostList />

          <div className="xl:hidden">
            <ChatPanel />
          </div>
        </main>
        <aside className="hidden w-96 flex-shrink-0 flex-col gap-6 xl:flex">
          <Card contentClassName="space-y-3">
            <h3 className="text-sm font-semibold text-white">Latest notifications</h3>
            <ul className="space-y-3 text-xs text-slate-300">
              {notifications.map((notification) => (
                <li key={notification.id}>{notification.message}</li>
              ))}
            </ul>
          </Card>
          <ChatPanel />
        </aside>
      </div>
    </div>
  );
}

