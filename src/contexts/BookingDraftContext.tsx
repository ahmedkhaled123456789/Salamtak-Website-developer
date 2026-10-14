import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { BookingDraft } from '../types/booking';

interface DraftState {
  draft: BookingDraft;
  step: number;
  idempotencyKey: string;
}

interface BookingDraftValue extends DraftState {
  update: (patch: Partial<BookingDraft>) => void;
  setStep: (step: number) => void;
  reset: (seed?: Partial<BookingDraft>) => void;
}

const STORAGE_KEY = 'careflow.bookingDraft';
const emptyDraft: BookingDraft = { days: 3, genderPreference: 'any' };

function newKey(): string {
  return `idem-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readState(): DraftState {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw) as DraftState;
  return { draft: emptyDraft, step: 0, idempotencyKey: newKey() };
}

const BookingDraftContext = createContext<BookingDraftValue | null>(null);

/** Preserves booking form state across steps and page reloads (this tab only). */
export function BookingDraftProvider({ children }: {children: React.ReactNode;}) {
  const [state, setState] = useState<DraftState>(readState);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const update = useCallback((patch: Partial<BookingDraft>) => {
    setState((s) => ({ ...s, draft: { ...s.draft, ...patch } }));
  }, []);

  const setStep = useCallback((step: number) => setState((s) => ({ ...s, step })), []);

  const reset = useCallback((seed?: Partial<BookingDraft>) => {
    setState({ draft: { ...emptyDraft, ...seed }, step: 0, idempotencyKey: newKey() });
  }, []);

  const value = useMemo(() => ({ ...state, update, setStep, reset }), [state, update, setStep, reset]);
  return <BookingDraftContext.Provider value={value}>{children}</BookingDraftContext.Provider>;
}

export function useBookingDraft(): BookingDraftValue {
  const ctx = useContext(BookingDraftContext);
  if (!ctx) throw new Error('useBookingDraft must be used inside BookingDraftProvider');
  return ctx;
}