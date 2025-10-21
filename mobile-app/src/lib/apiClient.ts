import axios, { AxiosError } from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT_MS, SESSION_COOKIE_NAME } from '@/constants/config';
import { getSessionCookie, persistSessionFromHeaders, clearSessionCookie } from '@/lib/sessionStorage';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(async (config) => {
  const session = await getSessionCookie();
  if (session) {
    const headers = (config.headers ?? {}) as Record<string, any>;
    headers.Cookie = `${SESSION_COOKIE_NAME}=${session}`;
    config.headers = headers;
  }
  return config;
});

apiClient.interceptors.response.use(
  async (response) => {
    await persistSessionFromHeaders(response.headers);
    return response;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401) {
      await clearSessionCookie();
    }
    const message =
      (error.response?.data as any)?.message || error.message || 'Something went wrong';
    const enriched = new Error(message);
    (enriched as any).status = status;
    (enriched as any).details = error.response?.data;
    return Promise.reject(enriched);
  }
);

export default apiClient;