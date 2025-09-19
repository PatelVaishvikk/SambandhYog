'use client';

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";

export default function RegisterForm({ onSuccess }) {
  const { register, isLoading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const result = await register(form);
      if (result.success) onSuccess?.(result.user);
    } catch (err) {
      setError(err.message || "Unable to register right now. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Full name" required value={form.name} onChange={handleChange("name")} placeholder="Ananya Rao" />
      <Input label="Email" type="email" required value={form.email} onChange={handleChange("email")} placeholder="you@company.com" />
      <Input label="Password" type="password" required value={form.password} onChange={handleChange("password")} placeholder="Create a secure password" />
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <Spinner size="sm" /> Creating account
          </span>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
}

