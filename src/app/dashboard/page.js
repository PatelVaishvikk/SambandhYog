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
      <div className="flex flex-1 gap-6">
        <Sidebar />
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
          <section className="space-y-3">
            <h1 className="text-3xl font-semibold text-slate-900">Your SambandhYog feed</h1>
            <p className="text-sm text-slate-500">
              Share milestones, reflect on learnings, and cheer for peers building positive careers.
            </p>
          </section>
          <PostForm />
          <PostList />
          <div className="xl:hidden">
            <ChatPanel />
          </div>
        </main>
        <aside className="hidden w-96 flex-shrink-0 flex-col gap-6 border-l border-slate-200 bg-white p-6 xl:flex">
          <Card className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">Latest notifications</h3>
            <ul className="space-y-3 text-xs text-slate-500">
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
