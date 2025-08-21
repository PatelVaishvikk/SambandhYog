"use client";
import Card from "../ui/Card";
import { useEffect, useRef, useState } from "react";
import { usePostsContext } from "../../context/PostsContext";
import MediaCarousel from "./MediaCarousel";
import { renderWithHashtags } from "../../utils/hashtag";

function MoodHalo({ positivity = 0.5, avatar }) {
  const deg = Math.round(positivity * 360);
  return (
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full" style={{
        background: `conic-gradient(#22c55e ${deg}deg, #ef4444 ${deg}deg 360deg)`,
        filter: "blur(6px)", opacity: .8
      }}/>
      <div className="absolute inset-[3px] rounded-full bg-ink grid place-items-center border border-white/20">
        <img src={avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
      </div>
    </div>
  );
}

export default function PostCard({ post }) {
  const { toggleLike, addComment, toggleBookmark, bookmarked } = usePostsContext();
  const [comment, setComment] = useState("");
  const [burst, setBurst] = useState(false);
  const tapRef = useRef({ t: 0 });

  const timeAgo = (() => {
    const diff = (Date.now() - post.createdAt) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s`;
    if (diff < 3600) return `${Math.floor(diff/60)}m`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h`;
    return `${Math.floor(diff/86400)}d`;
  })();

  const onDoubleTap = () => {
    setBurst(true);
    toggleLike(post.id, 1);
    setTimeout(()=>setBurst(false), 500);
  };

  const onPointerUp = () => {
    const now = performance.now();
    if (now - tapRef.current.t < 300) onDoubleTap();
    tapRef.current.t = now;
  };

  const onShare = async () => {
    const url = `${location.origin}/post/${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } catch {
      prompt("Copy this link:", url);
    }
  };

  const isSaved = bookmarked.has(post.id);

  return (
    <div className="relative pl-10">
      <div className="absolute left-[6px] top-5 w-3 h-3 rounded-full bg-white/70 shadow" />
      <Card className="p-0 overflow-hidden">
        <div className="p-4 pb-3 flex gap-3">
          <MoodHalo positivity={post.positivity} avatar={post.user.avatar} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="font-semibold">{post.user.name}</div>
              <div className="text-xs text-white/50">• {timeAgo}</div>
            </div>

            <p
              className="mt-2 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: renderWithHashtags(post.text) }}
            />

            {/* media */}
            <div className="mt-3 relative" onPointerUp={onPointerUp}>
              {/* double-tap heart */}
              {burst && (
                <div className="pointer-events-none absolute inset-0 grid place-items-center">
                  <div className="text-5xl animate-pop">❤️</div>
                </div>
              )}
              <MediaCarousel images={post.images} />
            </div>

            <div className="mt-3 flex items-center gap-3 text-sm">
              <button onClick={()=>toggleLike(post.id, 1)} className="btn-primary px-3 py-1" title="Like">
                ❤️ {post.likes}
              </button>
              <button onClick={onShare} className="btn-primary px-3 py-1" title="Share">🔗 Share</button>
              <button onClick={()=>toggleBookmark(post.id)} className="btn-primary px-3 py-1" title="Save">
                {isSaved ? "💾 Saved" : "💾 Save"}
              </button>
              <div className="ml-auto text-xs text-white/50">Positivity: {(post.positivity*100|0)}%</div>
            </div>

            {/* comments */}
            <form
              className="mt-3 flex items-center gap-2"
              onSubmit={(e)=>{e.preventDefault(); if(!comment.trim()) return; addComment(post.id, comment.trim()); setComment("");}}
            >
              <input value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Add a kind comment…" className="flex-1" />
              <button className="btn-primary px-3 py-2">Reply</button>
            </form>
            {post.comments.length > 0 && (
              <div className="mt-3 space-y-2">
                {post.comments.map(c=>(
                  <div key={c.id} className="text-sm text-white/85 bg-white/5 border border-white/10 rounded-xl px-3 py-2">{c.text}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
