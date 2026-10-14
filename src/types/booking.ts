import type { GenderPreference } from './nurse';

export type BookingStatus = 'pending_payment' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed';
export type BookingTab = 'upcoming' | 'in_progress' | 'completed' | 'cancelled';

export interface BookingDraft {
  serviceId?: string;
  startDate?: string;
  days: number;
  genderPreference: GenderPreference;
  nurseId?: string;
  address?: string;
  /** UAE emirate id (data/emirates.ts) used when no precise location was shared. */
  emirate?: string;
  /** Location the patient chose to share from the browser (only sent with this booking). */
  coords?: {latitude: number;longitude: number;};
  notes?: string;
}

export interface PriceQuote {
  dailyRate: number;
  days: number;
  subtotal: number;
  /** null = determined by the backend at checkout */
  fees: number | null;
  discount: number | null;
  estimatedTotal: number;
  currency: string;
  isSample: boolean;
}

export interface BookingTimelineEntry {
  status: BookingStatus | 'created';
  at: string;
}

export interface Booking {
  id: string;
  reference: string;
  serviceId: string;
  nurseId: string;
  startDate: string;
  endDate: string;
  days: number;
  status: BookingStatus;
  address: string;
  notes?: string;
  createdAt: string;
  payment: {
    status: PaymentStatus;
    amount: number;
    currency: string;
    method?: string;
  };
  timeline: BookingTimelineEntry[];
  permissions: {
    canCancel: boolean;
    canPay: boolean;
  };
}

export type PaymentSimulation = 'success' | 'failure';