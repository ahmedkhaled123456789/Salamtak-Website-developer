import type { Booking, BookingStatus, BookingTab, PaymentStatus } from '../types/booking';

export function tabForBooking(b: Booking): BookingTab {
  if (b.status === 'in_progress') return 'in_progress';
  if (b.status === 'completed') return 'completed';
  if (b.status === 'cancelled') return 'cancelled';
  return 'upcoming';
}

export type StatusTone = 'mint' | 'amber' | 'neutral' | 'coral' | 'teal';

export const bookingStatusTone: Record<BookingStatus, StatusTone> = {
  pending_payment: 'amber',
  confirmed: 'mint',
  in_progress: 'teal',
  completed: 'neutral',
  cancelled: 'coral'
};

export const paymentStatusTone: Record<PaymentStatus, StatusTone> = {
  pending: 'amber',
  processing: 'amber',
  succeeded: 'mint',
  failed: 'coral'
};

/** Days of care per calendar month, derived from non-cancelled bookings. */
export function careDaysByMonth(bookings: Booking[]): {month: string;days: number;}[] {
  const map = new Map<string, number>();
  bookings.
  filter((b) => b.status !== 'cancelled').
  forEach((b) => {
    const key = b.startDate.slice(0, 7);
    map.set(key, (map.get(key) ?? 0) + b.days);
  });
  return Array.from(map.entries()).
  sort(([a], [b]) => a.localeCompare(b)).
  map(([month, days]) => ({ month, days }));
}