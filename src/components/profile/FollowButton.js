"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

export default function FollowButton({ initialFollowing = false, onToggle, lockOnFollow = false, disabled = false }) {
  const [following, setFollowing] = useState(initialFollowing);

  useEffect(() => {
    setFollowing(initialFollowing);
  }, [initialFollowing]);

  const toggle = () => {
    if (disabled) return;
    if (lockOnFollow && following) return;
    const next = lockOnFollow ? true : !following;
    setFollowing(next);
    onToggle?.(next);
  };

  return (
    <Button type="button" size="sm" onClick={toggle} disabled={disabled || (lockOnFollow && following)}>
      {following ? (lockOnFollow ? "Requested" : "Following") : "Follow"}
    </Button>
  );
}
