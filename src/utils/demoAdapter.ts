import { demoBookings } from '../data/bookings';
import { nurses } from '../data/nurses';
import { services } from '../data/services';
import type { CareApi } from '../types/api';
import type { PatientUser, Session } from '../types/auth';
import type { Booking, BookingDraft, PriceQuote } from '../types/booking';
import { ApiError } from './apiClient';
import { config } from './config';
import { addDays } from './format';

/**
 * DEMO ADAPTER — simulates the backend for design previews.
 * State lives in sessionStorage for this tab only. Passwords are compared in
 * memory and never persisted.
 */
const BOOKINGS_KEY = 'careflow.demo.bookings';
const SESSION_KEY = 'careflow.session';
const PAYMENT_DELAY_MS = 2600;

export const DEMO_ACCOUNT = { email: 'demo@careflow.app', password: 'CareFlow2026' };

const demoUser: PatientUser = {
  id: 'pt-demo',
  firstName: 'Rana',
  lastName: 'Saleh',
  email: DEMO_ACCOUNT.email,
  phone: '',
  city: 'Dubai',
  address: 'Sample address — Al Olaya district',
  preferences: { language: 'en', genderPreference: 'female', emailUpdates: true }
};

const registered = new Map<string, {password: string;user: PatientUser;}>([
[DEMO_ACCOUNT.email, { password: DEMO_ACCOUNT.password, user: demoUser }]]
);

const idempotency = new Map<string, string>();
const pendingPayments = new Map<string, {resolveAt: number;outcome: 'success' | 'failure';}>();

function wait(min = 280, max = 640): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));
}

function readBookings(): Booking[] {
  const raw = sessionStorage.getItem(BOOKINGS_KEY);
  if (raw) return JSON.parse(raw) as Booking[];
  sessionStorage.setItem(BOOKINGS_KEY, JSON.stringify(demoBookings));
  return demoBookings;
}

function writeBookings(list: Booking[]): void {
  sessionStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
}

function requireSession(): Session {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) throw new ApiError('unauthorized');
  const session = JSON.parse(raw) as Session;
  if (session.expiresAt < Date.now()) throw new ApiError('session_expired');
  return session;
}

function createSession(user: PatientUser): Session {
  return { user, expiresAt: Date.now() + config.sessionTtlMs };
}

function settlePayment(booking: Booking): Booking {
  const pending = pendingPayments.get(booking.id);
  if (!pending || Date.now() < pending.resolveAt) return booking;
  pendingPayments.delete(booking.id);
  const now = new Date().toISOString();
  const succeeded = pending.outcome === 'success';
  const updated: Booking = {
    ...booking,
    status: succeeded ? 'confirmed' : 'pending_payment',
    payment: { ...booking.payment, status: succeeded ? 'succeeded' : 'failed', method: succeeded ? 'Card •••• 4242' : undefined },
    timeline: succeeded ? [...booking.timeline, { status: 'confirmed', at: now }] : booking.timeline,
    permissions: { canCancel: true, canPay: !succeeded }
  };
  writeBookings(readBookings().map((b) => b.id === updated.id ? updated : b));
  return updated;
}

function buildQuote(draft: BookingDraft): PriceQuote {
  const service = services.find((s) => s.id === draft.serviceId);
  if (!service) throw new ApiError('validation', 'service_required');
  const nurse = nurses.find((n) => n.id === draft.nurseId);
  const dailyRate = nurse?.dailyRateSample ?? service.dailyRateSample ?? 0;
  const subtotal = dailyRate * draft.days;
  return {
    dailyRate,
    days: draft.days,
    subtotal,
    fees: null,
    discount: null,
    estimatedTotal: subtotal,
    currency: config.currency,
    isSample: true
  };
}

export const demoAdapter: CareApi = {
  async listServices({ search = '', category = 'all', sort = 'popular', page = 1, pageSize = 9 }) {
    await wait();
    const term = search.trim().toLowerCase();
    let list = services.filter((s) => {
      const matchesCategory = category === 'all' || s.category === category;
      const haystack = `${s.title.en} ${s.title.ar} ${s.summary.en} ${s.summary.ar}`.toLowerCase();
      return matchesCategory && (!term || haystack.includes(term));
    });
    list = [...list].sort((a, b) => {
      if (sort === 'price-asc') return (a.dailyRateSample ?? 0) - (b.dailyRateSample ?? 0);
      if (sort === 'price-desc') return (b.dailyRateSample ?? 0) - (a.dailyRateSample ?? 0);
      if (sort === 'name') return a.title.en.localeCompare(b.title.en);
      return b.popularity - a.popularity;
    });
    const start = (page - 1) * pageSize;
    return {
      items: list.slice(start, start + pageSize),
      total: list.length,
      page,
      pageSize,
      hasMore: start + pageSize < list.length
    };
  },

  async getService(slug) {
    await wait(200, 420);
    const found = services.find((s) => s.slug === slug);
    if (!found) throw new ApiError('not_found');
    return found;
  },

  async listNurses({ serviceId, gender = 'any', availableOnly = false, sort = 'recommended', search = '' }) {
    await wait();
    const term = search.trim().toLowerCase();
    const list = nurses.filter(
      (n) =>
      (!serviceId || n.serviceIds.includes(serviceId)) && (
      gender === 'any' || n.gender === gender) && (
      !availableOnly || n.availability !== 'unavailable') && (
      !term || `${n.name.en} ${n.name.ar} ${n.role.en}`.toLowerCase().includes(term))
    );
    return [...list].sort((a, b) => {
      if (sort === 'price-asc') return (a.dailyRateSample ?? 0) - (b.dailyRateSample ?? 0);
      if (sort === 'price-desc') return (b.dailyRateSample ?? 0) - (a.dailyRateSample ?? 0);
      if (sort === 'experience') return (b.experienceYears ?? 0) - (a.experienceYears ?? 0);
      const rank = { available: 0, limited: 1, unavailable: 2 };
      return rank[a.availability] - rank[b.availability] || Number(b.featured) - Number(a.featured);
    });
  },

  async getNurse(slug) {
    await wait(200, 420);
    const found = nurses.find((n) => n.slug === slug);
    if (!found) throw new ApiError('not_found');
    return found;
  },

  async quote(draft) {
    await wait(160, 320);
    return buildQuote(draft);
  },

  async createBooking(draft, idempotencyKey) {
    const session = requireSession();
    await wait(600, 900);
    const existingId = idempotency.get(idempotencyKey);
    if (existingId) {
      const existing = readBookings().find((b) => b.id === existingId);
      if (existing) return existing;
    }
    if (!draft.serviceId || !draft.nurseId || !draft.startDate) throw new ApiError('validation');
    const nurse = nurses.find((n) => n.id === draft.nurseId);
    if (!nurse || nurse.availability === 'unavailable') throw new ApiError('conflict', 'nurse_unavailable');
    const quote = buildQuote(draft);
    const now = new Date().toISOString();
    const number = Math.floor(1100 + Math.random() * 800);
    const booking: Booking = {
      id: `bk-${number}`,
      reference: `CF-26-${number}`,
      serviceId: draft.serviceId,
      nurseId: draft.nurseId,
      startDate: draft.startDate,
      endDate: addDays(draft.startDate, draft.days - 1),
      days: draft.days,
      status: 'pending_payment',
      address: draft.address ?? session.user.address ?? '',
      notes: draft.notes,
      createdAt: now,
      payment: { status: 'pending', amount: quote.estimatedTotal, currency: quote.currency },
      timeline: [
      { status: 'created', at: now },
      { status: 'pending_payment', at: now }],

      permissions: { canCancel: true, canPay: true }
    };
    idempotency.set(idempotencyKey, booking.id);
    writeBookings([booking, ...readBookings()]);
    return booking;
  },

  async listBookings() {
    requireSession();
    await wait();
    return readBookings().map(settlePayment);
  },

  async listBookingsPage(page, pageSize = 20) {
    requireSession();
    await wait();
    const all = readBookings().map(settlePayment);
    const start = (page - 1) * pageSize;
    return { items: all.slice(start, start + pageSize), total: all.length, page, pageSize, hasMore: start + pageSize < all.length };
  },

  async getBooking(id) {
    requireSession();
    await wait(180, 360);
    const found = readBookings().find((b) => b.id === id);
    if (!found) throw new ApiError('not_found');
    return settlePayment(found);
  },

  async cancelBooking(id) {
    requireSession();
    await wait(500, 800);
    const list = readBookings();
    const found = list.find((b) => b.id === id);
    if (!found) throw new ApiError('not_found');
    if (!found.permissions.canCancel) throw new ApiError('conflict', 'cancel_not_permitted');
    const updated: Booking = {
      ...found,
      status: 'cancelled',
      timeline: [...found.timeline, { status: 'cancelled', at: new Date().toISOString() }],
      permissions: { canCancel: false, canPay: false }
    };
    writeBookings(list.map((b) => b.id === id ? updated : b));
    return updated;
  },

  async startPayment(bookingId, simulate) {
    requireSession();
    await wait(400, 700);
    const list = readBookings();
    const found = list.find((b) => b.id === bookingId);
    if (!found) throw new ApiError('not_found');
    if (!found.permissions.canPay) throw new ApiError('conflict', 'payment_not_permitted');
    pendingPayments.set(bookingId, { resolveAt: Date.now() + PAYMENT_DELAY_MS, outcome: simulate });
    const updated: Booking = {
      ...found,
      payment: { ...found.payment, status: 'processing' },
      permissions: { canCancel: false, canPay: false }
    };
    writeBookings(list.map((b) => b.id === bookingId ? updated : b));
    return updated;
  },

  async signIn(email, password) {
    await wait(500, 800);
    const record = registered.get(email.trim().toLowerCase());
    if (!record || record.password !== password) throw new ApiError('invalid_credentials');
    return createSession(record.user);
  },

  async signUp(input) {
    await wait(600, 900);
    const email = input.email.trim().toLowerCase();
    if (registered.has(email)) throw new ApiError('conflict', 'email_taken');
    const user: PatientUser = {
      id: `pt-${Date.now()}`,
      firstName: input.firstName,
      lastName: input.lastName,
      email,
      phone: input.phone,
      preferences: { language: 'en', genderPreference: 'any', emailUpdates: false }
    };
    registered.set(email, { password: input.password, user });
    return createSession(user);
  },

  async getPolicies() {
    await wait(120, 240);
    // the backend's default policy (care-backend settings `refund.policy`)
    return {
      currency: 'AED',
      paymentHoldMinutes: 15,
      nurseResponseMinutes: 120,
      maxAdvanceDays: 90,
      cancellationRefunds: [
      { minHoursBeforeStart: 48, refundPercent: 100 },
      { minHoursBeforeStart: 24, refundPercent: 50 },
      { minHoursBeforeStart: 0, refundPercent: 0 }]

    };
  },

  async sendContact() {
    await wait(500, 800);
  },

  async subscribeNewsletter() {
    await wait(300, 500);
  },

  async confirmNewsletter() {
    await wait(200, 400);
  },

  async unsubscribeNewsletter() {
    await wait(200, 400);
  },

  async requestPasswordReset() {
    await wait(500, 800);
    return { accepted: true };
  },

  async updateProfile(user) {
    requireSession();
    await wait(400, 700);
    const record = registered.get(user.email);
    if (record) registered.set(user.email, { ...record, user });
    return user;
  },

  async signOut() {
    return undefined;
  },

  async uploadAvatar(file) {
    const session = requireSession();
    await wait(400, 700);
    // demo only: the picture lives in this tab as a blob URL and is never uploaded anywhere
    const user = { ...session.user, avatarUrl: URL.createObjectURL(file) };
    const record = registered.get(user.email);
    if (record) registered.set(user.email, { ...record, user });
    return user;
  }
};