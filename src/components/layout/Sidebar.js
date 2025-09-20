"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useNotifications } from "@/context/NotificationContext";
import { useConnections } from "@/context/ConnectionsContext";

const NAV_LINKS = [
  { label: "Overview", href: "/dashboard" },
  { label: "Chats", href: "/dashboard/chats" },
  { label: "Create post", href: "/dashboard/create-post" },
  { label: "Notifications", href: "/dashboard/notifications" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();
  const { requests } = useConnections();

  const pendingIndicators = unreadCount + (requests?.length ?? 0);

  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col gap-4 rounded-[28px] border border-white/10 bg-white/[0.05] p-6 shadow-surface backdrop-blur-xl lg:flex">
      <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Workspace</p>
      <nav className="mt-1 flex flex-col gap-1 text-sm">
        {NAV_LINKS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const showIndicator = item.href === "/dashboard/notifications" && pendingIndicators > 0 && !isActive;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "group relative flex items-center justify-between rounded-2xl px-4 py-2 font-medium transition",
                isActive
                  ? "bg-gradient-to-r from-brand-500/25 via-brand-500/20 to-transparent text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <span>{item.label}</span>
              {showIndicator ? (
                <span className="h-2.5 w-2.5 rounded-full bg-accent-400 shadow-[0_0_12px_rgba(45,212,191,0.7)]" aria-hidden />
              ) : null}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
        <p className="font-semibold text-white">Daily focus</p>
        <p className="mt-2 leading-relaxed">
          Celebrate at least one win and send gratitude to a connection. Positivity compounds.
        </p>
      </div>
    </aside>
  );
}

