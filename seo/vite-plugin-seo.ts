/**
 * Build step for search engines and link previews (runs after `vite build`, Node only).
 *
 * The site is a client-rendered SPA. Google renders JavaScript, but many crawlers and every social link
 * preview (WhatsApp, X, LinkedIn, Slack…) read only the HTML. So for each indexable public route, in English
 * (`/…`) and Arabic (`/ar/…`), this writes `dist/<route>/index.html` = the built index.html with that page's
 * title, description, canonical URL, hreflang pairs, Open Graph tags and JSON-LD in <head> (and `lang`/`dir`
 * on <html>). `scripts/prerender.mjs` can then fill in the rendered body.
 *
 * Also writes:
 *   dist/app.html     generic shell (no canonical) — the hosting fallback for every other URL
 *   dist/sitemap.xml  indexable canonical URLs in both languages with xhtml:link alternates (needs VITE_SITE_URL)
 *   dist/robots.txt   keeps crawlers out of account/checkout, points to the sitemap
 *
 * Hosting: serve `<path>/index.html` when it exists, otherwise `app.html` (see website/README.md).
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';
import { articles } from '../src/data/articles';
import { faqs } from '../src/data/faqs';
import { imageWidths, SMALL_IMAGE_WIDTH } from '../src/data/imageWidths';
import { services } from '../src/data/services';
import {
  absoluteUrl,
  articleLd,
  breadcrumbLd,
  clampDescription,
  DEFAULT_OG_IMAGE,
  faqLd,
  HOME_HERO_SIZES,
  isIndexable,
  organizationLd,
  pick,
  serviceLd,
  SITE_NAME,
  staticPages,
  websiteLd,
  withBrand } from
'../src/seo/meta';
import type { Locale } from '../src/types/i18n';
import { localizedPath } from '../src/utils/localeRoute';

const LOCALES: Locale[] = ['en', 'ar'];

interface RouteHead {
  /** Path without language prefix (`/services`). */
  path: string;
  locale: Locale;
  title: string;
  description: string;
  image: string;
  type: 'website' | 'article';
  jsonLd: Record<string, unknown>[];
  /** Hero image to preload (the page's LCP element), if known at build time. */
  preloadImage?: string;
  /** Must equal the `sizes` the page's SmartImage uses, or the browser fetches the image twice. */
  preloadSizes?: string;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** JSON inside <script>: never let content close the tag. */
const jsonForScript = (v: unknown) => JSON.stringify(v).replace(/</g, '\\u003c');
const crumbs = {
  services: { en: 'Services', ar: 'الخدمات' },
  resources: { en: 'Health Resources', ar: 'الموارد الصحية' }
};

function routes(site: string, liveCatalog: boolean, locale: Locale): RouteHead[] {
  const out: RouteHead[] = [];
  const lp = (p: string) => localizedPath(p, locale);
  for (const [path, page] of Object.entries(staticPages)) {
    const jsonLd: Record<string, unknown>[] = [];
    if (path === '/') jsonLd.push(organizationLd(site), websiteLd(site));
    if (path === '/faqs') {
      const ld = faqLd(faqs, locale);
      if (ld) jsonLd.push(ld);
    }
    out.push({
      path,
      locale,
      title: pick(page.title, locale),
      description: pick(page.description, locale),
      image: DEFAULT_OG_IMAGE,
      type: 'website',
      jsonLd,
      preloadImage: path === '/' ? DEFAULT_OG_IMAGE : undefined,
      preloadSizes: HOME_HERO_SIZES
    });
  }
  // Catalogue pages from the bundled content. In live mode the backend owns the catalogue
  // (`npm run seed:website` creates these same slugs); services added later are still served via app.html.
  for (const s of services) {
    const path = `/services/${s.slug}`;
    const name = pick(s.title, locale);
    const description = pick(s.summary, locale);
    out.push({
      path,
      locale,
      title: withBrand(name, locale),
      description,
      image: s.image,
      type: 'website',
      // live mode shows the backend's picture (/api/v1/media/…), so the bundled one must not be preloaded
      preloadImage: liveCatalog ? undefined : s.image,
      jsonLd: [
      serviceLd(site, { name, description, path: lp(path), image: s.image }),
      breadcrumbLd(site, [{ name: crumbs.services[locale], path: lp('/services') }, { name, path: lp(path) }])]

    });
  }
  for (const a of articles) {
    const path = `/resources/${a.slug}`;
    const title = pick(a.title, locale);
    out.push({
      path,
      locale,
      title: withBrand(title, locale),
      description: pick(a.excerpt, locale),
      image: a.cover,
      type: 'article',
      preloadImage: a.cover,
      jsonLd: [
      articleLd(site, a, locale, lp(path)),
      breadcrumbLd(site, [{ name: crumbs.resources[locale], path: lp('/resources') }, { name: title, path: lp(path) }])]

    });
  }
  return out.filter((r) => isIndexable(r.path));
}

/** `/x.jpg` photos have WebP variants (scripts/optimize-images.py); preload the one SmartImage will pick. */
function preloadTag(image: string, sizes = '100vw'): string {
  const name = /^\/([\w-]+)\.jpg$/.exec(image)?.[1];
  const width = name ? imageWidths[name] : undefined;
  if (!name || !width) return '';
  const srcset = width > SMALL_IMAGE_WIDTH ? `/${name}-${SMALL_IMAGE_WIDTH}.webp ${SMALL_IMAGE_WIDTH}w, /${name}.webp ${width}w` : `/${name}.webp ${width}w`;
  return `<link rel="preload" as="image" type="image/webp" fetchpriority="high" imagesrcset="${srcset}" imagesizes="${sizes}">`;
}

/**
 * Latin text fonts every English page paints with (Manrope body, Newsreader headings incl. the italic hero line).
 * Preloaded so they arrive with the stylesheet: the first layout already uses them instead of laying the page out
 * with fallback fonts and again when each font swaps in. Arabic pages paint with IBM Plex Sans Arabic instead.
 */
const PRELOADED_FONTS = [/^manrope-latin-wght-normal-[\w-]+\.woff2$/, /^newsreader-latin-opsz-normal-[\w-]+\.woff2$/, /^newsreader-latin-opsz-italic-[\w-]+\.woff2$/];

function fontPreloads(assetsDir: string): string {
  const files = existsSync(assetsDir) ? readdirSync(assetsDir) : [];
  return PRELOADED_FONTS.map((re) => files.find((f) => re.test(f))).
  filter(Boolean).
  map((f) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/${f}">`).
  join('\n    ');
}

function headFor(r: RouteHead, site: string | null, fonts = ''): string {
  const desc = esc(clampDescription(r.description));
  const url = site ? absoluteUrl(site, localizedPath(r.path, r.locale)) : null;
  const alt = (l: Locale) => esc(absoluteUrl(site ?? '', localizedPath(r.path, l))); // only used when site is set
  const tags = [
  `<title>${esc(r.title)}</title>`,
  `<meta name="description" content="${desc}">`,
  url ? `<link rel="canonical" href="${esc(url)}">` : '',
  site ? `<link rel="alternate" hreflang="en" href="${alt('en')}">` : '',
  site ? `<link rel="alternate" hreflang="ar" href="${alt('ar')}">` : '',
  site ? `<link rel="alternate" hreflang="x-default" href="${alt('en')}">` : '',
  `<meta property="og:site_name" content="${SITE_NAME}">`,
  `<meta property="og:type" content="${r.type}">`,
  `<meta property="og:title" content="${esc(r.title)}">`,
  `<meta property="og:description" content="${desc}">`,
  url ? `<meta property="og:url" content="${esc(url)}">` : '',
  site ? `<meta property="og:image" content="${esc(absoluteUrl(site, r.image))}">` : '',
  `<meta property="og:locale" content="${r.locale === 'ar' ? 'ar_AR' : 'en_US'}">`,
  `<meta property="og:locale:alternate" content="${r.locale === 'ar' ? 'en_US' : 'ar_AR'}">`,
  `<meta name="twitter:card" content="summary_large_image">`,
  r.preloadImage ? preloadTag(r.preloadImage, r.preloadSizes) : '',
  r.locale === 'en' ? fonts : '',
  site && r.jsonLd.length ?
  `<script type="application/ld+json" id="page-jsonld">${jsonForScript(r.jsonLd.length === 1 ? r.jsonLd[0] : r.jsonLd)}</script>` :
  ''];

  return tags.filter(Boolean).join('\n    ');
}

const START = '<!--seo:start-->';
const END = '<!--seo:end-->';

function withHead(template: string, head: string, locale: Locale): string {
  const a = template.indexOf(START);
  const b = template.indexOf(END);
  if (a < 0 || b < a) throw new Error(`index.html must contain ${START} … ${END}`);
  const html = `${template.slice(0, a + START.length)}\n    ${head}\n    ${template.slice(b)}`;
  return locale === 'ar' ? html.replace('<html lang="en" dir="ltr">', '<html lang="ar" dir="rtl">') : html;
}

export function seoPlugin(options: {siteUrl?: string;dataSource?: string;}): Plugin {
  let config: ResolvedConfig;
  return {
    name: 'careflow-seo',
    apply: 'build',
    configResolved(c) {
      config = c;
    },
    closeBundle() {
      const outDir = resolve(config.root, config.build.outDir);
      const indexPath = join(outDir, 'index.html');
      if (!existsSync(indexPath)) return;
      const site = options.siteUrl?.replace(/\/+$/, '') || null;
      if (!site) {
        config.logger.warn(
          '\n[seo] VITE_SITE_URL is not set: no canonical/hreflang URLs, og:url/og:image or sitemap.xml were written. Set it for production builds.'
        );
      }
      const template = readFileSync(indexPath, 'utf8');
      if (!template.includes('<html lang="en" dir="ltr">')) throw new Error('index.html must start with <html lang="en" dir="ltr">');
      // generic fallback shell for every URL without its own file (private pages, new catalogue items, 404s)
      writeFileSync(join(outDir, 'app.html'), template);

      const fonts = fontPreloads(join(outDir, 'assets'));
      if (!fonts) config.logger.warn('[seo] Latin font files not found in assets/: no font preloads written');
      const live = options.dataSource === 'live';
      const all = LOCALES.flatMap((locale) => routes(site ?? 'https://example.invalid', live, locale));
      for (const r of all) {
        const urlPath = localizedPath(r.path, r.locale);
        const file = urlPath === '/' ? indexPath : join(outDir, urlPath, 'index.html');
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, withHead(template, headFor(r, site, fonts), r.locale));
      }
      // route list for scripts/prerender.mjs
      writeFileSync(join(outDir, 'prerender-routes.json'), JSON.stringify(all.map((r) => localizedPath(r.path, r.locale))));

      const robots = [
      'User-agent: *',
      'Disallow: /account',
      'Disallow: /checkout',
      'Disallow: /ar/account',
      'Disallow: /ar/checkout',
      'Allow: /',
      ...(site ? ['', `Sitemap: ${site}/sitemap.xml`] : []),
      ''].
      join('\n');
      writeFileSync(join(outDir, 'robots.txt'), robots);

      if (site) {
        const urls = all.
        map((r) => {
          const alt = (l: Locale) => esc(absoluteUrl(site, localizedPath(r.path, l)));
          return [
          '  <url>',
          `    <loc>${esc(absoluteUrl(site, localizedPath(r.path, r.locale)))}</loc>`,
          `    <xhtml:link rel="alternate" hreflang="en" href="${alt('en')}"/>`,
          `    <xhtml:link rel="alternate" hreflang="ar" href="${alt('ar')}"/>`,
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${alt('en')}"/>`,
          '  </url>'].
          join('\n');
        }).
        join('\n');
        writeFileSync(
          join(outDir, 'sitemap.xml'),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`
        );
      }
      config.logger.info(`[seo] ${all.length} route heads (en + ar), app.html, robots.txt${site ? ', sitemap.xml' : ''}`);
    }
  };
}
