"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { MessageCircle, Users, X } from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useConnections } from "@/context/ConnectionsContext";
import ChatWidgetSkeleton from "@/components/dashboard/ChatWidgetSkeleton";

const DynamicChatPanel = dynamic(() => import("@/components/common/ChatPanel"), {
  ssr: false,
  loading: () => <ChatWidgetSkeleton compact />,
});

export default function MobileChatLauncher() {
  const { conversations = [], followers = [], isSocketConnected } = useConnections();
  const [isOpen, setIsOpen] = useState(false);

  const connectedCount = useMemo(() => followers.length + conversations.length, [followers.length, conversations.length]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  return (
    <div className="xl:hidden">
      <Card contentClassName="flex items-center justify-between gap-4">
        <div className="space-y-2 text-sm text-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Connections</p>
          <p className="text-base font-semibold text-white">Chat on the go</p>
          <p className="text-xs text-slate-300">
            {connectedCount ? `Linked with ${connectedCount} supporters.` : "Tap to start your first chat session."}
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">
              <Users className="h-3.5 w-3.5" aria-hidden />
              {followers.length} followers
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">
              <MessageCircle className="h-3.5 w-3.5" aria-hidden />
              {conversations.length} active chats
            </span>
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          className="flex-shrink-0"
          variant="secondary"
          icon={MessageCircle}
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          aria-controls="mobile-chat-drawer"
        >
          Open chat
        </Button>
      </Card>

      {isOpen ? (
        <div
          id="mobile-chat-drawer"
          className="fixed inset-0 z-[60] flex flex-col bg-night-900/95 px-4 pb-6 pt-16 backdrop-blur-xl sm:px-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-300">
                {isSocketConnected ? "Live" : "Connecting"}
              </p>
              <h2 className="text-lg font-semibold text-white">Messages</h2>
            </div>
            <Button type="button" size="sm" variant="secondary" icon={X} onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
          <div className="flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-1">
            <DynamicChatPanel />
          </div>
        </div>
      ) : null}
    </div>
  );
}

