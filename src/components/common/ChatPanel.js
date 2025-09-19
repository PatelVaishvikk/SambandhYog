"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { useConnections } from "@/context/ConnectionsContext";

export default function ChatPanel() {
  const {
    conversations,
    followers,
    sendMessage,
    openConversation,
    isLoading,
    isSocketConnected,
  } = useConnections();
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!conversations.length) {
      setActiveId(null);
      return;
    }
    if (!activeId || !conversations.some((conversation) => conversation.id === activeId)) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  const mutualFollowers = useMemo(
    () => followers.filter((follower) => follower.status === "following"),
    [followers]
  );

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId),
    [conversations, activeId]
  );

  const handleSend = async (event) => {
    event.preventDefault();
    if (!activeConversation || !draft.trim()) return;
    const conversation = await sendMessage({ conversationId: activeConversation.id, content: draft.trim() });
    if (conversation?.id) {
      setActiveId(conversation.id);
    }
    setDraft("");
  };

  const handleOpenConversation = async (followerId) => {
    if (!followerId || isLoading) return;
    const existing = conversations.find((conversation) => conversation.participant?.id === followerId);
    if (existing) {
      setActiveId(existing.id);
      return;
    }
    const conversation = await openConversation(followerId);
    if (conversation?.id) {
      setActiveId(conversation.id);
    }
  };

  if (isLoading && !conversations.length) {
    return (
      <Card className="flex items-center gap-3 text-sm text-slate-500">
        <Spinner size="sm" />
        <span>Opening your conversations...</span>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Chats</h3>
        <span
          className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide ${
            isSocketConnected ? "text-emerald-600" : "text-slate-400"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${isSocketConnected ? "bg-emerald-500" : "bg-slate-300"}`}
          />
          {isSocketConnected ? "Live" : "Reconnecting"}
        </span>
      </div>

      {!isSocketConnected ? (
        <p className="text-xs text-slate-400">New messages sync as soon as the connection is back.</p>
      ) : null}

      <div className="flex flex-col gap-4 xl:flex-row">
        <div className="flex flex-col gap-4 xl:w-64">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Conversations</p>
            <div className="flex flex-col gap-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setActiveId(conversation.id)}
                  className={`rounded-2xl border px-3 py-2 text-left text-xs transition ${
                    conversation.id === activeId
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-500 hover:border-emerald-200 hover:text-emerald-700"
                  }`}
                >
                  {conversation.participant?.name ?? "Unknown"}
                </button>
              ))}
              {!conversations.length ? (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-4 text-xs text-slate-400">
                  No conversations yet.
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Mutual followers</p>
            <div className="flex flex-col gap-2">
              {mutualFollowers.map((follower) => (
                <button
                  key={follower.id}
                  onClick={() => handleOpenConversation(follower.id)}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-500 transition hover:border-emerald-200 hover:text-emerald-700"
                >
                  <span className="truncate">{follower.name}</span>
                  <span className="text-[10px] uppercase tracking-wide text-emerald-500">Message</span>
                </button>
              ))}
              {!mutualFollowers.length ? (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-4 text-xs text-slate-400">
                  Follow supporters back to begin a conversation.
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          {activeConversation ? (
            <>
              <div className="flex items-center gap-3">
                <Avatar
                  src={activeConversation.participant?.avatarUrl}
                  alt={activeConversation.participant?.name}
                  size={36}
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{activeConversation.participant?.name}</p>
                  <p className="text-xs text-slate-400">Positive connection</p>
                </div>
              </div>
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-3 text-xs text-slate-600">
                {activeConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.from === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <span
                      className={`rounded-2xl px-3 py-2 ${
                        message.from === "me"
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {message.content}
                    </span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Send a kind message"
                  className="flex-1 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs text-slate-600 placeholder:text-slate-400 shadow-inner focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
                <Button type="submit" size="sm" disabled={!draft.trim()}>
                  Send
                </Button>
              </form>
            </>
          ) : (
            <p className="text-xs text-slate-400">Pick a connection to start chatting.</p>
          )}
        </div>
      </div>
    </Card>
  );
}
