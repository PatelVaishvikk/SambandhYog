import { useEffect } from "react";

export default function useInfiniteScroll(ref, { onLoadMore, hasMore, threshold = 0.5 }) {
  useEffect(() => {
    if (!ref.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && onLoadMore?.()),
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, hasMore, onLoadMore, threshold]);
}
