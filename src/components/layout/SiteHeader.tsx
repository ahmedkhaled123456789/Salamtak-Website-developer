import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UserRoundIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n, type TranslationKey } from '../../contexts/I18nContext';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { LanguageSwitch } from './LanguageSwitch';
import { MobileMenu } from './MobileMenu';
import { ServicesMenu } from './ServicesMenu';

const primary: {to: string;key: TranslationKey;}[] = [
{ to: '/nurses', key: 'nav.findNurse' },
{ to: '/how-it-works', key: 'nav.howItWorks' },
{ to: '/about', key: 'nav.about' },
{ to: '/resources', key: 'nav.resources' }];


export function SiteHeader() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkClass = ({ isActive }: {isActive: boolean;}) =>
  cn('inline-flex h-9 items-center rounded-full px-3 text-[15px] font-medium transition-colors duration-150', isActive ? 'text-brand' : 'text-ink hover:text-brand');

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-ivory/85 backdrop-blur-md transition-[border-color,box-shadow] duration-200',
        scrolled ? 'border-line shadow-[0_8px_24px_-20px_rgba(23,43,42,0.35)]' : 'border-transparent'
      )}>
      
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <Logo />
        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
          <NavLink to="/" end className={linkClass}>
            {t('nav.home')}
          </NavLink>
          <ServicesMenu />
          {primary.map((link) =>
          <NavLink key={link.to} to={link.to} className={linkClass}>
              {t(link.key)}
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitch className="hidden md:inline-flex" />
          <Button
            to={isAuthenticated ? '/account' : '/sign-in'}
            variant="ghost"
            size="sm"
            className="hidden md:inline-flex"
            iconStart={isAuthenticated ? <UserRoundIcon className="h-4 w-4" aria-hidden /> : undefined}>
            
            {isAuthenticated ? t('nav.account') : t('common.signIn')}
          </Button>
          <Button to="/book" size="sm" className="hidden sm:inline-flex">
            {t('common.bookCare')}
          </Button>
          <div className="xl:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>);

}