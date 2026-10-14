import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { SESSION_EXPIRED_EVENT } from '../contexts/AuthContext';
import { ApiError } from './apiClient';

const NO_RETRY = new Set(['not_found', 'unauthorized', 'session_expired', 'not_configured', 'validation', 'conflict', 'invalid_credentials']);

/** Centralised error handling: expired sessions sign the user out everywhere. */
function handleError(error: unknown) {
  if (error instanceof ApiError && error.code === 'session_expired') {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleError }),
  mutationCache: new MutationCache({ onError: handleError }),
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: (count, error) => !(error instanceof ApiError && NO_RETRY.has(error.code)) && count < 2
    },
    mutations: { retry: false }
  }
});