"use client";

import Link from "next/link";
import clsx from "clsx";

const LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/explore/users", label: "Members" },
  { href: "/explore/categories/career", label: "Career" },
  { href: "/explore/categories/mentorship", label: "Mentorship" },
];

export default function Navigation({ current }) {
  return (
    <nav className="flex flex-wrap gap-3 text-sm text-slate-500">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={clsx(
            "rounded-full border border-transparent px-4 py-2 transition",
            current === link.href
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "hover:border-emerald-200 hover:text-emerald-700"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

