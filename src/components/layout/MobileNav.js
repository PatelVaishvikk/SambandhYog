"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useNotifications } from "@/context/NotificationContext";
import { useConnections } from "@/context/ConnectionsContext";

const LINKS = [
  { label: "Feed", href: "/dashboard" },
  { label: "Chats", href: "/dashboard/chats" },
  { label: "Explore", href: "/explore" },
  { label: "Notifications", href: "/dashboard/notifications" },
  { label: "Profile", href: "/dashboard/profile" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();
  const { requests } = useConnections();
  const pending = unreadCount + (requests?.length ?? 0);

  return (
    <nav className="md:hidden">
      <ul className="fixed bottom-0 left-0 right-0 z-30 flex justify-around border-t border-slate-200 bg-white/95 px-2 py-3 text-xs font-medium text-slate-500 backdrop-blur">
        {LINKS.map((link) => {
          const isActive = pathname === link.href;
          const showBadge = link.href === "/dashboard/notifications" && pending > 0 && !isActive;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={clsx(
                  "relative inline-flex flex-col items-center gap-1 rounded-full px-3 py-1 transition",
                  isActive ? "bg-emerald-100 text-emerald-700" : "hover:text-emerald-700"
                )}
              >
                <span>{link.label}</span>
                {showBadge ? (
                  <span className="absolute top-0 right-2 h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="h-16" aria-hidden />
    </nav>
  );
}


