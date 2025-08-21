export function renderWithHashtags(text = "") {
  const parts = text.split(/(\#[\w\d_]+)/g);
  return parts.map((p, idx) => {
    if (p.startsWith("#")) {
      const tag = p.slice(1);
      return `<a href="/explore?tag=${encodeURIComponent(tag)}" class="text-sky-300 hover:underline">${p}</a>`;
    }
    return p.replace(/\n/g, "<br/>");
  }).join("");
}
