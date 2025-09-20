"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import Input from "@/components/ui/Input";
import { useConnections } from "@/context/ConnectionsContext";

export default function UsersDirectoryClient() {
  const {
    members,
    directoryQuery,
    isDirectoryLoading,
    searchMembers,
    requestFollow,
    acceptRequest,
    declineRequest,
  } = useConnections();

  const [search, setSearch] = useState(directoryQuery ?? "");
  const [pending, setPending] = useState(new Set());

  useEffect(() => {
    setSearch(directoryQuery ?? "");
  }, [directoryQuery]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchMembers(search).catch(() => null);
    }, 250);
    return () => clearTimeout(timeout);
  }, [search, searchMembers]);

  const sortedMembers = useMemo(() => members.slice().sort((a, b) => a.name.localeCompare(b.name)), [members]);

  const handleAction = async (member, action) => {
    if (!member?.id) return;
    setPending((prev) => new Set(prev).add(member.id));
    try {
      if (action === "follow") {
        await requestFollow(member.id);
        toast.success("Follow request sent");
      } else if (action === "accept" && member.requestId) {
        await acceptRequest(member.requestId);
        toast.success("Request accepted");
      } else if (action === "decline" && member.requestId) {
        await declineRequest(member.requestId);
        toast.success("Request declined");
      }
      await searchMembers(search);
    } catch (error) {
      console.error("Directory action", error);
      toast.error(error.message || "Could not update connection");
    } finally {
      setPending((prev) => {
        const next = new Set(prev);
        next.delete(member.id);
        return next;
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card contentClassName="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Members building positive careers</h1>
            <p className="text-sm text-slate-400">Search by name, username, or headline to connect with new supporters.</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => searchMembers("")}>Clear search</Button>
        </div>
        <div className="relative">
          <SearchIcon />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search members"
            className="pl-10"
          />
        </div>
      </Card>

      <Card contentClassName="divide-y divide-white/5">
        {isDirectoryLoading && !sortedMembers.length ? (
          <div className="p-6 text-sm text-slate-300">Loading members...</div>
        ) : null}
        {sortedMembers.map((member) => {
          const pendingAction = pending.has(member.id) || member.relationship === "pending";
          const following = member.relationship === "following";
          const requestedYou = member.relationship === "requested-you";

          return (
            <div key={member.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={member.avatarUrl} alt={member.name} size={48} />
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-white">{member.name}</p>
                  <p className="truncate text-xs uppercase tracking-wide text-slate-400">@{member.username}</p>
                  {member.headline ? <p className="truncate text-sm text-slate-300">{member.headline}</p> : null}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {following ? (
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-300">Following</span>
                ) : requestedYou ? (
                  <>
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={pendingAction}
                      onClick={() => handleAction(member, "accept")}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={pendingAction}
                      onClick={() => handleAction(member, "decline")}
                    >
                      Decline
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant={pendingAction ? "secondary" : "primary"}
                    disabled={pendingAction}
                    onClick={() => handleAction(member, "follow")}
                  >
                    {pendingAction ? "Requested" : "Follow"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        {!isDirectoryLoading && !sortedMembers.length ? (
          <div className="p-6 text-sm text-slate-300">No members found. Try a different search.</div>
        ) : null}
      </Card>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
