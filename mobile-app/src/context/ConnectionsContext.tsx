import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import apiClient from '@/lib/apiClient';
import type { ConversationSnapshot, FollowRequest, UserSummary } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/hooks/useSocket';

interface ConnectionsContextValue {
  followers: UserSummary[];
  requests: FollowRequest[];
  outgoing: FollowRequest[];
  conversations: ConversationSnapshot[];
  members: UserSummary[];
  directoryQuery: string;
  isLoading: boolean;
  isDirectoryLoading: boolean;
  error: string | null;
  fetchConnections: () => Promise<void>;
  searchMembers: (query?: string) => Promise<UserSummary[]>;
  requestFollow: (targetUserId: string) => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  declineRequest: (requestId: string) => Promise<void>;
  followBack: (targetUserId: string) => Promise<void>;
  openConversation: (recipientId: string) => Promise<ConversationSnapshot | null>;
  sendMessage: (params: {
    conversationId?: string;
    recipientId: string;
    content: string;
  }) => Promise<ConversationSnapshot | null>;
}

const ConnectionsContext = createContext<ConnectionsContextValue | undefined>(undefined);

export function ConnectionsProvider({ children }: { children: React.ReactNode }) {
  const { user, isReady, refresh } = useAuth();
  const { socket } = useSocket();
  const [followers, setFollowers] = useState<UserSummary[]>([]);
  const [requests, setRequests] = useState<FollowRequest[]>([]);
  const [outgoing, setOutgoing] = useState<FollowRequest[]>([]);
  const [conversations, setConversations] = useState<ConversationSnapshot[]>([]);
  const [members, setMembers] = useState<UserSummary[]>([]);
  const [directoryQuery, setDirectoryQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDirectoryLoading, setIsDirectoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setFollowers([]);
    setRequests([]);
    setOutgoing([]);
    setConversations([]);
    setMembers([]);
    setDirectoryQuery('');
    setError(null);
    setIsLoading(false);
    setIsDirectoryLoading(false);
  }, []);

  const fetchConnections = useCallback(async () => {
    if (!user) {
      resetState();
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await apiClient.get<{
        followers: UserSummary[];
        requests: FollowRequest[];
        outgoing: FollowRequest[];
        conversations: ConversationSnapshot[];
      }>('/connections');
      setFollowers(data.followers ?? []);
      setRequests(data.requests ?? []);
      setOutgoing(data.outgoing ?? []);
      setConversations(data.conversations ?? []);
      setError(null);
    } catch (err) {
      console.error('Fetch connections', (err as Error).message);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [user, resetState]);

  const searchMembers = useCallback(
    async (query = '') => {
      if (!user) {
        setMembers([]);
        setDirectoryQuery('');
        return [];
      }
      const nextQuery = query ?? '';
      setDirectoryQuery(nextQuery);
      setIsDirectoryLoading(true);
      try {
        const { data } = await apiClient.get<{ users: UserSummary[] }>('/users/search', {
          params: { q: nextQuery }
        });
        const results = data.users ?? [];
        setMembers(results);
        return results;
      } catch (err) {
        console.error('Search members', (err as Error).message);
        setMembers([]);
        return [];
      } finally {
        setIsDirectoryLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (!isReady) return;
    fetchConnections().catch(() => null);
  }, [isReady, fetchConnections]);

  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      setMembers([]);
      setIsDirectoryLoading(false);
      return;
    }
    const query = directoryQuery || '';
    searchMembers(query).catch(() => null);
  }, [isReady, user, searchMembers, directoryQuery]);

  const followBack = useCallback(
    async (targetUserId: string) => {
      try {
        await apiClient.post('/users/follow', { targetUserId });
        await Promise.all([fetchConnections(), refresh().catch(() => null)]);
      } catch (err) {
        console.error('Follow back', (err as Error).message);
      }
    },
    [fetchConnections, refresh]
  );

  const acceptRequest = useCallback(
    async (requestId: string) => {
      try {
        await apiClient.post('/users/follow', { requestId, action: 'accept' });
        await Promise.all([fetchConnections(), refresh().catch(() => null)]);
      } catch (err) {
        console.error('Accept request', (err as Error).message);
      }
    },
    [fetchConnections, refresh]
  );

  const declineRequest = useCallback(
    async (requestId: string) => {
      try {
        await apiClient.post('/users/follow', { requestId, action: 'decline' });
        await fetchConnections();
      } catch (err) {
        console.error('Decline request', (err as Error).message);
      }
    },
    [fetchConnections]
  );

  const requestFollow = useCallback(
    async (targetUserId: string) => {
      try {
        await apiClient.post('/users/follow', { targetUserId });
        await fetchConnections();
      } catch (err) {
        console.error('Request follow', (err as Error).message);
      }
    },
    [fetchConnections]
  );

  const upsertConversation = useCallback((conversation: ConversationSnapshot) => {
    if (!conversation) return;
    setConversations((items) => {
      const filtered = items.filter((existing) => existing.id !== conversation.id);
      return [conversation, ...filtered];
    });
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleConversation = (payload: { conversation?: ConversationSnapshot }) => {
      const conversation = payload?.conversation;
      if (conversation) {
        upsertConversation(conversation);
      }
    };

    const handleNotification = (payload: { notification?: { type?: string } }) => {
      const type = payload?.notification?.type;
      if (type === 'follow-request' || type === 'follow-accepted') {
        fetchConnections();
        searchMembers(directoryQuery).catch(() => null);
      }
    };

    const handleConnect = () => {
      fetchConnections();
    };

    socket.on('chat:conversation', handleConversation);
    socket.on('notification:new', handleNotification);
    socket.on('connect', handleConnect);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off('chat:conversation', handleConversation);
      socket.off('notification:new', handleNotification);
      socket.off('connect', handleConnect);
    };
  }, [socket, upsertConversation, fetchConnections, searchMembers, directoryQuery]);

  const sendMessage = useCallback(
    async ({ conversationId, recipientId, content }: {
      conversationId?: string;
      recipientId: string;
      content: string;
    }) => {
      try {
        const { data } = await apiClient.post<{ conversation: ConversationSnapshot }>(
          '/chat/messages',
          { conversationId, recipientId, content }
        );
        upsertConversation(data.conversation);
        return data.conversation;
      } catch (err) {
        console.error('Send message', (err as Error).message);
        return null;
      }
    },
    [upsertConversation]
  );

  const openConversation = useCallback(
    async (recipientId: string) => {
      try {
        const { data } = await apiClient.post<{ conversation: ConversationSnapshot }>(
          '/chat/messages',
          { recipientId }
        );
        upsertConversation(data.conversation);
        return data.conversation;
      } catch (err) {
        console.error('Open conversation', (err as Error).message);
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
      members,
      directoryQuery,
      isLoading,
      isDirectoryLoading,
      error,
      fetchConnections,
      searchMembers,
      requestFollow,
      acceptRequest,
      declineRequest,
      followBack,
      openConversation,
      sendMessage
    }),
    [
      followers,
      requests,
      outgoing,
      conversations,
      members,
      directoryQuery,
      isLoading,
      isDirectoryLoading,
      error,
      fetchConnections,
      searchMembers,
      requestFollow,
      acceptRequest,
      declineRequest,
      followBack,
      openConversation,
      sendMessage
    ]
  );

  return <ConnectionsContext.Provider value={value}>{children}</ConnectionsContext.Provider>;
}

export function useConnections(): ConnectionsContextValue {
  const context = useContext(ConnectionsContext);
  if (!context) {
    throw new Error('useConnections must be used within a ConnectionsProvider');
  }
  return context;
}