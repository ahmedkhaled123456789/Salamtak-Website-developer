import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { m, useReducedMotion } from 'framer-motion';
import { useI18n } from '../../contexts/I18nContext';
import { AnnouncementBar } from './AnnouncementBar';
import { DemoModeBadge } from './DemoModeBadge';
import { RouteFallback } from './RouteFallback';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';
import { isHydrating } from '../../utils/hydration';

export function PublicLayout() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  return (
    <div className="flex min-h-screen w-full flex-col bg-ivory">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow-lift">
        {t('common.skipToContent')}
      </a>
      <AnnouncementBar />
      <SiteHeader />
      <m.main
        id="main"
        key={pathname}
        className="flex-1"
        initial={reduce || isHydrating() ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
        
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </m.main>
      <SiteFooter />
      <DemoModeBadge />
    </div>);

}