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
    <aside className="hidden w-64 flex-shrink-0 flex-col gap-3 border-r border-slate-200 bg-white p-6 lg:flex">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Workspace</p>
      <nav className="mt-1 flex flex-col gap-1 text-sm">
        {NAV_LINKS.map((item) => {
          const isActive = pathname === item.href;
          const showIndicator =
            item.href === "/dashboard/notifications" && pendingIndicators > 0 && !isActive;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "group relative rounded-full px-3 py-2 font-medium transition",
                isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-slate-500 hover:bg-slate-100 hover:text-emerald-700"
              )}
            >
              {item.label}
              {showIndicator ? (
                <span className="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-emerald-500" aria-hidden />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

