import type { Locale } from './i18n';
import type { GenderPreference } from './nurse';

export interface PatientUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  address?: string;
  /** Profile photo served by the backend (absolute or same-origin URL). */
  avatarUrl?: string;
  preferences: {
    language: Locale;
    genderPreference: GenderPreference;
    emailUpdates: boolean;
  };
}

export interface Session {
  user: PatientUser;
  expiresAt: number;
}

export interface SignUpInput {
  firstName: string;
  lastName: string;
  email: string;
  /** E.164, e.g. +966501234567 (required by the backend). */
  phone: string;
  password: string;
}