import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { PatientUser, Session } from '../types/auth';
import { SESSION_EXPIRED_EVENT } from '../utils/apiClient';
import { careApi } from '../utils/careApi';
import { isHydrating } from '../utils/hydration';

interface AuthValue {
  user: PatientUser | null;
  isAuthenticated: boolean;
  sessionExpired: boolean;
  startSession: (session: Session) => void;
  updateUser: (user: PatientUser) => void;
  signOut: () => void;
}

/** Only the non-sensitive session summary is kept; passwords never are. */
const SESSION_KEY = 'careflow.session';
export { SESSION_EXPIRED_EVENT };

const AuthContext = createContext<AuthValue | null>(null);

function readSession(): Session | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  const parsed = JSON.parse(raw) as Session;
  return parsed.expiresAt > Date.now() ? parsed : null;
}

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const client = useQueryClient();
  // A prerendered page was rendered signed-out: hydrate exactly that, then restore the session right after
  // (only public pages are prerendered, so no auth guard ever sees this first signed-out render).
  const [hydratingFirst] = useState(isHydrating);
  const [session, setSession] = useState<Session | null>(() => hydratingFirst ? null : readSession());
  const [sessionExpired, setSessionExpired] = useState(false);
  useEffect(() => {
    if (hydratingFirst) setSession(readSession());
  }, [hydratingFirst]);

  const clear = useCallback(
    (expired: boolean) => {
      sessionStorage.removeItem(SESSION_KEY);
      setSession(null);
      setSessionExpired(expired);
      client.removeQueries({ queryKey: ['bookings'] });
    },
    [client]
  );

  useEffect(() => {
    if (!session) return;
    const remaining = session.expiresAt - Date.now();
    const timer = window.setTimeout(() => clear(true), Math.max(remaining, 0));
    return () => window.clearTimeout(timer);
  }, [session, clear]);

  useEffect(() => {
    const onExpired = () => clear(true);
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, [clear]);

  const value = useMemo<AuthValue>(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: Boolean(session),
      sessionExpired,
      startSession: (next) => {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
        setSession(next);
        setSessionExpired(false);
      },
      updateUser: (user) => {
        setSession((prev) => {
          if (!prev) return prev;
          const next = { ...prev, user };
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
          return next;
        });
      },
      signOut: () => {
        void careApi.signOut(); // revokes the refresh token server-side and drops the stored tokens
        clear(false);
      }
    }),
    [session, sessionExpired, clear]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}