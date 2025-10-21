import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? (Constants as any).manifest?.extra ?? {};

export const API_BASE_URL: string = extra.apiBaseUrl ?? 'http://10.0.2.2:3000/api';
export const SOCKET_URL: string = extra.socketUrl ?? 'http://10.0.2.2:3000';
export const SESSION_COOKIE_NAME: string = extra.cookieName ?? 'sb_session';

export const REQUEST_TIMEOUT_MS = 15_000;

export const APP_DISPLAY_NAME = Constants.expoConfig?.name ?? 'SambandhYog';