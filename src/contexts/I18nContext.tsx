import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ar } from '../data/translationsAr';
import { en, type Dictionary } from '../data/translationsEn';
import type { Locale, Localized } from '../types/i18n';
import { config } from '../utils/config';
import { formatCurrency, formatDate, formatNumber } from '../utils/format';
import { switchLocaleUrl, urlLocale, writeLocalePref } from '../utils/localeRoute';

type Leaves<T, P extends string = ''> = { [K in
keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`> }[
keyof T & string];

export type TranslationKey = Leaves<Dictionary>;
type Vars = Record<string, string | number>;

interface I18nValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, vars?: Vars) => string;
  l: (value: Localized) => string;
  money: (amount: number, currency?: string) => string;
  date: (iso: string, options?: Intl.DateTimeFormatOptions) => string;
  num: (value: number) => string;
  daysLabel: (n: number) => string;
}

const dictionaries: Record<Locale, Dictionary> = { en, ar };
const I18nContext = createContext<I18nValue | null>(null);

function lookup(dict: Dictionary, key: string): string | undefined {
  let node: unknown = dict;
  for (const part of key.split('.')) {
    if (typeof node !== 'object' || node === null) return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === 'string' ? node : undefined;
}

/** The URL decides the language (see utils/localeRoute.ts). */
function initialLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  return urlLocale(window.location.pathname);
}

export function I18nProvider({ children }: {children: React.ReactNode;}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  // Back/forward across a language switch: the URL decides the language (the router remounts on change, see App).
  useEffect(() => {
    const onPop = () => setLocaleState(urlLocale(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    writeLocalePref(next);
    // the other language lives at another URL (router basename): change the URL in place, no page reload
    if (next !== urlLocale(window.location.pathname)) window.history.pushState(null, '', switchLocaleUrl(next));
    setLocaleState(next);
  }, []);

  const value = useMemo<I18nValue>(() => {
    const numeric = (n: number) => formatNumber(n, locale);
    return {
      locale,
      dir,
      setLocale,
      t: (key, vars) => {
        const raw = lookup(dictionaries[locale], key) ?? lookup(en, key) ?? key;
        if (!vars) return raw;
        return raw.replace(/\{(\w+)\}/g, (_, name: string) => {
          const v = vars[name];
          return v === undefined ? `{${name}}` : typeof v === 'number' ? numeric(v) : v;
        });
      },
      l: (value) => value[locale] || value.en,
      money: (amount, currency = config.currency) => formatCurrency(amount, currency, locale),
      date: (iso, options) => formatDate(iso, locale, options),
      num: numeric,
      daysLabel: (n) => {
        if (locale === 'en') return `${numeric(n)} ${n === 1 ? 'day' : 'days'}`;
        if (n === 1) return 'يوم واحد';
        if (n === 2) return 'يومان';
        if (n <= 10) return `${numeric(n)} أيام`;
        return `${numeric(n)} يوماً`;
      }
    };
  }, [locale, dir, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}