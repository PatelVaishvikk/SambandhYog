"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/common/SearchBar";

export default function UsersSearch({ initialValue }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const handleChange = (value) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      const queryString = params.toString();
      router.replace(queryString ? `/explore/users?${queryString}` : "/explore/users", { scroll: false });
    });
  };

  return <SearchBar placeholder="Search members" defaultValue={initialValue} onChange={handleChange} />;
}


