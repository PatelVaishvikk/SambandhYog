"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { useConnections } from "@/context/ConnectionsContext";

export default function FollowersPage({ params }) {
  const resolved = params;
  const username = typeof resolved?.username === "string" ? resolved.username : "";
  const { followers, followBack, openConversation, isLoading } = useConnections();

  const mutualFollowers = followers.filter((follower) => follower.status === "following");

  const handleMessage = (followerId) => {
    if (isLoading) return;
    openConversation(followerId);
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col gap-6 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Supporters of {username}</h1>
        <p className="text-sm text-slate-400">
          {mutualFollowers.length
            ? "Mutual followers can start a chat right away."
            : "Follow back supporters to unlock messaging."}
        </p>
      </div>

      {isLoading && !followers.length ? (
        <Card className="flex items-center gap-3 text-sm text-slate-300">
          <Spinner size="sm" />
          <span>Fetching supporters...</span>
        </Card>
      ) : null}

      {!isLoading && !followers.length ? (
        <Card className="text-sm text-slate-300">No supporters yet. Share updates to grow your circle.</Card>
      ) : null}

      <div className="space-y-3">
        {followers.map((follower) => {
          const canMessage = follower.status === "following";

          return (
            <Card key={follower.id} className="flex items-center justify-between gap-3 p-5">
              <div className="flex items-center gap-3">
                <Avatar src={follower.avatarUrl} alt={follower.name} size={40} />
                <div>
                  <Link
                    href={`/user/${follower.username}`}
                    className="text-sm font-semibold text-white transition hover:text-emerald-200"
                  >
                    {follower.name}
                  </Link>
                  <p className="text-xs text-slate-400">{follower.headline}</p>
                  <p className="text-xs text-slate-500">@{follower.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {canMessage ? (
                  <>
                    <Button size="sm" variant="secondary" onClick={() => handleMessage(follower.id)} disabled={isLoading}>
                      Message
                    </Button>
                    <span className="text-xs font-medium text-emerald-300">Mutual connection</span>
                  </>
                ) : (
                  <Button size="sm" onClick={() => followBack(follower.id)} disabled={isLoading}>
                    Follow back
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
