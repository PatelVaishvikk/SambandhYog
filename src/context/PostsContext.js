"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get("/posts");
      setPosts(data?.posts ?? []);
      setError(null);
    } catch (err) {
      console.error("Fetch posts", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const addPost = useCallback(
    async (payload) => {
      const { data } = await apiClient.post("/posts", payload);
      setPosts((items) => [data.post, ...items]);
      return data.post;
    },
    []
  );

  const value = useMemo(
    () => ({ posts, isLoading, error, fetchPosts, addPost, currentUser: user }),
    [posts, isLoading, error, fetchPosts, addPost, user]
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

