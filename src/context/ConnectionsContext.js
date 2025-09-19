"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/hooks/useSocket";

const ConnectionsContext = createContext(null);

export function ConnectionsProvider({ children }) {
  const { user, isInitialized, refreshUser } = useAuth();
  const { socket, isConnected: isSocketConnected } = useSocket();
  const [followers, setFollowers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetState = useCallback(() => {
    setFollowers([]);
    setRequests([]);
    setOutgoing([]);
    setConversations([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const fetchConnections = useCallback(async () => {
    if (!user) {
      resetState();
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await apiClient.get("/connections");
      setFollowers(data.followers ?? []);
      setRequests(data.requests ?? []);
      setOutgoing(data.outgoing ?? []);
      setConversations(data.conversations ?? []);
      setError(null);
    } catch (err) {
      if (err.message === "Not authenticated") {
        resetState();
      } else {
        console.error("Fetch connections", err);
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, resetState]);

  useEffect(() => {
    if (!isInitialized) return;
    fetchConnections();
  }, [isInitialized, fetchConnections]);

  const followBack = useCallback(
    async (targetUserId) => {
      try {
        await apiClient.post("/users/follow", { targetUserId });
        await Promise.all([fetchConnections(), refreshUser().catch(() => null)]);
      } catch (err) {
        console.error("Follow back", err);
      }
    },
    [fetchConnections, refreshUser]
  );

  const acceptRequest = useCallback(
    async (requestId) => {
      try {
        await apiClient.post("/users/follow", { requestId, action: "accept" });
        await Promise.all([fetchConnections(), refreshUser().catch(() => null)]);
      } catch (err) {
        console.error("Accept request", err);
      }
    },
    [fetchConnections, refreshUser]
  );

  const declineRequest = useCallback(
    async (requestId) => {
      try {
        await apiClient.post("/users/follow", { requestId, action: "decline" });
        await fetchConnections();
      } catch (err) {
        console.error("Decline request", err);
      }
    },
    [fetchConnections]
  );

  const requestFollow = useCallback(
    async (targetUserId) => {
      try {
        await apiClient.post("/users/follow", { targetUserId });
        await fetchConnections();
      } catch (err) {
        console.error("Request follow", err);
      }
    },
    [fetchConnections]
  );

  const upsertConversation = useCallback((conversation) => {
    if (!conversation) return;
    setConversations((items) => {
      const filtered = items.filter((existing) => existing.id !== conversation.id);
      return [conversation, ...filtered];
    });
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleConversation = (payload) => {
      const conversation = payload?.conversation;
      if (conversation) {
        upsertConversation(conversation);
      }
    };

    const handleNotification = (payload) => {
      const type = payload?.notification?.type;
      if (type === "follow-request" || type === "follow-accepted") {
        fetchConnections();
      }
    };

    const handleConnect = () => {
      fetchConnections();
    };

    socket.on("chat:conversation", handleConversation);
    socket.on("notification:new", handleNotification);
    socket.on("connect", handleConnect);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("chat:conversation", handleConversation);
      socket.off("notification:new", handleNotification);
      socket.off("connect", handleConnect);
    };
  }, [socket, upsertConversation, fetchConnections]);

  const sendMessage = useCallback(
    async ({ conversationId, recipientId, content }) => {
      try {
        const { data } = await apiClient.post("/chat/messages", { conversationId, recipientId, content });
        upsertConversation(data.conversation);
        return data.conversation;
      } catch (err) {
        console.error("Send message", err);
        return null;
      }
    },
    [upsertConversation]
  );

  const openConversation = useCallback(
    async (recipientId) => {
      try {
        const { data } = await apiClient.post("/chat/messages", { recipientId });
        upsertConversation(data.conversation);
        return data.conversation;
      } catch (err) {
        console.error("Open conversation", err);
        return null;
      }
    },
    [upsertConversation]
  );

  const value = useMemo(
    () => ({
      followers,
      requests,
      outgoing,
      conversations,
      isLoading,
      error,
      isSocketConnected,
      fetchConnections,
      followBack,
      acceptRequest,
      declineRequest,
      requestFollow,
      sendMessage,
      openConversation,
    }),
    [
      followers,
      requests,
      outgoing,
      conversations,
      isLoading,
      error,
      isSocketConnected,
      fetchConnections,
      followBack,
      acceptRequest,
      declineRequest,
      requestFollow,
      sendMessage,
      openConversation,
    ]
  );

  return <ConnectionsContext.Provider value={value}>{children}</ConnectionsContext.Provider>;
}

export function useConnections() {
  const context = useContext(ConnectionsContext);
  if (!context) {
    throw new Error("useConnections must be used within a ConnectionsProvider");
  }
  return context;
}

