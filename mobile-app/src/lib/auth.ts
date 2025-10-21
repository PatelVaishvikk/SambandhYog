import apiClient from '@/lib/apiClient';
import type { UserSummary } from '@/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  headline?: string;
  bio?: string;
  location?: string;
  website?: string;
  pronouns?: string;
}

export interface AuthResponse {
  success: boolean;
  user: UserSummary;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
  return data;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
  return data;
}

export async function fetchCurrentUser(): Promise<{ user: UserSummary | null }> {
  const { data } = await apiClient.get<{ user: UserSummary | null }>('/auth/me');
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<{ user: UserSummary }> {
  const { data } = await apiClient.patch<{ user: UserSummary }>('/users/update', payload);
  return data;
}