"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, Paperclip, Search, Send, Sparkles } from "lucide-react";
import clsx from "clsx";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import { useConnections } from "@/context/ConnectionsContext";
import { formatRelativeTime } from "@/utils/formatters";

function normalizeMessages(conversation) {
  const list = Array.isArray(conversation?.messages) ? conversation.messages : [];
  return list.slice().sort((a, b) => new Date(a.createdAt ?? 0) - new Date(b.createdAt ?? 0));
}

function formatClockTime(timestamp) {
  if (!timestamp) return "";
  try {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (error) {
    return "";
  }
}

export default function ChatPanel() {
  const {
    conversations,
    followers,
    members,
    isLoading,
    isDirectoryLoading,
    isSocketConnected,
    followBack,
    acceptRequest,
    declineRequest,
    requestFollow,
    searchMembers,
    sendMessage,
    openConversation,
  } = useConnections();

  const [activeId, setActiveId] = useState(conversations[0]?.id ?? null);
  const [draft, setDraft] = useState("");
  const [conversationSearch, setConversationSearch] = useState("");
  const [followerSearch, setFollowerSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [directoryView, setDirectoryView] = useState("followers");
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState("list");
  const [pendingMemberIds, setPendingMemberIds] = useState(new Set());

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setMobileView("list");
    }
  }, [isMobile]);

  useEffect(() => {
    if (!conversations.length) {
      setActiveId(null);
      return;
    }
    if (!activeId || !conversations.some((conversation) => conversation.id === activeId)) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (directoryView === "discover") {
        searchMembers(memberSearch).catch(() => null);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [memberSearch, directoryView, searchMembers]);

  const filteredConversations = useMemo(() => {
    const term = conversationSearch.trim().toLowerCase();
    const sorted = conversations
      .slice()
      .sort((a, b) => new Date(b.updatedAt ?? b.lastMessageAt ?? 0) - new Date(a.updatedAt ?? a.lastMessageAt ?? 0));

    if (!term) return sorted;
    return sorted.filter((conversation) => {
      const name = conversation.participant?.name ?? "";
      return name.toLowerCase().includes(term);
    });
  }, [conversationSearch, conversations]);

  const filteredFollowers = useMemo(() => {
    const term = followerSearch.trim().toLowerCase();
    return followers
      .filter(Boolean)
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((follower) => {
        const haystack = `${follower.name ?? ""} ${follower.username ?? ""}`.toLowerCase();
        return !term || haystack.includes(term);
      });
  }, [followerSearch, followers]);

  const sortedMembers = useMemo(() => {
    return members.slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [members]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId) ?? null,
    [conversations, activeId]
  );

  const activeMessages = useMemo(() => normalizeMessages(activeConversation), [activeConversation]);
  const messageContainerRef = useRef(null);

  const lastMessage = activeMessages.length ? activeMessages[activeMessages.length - 1] : null;
  const lastInteraction = lastMessage?.createdAt ?? activeConversation?.updatedAt ?? activeConversation?.createdAt;
  const statusText = activeConversation
    ? isSocketConnected
      ? lastInteraction
        ? `Last active ${formatRelativeTime(lastInteraction)}`
        : "Online now"
      : "Reconnecting..."
    : "";

  useEffect(() => {
    if (!messageContainerRef.current) return;
    messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  }, [activeMessages, activeConversation?.id, isMobile]);

  const sendDraftMessage = async () => {
    if (!activeConversation || !draft.trim()) return;
    const conversation = await sendMessage({ conversationId: activeConversation.id, content: draft.trim() });
    if (conversation?.id) {
      setActiveId(conversation.id);
    }
    setDraft("");
  };

  const handleSelectConversation = (conversationId) => {
    setActiveId(conversationId);
    setDraft("");
    if (isMobile) {
      setMobileView("chat");
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();
    await sendDraftMessage();
  };

  const handleComposerKeyDown = async (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await sendDraftMessage();
    }
  };

  const handleOpenConversation = async (participantId) => {
    if (!participantId || isLoading) return;
    const existing = conversations.find((conversation) => conversation.participant?.id === participantId);
    if (existing) {
      handleSelectConversation(existing.id);
      return;
    }
    const conversation = await openConversation(participantId);
    if (conversation?.id) {
      handleSelectConversation(conversation.id);
    }
  };

  const handleFollowBack = async (followerId) => {
    await followBack(followerId);
  };

  const handleFollowMember = async (memberId) => {
    setPendingMemberIds((current) => {
      const next = new Set(current);
      next.add(memberId);
      return next;
    });
    try {
      await requestFollow(memberId);
      await searchMembers(memberSearch);
    } finally {
      setPendingMemberIds((current) => {
        const next = new Set(current);
        next.delete(memberId);
        return next;
      });
    }
  };

  const handleAcceptMemberRequest = async (requestId) => {
    if (!requestId) return;
    await acceptRequest(requestId);
    await searchMembers(memberSearch);
  };

  const handleDeclineMemberRequest = async (requestId) => {
    if (!requestId) return;
    await declineRequest(requestId);
    await searchMembers(memberSearch);
  };

  if (isLoading && !conversations.length) {
    return (
      <Card padding="p-0" contentClassName="flex items-center gap-3 px-6 py-4 text-sm text-slate-200">
        <Spinner size="sm" />
        <span>Opening your conversations...</span>
      </Card>
    );
  }

  const conversationList = (
    <aside
      className={clsx(
        "flex min-h-0 flex-col bg-night-800/70",
        isMobile ? "w-full border-b border-white/10" : "w-[320px] border-r border-white/10"
      )}
    >
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Chats</h2>
          <p className="text-xs text-slate-400">Connected with {followers.length} supporters</p>
        </div>
        <span className={clsx("flex items-center gap-2 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.3em]", isSocketConnected ? "bg-emerald-400/15 text-emerald-200" : "bg-amber-400/15 text-amber-200")}>
          <span className={clsx("h-2 w-2 rounded-full", isSocketConnected ? "bg-emerald-400" : "bg-amber-300")} />
          {isSocketConnected ? "Online" : "Connecting"}
        </span>
      </header>
      <div className="border-b border-white/10 px-4 py-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
          <Input
            value={conversationSearch}
            onChange={(event) => setConversationSearch(event.target.value)}
            placeholder="Search or start a chat"
            className="rounded-full bg-white/5 pl-9"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4 overscroll-contain">
        {filteredConversations.length ? (
          <ul className="space-y-2">
            {filteredConversations.map((conversation) => {
              const isActive = conversation.id === activeId;
              const messages = normalizeMessages(conversation);
              const lastMessage = messages.length ? messages[messages.length - 1] : null;
              const snippet = lastMessage?.content ?? "Start a new conversation";
              const timestamp = lastMessage?.createdAt ?? conversation.updatedAt ?? conversation.createdAt;
              return (
                <li key={conversation.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={clsx(
                      "relative flex w-full items-center gap-3 rounded-3xl px-3 py-3 text-left transition",
                      isActive ? "bg-white/10" : "hover:bg-white/5"
                    )}
                  >
                    <Avatar src={conversation.participant?.avatarUrl} alt={conversation.participant?.name} size={44} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-white">
                          {conversation.participant?.name ?? "Unknown"}
                        </p>
                        <time className="shrink-0 text-[11px] uppercase tracking-[0.25em] text-slate-500">
                          {timestamp ? formatClockTime(timestamp) : ""}
                        </time>
                      </div>
                      <p className="mt-1 truncate text-xs text-slate-400">{snippet}</p>
                    </div>
                    {isActive ? (
                      <span className="absolute inset-y-2 left-1 w-1 rounded-full bg-brand-400" aria-hidden />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-slate-400">
            <Sparkles className="h-8 w-8 text-slate-500" aria-hidden />
            <p>No conversations yet. Start by messaging a follower.</p>
          </div>
        )}
      </div>
      <footer className="border-t border-white/10 px-5 py-3 text-[11px] uppercase tracking-[0.25em] text-slate-500">
        Tip: tap a follower below to begin a new chat.
      </footer>
    </aside>
  );

  const messagePanel = (
    <section className="flex min-w-0 flex-1 min-h-0 flex-col bg-night-900/60">
      {activeConversation ? (
        <>
          <header className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              {isMobile ? (
                <button
                  type="button"
                  onClick={() => setMobileView("list")}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                  <span className="sr-only">Back to conversations</span>
                </button>
              ) : null}
              <Avatar src={activeConversation.participant?.avatarUrl} alt={activeConversation.participant?.name} size={48} />
              <div>
                <p className="text-sm font-semibold text-white">{activeConversation.participant?.name ?? "Unknown"}</p>
                <p className="text-xs text-slate-400">{statusText}</p>
              </div>
            </div>
            <span className="hidden text-xs uppercase tracking-[0.3em] text-slate-500 sm:inline">Secure connection - SambandhYog</span>
          </header>

          <div
            ref={messageContainerRef}
            className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6"
          >
            {activeMessages.length ? (
              activeMessages.map((message) => {
                const isMine = message.from === "me";
                return (
                  <div key={message.id} className={clsx("flex", isMine ? "justify-end" : "justify-start")}>
                    <div
                      className={clsx(
                        "max-w-[80%] rounded-3xl px-4 py-2 text-sm leading-relaxed shadow-lg",
                        isMine ? "bg-brand-500/90 text-white" : "bg-white/10 text-slate-100"
                      )}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                      <span
                        className={clsx(
                          "mt-1 block text-right text-[10px] tracking-[0.2em]",
                          isMine ? "text-white/80" : "text-slate-300/80"
                        )}
                      >
                        {formatClockTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-slate-400">
                <Sparkles className="h-8 w-8 text-slate-500" aria-hidden />
                <p>Say hello and start the conversation.</p>
              </div>
            )}
          </div>

          <footer className="border-t border-white/10 px-4 py-4 sm:px-6">
            <form onSubmit={handleSend} className="flex items-end gap-3">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:text-white"
              >
                <Paperclip className="h-4 w-4" aria-hidden />
                <span className="sr-only">Attach a file</span>
              </button>
              <div className="flex-1">
                <div className="rounded-3xl border border-white/10 bg-white/5">
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={handleComposerKeyDown}
                    placeholder="Type a message"
                    rows={1}
                    className="max-h-32 w-full resize-none rounded-3xl bg-transparent px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <p className="mt-2 text-[11px] text-slate-500">Press Enter to send - Shift + Enter for a new line</p>
              </div>
              <Button type="submit" icon={Send} disabled={!draft.trim()}>
                Send
              </Button>
            </form>
          </footer>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-sm text-slate-400">
          <Sparkles className="h-8 w-8 text-slate-500" aria-hidden />
          <p>Select a conversation to start messaging.</p>
        </div>
      )}
    </section>
  );

  const followersContent = (
    <div className="flex-1 overflow-y-auto px-3 py-4 overscroll-contain">
      {filteredFollowers.length ? (
        <ul className="space-y-2">
          {filteredFollowers.map((follower) => {
            const canMessage = follower.status === "following";
            return (
              <li key={follower.id}>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">
                  <button
                    type="button"
                    onClick={() => (canMessage ? handleOpenConversation(follower.id) : null)}
                    className={clsx(
                      "flex flex-1 items-center gap-3 text-left transition",
                      canMessage ? "hover:text-white" : "cursor-not-allowed opacity-75"
                    )}
                  >
                    <Avatar src={follower.avatarUrl} alt={follower.name} size={40} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">{follower.name}</p>
                      <p className="truncate text-xs text-slate-400">@{follower.username}</p>
                    </div>
                  </button>
                  {canMessage ? (
                    <span className="text-[10px] uppercase tracking-wide text-brand-300">Message</span>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => handleFollowBack(follower.id)}>
                      Follow back
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-slate-400">
          <Sparkles className="h-8 w-8 text-slate-500" aria-hidden />
          <p>No followers found. Expand your circle to chat more.</p>
        </div>
      )}
    </div>
  );

  const discoverContent = (
    <div className="flex-1 overflow-y-auto px-3 py-4 overscroll-contain">
      {isDirectoryLoading ? (
        <div className="flex items-center justify-center gap-3 text-sm text-slate-200">
          <Spinner size="sm" />
          <span>Loading members...</span>
        </div>
      ) : sortedMembers.length ? (
        <ul className="space-y-2">
          {sortedMembers.map((member) => {
            const pending = member.relationship === "pending";
            const following = member.relationship === "following";
            const requestedYou = member.relationship === "requested-you";
            const isBusy = pendingMemberIds.has(member.id);

            return (
              <li key={member.id} className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">
                <div className="flex items-center gap-3">
                  <Avatar src={member.avatarUrl} alt={member.name} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">{member.name}</p>
                    <p className="truncate text-xs text-slate-400">@{member.username}</p>
                  </div>
                  {following ? (
                    <span className="text-[10px] uppercase tracking-wide text-brand-300">Following</span>
                  ) : requestedYou ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleAcceptMemberRequest(member.requestId)}
                        disabled={!member.requestId}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeclineMemberRequest(member.requestId)}
                        disabled={!member.requestId}
                      >
                        Decline
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant={pending || isBusy ? "secondary" : "primary"}
                      onClick={() => handleFollowMember(member.id)}
                      disabled={pending || isBusy}
                    >
                      {pending || isBusy ? "Requested" : "Follow"}
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-slate-400">
          <Sparkles className="h-8 w-8 text-slate-500" aria-hidden />
          <p>No members found. Try another search.</p>
        </div>
      )}
    </div>
  );

  const followersPanel = (
    <aside className="flex w-72 min-h-0 flex-col border-l border-white/10">
      <header className="border-b border-white/10 px-5 py-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Connections</h2>
        <p className="mt-1 text-sm text-slate-100">Follow and chat with positive peers</p>
      </header>
      <div className="flex items-center gap-1 border-b border-white/10 px-4 py-3 text-xs font-semibold text-slate-400">
        <button
          type="button"
          onClick={() => setDirectoryView("followers")}
          className={clsx(
            "rounded-full px-3 py-1 transition",
            directoryView === "followers" ? "bg-white/10 text-white" : "hover:bg-white/5"
          )}
        >
          Followers
        </button>
        <button
          type="button"
          onClick={() => setDirectoryView("discover")}
          className={clsx(
            "rounded-full px-3 py-1 transition",
            directoryView === "discover" ? "bg-white/10 text-white" : "hover:bg-white/5"
          )}
        >
          Discover
        </button>
      </div>
      {directoryView === "followers" ? (
        <>
          <div className="border-b border-white/10 px-4 py-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
              <Input
                value={followerSearch}
                onChange={(event) => setFollowerSearch(event.target.value)}
                placeholder="Search followers"
                className="pl-9"
              />
            </div>
          </div>
          {followersContent}
        </>
      ) : (
        <>
          <div className="border-b border-white/10 px-4 py-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
              <Input
                value={memberSearch}
                onChange={(event) => setMemberSearch(event.target.value)}
                placeholder="Search members"
                className="pl-9"
              />
            </div>
          </div>
          {discoverContent}
        </>
      )}
    </aside>
  );

  return (
    <div className="w-full space-y-4">
      <Card
        className="w-full"
        padding="p-0"
        contentClassName={clsx(
          "flex min-h-0 overflow-hidden",
          isMobile
            ? "h-[calc(100vh-160px)] min-h-[480px] max-h-[720px] flex-col"
            : "h-[calc(100vh-200px)] max-h-[720px]"
        )}
      >
        {isMobile ? (
          <>
            {mobileView !== "chat" ? conversationList : null}
            {mobileView === "chat" ? messagePanel : null}
          </>
        ) : (
          <>
            {conversationList}
            {messagePanel}
            {followersPanel}
          </>
        )}
      </Card>

      {isMobile ? (
        <div className="space-y-3">
          <Card padding="p-0" contentClassName="flex flex-col">
            <details className="group" open>
              <summary className="flex cursor-pointer items-center justify-between border-b border-white/10 px-5 py-4 text-sm font-semibold text-white">
                Followers
                <span className="text-xs font-medium text-brand-300">{followers.length}</span>
              </summary>
              <div className="border-b border-white/10 px-4 py-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
                  <Input
                    value={followerSearch}
                    onChange={(event) => setFollowerSearch(event.target.value)}
                    placeholder="Search followers"
                    className="pl-9"
                  />
                </div>
              </div>
              {followersContent}
            </details>
          </Card>
          <Card padding="p-0" contentClassName="flex flex-col">
            <details className="group" open>
              <summary className="flex cursor-pointer items-center justify-between border-b border-white/10 px-5 py-4 text-sm font-semibold text-white">
                Discover members
                <span className="text-xs font-medium text-brand-300">{sortedMembers.length}</span>
              </summary>
              <div className="border-b border-white/10 px-4 py-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
                  <Input
                    value={memberSearch}
                    onChange={(event) => setMemberSearch(event.target.value)}
                    placeholder="Search members"
                    className="pl-9"
                  />
                </div>
              </div>
              {discoverContent}
            </details>
          </Card>
        </div>
      ) : null}
    </div>
  );
}





