import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import apiClient from '@/lib/apiClient';
import type { Post } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface PostsContextValue {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  fetchPosts: () => Promise<Post[]>;
  addPost: (payload: { title?: string; content: string; tags?: string[] }) => Promise<Post | null>;
  toggleReaction: (postId: string) => Promise<Post | null>;
  addComment: (postId: string, content: string) => Promise<Post | null>;
}

const PostsContext = createContext<PostsContextValue | undefined>(undefined);

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const { user, isReady } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inflightRequest = useRef<Promise<Post[]> | null>(null);
  const currentUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    currentUserIdRef.current = user?.id ?? null;
  }, [user]);

  const resetState = useCallback(() => {
    inflightRequest.current = null;
    setPosts([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const upsertPost = useCallback((post: Post) => {
    if (!post) return;
    setPosts((items) => {
      const index = items.findIndex((item) => item.id === post.id);
      if (index === -1) {
        return [post, ...items];
      }
      const next = [...items];
      next[index] = post;
      return next;
    });
  }, []);

  const fetchPosts = useCallback(async () => {
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
      .get<{ posts: Post[] }>('/posts')
      .then(({ data }) => {
        if (currentUserIdRef.current !== expectedUserId) {
          return [];
        }
        const payload = data?.posts ?? [];
        setPosts(payload);
        setError(null);
        return payload;
      })
      .catch((err: Error & { status?: number }) => {
        if (currentUserIdRef.current === expectedUserId) {
          console.error('Fetch posts', err.message);
          if (err.status === 401) {
            resetState();
          } else {
            setError(err.message);
          }
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
    if (!isReady) return;

    if (!user) {
      resetState();
      return;
    }

    fetchPosts().catch(() => null);
  }, [isReady, user, fetchPosts, resetState]);

  const addPost = useCallback(
    async (payload: { title?: string; content: string; tags?: string[] }) => {
      try {
        const { data } = await apiClient.post<{ post: Post }>('/posts', payload);
        setPosts((items) => [data.post, ...items]);
        return data.post;
      } catch (error) {
        console.error('Create post', (error as Error).message);
        throw error;
      }
    },
    []
  );

  const toggleReaction = useCallback(
    async (postId: string) => {
      try {
        const { data } = await apiClient.post<{ post: Post }>('/posts/react', { postId });
        upsertPost(data.post);
        return data.post;
      } catch (error) {
        console.error('Toggle reaction', (error as Error).message);
        throw error;
      }
    },
    [upsertPost]
  );

  const addComment = useCallback(
    async (postId: string, content: string) => {
      try {
        const { data } = await apiClient.post<{ post: Post }>('/posts/comment', { postId, content });
        upsertPost(data.post);
        return data.post;
      } catch (error) {
        console.error('Add comment', (error as Error).message);
        throw error;
      }
    },
    [upsertPost]
  );

  const value = useMemo(
    () => ({ posts, isLoading, error, fetchPosts, addPost, toggleReaction, addComment }),
    [posts, isLoading, error, fetchPosts, addPost, toggleReaction, addComment]
  );

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePosts(): PostsContextValue {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
}