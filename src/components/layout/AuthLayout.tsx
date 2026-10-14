import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useI18n, type TranslationKey } from '../../contexts/I18nContext';
import { images } from '../../data/images';
import { withBrand } from '../../seo/meta';
import { usePageMeta } from '../../seo/usePageMeta';
import { Logo } from '../ui/Logo';
import { SmartImage } from '../ui/SmartImage';
import { DemoModeBadge } from './DemoModeBadge';
import { LanguageSwitch } from './LanguageSwitch';
import { RouteFallback } from './RouteFallback';

const authTitles: Record<string, TranslationKey> = {
  '/sign-up': 'auth.signUpTitle',
  '/forgot-password': 'auth.forgotTitle'
};

export function AuthLayout() {
  const { t, l, locale } = useI18n();
  const { pathname } = useLocation();
  usePageMeta({ title: withBrand(t(authTitles[pathname] ?? 'auth.signInTitle'), locale), noindex: true });
  return (
    <div className="grid min-h-screen w-full bg-ivory lg:grid-cols-[1fr_minmax(0,560px)] xl:grid-cols-[1fr_640px]">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo />
          <LanguageSwitch />
        </div>
        <main id="main" className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-[420px]">
            <Suspense fallback={<RouteFallback />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
      <aside className="relative hidden p-4 lg:block">
        <SmartImage
          src={images.auth}
          alt={l({ en: 'Nurse and older woman looking out of a bright window together', ar: 'ممرضة وسيدة مسنّة تنظران معاً من نافذة مشرقة' })}
          priority
          className="h-full rounded-[32px]" />
        
        <div className="absolute inset-x-10 bottom-10 rounded-3xl bg-white/95 p-7 backdrop-blur">
          <p className="font-display text-[30px] leading-tight text-ink">{t('auth.side')}</p>
          <p className="mt-2 text-[15px] text-muted">{t('auth.sideBody')}</p>
        </div>
      </aside>
      <DemoModeBadge />
    </div>);

}