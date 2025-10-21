"use client";

import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

const SOCKET_PATH = "/api/socket";

export function useSocket() {
  const { user, isInitialized } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let active = true;
    let instance = null;

    async function connect() {
      try {
        await fetch(SOCKET_PATH, { credentials: "include" });
        instance = io({
          path: SOCKET_PATH,
          transports: ["websocket", "polling"],
          withCredentials: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        instance.on("connect_error", (error) => {
          console.error("Socket connection error", error);
        });

        instance.on("error", (error) => {
          console.error("Socket error", error);
        });

        if (active) {
          setSocket(instance);
        } else {
          instance.disconnect();
        }
      } catch (error) {
        console.error("Failed to initialize socket", error);
      }
    }

    if (isInitialized && user) {
      connect();
    } else {
      setSocket((existing) => {
        existing?.disconnect();
        return null;
      });
    }

    return () => {
      active = false;
      if (instance) {
        instance.disconnect();
        instance = null;
      }
      setSocket((existing) => {
        existing?.disconnect();
        return null;
      });
    };
  }, [user, isInitialized]);

  const isConnected = socket?.connected ?? false;

  return useMemo(() => ({ socket, isConnected }), [socket, isConnected]);
}
