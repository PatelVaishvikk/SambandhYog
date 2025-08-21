"use client";
import { useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { usePostsContext } from "../../context/PostsContext";

export default function PostForm() {
  const { addPost } = usePostsContext();
  const [text, setText] = useState("");
  const [previews, setPreviews] = useState([]);

  const onFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const urls = files.slice(0, 10).map(f => URL.createObjectURL(f)); // up to 10 like IG
    setPreviews(prev => [...prev, ...urls].slice(0, 10));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() && previews.length === 0) return;
    addPost(text.trim(), previews);
    setText("");
    setPreviews([]);
  };

  return (
    <Card className="p-0 overflow-hidden animate-fadeUp">
      <div className="p-4 flex items-start gap-3">
        <img src="/default-avatar.png" alt="" className="w-10 h-10 rounded-xl" />
        <form onSubmit={onSubmit} className="flex-1 space-y-3">
          <textarea
            rows={3}
            value={text}
            onChange={(e)=>setText(e.target.value)}
            placeholder="Share something uplifting… Use #hashtags"
            className="w-full"
          />
          {previews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {previews.map((src, i)=>(
                <div key={i} className="relative group rounded-xl overflow-hidden border border-white/10">
                  <img src={src} className="w-full h-full object-cover" />
                  <button type="button" onClick={()=>setPreviews(previews.filter((_,idx)=>idx!==i))}
                    className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded-lg text-xs">Remove</button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            <label className="btn-primary cursor-pointer">
              📷 Add images
              <input type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
            </label>
            <Button type="submit" className="hover:scale-[1.02] active:scale-100">Post</Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
