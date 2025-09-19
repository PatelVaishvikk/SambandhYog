"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Chats", href: "/dashboard/chats" },
  { label: "Explore", href: "/explore" },
  { label: "Admin", href: "/admin" },
];

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
      <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-slate-900">
        <span className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-white shadow-inner">
          <Image src="/logo1.png" alt="SambandhYog" fill sizes="40px" className="object-cover" priority />
        </span>
        SambandhYog
      </Link>
      <nav className="hidden items-center gap-5 text-sm text-slate-500 md:flex">
        {NAV_LINKS.map((item) => (
          <Link key={item.href} href={item.href} className="transition hover:text-emerald-600">
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Avatar src={user.avatarUrl} alt={user.name} size={40} />
            <Button type="button" variant="secondary" size="sm" onClick={logout}>
              Log out
            </Button>
          </>
        ) : (
          <Button as={Link} href="/auth/login" size="sm">
            Log in
          </Button>
        )}
      </div>
    </header>
  );
}

