import type { BookingDraft } from '../types/booking';
import type { NurseQuery } from '../types/nurse';
import type { ServiceQuery } from '../types/service';

export const queryKeys = {
  catalog: ['catalog'] as const,
  services: (q: Omit<ServiceQuery, 'page'>) => ['services', q] as const,
  service: (slug: string) => ['service', slug] as const,
  nurses: (q: NurseQuery) => ['nurses', q] as const,
  nurse: (slug: string) => ['nurse', slug] as const,
  quote: (d: BookingDraft) => ['quote', d.serviceId, d.nurseId, d.days] as const,
  policies: ['policies'] as const,
  bookings: ['bookings'] as const,
  bookingsPage: ['bookings', 'pages'] as const,
  booking: (id: string) => ['bookings', id] as const
};