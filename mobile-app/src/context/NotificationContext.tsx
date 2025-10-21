import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import apiClient from '@/lib/apiClient';
import type { NotificationItem } from '@/types';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/context/AuthContext';

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<NotificationItem[]>;
  markAllAsRead: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

function sortNotifications(list: NotificationItem[]): NotificationItem[] {
  return [...list].sort(
    (a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
  );
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { socket } = useSocket();
  const { user, isReady } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inflightRequest = useRef<Promise<NotificationItem[]> | null>(null);
  const currentUserIdRef = useRef<string | null>(null);

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
      .get<{ notifications: NotificationItem[] }>('/notifications')
      .then(({ data }) => {
        if (currentUserIdRef.current !== expectedUserId) {
          return [];
        }
        const payload = sortNotifications(data?.notifications ?? []);
        setNotifications(payload);
        setError(null);
        return payload;
      })
      .catch((err: Error) => {
        if (currentUserIdRef.current === expectedUserId) {
          console.error('Fetch notifications', err.message);
          setError(err.message);
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
    if (!isReady) {
      return;
    }

    if (!user) {
      resetState();
      return;
    }

    fetchNotifications().catch(() => null);
  }, [isReady, user, fetchNotifications, resetState]);

  useEffect(() => {
    if (!socket || !currentUserIdRef.current) {
      return;
    }

    const handleNewNotification = (payload: { notification?: NotificationItem }) => {
      const notification = payload?.notification;
      if (!notification) return;
      const targetUserId = (notification as any)?.userId;
      if (targetUserId && targetUserId !== currentUserIdRef.current) {
        return;
      }
      setNotifications((items) => sortNotifications([notification, ...items]));
    };

    const handleConnect = () => {
      fetchNotifications().catch(() => null);
    };

    socket.on('notification:new', handleNewNotification);
    socket.on('connect', handleConnect);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off('notification:new', handleNewNotification);
      socket.off('connect', handleConnect);
    };
  }, [socket, fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    if (!currentUserIdRef.current) return;
    setNotifications((items) => items.map((item) => ({ ...item, read: true })));
    try {
      await apiClient.patch('/notifications', { action: 'mark-all-read' });
    } catch (error) {
      console.error('Mark all notifications', (error as Error).message);
      fetchNotifications().catch(() => null);
    }
  }, [fetchNotifications]);

  const markAsRead = useCallback(
    async (id: string) => {
      if (!currentUserIdRef.current || !id) return;
      setNotifications((items) => items.map((item) => (item.id === id ? { ...item, read: true } : item)));
      try {
        await apiClient.patch('/notifications', { ids: [id], read: true });
      } catch (error) {
        console.error('Mark notification', (error as Error).message);
        fetchNotifications().catch(() => null);
      }
    },
    [fetchNotifications]
  );

  const removeNotification = useCallback(
    async (id: string) => {
      if (!currentUserIdRef.current || !id) return;
      setNotifications((items) => items.filter((item) => item.id !== id));
      try {
        await apiClient.delete('/notifications', { data: { ids: [id] } });
      } catch (error) {
        console.error('Remove notification', (error as Error).message);
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
      removeNotification
    }),
    [notifications, isLoading, error, fetchNotifications, markAllAsRead, markAsRead, removeNotification]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}