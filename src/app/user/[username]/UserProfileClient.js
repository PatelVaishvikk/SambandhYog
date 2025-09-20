"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { useConnections } from "@/context/ConnectionsContext";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/apiClient";

export default function UserProfileClient({ username }) {
  const displayName = username.replace(/-/g, " ");
  const { user: currentUser } = useAuth();
  const { outgoing, requestFollow, isLoading: connectionsLoading } = useConnections();
  const [profile, setProfile] = useState(null);
  const [relationship, setRelationship] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isRequestingFollow, setIsRequestingFollow] = useState(false);

  useEffect(() => {
    let active = true;
    setIsFetching(true);
    setProfileError(null);
    (async () => {
      try {
        if (!username) {
          throw new Error("Username is missing");
        }

        const { data } = await apiClient.get(`/users/${username}`);
        if (!active) return;
        setProfile(data.profile ?? null);
        setRelationship(data.relationship ?? null);
      } catch (error) {
        if (!active) return;
        const payloadProfile = error.data?.profile ?? null;
        if (payloadProfile) {
          setProfile(payloadProfile);
          setRelationship(error.data?.relationship ?? null);
        }
        setProfileError(error.message);
      } finally {
        if (active) {
          setIsFetching(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [username]);

  const profileId = profile?.id;
  const isSelf = useMemo(() => {
    if (!profileId || !currentUser?.id) return false;
    return profileId === currentUser.id || profile?.username === currentUser.username;
  }, [profileId, currentUser?.id, profile?.username, currentUser?.username]);

  const isFollowing = relationship?.follows ?? false;
  const isPending = relationship?.pending ?? false;
  const canViewProfile = isSelf || isFollowing;

  const alreadyRequested = useMemo(() => {
    if (isPending) return true;
    if (!profileId) return false;
    return outgoing.some((item) => item.id === profileId);
  }, [isPending, outgoing, profileId]);

  const handleRequestFollow = async () => {
    if (!profileId || isSelf || isFollowing || alreadyRequested || isRequestingFollow) {
      return;
    }
    setIsRequestingFollow(true);
    try {
      await requestFollow(profileId);
      setRelationship((prev) => ({ ...(prev ?? {}), pending: true, follows: false }));
    } catch (error) {
      console.error("Request follow", error);
    } finally {
      setIsRequestingFollow(false);
    }
  };

  if (isFetching && !profile) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-3xl items-center justify-center px-6 py-16">
        <Card contentClassName="text-sm text-slate-200">Loading profile...</Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col gap-6 px-6 py-16">
      <Card contentClassName="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar src={profile?.avatarUrl} alt={displayName} size={64} />
          <div>
            <h1 className="text-3xl font-semibold text-white">{profile?.name ?? displayName}</h1>
            <p className="text-sm text-slate-200">{profile?.headline ?? "This member is crafting their profile."}</p>
            {profileError && canViewProfile ? (
              <p className="text-xs text-rose-300">{profileError}</p>
            ) : null}
          </div>
        </div>
        {isSelf ? (
          <span className="text-xs text-slate-400">This is your profile.</span>
        ) : canViewProfile ? (
          <span className="text-xs text-slate-400">You follow this member.</span>
        ) : (
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
            <p>{profileError ?? "Follow this member to unlock their profile."}</p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant={isPending || alreadyRequested ? "secondary" : "primary"}
                onClick={handleRequestFollow}
                disabled={isRequestingFollow || isPending || alreadyRequested || connectionsLoading}
              >
                {isPending || alreadyRequested ? "Request sent" : "Send follow request"}
              </Button>
              {isRequestingFollow ? <span className="text-xs text-slate-400">Sending...</span> : null}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
