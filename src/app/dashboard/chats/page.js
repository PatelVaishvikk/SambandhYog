"use client";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ChatPanel from "@/components/common/ChatPanel";

export default function ChatsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 gap-6">
        <Sidebar />
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
          <section className="space-y-3">
            <h1 className="text-3xl font-semibold text-slate-900">Your conversations</h1>
            <p className="text-sm text-slate-500">Connect with supporters and keep the encouragement flowing.</p>
          </section>
          <ChatPanel />
        </main>
      </div>
    </div>
  );
}

