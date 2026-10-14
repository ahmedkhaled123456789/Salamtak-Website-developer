import type { Locale } from '../types/i18n';

/** Gregorian calendar for both locales so dates match booking records. */
export function intlLocale(locale: Locale): string {
  return locale === 'ar' ? 'ar-u-ca-gregory' : 'en-GB';
}

export function formatCurrency(amount: number, currency: string, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale(locale)).format(value);
}

export function formatDate(
iso: string,
locale: Locale,
options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' })
: string {
  return new Intl.DateTimeFormat(intlLocale(locale), options).format(new Date(iso));
}

export function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}