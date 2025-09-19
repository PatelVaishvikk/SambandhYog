"use client";

import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";

export default function SearchBar({ placeholder = "Search", defaultValue = "", onChange }) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (event) => {
    const next = event.target.value;
    setValue(next);
    onChange?.(next);
  };

  return <Input value={value} onChange={handleChange} placeholder={placeholder} />;
}

