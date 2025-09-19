"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import Button from "@/components/ui/Button";

export default function LikeButton({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);

  const toggle = () => {
    setLiked((prev) => !prev);
    setCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={toggle}
      className={liked ? "text-emerald-600" : undefined}
    >
      <Heart className={`h-4 w-4 ${liked ? "fill-emerald-500 text-emerald-500" : "text-slate-500"}`} aria-hidden />
      {count}
    </Button>
  );
}


