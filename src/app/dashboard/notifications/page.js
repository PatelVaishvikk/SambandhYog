"use client";

import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { useNotifications } from "@/context/NotificationContext";
import { useConnections } from "@/context/ConnectionsContext";

export default function NotificationsPage() {
  const {
    notifications,
    markAllAsRead,
    markAsRead,
    removeNotification,
    isLoading: notificationsLoading,
    error: notificationsError,
  } = useNotifications();
  const { requests, acceptRequest, declineRequest, isLoading, error, fetchConnections } = useConnections();

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 gap-6">
        <Sidebar />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
              <p className="text-sm text-slate-500">Stay updated on shout-outs, follows, and mentorship invites.</p>
            </div>
            <button onClick={markAllAsRead} className="text-xs font-semibold text-emerald-600">
              Mark all as read
            </button>
          </div>

          {error ? <Card className="text-sm text-rose-500">{error}</Card> : null}
          {notificationsError ? <Card className="text-sm text-rose-500">{notificationsError}</Card> : null}

          {isLoading && !requests.length ? (
            <Card className="flex items-center gap-2 text-sm text-slate-500">
              <Spinner size="sm" />
              <span>Loading requests...</span>
            </Card>
          ) : null}

          {requests.length ? (
            <Card className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-900">Follow requests</h2>
              <ul className="space-y-3">
                {requests.map((request) => (
                  <li key={request.requestId} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={request.avatarUrl} alt={request.name} size={40} />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{request.name}</p>
                        <p className="text-xs text-slate-500">{request.headline}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => acceptRequest(request.requestId)} disabled={isLoading}>
                        Accept
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => declineRequest(request.requestId)} disabled={isLoading}>
                        Dismiss
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          <Card className="space-y-4">
            {notificationsLoading ? (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Spinner size="sm" />
                <span>Loading notifications...</span>
              </div>
            ) : null}

            {notifications.length ? (
              <ul className="space-y-4 text-sm text-slate-600">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`rounded-2xl border border-slate-200 bg-white p-4 ${notification.read ? "opacity-80" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p>{notification.message}</p>
                        <span className="text-xs text-slate-400">{notification.read ? "Read" : "Unread"}</span>
                      </div>
                      <div className="flex gap-2">
                        {!notification.read ? (
                          <Button size="sm" variant="secondary" onClick={() => markAsRead(notification.id)}>
                            Mark read
                          </Button>
                        ) : null}
                        <Button size="sm" variant="secondary" onClick={() => removeNotification(notification.id)}>
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : !notificationsLoading ? (
              <p className="text-sm text-slate-500">No notifications yet. Check back soon!</p>
            ) : null}
          </Card>
        </main>
      </div>
    </div>
  );
}

