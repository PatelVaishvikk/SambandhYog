"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";

const StoriesContext = createContext(null);

export function StoriesProvider({ children }) {
  const { user, isInitialized } = useAuth();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestRef = useRef(null);

  const resetState = useCallback(() => {
    requestRef.current = null;
    setStories([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const fetchStories = useCallback(async () => {
    if (!user) {
      resetState();
      return [];
    }

    if (requestRef.current) {
      return requestRef.current;
    }

    setIsLoading(true);

    const promise = apiClient
      .get("/stories")
      .then(({ data }) => {
        const payload = Array.isArray(data?.stories) ? data.stories : [];
        setStories(payload);
        setError(null);
        return payload;
      })
      .catch((err) => {
        console.error("Fetch stories error", err);
        setError(err.message ?? "Failed to load stories");
        return [];
      })
      .finally(() => {
        setIsLoading(false);
        requestRef.current = null;
      });

    requestRef.current = promise;
    return promise;
  }, [user, resetState]);

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) {
      resetState();
      return;
    }
    fetchStories().catch(() => null);
  }, [isInitialized, user, fetchStories, resetState]);

  const upsertGroup = useCallback((group) => {
    if (!group?.user?.id) return;
    setStories((previous) => {
      const others = previous.filter((item) => item?.user?.id !== group.user.id);
      return [group, ...others];
    });
  }, []);

  const removeGroup = useCallback((userId) => {
    if (!userId) return;
    setStories((previous) => previous.filter((item) => item?.user?.id !== userId));
  }, []);

  const createStory = useCallback(
    async ({ content, backgroundId }) => {
      if (!user) {
        throw new Error("You must be logged in to create a story.");
      }
      const payload = {
        content: content?.trim(),
        backgroundId,
      };
      const { data } = await apiClient.post("/stories", payload);
      const group = data?.group;
      if (group) {
        upsertGroup(group);
      } else {
        fetchStories().catch(() => null);
      }
      return group;
    },
    [user, fetchStories, upsertGroup]
  );

  const updateStory = useCallback(
    async (storyId, payload) => {
      const { data } = await apiClient.patch(`/stories/${storyId}`, payload);
      const group = data?.group;
      if (group) {
        upsertGroup(group);
      } else {
        fetchStories().catch(() => null);
      }
      return group;
    },
    [fetchStories, upsertGroup]
  );

  const deleteStory = useCallback(
    async (storyId) => {
      const { data } = await apiClient.delete(`/stories/${storyId}`);
      const group = data?.group;
      if (group) {
        upsertGroup(group);
      } else if (user?.id) {
        removeGroup(user.id);
      }
      return data;
    },
    [removeGroup, upsertGroup, user?.id]
  );

  const value = useMemo(
    () => ({
      stories,
      isLoading,
      error,
      fetchStories,
      createStory,
      updateStory,
      deleteStory,
    }),
    [stories, isLoading, error, fetchStories, createStory, updateStory, deleteStory]
  );

  return <StoriesContext.Provider value={value}>{children}</StoriesContext.Provider>;
}

export function useStories() {
  const context = useContext(StoriesContext);
  if (!context) {
    throw new Error("useStories must be used within a StoriesProvider");
  }
  return context;
}

