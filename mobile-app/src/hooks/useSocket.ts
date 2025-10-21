import { useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SESSION_COOKIE_NAME, SOCKET_URL } from '@/constants/config';
import { getSessionCookie } from '@/lib/sessionStorage';
import { useAuth } from '@/context/AuthContext';

const SOCKET_PATH = '/api/socket';

export function useSocket() {
  const { user, isReady } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let active = true;
    let instance: Socket | null = null;

    async function connect() {
      if (!isReady || !user) {
        setSocket((existing) => {
          existing?.disconnect();
          return null;
        });
        return;
      }

      try {
        const session = await getSessionCookie();
        instance = io(SOCKET_URL, {
          path: SOCKET_PATH,
          transports: ['websocket'],
          withCredentials: true,
          extraHeaders: session ? { Cookie: `${SESSION_COOKIE_NAME}=${session}` } : undefined
        });

        instance.on('connect_error', (error) => {
          console.warn('Socket connection error', error.message);
        });

        if (active) {
          setSocket(instance);
        } else {
          instance.disconnect();
        }
      } catch (error) {
        console.error('Failed to initialize socket', error);
      }
    }

    connect();

    return () => {
      active = false;
      setSocket((existing) => {
        existing?.disconnect();
        return null;
      });
      instance?.disconnect();
    };
  }, [user, isReady]);

  const isConnected = socket?.connected ?? false;

  return useMemo(() => ({ socket, isConnected }), [socket, isConnected]);
}