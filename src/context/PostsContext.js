"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from "react";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const { user, isInitialized } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const inflightRequest = useRef(null);
  const currentUserIdRef = useRef(null);

  useEffect(() => {
    currentUserIdRef.current = user?.id ?? null;
  }, [user]);

  const resetState = useCallback(() => {
    inflightRequest.current = null;
    setPosts([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const upsertPost = useCallback((post) => {
    if (!post) return;
    setPosts((items) => {
      const index = items.findIndex((item) => item.id === post.id);
      if (index === -1) {
        return [post, ...items];
      }
      const clone = [...items];
      clone[index] = post;
      return clone;
    });
  }, []);

  const removePost = useCallback((postId) => {
    setPosts((items) => items.filter((item) => item.id !== postId));
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
      .get("/posts")
      .then(({ data }) => {
        if (currentUserIdRef.current !== expectedUserId) {
          return [];
        }
        const payload = data?.posts ?? [];
        setPosts(payload);
        setError(null);
        return payload;
      })
      .catch((err) => {
        if (currentUserIdRef.current === expectedUserId) {
          console.error("Fetch posts", err);
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
    if (!isInitialized) {
      return;
    }

    if (!user) {
      resetState();
      return;
    }

    fetchPosts().catch(() => null);
  }, [isInitialized, user, fetchPosts, resetState]);

  const addPost = useCallback(async (payload) => {
    const { data } = await apiClient.post("/posts", payload);
    setPosts((items) => [data.post, ...items]);
    return data.post;
  }, []);

  const toggleReaction = useCallback(async (postId) => {
    const { data } = await apiClient.post("/posts/react", { postId });
    upsertPost(data.post);
    return data.post;
  }, [upsertPost]);

  const addComment = useCallback(async (postId, content) => {
    const { data } = await apiClient.post("/posts/comment", { postId, content });
    upsertPost(data.post);
    return data.post;
  }, [upsertPost]);

  const updatePost = useCallback(
    async (postId, payload) => {
      const { data } = await apiClient.put(`/posts/${postId}`, payload);
      upsertPost(data.post);
      return data.post;
    },
    [upsertPost]
  );

  const deletePost = useCallback(
    async (postId) => {
      await apiClient.delete(`/posts/${postId}`);
      removePost(postId);
    },
    [removePost]
  );

  const value = useMemo(
    () => ({
      posts,
      isLoading,
      error,
      fetchPosts,
      addPost,
      toggleReaction,
      addComment,
      updatePost,
      deletePost,
      currentUser: user,
    }),
    [posts, isLoading, error, fetchPosts, addPost, toggleReaction, addComment, updatePost, deletePost, user]
  );

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
}
