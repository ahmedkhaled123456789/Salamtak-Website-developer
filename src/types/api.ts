import type { PatientUser, Session, SignUpInput } from './auth';
import type { Booking, BookingDraft, PaymentSimulation, PriceQuote } from './booking';
import type { Nurse, NurseQuery } from './nurse';
import type { ContactInput, Policies } from './content';
import type { CareService, Paginated, ServiceQuery } from './service';

export type ApiErrorCode =
'network' |
'unauthorized' |
'invalid_credentials' |
'session_expired' |
'not_found' |
'validation' |
'conflict' |
'not_configured' |
'unknown';

/** The contract every data source (demo or live) must implement. */
export interface CareApi {
  listServices(query: ServiceQuery): Promise<Paginated<CareService>>;
  getService(slug: string): Promise<CareService>;
  listNurses(query: NurseQuery): Promise<Nurse[]>;
  getNurse(slug: string): Promise<Nurse>;
  quote(draft: BookingDraft): Promise<PriceQuote>;
  createBooking(draft: BookingDraft, idempotencyKey: string): Promise<Booking>;
  /** The most recent bookings (first page, up to 100) — dashboard summaries. */
  listBookings(): Promise<Booking[]>;
  /** One page of the booking history, newest first. */
  listBookingsPage(page: number, pageSize?: number): Promise<Paginated<Booking>>;
  getBooking(id: string): Promise<Booking>;
  cancelBooking(id: string): Promise<Booking>;
  startPayment(bookingId: string, simulate: PaymentSimulation): Promise<Booking>;
  signIn(email: string, password: string): Promise<Session>;
  signUp(input: SignUpInput): Promise<Session>;
  requestPasswordReset(email: string): Promise<{accepted: true;}>;
  updateProfile(user: PatientUser): Promise<PatientUser>;
  signOut(): Promise<void>;
  /** Replaces the signed-in user's profile photo; returns the user with the new `avatarUrl`. */
  uploadAvatar(file: File): Promise<PatientUser>;
  getPolicies(): Promise<Policies>;
  sendContact(input: ContactInput): Promise<void>;
  /** Double opt-in: the API emails a confirmation link; nothing is sent until it is used. */
  subscribeNewsletter(email: string, locale: 'en' | 'ar'): Promise<void>;
  confirmNewsletter(token: string): Promise<void>;
  unsubscribeNewsletter(token: string): Promise<void>;
}