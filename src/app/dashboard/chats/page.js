"use client";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ChatPanel from "@/components/common/ChatPanel";

export default function ChatsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-6 pb-12 pt-8">
        <Sidebar />
        <main className="flex w-full flex-1 flex-col gap-8">
          <header className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
              Direct messages
            </span>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-white md:text-4xl">Keep the encouragement flowing</h1>
              <p className="max-w-xl text-sm text-slate-300">
                Chat with supporters, celebrate their wins, and stay accountable together.
              </p>
            </div>
          </header>
          <div className="flex flex-1">
            <ChatPanel />
          </div>
        </main>
      </div>
    </div>
  );
}
