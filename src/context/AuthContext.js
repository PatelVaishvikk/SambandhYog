"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import {
  login as loginRequest,
  register as registerRequest,
  fetchCurrentUser,
  logout as logoutRequest,
  updateProfile as updateProfileRequest,
} from "@/lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetchCurrentUser();
      if (response?.user) {
        setUser(response.user);
        return response.user;
      }
      setUser(null);
      return null;
    } catch (error) {
      setUser(null);
      throw error;
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      try {
        await refreshUser().catch(() => null);
      } finally {
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [refreshUser]);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const response = await loginRequest(credentials);
      if (response?.user) {
        setUser(response.user);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setIsLoading(true);
    try {
      const response = await registerRequest(payload);
      if (response?.user) {
        setUser(response.user);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutRequest();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const response = await updateProfileRequest(updates);
    if (response?.user) {
      setUser(response.user);
    }
    return response?.user;
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, isInitialized, login, logout, register, updateProfile, refreshUser }),
    [user, isLoading, isInitialized, login, logout, register, updateProfile, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
