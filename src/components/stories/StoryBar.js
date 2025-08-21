"use client";
import Card from "../ui/Card";
import { useEffect, useState } from "react";

const demoStories = [
  { id: "s1", user: "Aarav", avatar: "/default-avatar.png", image: "/images/welcome-banner.jpg" },
  { id: "s2", user: "Diya",  avatar: "/default-avatar.png", image: "/images/placeholder-post.jpg" },
  { id: "s3", user: "You",   avatar: "/default-avatar.png", image: "/images/placeholder-post.jpg" },
];

export default function StoryBar() {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setActive(null), 3000);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <>
      <Card className="p-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-4">
          {demoStories.map(s => (
            <button key={s.id} onClick={()=>setActive(s)} className="flex flex-col items-center group">
              <div className="relative">
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-pink-400 via-purple-400 to-green-400 animate-float">
                  <img src={s.avatar} className="w-full h-full rounded-full object-cover border-2 border-ink" />
                </div>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/70">{s.user}</span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {active && (
        <div className="fixed inset-0 bg-black/70 z-50 grid place-items-center" onClick={()=>setActive(null)}>
          <div className="relative w-[min(92vw,520px)] h-[min(92vh,740px)] rounded-2xl overflow-hidden border border-white/10">
            <img src={active.image} className="w-full h-full object-cover" />
            <div className="absolute top-0 left-0 right-0 h-1.5 m-3 rounded bg-white/30">
              <div className="h-full bg-white/90 animate-[shrink_3s_linear_forwards]" style={{transformOrigin:"left"}} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
              <div className="flex items-center gap-2">
                <img src={active.avatar} className="w-8 h-8 rounded-full" />
                <div className="font-medium">{active.user}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes shrink { to { transform: scaleX(0); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}
