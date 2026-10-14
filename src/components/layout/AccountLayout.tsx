import { Suspense } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CalendarRangeIcon, HomeIcon, LayoutDashboardIcon, LogOutIcon, PlusIcon, UserRoundIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n, type TranslationKey } from '../../contexts/I18nContext';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { DemoModeBadge } from './DemoModeBadge';
import { LanguageSwitch } from './LanguageSwitch';
import { RouteFallback } from './RouteFallback';
import { withBrand } from '../../seo/meta';
import { usePageMeta } from '../../seo/usePageMeta';

const links: {to: string;key: TranslationKey;icon: typeof HomeIcon;end?: boolean;}[] = [
{ to: '/account', key: 'nav.dashboard', icon: LayoutDashboardIcon, end: true },
{ to: '/account/bookings', key: 'nav.bookings', icon: CalendarRangeIcon },
{ to: '/account/profile', key: 'nav.profile', icon: UserRoundIcon }];


export function AccountLayout() {
  const { t, locale } = useI18n();
  usePageMeta({ title: withBrand(t('nav.account'), locale), noindex: true });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const initials = `${user?.firstName[0] ?? ''}${user?.lastName[0] ?? ''}`;

  const logout = () => {
    signOut();
    navigate('/', { replace: true });
  };

  const item = ({ isActive }: {isActive: boolean;}) =>
  cn(
    'flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors duration-150',
    isActive ? 'bg-mint text-brand-dark' : 'text-ink hover:bg-ivory'
  );

  return (
    <div className="min-h-screen w-full bg-ivory">
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8">
          <Logo />
          <div className="flex items-center gap-2">
            <LanguageSwitch className="hidden sm:inline-flex" />
            <Button to="/book" size="sm" iconStart={<PlusIcon className="h-4 w-4" aria-hidden />}>
              {t('common.bookCare')}
            </Button>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white" aria-label={user?.email}>
              {initials}
            </span>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <nav aria-label={t('account.menuTitle')} className="lg:sticky lg:top-24">
            <p className="mb-3 hidden px-3 text-[13px] font-semibold text-muted lg:block">{t('account.menuTitle')}</p>
            <ul className="scrollbar-none flex gap-1 overflow-x-auto lg:flex-col">
              {links.map(({ to, key, icon: Icon, end }) =>
              <li key={to}>
                  <NavLink to={to} end={end} className={item}>
                    <Icon className="h-4 w-4" aria-hidden />
                    {t(key)}
                  </NavLink>
                </li>
              )}
              <li className="lg:mt-4 lg:border-t lg:border-line lg:pt-4">
                <NavLink to="/" className={item({ isActive: false })}>
                  <HomeIcon className="h-4 w-4" aria-hidden />
                  {t('nav.home')}
                </NavLink>
              </li>
              <li>
                <button type="button" onClick={logout} className={cn(item({ isActive: false }), 'w-full')}>
                  <LogOutIcon className="h-4 w-4" aria-hidden />
                  {t('common.signOut')}
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        <main id="main" className="min-w-0">
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <DemoModeBadge />
    </div>);

}