import type { Locale } from '../types/i18n';

/**
 * Language lives in the URL: English at `/…`, Arabic at `/ar/…` (same page structure). Search engines index both
 * versions with hreflang pairs, shared links open in the language they were shared in, and the router runs with
 * `basename="/ar"` for Arabic so every in-app link stays in the current language.
 */
export const AR_PREFIX = '/ar';
export const LOCALE_PREF_KEY = 'careflow.locale';

export const urlLocale = (pathname: string): Locale => pathname === AR_PREFIX || pathname.startsWith(`${AR_PREFIX}/`) ? 'ar' : 'en';

/** `/ar/services` → `/services`, `/ar` → `/`. */
export const stripLocale = (pathname: string): string => urlLocale(pathname) === 'ar' ? pathname.slice(AR_PREFIX.length) || '/' : pathname;

/** `/services` + ar → `/ar/services`; `/` + ar → `/ar`. */
export const localizedPath = (path: string, locale: Locale): string => locale === 'ar' ? path === '/' ? AR_PREFIX : `${AR_PREFIX}${path}` : path;

/** The same page in the other language (the router remounts with the other basename; see App.tsx LocaleRouter). */
export function switchLocaleUrl(target: Locale, loc: {pathname: string;search: string;hash: string;} = window.location): string {
  return `${localizedPath(stripLocale(loc.pathname), target)}${loc.search}${loc.hash}`;
}

export function readLocalePref(): Locale | null {
  try {
    const v = window.localStorage.getItem(LOCALE_PREF_KEY);
    return v === 'ar' || v === 'en' ? v : null;
  } catch {
    return null;
  }
}

export function writeLocalePref(locale: Locale): void {
  try {
    window.localStorage.setItem(LOCALE_PREF_KEY, locale);
  } catch {/* storage unavailable: the URL still decides */}
}
