import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { UserSummary } from '@/types';
import {
  fetchCurrentUser,
  login as loginRequest,
  register as registerRequest,
  logout as logoutRequest,
  updateProfile as updateProfileRequest,
  type LoginPayload,
  type RegisterPayload,
  type UpdateProfilePayload
} from '@/lib/auth';
import { clearSessionCookie } from '@/lib/sessionStorage';

interface AuthContextValue {
  user: UserSummary | null;
  isReady: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<UserSummary | null>;
  register: (payload: RegisterPayload) => Promise<UserSummary | null>;
  logout: () => Promise<void>;
  refresh: () => Promise<UserSummary | null>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<UserSummary | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const initialize = useCallback(async () => {
    try {
      const { user: current } = await fetchCurrentUser();
      setUser(current ?? null);
    } catch (error) {
      setUser(null);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    initialize().catch(() => setIsReady(true));
  }, [initialize]);

  const login = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const { user: loggedIn } = await loginRequest(payload);
      setUser(loggedIn);
      queryClient.invalidateQueries();
      return loggedIn;
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const { user: created } = await registerRequest(payload);
      setUser(created);
      queryClient.invalidateQueries();
      return created;
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutRequest();
      await clearSessionCookie();
      setUser(null);
      queryClient.clear();
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  const refresh = useCallback(async () => {
    try {
      const { user: refreshed } = await fetchCurrentUser();
      setUser(refreshed ?? null);
      return refreshed ?? null;
    } catch (error) {
      setUser(null);
      return null;
    }
  }, []);

  const updateProfile = useCallback(async (payload: UpdateProfilePayload) => {
    const { user: updated } = await updateProfileRequest(payload);
    setUser(updated ?? null);
    return updated ?? null;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isReady,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refresh,
      updateProfile
    }),
    [user, isReady, isLoading, login, register, logout, refresh, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}