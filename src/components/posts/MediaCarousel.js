"use client";
import { useRef, useState } from "react";

export default function MediaCarousel({ images = [] }) {
  const [i, setI] = useState(0);
  const track = useRef(null);

  const go = (dir) => {
    const next = Math.max(0, Math.min(images.length - 1, i + dir));
    setI(next);
    track.current?.scrollTo({ left: next * track.current.clientWidth, behavior: "smooth" });
  };

  if (!images?.length) return null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10">
      <div ref={track} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar">
        {images.map((src, idx) => (
          <div key={idx} className="snap-start shrink-0 w-full">
            <img src={src} className="w-full h-auto object-cover" />
          </div>
        ))}
      </div>

      {i > 0 && (
        <button onClick={()=>go(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 px-2 py-1 rounded-lg text-sm">‹</button>
      )}
      {i < images.length - 1 && (
        <button onClick={()=>go(+1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 px-2 py-1 rounded-lg text-sm">›</button>
      )}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
        {images.map((_, idx) => (
          <span key={idx} className={`w-1.5 h-1.5 rounded-full ${idx===i?'bg-white':'bg-white/40'}`} />
        ))}
      </div>
    </div>
  );
}
