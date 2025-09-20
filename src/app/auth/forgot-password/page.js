'use client';

import Card from "@/components/ui/Card";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center justify-center px-6 py-20">
      <Card className="w-full max-w-lg bg-white/10" contentClassName="space-y-4" padding="p-8">
        <h1 className="text-3xl font-bold text-white">Reset your password</h1>
        <p className="text-sm text-slate-300">
          Enter the email linked to your account. We will send a secure link so you can set a new password.
        </p>
        <ForgotPasswordForm />
      </Card>
    </div>
  );
}


