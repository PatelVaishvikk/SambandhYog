"use client";

import { useState } from "react";
import Link from "next/link";
import PostForm from "@/components/posts/PostForm";
import PostList from "@/components/posts/PostList";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { useConnections } from "@/context/ConnectionsContext";
import { usePosts } from "@/context/PostsContext";

function MembersSpotlight() {
  const {
    members,
    directoryQuery,
    isDirectoryLoading,
    requestFollow,
    acceptRequest,
    declineRequest,
    searchMembers,
  } = useConnections();
  const [pending, setPending] = useState(new Set());

  const refreshDirectory = async () => {
    await searchMembers(directoryQuery);
  };

  const handleFollow = async (member) => {
    if (!member?.id) return;
    setPending((prev) => new Set(prev).add(member.id));
    try {
      if (member.relationship === "requested-you" && member.requestId) {
        await acceptRequest(member.requestId);
        toast.success("Follow request accepted");
      } else if (member.relationship !== "following") {
        await requestFollow(member.id);
        toast.success("Follow request sent");
      }
      await refreshDirectory();
    } catch (error) {
      console.error("Follow member", error);
      toast.error(error.message || "Could not update follow status");
    } finally {
      setPending((prev) => {
        const next = new Set(prev);
        next.delete(member.id);
        return next;
      });
    }
  };

  const handleDecline = async (member) => {
    if (!member?.requestId) return;
    setPending((prev) => new Set(prev).add(member.id));
    try {
      await declineRequest(member.requestId);
      toast.success("Request declined");
      await refreshDirectory();
    } catch (error) {
      console.error("Decline request", error);
      toast.error(error.message || "Could not decline request");
    } finally {
      setPending((prev) => {
        const next = new Set(prev);
        next.delete(member.id);
        return next;
      });
    }
  };

  const topMembers = members.slice(0, 6);

  return (
    <Card contentClassName="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Members</p>
          <h2 className="text-lg font-semibold text-white">Grow your circle</h2>
        </div>
        <Button as={Link} href="/explore/users" size="sm" variant="secondary">
          Explore all
        </Button>
      </header>
      <div className="space-y-3">
        {isDirectoryLoading && !topMembers.length ? (
          <p className="text-sm text-slate-400">Loading members...</p>
        ) : null}
        {topMembers.map((member) => {
          const isPending = pending.has(member.id) || member.relationship === "pending";
          const isFollowing = member.relationship === "following";
          const requestedYou = member.relationship === "requested-you";

          return (
            <div key={member.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-2">
              <Avatar src={member.avatarUrl} alt={member.name} size={40} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-white">{member.name}</p>
                <p className="truncate text-xs text-slate-400">@{member.username}</p>
              </div>
              {isFollowing ? (
                <span className="text-[10px] uppercase tracking-wide text-brand-300">Following</span>
              ) : requestedYou ? (
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary" disabled={isPending} onClick={() => handleFollow(member)}>
                    Accept
                  </Button>
                  <Button size="sm" variant="ghost" disabled={isPending} onClick={() => handleDecline(member)}>
                    Decline
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant={isPending ? "secondary" : "primary"}
                  disabled={isPending}
                  onClick={() => handleFollow(member)}
                >
                  {isPending ? "Requested" : "Follow"}
                </Button>
              )}
            </div>
          );
        })}
        {!isDirectoryLoading && !topMembers.length ? (
          <p className="text-sm text-slate-400">No members to show yet. Visit explore to find new connections.</p>
        ) : null}
      </div>
    </Card>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const { isLoading } = usePosts();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Community Feed</h1>
          <p className="text-sm text-slate-400">Share milestones and celebrate supporters.</p>
        </div>
        <Button as={Link} href="/dashboard" size="sm" variant="secondary">
          Go to dashboard
        </Button>
      </header>
      <div className="flex flex-1 flex-col gap-6 lg:flex-row">
        <main className="flex w-full flex-1 flex-col gap-6">
          {user ? <PostForm /> : <Card contentClassName="text-sm text-slate-200">Log in to share updates with your circle.</Card>}
          <PostList />
          {isLoading ? <span className="text-xs text-slate-500">Refreshing feed...</span> : null}
        </main>
        <aside className="w-full max-w-sm flex-shrink-0 space-y-4 lg:block">
          <MembersSpotlight />
        </aside>
      </div>
    </div>
  );
}
