"use client";

import { useEffect, useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import FollowButton from "@/components/profile/FollowButton";
import Avatar from "@/components/ui/Avatar";
import { useConnections } from "@/context/ConnectionsContext";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/apiClient";

export default function UserProfileClient({ username }) {
  const displayName = username.replace(/-/g, " ");
  const { user: currentUser } = useAuth();
  const { outgoing, requestFollow, isLoading } = useConnections();
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!username) {
          setProfileError("Username is missing");
          return;
        }

        const { data } = await apiClient.get(`/users/${username}`);
        if (active) {
          setProfile(data.profile);
          setProfileError(null);
        }
      } catch (error) {
        if (active) {
          setProfileError(error.message);
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

  const alreadyRequested = useMemo(() => {
    if (!profileId) return false;
    return outgoing.some((item) => item.id === profileId);
  }, [outgoing, profileId]);

  const handleFollow = () => {
    if (!profileId || alreadyRequested || isLoading || isSelf) return;
    requestFollow(profileId);
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col gap-6 px-6 py-16">
      <Card className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar src={profile?.avatarUrl} alt={displayName} size={64} />
          <div>
            <h1 className="text-3xl font-semibold text-white">{profile?.name ?? displayName}</h1>
            <p className="text-sm text-slate-300">{profile?.headline ?? "This member is crafting their profile."}</p>
            {profileError ? <p className="text-xs text-rose-300">{profileError}</p> : null}
          </div>
        </div>
        {isSelf ? (
          <span className="text-xs text-slate-400">This is your profile.</span>
        ) : (
          <FollowButton
            initialFollowing={alreadyRequested}
            onToggle={handleFollow}
            lockOnFollow
            disabled={isLoading || !profileId}
          />
        )}
      </Card>
    </div>
  );
}
