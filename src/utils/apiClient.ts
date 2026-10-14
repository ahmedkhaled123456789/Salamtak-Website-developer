import type { ApiErrorCode } from '../types/api';
import { config } from './config';

export class ApiError extends Error {
  code: ApiErrorCode;
  status?: number;
  /** The backend's own `errorCode` (e.g. BOOKING_CONFLICT), when it sent one. */
  serverCode?: string;

  constructor(code: ApiErrorCode, message?: string, status?: number, serverCode?: string) {
    super(message ?? code);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.serverCode = serverCode;
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof TypeError) return new ApiError('network', error.message);
  return new ApiError('unknown', error instanceof Error ? error.message : undefined);
}

function codeFromStatus(status: number, serverCode?: string): ApiErrorCode {
  if (serverCode === 'INVALID_CREDENTIALS') return 'invalid_credentials';
  if (status === 401) return 'unauthorized';
  if (status === 404) return 'not_found';
  if (status === 409) return 'conflict';
  if (status === 400 || status === 422) return 'validation';
  return 'unknown';
}

/** Where the backend serves images/media from; empty when the site proxies /api (same origin). */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  return /^https?:\/\//.test(path) ? path : `${config.apiBaseUrl}${path}`;
}

/* ------------------------------ token storage ------------------------------ */
const TOKEN_KEY = 'careflow.tokens';
export const SESSION_EXPIRED_EVENT = 'careflow:session-expired';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export function readTokens(): Tokens | null {
  try {
    const raw = sessionStorage.getItem(TOKEN_KEY);
    return raw ? (JSON.parse(raw) as Tokens) : null;
  } catch {
    return null;
  }
}
export function writeTokens(tokens: Tokens | null): void {
  try {
    if (tokens) sessionStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable: the session just won't survive a reload */
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  /** Multipart upload; the browser sets the boundary, so no Content-Type is sent. */
  form?: FormData;
  signal?: AbortSignal;
  headers?: Record<string, string>;
  /** Public endpoints skip the Authorization header and the refresh dance. */
  anonymous?: boolean;
}

interface Envelope<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string;
}

let refreshing: Promise<boolean> | null = null;

/** Rotates the refresh token once for any number of concurrent 401s. */
function refreshSession(): Promise<boolean> {
  refreshing ??= (async () => {
    const tokens = readTokens();
    if (!tokens) return false;
    try {
      const res = await fetch(`${config.apiBaseUrl}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ refreshToken: tokens.refreshToken })
      });
      if (!res.ok) return false;
      const body = (await res.json()) as Envelope<Tokens>;
      writeTokens({ accessToken: body.data.accessToken, refreshToken: body.data.refreshToken });
      return true;
    } catch {
      return false;
    } finally {
      setTimeout(() => {refreshing = null;}, 0);
    }
  })();
  return refreshing;
}

async function send(path: string, options: RequestOptions): Promise<Response> {
  const tokens = options.anonymous ? null : readTokens();
  return fetch(`${config.apiBaseUrl}/api/v1${path}`, {
    method: options.method ?? 'GET',
    headers: {
      ...(options.form ? {} : { 'Content-Type': 'application/json' }),
      Accept: 'application/json',
      ...(tokens ? { Authorization: `Bearer ${tokens.accessToken}` } : {}),
      ...options.headers
    },
    body: options.form ?? (options.body === undefined ? undefined : JSON.stringify(options.body)),
    signal: options.signal
  });
}

/**
 * Typed fetch wrapper for care-backend (`/api/v1`). Sends the bearer token, transparently rotates it once
 * on a 401, and unwraps the `{ success, data }` envelope. Tokens live in sessionStorage only.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let response: Response;
  try {
    response = await send(path, options);
    if (response.status === 401 && !options.anonymous && readTokens()) {
      if (await refreshSession()) response = await send(path, options);
      else {
        writeTokens(null);
        window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
      }
    }
  } catch (error) {
    throw toApiError(error);
  }
  let payload: Envelope<T> | undefined;
  try {
    payload = (await response.json()) as Envelope<T>;
  } catch {
    payload = undefined;
  }
  if (!response.ok || payload?.success === false) {
    throw new ApiError(
      codeFromStatus(response.status, payload?.errorCode),
      payload?.message ?? response.statusText,
      response.status,
      payload?.errorCode
    );
  }
  return payload?.data as T;
}
