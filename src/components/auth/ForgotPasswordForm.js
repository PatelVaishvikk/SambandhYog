'use client';

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 800));
    setStatus("sent");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" />
      <Button type="submit" className="w-full" disabled={!email || status === "loading"}>
        {status === "loading" ? (
          <span className="inline-flex items-center gap-2">
            <Spinner size="sm" /> Sending reset link
          </span>
        ) : status === "sent" ? (
          "Reset link sent"
        ) : (
          "Send reset link"
        )}
      </Button>
      {status === "sent" ? (
        <p className="text-sm text-emerald-300">Check your inbox for a link to reset your password.</p>
      ) : null}
    </form>
  );
}

