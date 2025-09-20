"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import Card from "@/components/ui/Card";
import { toast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const handleSuccess = () => {
    toast.success("Welcome back! Redirecting to your dashboard.");
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-4xl items-center justify-between gap-10 px-6 py-20">
      <div className="max-w-md space-y-4">
        <h1 className="text-4xl font-bold text-white">Log in to SambandhYog</h1>
        <p className="text-sm text-slate-300">
          Reconnect with your circles, celebrate wins, and keep your professional momentum strong.
        </p>
        <p className="text-xs text-slate-500">
          New here? <Link href="/auth/register" className="text-brand-300">Create an account</Link>
        </p>
      </div>
      <Card className="w-full max-w-md bg-white/10" padding="p-8" contentClassName="space-y-4">
        <LoginForm onSuccess={handleSuccess} />
        <div className="mt-4 text-xs text-slate-400">
          <Link href="/auth/forgot-password" className="text-brand-300">
            Forgot your password?
          </Link>
        </div>
      </Card>
    </div>
  );
}

