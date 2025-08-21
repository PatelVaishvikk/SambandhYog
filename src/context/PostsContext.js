"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";

const Ctx = createContext(null);
export const usePostsContext = () => useContext(Ctx);
// naive sentiment
const POS = ["thanks","great","love","grateful","happy","peace","joy","kind","proud","win","sweet","beautiful","awesome","wow","amazing","blessed"];
const NEG = ["hate","angry","sad","bad","toxic","ugly","loser","worst","annoyed","problem"];

function scorePositivity(text) {
  const t = (text || "").toLowerCase();
  const pos = POS.reduce((a,w)=>a+(t.includes(w)?1:0),0);
  const neg = NEG.reduce((a,w)=>a+(t.includes(w)?1:0),0);
  const raw = pos - neg;
  return Math.max(0, Math.min(1, (raw + 2) / 4));
}

const seed = [
  {
    id: nanoid(),
    user: { name: "Aarav", avatar: "/default-avatar.png" },
    text: "Grateful to start building #SambandhYog today ✨ Let’s keep the vibe positive.",
    images: ["/images/welcome-banner.jpg"],
    createdAt: Date.now() - 1000 * 60 * 90,
    likes: 5,
    comments: [{ id: nanoid(), text: "Let’s go! 🔥" }],
    bookmarks: 1,
  },
  {
    id: nanoid(),
    user: { name: "Diya", avatar: "/default-avatar.png" },
    text: "Shared my first design snippet. Feedback welcome 🪷 #design #ui",
    images: ["/images/placeholder-post.jpg","/images/welcome-banner.jpg"],
    createdAt: Date.now() - 1000 * 60 * 30,
    likes: 2,
    comments: [],
    bookmarks: 0,
  }
];

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [bookmarked, setBookmarked] = useState(() => new Set());

  useEffect(() => {
    const saved = localStorage.getItem("sy_posts");
    const bm = localStorage.getItem("sy_bookmarks");
    if (saved) {
      const parsed = JSON.parse(saved);
      setPosts(parsed);
    } else {
      const seeded = seed.map(p => ({ ...p, positivity: scorePositivity(p.text) }));
      setPosts(seeded);
    }
    if (bm) setBookmarked(new Set(JSON.parse(bm)));
  }, []);

  useEffect(() => {
    localStorage.setItem("sy_posts", JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem("sy_bookmarks", JSON.stringify(Array.from(bookmarked)));
  }, [bookmarked]);

  const addPost = (text, fileUrls = []) => {
    const p = {
      id: nanoid(),
      user: { name: localStorage.getItem("sy_user") || "You ✨", avatar: "/default-avatar.png" },
      text: text || "",
      images: fileUrls,
      createdAt: Date.now(),
      likes: 0,
      comments: [],
      bookmarks: 0,
      positivity: scorePositivity(text),
    };
    setPosts(prev => [p, ...prev]);
  };

  const toggleLike = (id, bump = 1) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + bump } : p));
  };

  const addComment = (id, text) => {
    if (!text?.trim()) return;
    setPosts(prev => prev.map(p => p.id === id ? { ...p, comments: [...p.comments, { id: nanoid(), text: text.trim() }] } : p));
  };

  const toggleBookmark = (id) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const saved = bookmarked.has(id);
      return { ...p, bookmarks: Math.max(0, (p.bookmarks || 0) + (saved ? -1 : 1)) };
    }));
    setBookmarked(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  // basic "explore" score: recency + likes + comments + positivity
  const getExplore = () => {
    const now = Date.now();
    const scored = posts.map(p => {
      const ageH = (now - p.createdAt) / 3600_000;
      const recency = Math.max(0, 1 - ageH / 48); // decay over ~2 days
      const eng = (p.likes * 1.2) + (p.comments.length * 1.6) + (p.bookmarks || 0);
      const pos = (p.positivity || 0.5);
      const score = recency * 0.5 + Math.min(1, eng / 20) * 0.3 + pos * 0.2;
      return { ...p, _score: score };
    });
    return scored.sort((a,b)=>b._score - a._score);
  };

  const value = useMemo(() => ({
    posts, addPost, toggleLike, addComment, toggleBookmark, bookmarked, getExplore
  }), [posts, bookmarked]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
