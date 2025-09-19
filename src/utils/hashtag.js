export function extractHashtags(text) {
  if (!text) return [];
  const matches = text.match(/#(\w+)/g) || [];
  return matches.map((tag) => tag.slice(1).toLowerCase());
}
