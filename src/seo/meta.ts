/**
 * Search & social metadata for the public website — shared by the runtime hook (usePageMeta) and the
 * build step (seo/vite-plugin-seo.ts) so the HTML a crawler downloads and the page React renders agree.
 *
 * Pure data + functions: no React, no `import.meta.env`, no browser globals.
 *
 * Indexing policy
 * - Indexable: marketing pages, the service catalogue, service pages, health resources.
 * - noindex: anything personal or transactional (account, booking, checkout, sign-in), placeholder legal
 *   pages, individual nurse profiles (people, not products — opt in deliberately if that changes), 404s.
 * - Every public page exists twice: English at `/…` and Arabic at `/ar/…` (utils/localeRoute.ts), linked with
 *   hreflang pairs (en, ar, x-default → en) in the static heads, at runtime and in the sitemap.
 */
import type { Article, Faq } from '../types/content';
import type { Localized, Locale } from '../types/i18n';

export const SITE_NAME = 'CareFlow';
/** Default social preview image (the home hero photo). */
export const DEFAULT_OG_IMAGE = '/61756c81-b298-4a96-af48-e941ff36a793.jpg';
/** `sizes` of the home hero photo — shared with the build's preload hint so both pick the same file. */
export const HOME_HERO_SIZES = '(min-width: 1024px) 45vw, 100vw';

export interface PageMeta {
  title: Localized;
  description: Localized;
}

const meta = (titleEn: string, titleAr: string, descEn: string, descAr: string): PageMeta => ({
  title: { en: titleEn, ar: titleAr },
  description: { en: descEn, ar: descAr }
});

/** Indexable static pages (path → copy). Order is the sitemap order. */
export const staticPages: Record<string, PageMeta> = {
  '/': meta(
    'CareFlow — Trusted home nursing and care, right at home',
    'كيرفلو — رعاية تمريضية منزلية موثوقة في بيتك',
    'Book verified home care nurses for elderly care, post-surgery recovery, wound care and daily support. Clear daily rates, booking and payment status in one place.',
    'احجز ممرضين موثّقين للرعاية المنزلية: رعاية كبار السن، التعافي بعد الجراحة، العناية بالجروح والدعم اليومي، بأسعار يومية واضحة وحالة حجز ودفع في مكان واحد.'
  ),
  '/services': meta(
    'Home care services — elderly care, nursing and recovery | CareFlow',
    'خدمات الرعاية المنزلية — كبار السن والتمريض والتعافي | كيرفلو',
    'Browse every CareFlow home care service, compare what each one includes and its daily rate, and book the support that fits your family.',
    'تصفّح جميع خدمات الرعاية المنزلية في كيرفلو، وقارن ما تتضمنه كل خدمة وسعرها اليومي، واحجز الدعم المناسب لعائلتك.'
  ),
  '/nurses': meta(
    'Find a home care nurse | CareFlow',
    'ابحث عن ممرض للرعاية المنزلية | كيرفلو',
    'Compare verified home care professionals by service, experience and language, and book the nurse who fits your needs.',
    'قارن بين مختصي الرعاية المنزلية الموثّقين حسب الخدمة والخبرة واللغة، واحجز الممرض المناسب لاحتياجاتك.'
  ),
  '/how-it-works': meta(
    'How booking home care works | CareFlow',
    'كيف يعمل حجز الرعاية المنزلية | كيرفلو',
    'A simple, transparent path from choosing a service and dates to welcoming a nurse home — and what happens after you book.',
    'طريق بسيط وواضح من اختيار الخدمة والتواريخ إلى استقبال الممرض في المنزل، وما يحدث بعد الحجز.'
  ),
  '/about': meta(
    'About CareFlow — home care on your terms',
    'عن كيرفلو — رعاية منزلية بشروطك',
    'CareFlow makes finding trusted home care simple and gives families the clarity they need: dignity, plain language and visible pricing.',
    'تجعل كيرفلو العثور على رعاية منزلية موثوقة أمراً بسيطاً، وتمنح العائلات الوضوح الذي تحتاجه: الكرامة واللغة الواضحة والأسعار المعلنة.'
  ),
  '/why-careflow': meta(
    'Why families choose CareFlow for home care',
    'لماذا تختار العائلات كيرفلو للرعاية المنزلية',
    'Verified professionals, clear daily rates and booking status you can follow — the details that make home care easier to find, plan and manage.',
    'مختصون موثّقون وأسعار يومية واضحة وحالة حجز يمكنك متابعتها — تفاصيل تجعل الرعاية المنزلية أسهل في الإيجاد والتخطيط والإدارة.'
  ),
  '/stories': meta(
    'Patient and family stories | CareFlow',
    'قصص المرضى والعائلات | كيرفلو',
    'Illustrative stories that show the home care experience CareFlow is designed to create for patients and their families.',
    'قصص توضيحية تعرض تجربة الرعاية المنزلية التي صُممت كيرفلو لتقديمها للمرضى وعائلاتهم.'
  ),
  '/faqs': meta(
    'Home care FAQs — booking, pricing and payments | CareFlow',
    'الأسئلة الشائعة — الحجز والأسعار والدفع | كيرفلو',
    'Answers about booking a nurse, how daily pricing works, payments, changes and cancellations, and managing your CareFlow account.',
    'إجابات حول حجز ممرض وطريقة احتساب الأسعار اليومية والدفع والتعديل والإلغاء وإدارة حسابك في كيرفلو.'
  ),
  '/contact': meta(
    'Contact CareFlow',
    'تواصل مع كيرفلو',
    'Questions about home care, an existing booking, or joining CareFlow as a professional? Get in touch with our team.',
    'لديك سؤال عن الرعاية المنزلية أو حجز قائم أو الانضمام إلى كيرفلو كمختص؟ تواصل مع فريقنا.'
  ),
  '/resources': meta(
    'Home care health resources and guides | CareFlow',
    'موارد وأدلة صحية للرعاية المنزلية | كيرفلو',
    'Practical reading on home safety, recovery after hospital, and family caregiving. General information, not medical advice.',
    'قراءات عملية عن سلامة المنزل والتعافي بعد المستشفى ورعاية الأسرة. معلومات عامة وليست نصيحة طبية.'
  )
};

/**
 * Paths that must never be indexed (and are left out of the sitemap).
 * `/x` = the page and everything under it; `/x/` = only the pages under it (`/nurses` stays indexable).
 */
export const NOINDEX_PREFIXES = ['/account', '/checkout', '/book', '/sign-in', '/sign-up', '/forgot-password', '/legal/', '/nurses/', '/newsletter'];

export function isIndexable(path: string): boolean {
  return !NOINDEX_PREFIXES.some((p) => p.endsWith('/') ? path.startsWith(p) : path === p || path.startsWith(`${p}/`));
}

/** Keeps meta descriptions within what search results show (~160 chars), cut on a word boundary. */
export function clampDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '')}…`;
}

export const pick = (value: Localized, locale: Locale): string => value[locale] || value.en;

export const withBrand = (title: string, locale: Locale): string => `${title} | ${locale === 'ar' ? 'كيرفلو' : SITE_NAME}`;

export const absoluteUrl = (siteUrl: string, pathOrUrl: string): string =>
/^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${siteUrl.replace(/\/+$/, '')}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;

/* ------------------------------ structured data ------------------------------ */
type JsonLd = Record<string, unknown>;

/** Only facts the site can stand behind: name, URL and logo. No ratings, prices or addresses. */
export function organizationLd(siteUrl: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${absoluteUrl(siteUrl, '/')}#organization`,
    name: SITE_NAME,
    url: absoluteUrl(siteUrl, '/'),
    logo: absoluteUrl(siteUrl, '/favicon.svg')
  };
}

export function websiteLd(siteUrl: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: absoluteUrl(siteUrl, '/'),
    inLanguage: ['en', 'ar'],
    publisher: { '@id': `${absoluteUrl(siteUrl, '/')}#organization` }
  };
}

export function breadcrumbLd(siteUrl: string, items: {name: string;path: string;}[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(siteUrl, item.path)
    }))
  };
}

export function serviceLd(siteUrl: string, s: {name: string;description: string;path: string;image?: string;}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Home health care',
    name: s.name,
    description: s.description,
    url: absoluteUrl(siteUrl, s.path),
    ...(s.image ? { image: absoluteUrl(siteUrl, s.image) } : {}),
    provider: { '@id': `${absoluteUrl(siteUrl, '/')}#organization` }
  };
}

/** `path` = the article's public path in this language (e.g. `/ar/resources/…`). */
export function articleLd(siteUrl: string, a: Article, locale: Locale, path = `/resources/${a.slug}`): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pick(a.title, locale),
    description: clampDescription(pick(a.excerpt, locale)),
    image: absoluteUrl(siteUrl, a.cover),
    datePublished: a.date,
    inLanguage: locale,
    mainEntityOfPage: absoluteUrl(siteUrl, path),
    author: { '@type': 'Organization', name: a.author ? pick(a.author.name, locale) : SITE_NAME },
    publisher: { '@id': `${absoluteUrl(siteUrl, '/')}#organization` }
  };
}

/** FAQ markup with confirmed answers only: entries still marked `placeholder` are left out. */
export function faqLd(items: Faq[], locale: Locale): JsonLd | null {
  const confirmed = items.filter((f) => !f.placeholder);
  if (!confirmed.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: confirmed.map((f) => ({
      '@type': 'Question',
      name: pick(f.question, locale),
      acceptedAnswer: { '@type': 'Answer', text: pick(f.answer, locale) }
    }))
  };
}
