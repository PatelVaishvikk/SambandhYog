import * as SecureStore from 'expo-secure-store';
import type { AxiosResponseHeaders } from 'axios';
import { SESSION_COOKIE_NAME } from '@/constants/config';

const SESSION_STORAGE_KEY = 'sambandhyog.session';

export async function storeSessionCookie(value: string): Promise<void> {
  if (!value) return;
  await SecureStore.setItemAsync(SESSION_STORAGE_KEY, value);
}

export async function getSessionCookie(): Promise<string | null> {
  return SecureStore.getItemAsync(SESSION_STORAGE_KEY);
}

export async function clearSessionCookie(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY);
}

export function extractSessionCookie(raw?: string | string[] | null): string | null {
  if (!raw) return null;
  const entries = Array.isArray(raw) ? raw : [raw];
  for (const entry of entries) {
    const match = entry.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`));
    if (match?.[1]) {
      return match[1];
    }
  }
  return null;
}

export async function persistSessionFromHeaders(headers?: AxiosResponseHeaders | Record<string, any>): Promise<string | null> {
  if (!headers) return null;
  const setCookie = headers['set-cookie'] ?? headers['Set-Cookie'];
  const value = extractSessionCookie(setCookie ?? null);
  if (value) {
    await storeSessionCookie(value);
    return value;
  }
  return null;
}