"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import apiClient from "@/lib/apiClient";
import { useSocket } from "@/hooks/useSocket";

const NotificationContext = createContext(null);

function sortNotifications(list) {
  return [...list].sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf());
}

export function NotificationProvider({ children }) {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get("/notifications");
      setNotifications(sortNotifications(data.notifications ?? []));
      setError(null);
    } catch (err) {
      console.error("Fetch notifications", err);
      setError(err.message ?? "Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (payload) => {
      const notification = payload?.notification;
      if (!notification) return;
      setNotifications((items) => sortNotifications([notification, ...items]));
    };

    const handleConnect = () => {
      fetchNotifications();
    };

    socket.on("notification:new", handleNewNotification);
    socket.on("connect", handleConnect);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("notification:new", handleNewNotification);
      socket.off("connect", handleConnect);
    };
  }, [socket, fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    setNotifications((items) => items.map((item) => ({ ...item, read: true })));
    try {
      await apiClient.patch("/notifications", { action: "mark-all-read" });
    } catch (err) {
      console.error("Mark all notifications as read", err);
      fetchNotifications();
    }
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id) => {
    if (!id) return;
    setNotifications((items) => items.map((item) => (item.id === id ? { ...item, read: true } : item)));
    try {
      await apiClient.patch("/notifications", { ids: [id], read: true });
    } catch (err) {
      console.error("Mark notification read", err);
      fetchNotifications();
    }
  }, [fetchNotifications]);

  const removeNotification = useCallback(async (id) => {
    if (!id) return;
    setNotifications((items) => items.filter((item) => item.id !== id));
    try {
      await apiClient.delete("/notifications", { data: { ids: [id] } });
    } catch (err) {
      console.error("Delete notification", err);
      fetchNotifications();
    }
  }, [fetchNotifications]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((item) => !item.read).length,
      isLoading,
      error,
      fetchNotifications,
      markAllAsRead,
      markAsRead,
      removeNotification,
    }),
    [notifications, isLoading, error, fetchNotifications, markAllAsRead, markAsRead, removeNotification]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
