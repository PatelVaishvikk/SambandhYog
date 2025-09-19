export function formatRelativeTime(date) {
  if (!date) return "just now";
  const delta = Date.now() - new Date(date).getTime();
  const minutes = Math.round(delta / (1000 * 60));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function truncate(text, length = 140) {
  if (!text || text.length <= length) return text;
  return `${text.slice(0, length)}...`;
}
