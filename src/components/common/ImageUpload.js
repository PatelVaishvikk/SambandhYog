'use client';

import { useRef, useState } from "react";
import Button from "@/components/ui/Button";

export default function ImageUpload({ onUpload }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState(null);

  const handleSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    onUpload?.(file);
  };

  return (
    <div className="flex items-center gap-3 text-sm text-slate-300">
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleSelect} />
      <Button type="button" size="sm" variant="secondary" onClick={() => inputRef.current?.click()}>
        Upload image
      </Button>
      <span className="text-xs text-slate-500">{fileName || "PNG, JPG, up to 5 MB"}</span>
    </div>
  );
}

