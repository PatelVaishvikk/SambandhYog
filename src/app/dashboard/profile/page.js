"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Card from "@/components/ui/Card";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileStats from "@/components/profile/ProfileStats";
import EditProfile from "@/components/profile/EditProfile";
import { useAuth } from "@/context/AuthContext";

const DEFAULT_PROFILE = {
  name: "Aarav Patel",
  headline: "Product Designer @ SambandhYog",
  bio: "Designing products that celebrate small wins and keep teams motivated.",
  avatarUrl: "/default-avatar.png",
  tags: ["Design Leader"],
};

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState(user ?? DEFAULT_PROFILE);

  useEffect(() => {
    if (user) {
      setProfile(user);
    }
  }, [user]);

  const handleSave = async (nextProfile) => {
    const updated = await updateProfile(nextProfile);
    if (updated) {
      setProfile(updated);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 gap-6">
        <Sidebar />
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
          <section className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
            <ProfileCard profile={profile} />
            <ProfileStats stats={{ Followers: profile.followers ?? 0, Following: profile.following ?? 0, Mentorships: 12 }} />
          </section>
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Edit profile</h2>
            <EditProfile initialProfile={profile} onSave={handleSave} />
          </Card>
        </main>
      </div>
    </div>
  );
}

