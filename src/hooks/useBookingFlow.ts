import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBookingDraft } from '../contexts/BookingDraftContext';
import type { TranslationKey } from '../contexts/I18nContext';
import type { BookingDraft } from '../types/booking';
import type { Nurse } from '../types/nurse';
import type { CareService } from '../types/service';
import { ApiError } from '../utils/apiClient';
import { todayIso } from '../utils/format';
import { useCatalogData } from './useCatalogData';
import { useCreateBooking } from './useBookings';

export const BOOKING_STEPS = ['service', 'schedule', 'preference', 'nurse', 'review', 'account'] as const;
export type BookingStepId = (typeof BOOKING_STEPS)[number];

type Errors = Partial<Record<'service' | 'startDate' | 'days' | 'address' | 'nurse', {key: TranslationKey;vars?: Record<string, number>;}>>;

function validate(step: BookingStepId, draft: BookingDraft, services: CareService[], nurses: Nurse[]): Errors {
  const errors: Errors = {};
  const service = services.find((s) => s.id === draft.serviceId);
  if (step === 'service' && !service) errors.service = { key: 'validation.service' };
  if (step === 'schedule' && service) {
    if (!draft.startDate || draft.startDate < todayIso()) errors.startDate = { key: 'validation.date' };
    if (draft.days < service.minDays || draft.days > service.maxDays)
    errors.days = { key: 'validation.days', vars: { min: service.minDays, max: service.maxDays } };
  }
  if (step === 'preference' && (draft.address ?? '').trim().length < 5) errors.address = { key: 'validation.address' };
  if (step === 'nurse') {
    const nurse = nurses.find((n) => n.id === draft.nurseId);
    if (!nurse || nurse.availability === 'unavailable') errors.nurse = { key: 'validation.nurse' };
  }
  return errors;
}

/** Orchestrates the multi-step booking: validation, persistence, submission. */
export function useBookingFlow() {
  const { draft, step, setStep, update, reset, idempotencyKey } = useBookingDraft();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [errors, setErrors] = useState<Errors>({});
  const create = useCreateBooking();
  const { services, nurses } = useCatalogData();
  const stepId = BOOKING_STEPS[Math.min(step, BOOKING_STEPS.length - 1)];

  // Seed from ?service=<slug> links (e.g. sample booking preview).
  useEffect(() => {
    const slug = params.get('service');
    if (!slug || services.length === 0) return; // the catalogue may still be loading
    const found = services.find((s) => s.slug === slug);
    if (found && found.id !== draft.serviceId) reset({ serviceId: found.id, days: Math.max(found.minDays, Math.min(5, found.maxDays)) });
    params.delete('service');
    setParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services]);

  const patch = (next: Partial<BookingDraft>) => {
    const merged = { ...draft, ...next };
    const nurse = nurses.find((n) => n.id === merged.nurseId);
    const nurseStillValid =
    nurse && (!merged.serviceId || nurse.serviceIds.includes(merged.serviceId)) && (merged.genderPreference === 'any' || nurse.gender === merged.genderPreference);
    update(nurseStillValid ? next : { ...next, nurseId: undefined });
    setErrors({});
  };

  const next = () => {
    const found = validate(stepId, draft, services, nurses);
    setErrors(found);
    if (Object.keys(found).length === 0) setStep(Math.min(step + 1, BOOKING_STEPS.length - 1));
  };

  const back = () => {
    setErrors({});
    setStep(Math.max(0, step - 1));
  };

  const goTo = (target: number) => {
    if (target < step) {
      setErrors({});
      setStep(target);
    }
  };

  const submit = () => {
    if (create.isPending || !isAuthenticated) return;
    create.mutate(
      { draft, key: idempotencyKey },
      {
        onSuccess: (booking) => {
          reset();
          navigate(`/checkout/${booking.id}`, { replace: true });
        },
        onError: (error) => {
          if (error instanceof ApiError && error.code === 'conflict') {
            update({ nurseId: undefined });
            setStep(BOOKING_STEPS.indexOf('nurse'));
          }
        }
      }
    );
  };

  const conflict = create.error instanceof ApiError && create.error.code === 'conflict';
  const service = useMemo(() => services.find((s) => s.id === draft.serviceId), [services, draft.serviceId]);
  const nurse = useMemo(() => nurses.find((n) => n.id === draft.nurseId), [nurses, draft.nurseId]);

  return { draft, step, stepId, errors, patch, next, back, goTo, submit, create, conflict, service, nurse, isAuthenticated };
}