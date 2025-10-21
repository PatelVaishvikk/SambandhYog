"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Compass, Home, MessageCircle, PlusCircle, User } from "lucide-react";

import { useNotifications } from "@/context/NotificationContext";
import { useConnections } from "@/context/ConnectionsContext";

const LINKS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/chats", label: "Chats", icon: MessageCircle },
  { href: "/dashboard/create-post", label: "Create", icon: PlusCircle, emphasize: true },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/dashboard/notifications", label: "Alerts", icon: Bell },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();
  const { requests } = useConnections();
  const pending = unreadCount + (requests?.length ?? 0);

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === href || pathname.startsWith("/dashboard/");
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="pointer-events-none fixed bottom-4 left-0 right-0 z-50 flex justify-center lg:hidden">
      <div className="pointer-events-auto flex w-[min(480px,92vw)] items-center justify-around rounded-[28px] border border-white/15 bg-night-800/80 px-3 py-2 shadow-[0_12px_40px_-20px_rgba(15,23,42,0.75)] backdrop-blur-xl">
        {LINKS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          const showBadge = item.href === "/dashboard/notifications" && pending > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-1 text-[11px] font-medium transition ${
                active ? "text-white" : "text-slate-400 hover:text-white"
              } ${item.emphasize ? "shadow-[0_16px_40px_-22px_rgba(99,102,241,0.9)]" : ""}`}
            >
              <span
                className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 transition ${
                  active ? "bg-white/15 text-white" : "bg-white/5 text-slate-200"
                } ${item.emphasize ? "border-brand-400/40 bg-brand-500/40 text-white" : ""}`}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {showBadge && !active ? (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent-400 shadow-[0_0_10px_rgba(45,212,191,0.75)]" />
                ) : null}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

