"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ImageUpload from "@/components/common/ImageUpload";
import Avatar from "@/components/ui/Avatar";
import { uploadProfileImage } from "@/lib/auth";

export default function EditProfile({ initialProfile, onSave }) {
  const [form, setForm] = useState(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setForm(initialProfile);
  }, [initialProfile]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const { url } = await uploadProfileImage(file);
      setForm((prev) => ({ ...prev, avatarUrl: url }));
    } catch (error) {
      console.error("Avatar upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await onSave?.(form);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar src={form.avatarUrl} alt={form.name} size={64} />
        <ImageUpload onUpload={handleUpload} />
        {isUploading ? <span className="text-xs text-slate-400">Uploading...</span> : null}
      </div>
      <Input label="Name" value={form.name} onChange={handleChange("name")} />
      <Input label="Headline" value={form.headline} onChange={handleChange("headline")} />
      <label className="flex flex-col gap-1 text-sm text-slate-200">
        <span className="font-medium text-slate-200">About</span>
        <textarea
          value={form.bio}
          onChange={handleChange("bio")}
          className="min-h-[120px] rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
      </label>
      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}

