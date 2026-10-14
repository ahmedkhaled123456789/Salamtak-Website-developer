import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import { config } from '../utils/config';
import { localizedPath } from '../utils/localeRoute';
import { absoluteUrl, clampDescription, DEFAULT_OG_IMAGE, isIndexable, pick, SITE_NAME, staticPages } from './meta';

interface Options {
  /** Full document title (already localized and branded). */
  title: string;
  description?: string;
  /** Social preview image (site path or absolute URL). */
  image?: string;
  type?: 'website' | 'article';
  /** Force noindex (private, placeholder or error pages). Paths in NOINDEX_PREFIXES are always noindex. */
  noindex?: boolean;
  /** schema.org objects for this page (only truthful, page-specific facts). */
  jsonLd?: Record<string, unknown>[];
}

const siteUrl = () => config.siteUrl || window.location.origin;

/** Creates or updates one `<meta>`/`<link>` so static tags from the build are reused, never duplicated. */
function upsert(tag: 'meta' | 'link', key: 'name' | 'property' | 'rel', keyValue: string, attr: 'content' | 'href', value: string | null) {
  let el = document.head.querySelector<HTMLElement>(`${tag}[${key}="${keyValue}"]`);
  if (value === null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement(tag);
    el.setAttribute(key, keyValue);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

/**
 * Sets the document title, description, canonical URL, robots, Open Graph / Twitter tags and JSON-LD for the
 * current page. The build writes the same tags into each public route's HTML (seo/vite-plugin-seo.ts) for
 * crawlers and link previews that don't run JavaScript; this keeps them right after client-side navigation
 * and in Arabic.
 */
export function usePageMeta({ title, description, image, type = 'website', noindex = false, jsonLd }: Options) {
  const { pathname } = useLocation();
  const { locale } = useI18n();
  const ld = jsonLd ? JSON.stringify(jsonLd.length === 1 ? jsonLd[0] : jsonLd) : '';

  useEffect(() => {
    const indexable = !noindex && isIndexable(pathname);
    // the router pathname has no /ar prefix (basename); public URLs do
    const url = absoluteUrl(siteUrl(), localizedPath(pathname, locale));
    const desc = description ? clampDescription(description) : null;
    document.title = title;
    upsert('meta', 'name', 'description', 'content', desc);
    upsert('meta', 'name', 'robots', 'content', indexable ? null : 'noindex, nofollow');
    upsert('link', 'rel', 'canonical', 'href', indexable ? url : null);
    upsert('meta', 'property', 'og:site_name', 'content', SITE_NAME);
    upsert('meta', 'property', 'og:type', 'content', type);
    upsert('meta', 'property', 'og:title', 'content', title);
    upsert('meta', 'property', 'og:description', 'content', desc);
    upsert('meta', 'property', 'og:url', 'content', url);
    upsert('meta', 'property', 'og:image', 'content', absoluteUrl(siteUrl(), image || DEFAULT_OG_IMAGE));
    upsert('meta', 'property', 'og:locale', 'content', locale === 'ar' ? 'ar_AR' : 'en_US');
    upsert('meta', 'name', 'twitter:card', 'content', 'summary_large_image');
    // hreflang pairs: every public page exists in English and Arabic
    for (const [lang, loc] of [['en', 'en'], ['ar', 'ar'], ['x-default', 'en']] as const) {
      let link = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${lang}"]`);
      if (!indexable) {
        link?.remove();
        continue;
      }
      if (!link) {
        link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = lang;
        document.head.appendChild(link);
      }
      link.href = absoluteUrl(siteUrl(), localizedPath(pathname, loc));
    }

    let script = document.getElementById('page-jsonld');
    if (!ld || !indexable) script?.remove();
    else {
      if (!script) {
        script = document.createElement('script');
        script.id = 'page-jsonld';
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = ld;
    }
  }, [pathname, locale, title, description, image, type, noindex, ld]);
}

/** Metadata for one of the indexable static pages in `staticPages`. */
export function useStaticPageMeta(path: keyof typeof staticPages, extra: Pick<Options, 'jsonLd' | 'image'> = {}) {
  const { locale } = useI18n();
  const page = staticPages[path];
  usePageMeta({ title: pick(page.title, locale), description: pick(page.description, locale), ...extra });
}
