"use client";

import clsx from "clsx";
import Button from "@/components/ui/Button";
import { Heart } from "lucide-react";

export default function LikeButton({ count = 0, liked = false, onToggle, disabled = false }) {
  const handleClick = () => {
    if (disabled) return;
    onToggle?.();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={disabled}
      className={clsx("gap-1 text-xs", liked ? "text-brand-300" : "text-slate-300")}
    >
      <Heart
        className={clsx("h-4 w-4", liked ? "fill-brand-400 text-brand-400" : "text-slate-400")}
        aria-hidden
      />
      {count}
    </Button>
  );
}
