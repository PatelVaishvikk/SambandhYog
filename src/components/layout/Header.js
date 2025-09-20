"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-night-800/70 px-6 py-4 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 text-base font-semibold tracking-tight text-white">
          <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-inner">
            <Image src="/logo1.png" alt="SambandhYog" fill sizes="44px" className="object-contain p-1.5" priority />
          </span>
          <span className="flex flex-col leading-none">
            SambandhYog
            <span className="text-[11px] font-medium uppercase tracking-[0.4em] text-slate-400">Positive Network</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 text-sm md:flex">
          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative overflow-hidden rounded-full px-4 py-2 font-medium text-slate-300 transition hover:text-white"
              >
                <span
                  className={"absolute inset-0 -z-[1] rounded-full bg-white/5 opacity-0 transition group-hover:opacity-100"}
                  aria-hidden
                />
                <span
                  className={
                    "absolute inset-0 -z-[1] scale-95 rounded-full bg-gradient-to-r from-brand-500/30 via-brand-400/30 to-accent-400/30 opacity-0 transition group-hover:opacity-100" +
                    (isActive ? " opacity-100" : "")
                  }
                  aria-hidden
                />
                <span className={isActive ? "text-white" : undefined}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button as={Link} href="/dashboard/create-post" size="sm" variant="secondary">
                Share insight
              </Button>
              <Avatar src={user.avatarUrl} alt={user.name} size={44} />
              <Button type="button" variant="ghost" size="sm" onClick={logout}>
                Log out
              </Button>
            </>
          ) : (
            <Button as={Link} href="/auth/login" size="sm">
              Log in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

