'use client';

import { useEffect, useRef } from "react";

export default function InfiniteScroll({ onLoadMore, hasMore, threshold = 0.5 }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onLoadMore?.();
          }
        });
      },
      { threshold }
    );

    const node = sentinelRef.current;
    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore, threshold]);

  if (!hasMore) return null;
  return <div ref={sentinelRef} className="h-10" aria-hidden />;
}

