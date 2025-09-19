"use client";

import Image from "next/image";
import clsx from "clsx";

export default function Avatar({ src = "", alt = "", size = 40, className }) {
  const dimension = typeof size === "number" ? size : 40;
  const showFallback = !src;
  const initials =
    alt
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .slice(0, 2)
      .join("") || "SY";

  return (
    <span
      className={clsx(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-500",
        className
      )}
      style={{ width: dimension, height: dimension }}
    >
      {showFallback ? (
        <span>{initials}</span>
      ) : (
        <Image src={src} alt={alt} fill sizes={`${dimension}px`} className="object-cover" />
      )}
    </span>
  );
}

