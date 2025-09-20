"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from "react";
import apiClient from "@/lib/apiClient";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/context/AuthContext";

const NotificationContext = createContext(null);

function sortNotifications(list) {
  return [...list].sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf());
}

export function NotificationProvider({ children }) {
  const { socket } = useSocket();
  const { user, isInitialized } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const inflightRequest = useRef(null);
  const currentUserIdRef = useRef(null);

  useEffect(() => {
    currentUserIdRef.current = user?.id ?? null;
  }, [user]);

  const resetState = useCallback(() => {
    inflightRequest.current = null;
    setNotifications([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const fetchNotifications = useCallback(async () => {
    const expectedUserId = currentUserIdRef.current;

    if (!expectedUserId) {
      resetState();
      return [];
    }

    if (inflightRequest.current) {
      return inflightRequest.current;
    }

    setIsLoading(true);

    const request = apiClient
      .get("/notifications")
      .then(({ data }) => {
        if (currentUserIdRef.current !== expectedUserId) {
          return [];
        }
        const payload = sortNotifications(data.notifications ?? []);
        setNotifications(payload);
        setError(null);
        return payload;
      })
      .catch((err) => {
        if (currentUserIdRef.current === expectedUserId) {
          console.error("Fetch notifications", err);
          setError(err.message ?? "Failed to load notifications");
        }
        return [];
      })
      .finally(() => {
        if (currentUserIdRef.current === expectedUserId) {
          setIsLoading(false);
        }
        inflightRequest.current = null;
      });

    inflightRequest.current = request;
    return request;
  }, [resetState]);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (!user) {
      resetState();
      return;
    }

    fetchNotifications().catch(() => null);
  }, [isInitialized, user, fetchNotifications, resetState]);

  useEffect(() => {
    if (!socket || !currentUserIdRef.current) {
      return;
    }

    const handleNewNotification = (payload) => {
      const notification = payload?.notification;
      if (!notification) return;
      if (notification.userId && notification.userId !== currentUserIdRef.current) {
        return;
      }
      setNotifications((items) => sortNotifications([notification, ...items]));
    };

    const handleConnect = () => {
      fetchNotifications().catch(() => null);
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
  }, [socket, fetchNotifications, user]);

  const markAllAsRead = useCallback(async () => {
    if (!currentUserIdRef.current) {
      return;
    }
    setNotifications((items) => items.map((item) => ({ ...item, read: true })));
    try {
      await apiClient.patch("/notifications", { action: "mark-all-read" });
    } catch (err) {
      console.error("Mark all notifications as read", err);
      fetchNotifications().catch(() => null);
    }
  }, [fetchNotifications]);

  const markAsRead = useCallback(
    async (id) => {
      if (!currentUserIdRef.current || !id) {
        return;
      }
      setNotifications((items) => items.map((item) => (item.id === id ? { ...item, read: true } : item)));
      try {
        await apiClient.patch("/notifications", { ids: [id], read: true });
      } catch (err) {
        console.error("Mark notification read", err);
        fetchNotifications().catch(() => null);
      }
    },
    [fetchNotifications]
  );

  const removeNotification = useCallback(
    async (id) => {
      if (!currentUserIdRef.current || !id) {
        return;
      }
      setNotifications((items) => items.filter((item) => item.id !== id));
      try {
        await apiClient.delete("/notifications", { data: { ids: [id] } });
      } catch (err) {
        console.error("Delete notification", err);
        fetchNotifications().catch(() => null);
      }
    },
    [fetchNotifications]
  );

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
