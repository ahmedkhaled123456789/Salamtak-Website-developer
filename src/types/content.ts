import type { Localized } from './i18n';

export interface Article {
  id: string;
  slug: string;
  category: Localized;
  title: Localized;
  excerpt: Localized;
  cover: string;
  coverAlt: Localized;
  date: string;
  readMinutes: number;
  author: {name: Localized;role: Localized;} | null;
  body: Localized[];
}

export interface Testimonial {
  id: string;
  initials: string;
  author: Localized;
  relation: Localized;
  serviceId: string;
  quote: Localized;
}

export type FaqTopic = 'booking' | 'pricing' | 'payment' | 'changes' | 'account';

export interface Faq {
  id: string;
  topic: FaqTopic;
  question: Localized;
  answer: Localized;
  /** true when the answer is a placeholder pending a documented policy */
  placeholder?: boolean;
  /** Answer completed at runtime from live data (see utils/policies.ts). */
  dynamic?: 'cancellation';
}
/** Booking and cancellation rules currently in force (GET /public/policies). */
export interface Policies {
  currency: string;
  paymentHoldMinutes: number;
  nurseResponseMinutes: number;
  maxAdvanceDays: number;
  /** Longest notice first: cancelling at least `minHoursBeforeStart` hours ahead refunds `refundPercent` %. */
  cancellationRefunds: {minHoursBeforeStart: number;refundPercent: number;}[];
}

export type ContactTopic = 'care' | 'booking' | 'partner' | 'other';
export interface ContactInput {
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
  locale: 'en' | 'ar';
  /** Honeypot (hidden field): must stay empty. */
  website?: string;
}
