"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Search, Send, Sparkles } from "lucide-react";
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

  const handleSelectConversation = (conversationId) => {
    setActiveId(conversationId);
    setDraft("");
    if (isMobile) {
      setMobileView("chat");
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();
    if (!activeConversation || !draft.trim()) return;
    const conversation = await sendMessage({ conversationId: activeConversation.id, content: draft.trim() });
    if (conversation?.id) {
      setActiveId(conversation.id);
    }
    setDraft("");
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
    <section
      className={clsx(
        "flex flex-col border-white/10",
        isMobile ? "w-full border-b" : "w-72 border-r"
      )}
    >
      <header className="border-b border-white/10 px-5 py-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Messages</h2>
        <p className="mt-1 text-sm text-slate-100">Connected with {followers.length} supporters</p>
      </header>
      <div className="border-b border-white/10 px-4 py-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
          <Input
            value={conversationSearch}
            onChange={(event) => setConversationSearch(event.target.value)}
            placeholder="Search conversations"
            className="pl-9"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {filteredConversations.length ? (
          <ul className="space-y-2">
            {filteredConversations.map((conversation) => {
              const isActive = conversation.id === activeId;
              const lastMessage = normalizeMessages(conversation).slice(-1)[0];
              const snippet = lastMessage?.content ?? "Start a new conversation";
              const timestamp = lastMessage?.createdAt ?? conversation.updatedAt ?? conversation.createdAt;
              return (
                <li key={conversation.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2 text-left transition ${
                      isActive
                        ? "border-brand-400/60 bg-brand-500/20 text-white"
                        : "border-white/10 bg-white/10 text-slate-200 hover:border-brand-400/40 hover:text-white"
                    }`}
                  >
                    <Avatar src={conversation.participant?.avatarUrl} alt={conversation.participant?.name} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {conversation.participant?.name ?? "Unknown"}
                      </p>
                      <p className="truncate text-xs text-slate-400">{snippet}</p>
                    </div>
                    <time className="text-[10px] uppercase tracking-wide text-slate-500">
                      {timestamp ? formatRelativeTime(timestamp) : ""}
                    </time>
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
    </section>
  );

  const messagePanel = (
    <section
      className={clsx(
        "flex min-w-0 flex-1 flex-col",
        !activeConversation && "items-center justify-center"
      )}
    >
      {activeConversation ? (
        <>
          <header className="flex items-center gap-3 border-b border-white/10 px-6 py-4">
            {isMobile ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setMobileView("list")}
                className="-ml-2 px-2 text-slate-200"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Back
              </Button>
            ) : null}
            <Avatar
              src={activeConversation.participant?.avatarUrl}
              alt={activeConversation.participant?.name}
              size={isMobile ? 40 : 44}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{activeConversation.participant?.name}</p>
              <p className="text-xs text-slate-400">
                {isSocketConnected ? "Active now" : "Reachable when they reconnect"}
              </p>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="space-y-3">
              {activeMessages.map((message) => {
                const fromMe = message.from === "me";
                return (
                  <div
                    key={message.id}
                    className={`flex ${fromMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                        fromMe ? "bg-brand-500 text-white" : "bg-white/10 text-slate-100"
                      }`}
                    >
                      <p>{message.content}</p>
                      <span className="mt-1 block text-[10px] uppercase tracking-wide text-white/70">
                        {formatRelativeTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <form onSubmit={handleSend} className="border-t border-white/10 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={`Send a kind message to ${activeConversation.participant?.name}`}
                className="flex-1"
              />
              <Button type="submit" size="sm" variant="secondary" disabled={!draft.trim()}>
                <Send className="h-4 w-4" aria-hidden />
                Send
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/10">
            <Sparkles className="h-7 w-7 text-brand-300" aria-hidden />
          </div>
          <p className="text-base font-semibold text-white">Select a conversation</p>
          <p className="text-sm text-slate-400">
            Choose someone from your messages or followers to begin a positive exchange.
          </p>
        </div>
      )}
    </section>
  );

  const followersContent = (
    <div className="flex-1 overflow-y-auto px-3 py-4">
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
    <div className="flex-1 overflow-y-auto px-3 py-4">
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
    <aside className="flex w-72 flex-col border-l border-white/10">
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
          "overflow-hidden",
          isMobile ? "flex min-h-[520px] flex-col" : "flex h-[640px]"
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


