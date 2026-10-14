import { nurses as sampleNurses } from '../data/nurses';
import { services as sampleServices } from '../data/services';
import type { CareApi } from '../types/api';
import type { PatientUser, Session } from '../types/auth';
import type { Booking, BookingStatus, BookingTimelineEntry, PriceQuote } from '../types/booking';
import type { Policies } from '../types/content';
import type { Localized } from '../types/i18n';
import type { Nurse } from '../types/nurse';
import type { CareService, ServiceCategory } from '../types/service';
import { ApiError, mediaUrl, readTokens, request, writeTokens, type Tokens } from './apiClient';
import { config } from './config';
import { DEFAULT_EMIRATE, findEmirate } from '../data/emirates';

/**
 * LIVE ADAPTER — maps care-backend (`/api/v1`) onto the website's types.
 *
 * Source of truth is the backend for everything that changes: ids, prices, pictures (services, nurses, users),
 * availability, bookings and accounts. The bundled sample content in data/ only supplies editorial copy the API
 * has no field for (Arabic titles, "what's included", qualifications), matched by service slug / nurse name and
 * never used for ids, prices or images. A service or nurse created in the backend works without any sample entry.
 */

/* --------------------------------- API shapes --------------------------------- */
interface ApiService {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  sortOrder: number;
  imageUrl: string | null;
  baseRatesMinor?: { daily: number | null };
}
interface ApiNurseCard {
  id: string;
  serviceIds: string[];
  dailyRateMinor: number | null;
  displayName: string;
  imageUrl: string | null;
  bio: string | null;
  yearsOfExperience: number;
  specializations: string[];
  languages: string[];
  gender: string | null;
  averageRating: number;
  totalReviews: number;
  city: string | null;
  price?: { unitAmountMinor: number } | null;
}
interface ApiBooking {
  id: string;
  bookingNumber: string;
  status: string;
  service: { id: string };
  nurse?: { id: string };
  startDateTime: string;
  endDateTime: string;
  durationMinutes: number;
  notes: string | null;
  createdAt: string;
  location: { address: string | null };
  pricing?: { patientPayableMinor: number; currency: string };
}
interface ApiHistory {
  newState: string;
  createdAt: string;
}
interface ApiUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImageUrl?: string;
}
interface ApiPatient {
  address: string | null;
  city: string | null;
}
interface Page<T> {
  items: T[];
}

/* ---------------------------------- helpers ---------------------------------- */
const MIN_PER_DAY = 1440;
/** Local wall-clock start of a care day; the API stores UTC and checks it against the platform timezone. */
const START_TIME = '09:00:00';
const l = (en: string, ar = en): Localized => ({ en, ar });

const CATEGORY: Record<string, ServiceCategory> = {
  ELDERLY_CARE: 'elderly',
  POST_SURGERY: 'recovery',
  CHRONIC_CARE: 'recovery',
  NURSING: 'nursing',
  MEDICATION: 'nursing',
  MONITORING: 'nursing',
  DAILY_ASSISTANCE: 'daily-living',
  COMPANIONSHIP: 'daily-living'
};

const STATUS: Record<string, BookingStatus> = {
  PENDING: 'pending_payment',
  PAYMENT_PENDING: 'pending_payment',
  PAID: 'confirmed',
  NURSE_PENDING: 'confirmed',
  NURSE_ACCEPTED: 'confirmed',
  CONFIRMED: 'confirmed',
  CARE_STARTED: 'in_progress',
  CARE_IN_PROGRESS: 'in_progress',
  DISPUTED: 'in_progress',
  COMPLETED: 'completed',
  NURSE_REJECTED: 'cancelled',
  CANCELLED: 'cancelled',
  EXPIRED: 'cancelled',
  FAILED: 'cancelled',
  REFUND_PENDING: 'cancelled',
  REFUNDED: 'cancelled'
};
const CANCELLABLE = new Set(['PAYMENT_PENDING', 'NURSE_PENDING', 'NURSE_ACCEPTED', 'CONFIRMED']);
const PAID_STATES = new Set(['PAID', 'NURSE_PENDING', 'NURSE_ACCEPTED', 'CONFIRMED', 'CARE_STARTED', 'CARE_IN_PROGRESS', 'COMPLETED', 'DISPUTED']);

/** Platform timezone offset used to turn a calendar date into an instant (and back). */
const TZ_OFFSET = config.platformUtcOffset;
function offsetMinutes(): number {
  const m = /^([+-])(\d{2}):(\d{2})$/.exec(TZ_OFFSET);
  return m ? (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) : 0;
}
const localDate = (iso: string): string => new Date(new Date(iso).getTime() + offsetMinutes() * 60_000).toISOString().slice(0, 10);

/* --------------------------------- services --------------------------------- */
const sampleBySlug = new Map(sampleServices.map((s) => [s.slug, s]));

function toService(api: ApiService): CareService {
  const sample = sampleBySlug.get(api.slug);
  const text = api.description ?? '';
  return {
    id: api.id,
    legacyId: sample?.id,
    slug: api.slug,
    category: CATEGORY[api.category] ?? sample?.category ?? 'nursing',
    title: sample?.title ?? l(api.name),
    summary: sample?.summary ?? l(text.length > 140 ? `${text.slice(0, 137)}…` : text),
    description: sample?.description ?? l(text),
    image: mediaUrl(api.imageUrl),
    imageAlt: sample?.imageAlt ?? l(api.name),
    dailyRateSample: api.baseRatesMinor?.daily != null ? api.baseRatesMinor.daily / 100 : null,
    includes: sample?.includes ?? [],
    notes: sample?.notes ?? l(''),
    minDays: Math.max(1, Math.round(api.minDurationMinutes / MIN_PER_DAY)),
    maxDays: Math.max(1, Math.round(api.maxDurationMinutes / MIN_PER_DAY)),
    popularity: sample?.popularity ?? Math.max(0, 100 - api.sortOrder)
  };
}

let servicesCache: Promise<CareService[]> | null = null;
function allServices(): Promise<CareService[]> {
  servicesCache ??= request<Page<ApiService>>('/public/services', { anonymous: true }).
  then((r) => r.items.map(toService)).
  catch((e) => {servicesCache = null;throw e;});
  return servicesCache;
}

/* ---------------------------------- nurses ---------------------------------- */
function toNurse(card: ApiNurseCard): Nurse {
  const [first = '', last = ''] = card.displayName.split(' ');
  const sample = sampleNurses.find((n) => {
    const [f = '', ...rest] = n.name.en.split(' ');
    return f === first && `${(rest.pop() ?? '').charAt(0)}.` === last;
  });
  const gender = card.gender === 'MALE' ? 'male' : 'female';
  const city = card.city ?? '';
  return {
    id: card.id,
    slug: card.id,
    name: sample?.name ?? l(card.displayName),
    role: sample?.role ?? l(card.specializations[0] ?? 'Nurse'),
    gender,
    portrait: mediaUrl(card.imageUrl),
    bio: sample?.bio ?? l(card.bio ?? ''),
    city: sample?.city ?? l(city),
    serviceIds: card.serviceIds,
    languages: sample?.languages ?? card.languages.map((x) => l(x.charAt(0).toUpperCase() + x.slice(1))),
    experienceYears: card.yearsOfExperience || undefined,
    qualifications: sample?.qualifications,
    availability: 'available',
    dailyRateSample: card.price ? card.price.unitAmountMinor / 100 : card.dailyRateMinor != null ? card.dailyRateMinor / 100 : undefined,
    featured: sample?.featured ?? card.averageRating >= 4.5
  };
}

/* --------------------------------- bookings --------------------------------- */
const PROCESSING_KEY = 'careflow.payments.processing';
const PROCESSING_TTL_MS = 5 * 60_000;

function processingIds(): Record<string, number> {
  try {
    const all = JSON.parse(sessionStorage.getItem(PROCESSING_KEY) ?? '{}') as Record<string, number>;
    return Object.fromEntries(Object.entries(all).filter(([, at]) => Date.now() - at < PROCESSING_TTL_MS));
  } catch {
    return {};
  }
}
function markProcessing(id: string, on: boolean): void {
  const all = processingIds();
  if (on) all[id] = Date.now();
  else delete all[id];
  try {
    sessionStorage.setItem(PROCESSING_KEY, JSON.stringify(all));
  } catch {/* storage unavailable: the page just shows "pending" until the webhook lands */}
}

function toBooking(api: ApiBooking, history?: ApiHistory[]): Booking {
  const days = Math.max(1, Math.ceil(api.durationMinutes / MIN_PER_DAY));
  const status = STATUS[api.status] ?? 'pending_payment';
  const paid = PAID_STATES.has(api.status) || api.status === 'REFUND_PENDING' || api.status === 'REFUNDED';
  const processing = api.status === 'PAYMENT_PENDING' && api.id in processingIds();
  if (paid) markProcessing(api.id, false);
  const timeline: BookingTimelineEntry[] = [{ status: 'created', at: api.createdAt }];
  for (const h of history ?? []) {
    const mapped = STATUS[h.newState];
    if (mapped && timeline[timeline.length - 1]?.status !== mapped) timeline.push({ status: mapped, at: h.createdAt });
  }
  return {
    id: api.id,
    reference: api.bookingNumber,
    serviceId: api.service.id,
    nurseId: api.nurse?.id ?? '',
    startDate: localDate(api.startDateTime),
    endDate: localDate(new Date(new Date(api.endDateTime).getTime() - 1).toISOString()),
    days,
    status,
    address: api.location.address ?? '',
    notes: api.notes ?? undefined,
    createdAt: api.createdAt,
    payment: {
      status: paid ? 'succeeded' : processing ? 'processing' : 'pending',
      amount: (api.pricing?.patientPayableMinor ?? 0) / 100,
      currency: api.pricing?.currency ?? 'AED'
    },
    timeline,
    permissions: { canCancel: CANCELLABLE.has(api.status), canPay: api.status === 'PAYMENT_PENDING' && !processing }
  };
}

const getBookingRaw = (id: string) => request<ApiBooking>(`/bookings/${id}`);

/* ----------------------------------- users ----------------------------------- */
const PREFS_KEY = (id: string) => `careflow.prefs.${id}`;

function readPrefs(id: string): PatientUser['preferences'] {
  try {
    const raw = localStorage.getItem(PREFS_KEY(id));
    if (raw) return JSON.parse(raw) as PatientUser['preferences'];
  } catch {/* ignore */}
  return { language: 'en', genderPreference: 'any', emailUpdates: false };
}

async function loadUser(api: ApiUser): Promise<PatientUser> {
  const profile = await request<ApiPatient>('/patients/me').catch(() => null);
  return {
    id: api.id,
    firstName: api.firstName,
    lastName: api.lastName,
    email: api.email,
    phone: api.phone,
    city: profile?.city ?? undefined,
    address: profile?.address ?? undefined,
    avatarUrl: api.profileImageUrl ? mediaUrl(api.profileImageUrl) : undefined,
    preferences: readPrefs(api.id)
  };
}

async function startSession(result: {user: ApiUser;tokens: Tokens;}): Promise<Session> {
  writeTokens({ accessToken: result.tokens.accessToken, refreshToken: result.tokens.refreshToken });
  return { user: await loadUser(result.user), expiresAt: Date.now() + config.sessionTtlMs };
}

/* ----------------------------------- quote ----------------------------------- */
function estimate(service: CareService | undefined, nurse: Nurse | undefined, days: number): PriceQuote {
  const dailyRate = nurse?.dailyRateSample ?? service?.dailyRateSample ?? 0;
  return {
    dailyRate,
    days,
    subtotal: dailyRate * days,
    fees: null,
    discount: null,
    estimatedTotal: dailyRate * days,
    currency: config.currency,
    isSample: true
  };
}

function careWindow(startDate: string, days: number): {startDateTime: string;endDateTime: string;} {
  const start = new Date(`${startDate}T${START_TIME}${TZ_OFFSET}`);
  return { startDateTime: start.toISOString(), endDateTime: new Date(start.getTime() + days * MIN_PER_DAY * 60_000).toISOString() };
}

export const liveAdapter: CareApi = {
  async listServices({ search = '', category = 'all', sort = 'popular', page = 1, pageSize = 9 }) {
    const term = search.trim().toLowerCase();
    let list = (await allServices()).filter((s) =>
    (category === 'all' || s.category === category) &&
    (!term || `${s.title.en} ${s.title.ar} ${s.summary.en} ${s.summary.ar}`.toLowerCase().includes(term))
    );
    list = [...list].sort((a, b) => {
      if (sort === 'price-asc') return (a.dailyRateSample ?? 0) - (b.dailyRateSample ?? 0);
      if (sort === 'price-desc') return (b.dailyRateSample ?? 0) - (a.dailyRateSample ?? 0);
      if (sort === 'name') return a.title.en.localeCompare(b.title.en);
      return b.popularity - a.popularity;
    });
    const start = (page - 1) * pageSize;
    return { items: list.slice(start, start + pageSize), total: list.length, page, pageSize, hasMore: start + pageSize < list.length };
  },

  async getService(slug) {
    const raw = await request<ApiService>(`/public/services/${encodeURIComponent(slug)}`, { anonymous: true });
    return toService(raw);
  },

  async listNurses({ serviceId, gender = 'any', sort = 'recommended', search = '' }) {
    const params = new URLSearchParams({ limit: '100' });
    if (serviceId) params.set('serviceId', serviceId);
    if (gender !== 'any') params.set('gender', gender.toUpperCase());
    if (sort === 'experience') params.set('sort', 'experience');
    if (sort === 'price-asc' && serviceId) params.set('sort', 'price');
    const res = await request<Page<ApiNurseCard>>(`/public/nurses?${params}`, { anonymous: true });
    const term = search.trim().toLowerCase();
    const list = res.items.map(toNurse).filter((n) => !term || `${n.name.en} ${n.name.ar} ${n.role.en}`.toLowerCase().includes(term));
    if (sort === 'price-desc') list.sort((a, b) => (b.dailyRateSample ?? 0) - (a.dailyRateSample ?? 0));
    if (sort === 'price-asc' && !serviceId) list.sort((a, b) => (a.dailyRateSample ?? 0) - (b.dailyRateSample ?? 0));
    return list;
  },

  async getNurse(slug) {
    return toNurse(await request<ApiNurseCard>(`/public/nurses/${encodeURIComponent(slug)}`, { anonymous: true }));
  },

  async quote(draft) {
    const services = await allServices();
    const service = services.find((s) => s.id === draft.serviceId);
    const fallback = () => estimate(service, undefined, draft.days);
    if (!draft.serviceId || !draft.nurseId || !draft.startDate || !readTokens()) return fallback();
    try {
      const q = await request<{
        rateMinor: number;baseMinor: number;surchargeMinor: number;feesMinor: number;discountMinor: number;patientPayableMinor: number;currency: string;
      }>('/bookings/quote', {
        method: 'POST',
        body: { serviceId: draft.serviceId, nurseId: draft.nurseId, ...careWindow(draft.startDate, draft.days) }
      });
      return {
        dailyRate: q.rateMinor / 100,
        days: draft.days,
        subtotal: (q.baseMinor + q.surchargeMinor) / 100,
        fees: q.feesMinor / 100,
        discount: q.discountMinor ? q.discountMinor / 100 : null,
        estimatedTotal: q.patientPayableMinor / 100,
        currency: q.currency,
        isSample: false
      };
    } catch (error) {
      if (error instanceof ApiError && error.code === 'network') throw error;
      return fallback(); // e.g. start too soon: the exact reason is reported when the booking is created
    }
  },

  async createBooking(draft, idempotencyKey) {
    if (!draft.serviceId || !draft.nurseId || !draft.startDate) throw new ApiError('validation', 'service_required');
    const nurse = await liveAdapter.getNurse(draft.nurseId);
    const profile = await request<ApiPatient>('/patients/me').catch(() => null);
    // The API checks the address against the nurse's service radius. Most precise first: the location the patient
    // shared, then the chosen emirate, the profile city, the nurse's city; Dubai as the last resort.
    const place = findEmirate(draft.emirate) ?? findEmirate(profile?.city) ?? findEmirate(nurse.city.en) ?? DEFAULT_EMIRATE;
    const coords = draft.coords ?? { latitude: place.latitude, longitude: place.longitude };
    const when = careWindow(draft.startDate, draft.days);
    const quote = await request<{quoteToken: string;}>('/bookings/quote', {
      method: 'POST',
      body: { serviceId: draft.serviceId, nurseId: draft.nurseId, ...when, location: coords }
    });
    const created = await request<ApiBooking>('/bookings', {
      method: 'POST',
      headers: { 'Idempotency-Key': idempotencyKey },
      body: {
        serviceId: draft.serviceId,
        nurseId: draft.nurseId,
        ...when,
        location: { ...coords, address: draft.address || profile?.address || place.name.en, city: profile?.city || place.name.en },
        ...(draft.genderPreference !== 'any' && { genderPreference: draft.genderPreference.toUpperCase() }),
        ...(draft.notes && { notes: draft.notes }),
        quoteToken: quote.quoteToken
      }
    });
    return toBooking(created);
  },

  async listBookings() {
    const res = await request<Page<ApiBooking>>('/bookings?limit=100');
    return res.items.map((b) => toBooking(b));
  },

  async listBookingsPage(page, pageSize = 20) {
    const res = await request<Page<ApiBooking> & {meta: {total: number;totalPages: number;};}>(`/bookings?page=${page}&limit=${pageSize}`);
    return { items: res.items.map((b) => toBooking(b)), total: res.meta.total, page, pageSize, hasMore: page < res.meta.totalPages };
  },

  async getBooking(id) {
    const [booking, history] = await Promise.all([
    getBookingRaw(id),
    request<Page<ApiHistory>>(`/bookings/${id}/history`).catch(() => ({ items: [] as ApiHistory[] }))]
    );
    return toBooking(booking, history.items);
  },

  async cancelBooking(id) {
    await request<ApiBooking>(`/bookings/${id}/cancel`, { method: 'POST' });
    return liveAdapter.getBooking(id);
  },

  async startPayment(bookingId) {
    const payment = await request<{redirectUrl: string | null;}>('/payments/create', { method: 'POST', body: { bookingId } });
    markProcessing(bookingId, true);
    if (payment.redirectUrl) window.location.assign(payment.redirectUrl);
    return liveAdapter.getBooking(bookingId);
  },

  async signIn(email, password) {
    return startSession(await request('/auth/login', { method: 'POST', anonymous: true, body: { email, password } }));
  },

  async signUp(input) {
    return startSession(await request('/auth/register', {
      method: 'POST',
      anonymous: true,
      body: { firstName: input.firstName, lastName: input.lastName, email: input.email, phone: input.phone, password: input.password, role: 'PATIENT' }
    }));
  },

  async getPolicies() {
    return request<Policies>('/public/policies', { anonymous: true });
  },

  async sendContact(input) {
    await request('/public/contact', {
      method: 'POST',
      anonymous: true,
      body: { ...input, topic: input.topic.toUpperCase(), website: input.website || undefined }
    });
  },

  async subscribeNewsletter(email, locale) {
    await request('/public/newsletter', { method: 'POST', anonymous: true, body: { email, locale } });
  },

  async confirmNewsletter(token) {
    await request('/public/newsletter/confirm', { method: 'POST', anonymous: true, body: { token } });
  },

  async unsubscribeNewsletter(token) {
    await request('/public/newsletter/unsubscribe', { method: 'POST', anonymous: true, body: { token } });
  },

  async requestPasswordReset(email) {
    await request('/auth/forgot-password', { method: 'POST', anonymous: true, body: { email } });
    return { accepted: true };
  },

  async updateProfile(user) {
    const me = await request<ApiUser>('/users/me', { method: 'PATCH', body: { firstName: user.firstName, lastName: user.lastName } });
    await request('/patients/me', { method: 'PATCH', body: { address: user.address ?? '', city: user.city ?? '' } });
    try {
      localStorage.setItem(PREFS_KEY(user.id), JSON.stringify(user.preferences));
    } catch {/* preferences just won't persist */}
    return { ...user, firstName: me.firstName, lastName: me.lastName };
  },

  async signOut() {
    const tokens = readTokens();
    writeTokens(null);
    if (tokens) await request('/auth/logout', { method: 'POST', anonymous: true, body: { refreshToken: tokens.refreshToken } }).catch(() => undefined);
  },

  async uploadAvatar(file) {
    const form = new FormData();
    form.append('file', file);
    const me = await request<ApiUser>('/users/me/avatar', { method: 'PUT', form });
    return loadUser(me);
  }
};
