"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RegisterForm from "@/components/auth/RegisterForm";
import Card from "@/components/ui/Card";
import { toast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const handleSuccess = () => {
    toast.success("Account created! Welcome to SambandhYog.");
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center justify-between gap-10 px-6 py-20">
      <div className="max-w-xl space-y-4">
        <h1 className="text-4xl font-bold text-white">Join a community that celebrates your wins</h1>
        <p className="text-sm text-slate-300">
          Build authentic professional relationships, find mentors, and share milestones that inspire others.
        </p>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>- Discover curated circles for every career stage</li>
          <li>- Get feedback from mentors and supportive peers</li>
          <li>- Track your journey with positivity-first analytics</li>
        </ul>
        <p className="text-xs text-slate-500">
          Already have an account? <Link href="/auth/login" className="text-emerald-300">Log in</Link>
        </p>
      </div>
      <Card className="w-full max-w-md bg-slate-900/80 p-8">
        <RegisterForm onSuccess={handleSuccess} />
      </Card>
    </div>
  );
}
