import React from 'react';
import { NavLink } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, m } from 'framer-motion';
import { MenuIcon, XIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n, type TranslationKey } from '../../contexts/I18nContext';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { LanguageSwitch } from './LanguageSwitch';

const links: {to: string;key: TranslationKey;}[] = [
{ to: '/', key: 'nav.home' },
{ to: '/services', key: 'nav.services' },
{ to: '/nurses', key: 'nav.findNurse' },
{ to: '/how-it-works', key: 'nav.howItWorks' },
{ to: '/why-careflow', key: 'nav.why' },
{ to: '/about', key: 'nav.about' },
{ to: '/stories', key: 'nav.reviews' },
{ to: '/resources', key: 'nav.resources' },
{ to: '/faqs', key: 'nav.faqs' },
{ to: '/contact', key: 'nav.contact' }];


export function MobileMenu() {
  const { t, dir } = useI18n();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = React.useState(false);
  const offset = dir === 'rtl' ? '-100%' : '100%';

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink" aria-label={t('common.menu')}>
        <MenuIcon className="h-5 w-5" aria-hidden />
      </Dialog.Trigger>
      <AnimatePresence>
        {open &&
        <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <m.div className="fixed inset-0 z-50 bg-ink/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
            </Dialog.Overlay>
            <Dialog.Content asChild aria-describedby={undefined}>
              <m.div
              dir={dir}
              className="fixed inset-y-0 end-0 z-50 flex w-full max-w-[400px] flex-col bg-ivory shadow-lift"
              initial={{ x: offset }}
              animate={{ x: 0 }}
              exit={{ x: offset }}
              transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}>
              
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <Dialog.Title className="sr-only">{t('common.menu')}</Dialog.Title>
                  <Logo />
                  <Dialog.Close className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-mint/60" aria-label={t('common.close')}>
                    <XIcon className="h-5 w-5" aria-hidden />
                  </Dialog.Close>
                </div>
                <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label={t('common.menu')}>
                  {links.map((link) =>
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                  cn('block rounded-xl px-4 py-3 text-[17px] font-medium', isActive ? 'bg-mint text-brand-dark' : 'text-ink hover:bg-white')
                  }>
                  
                      {t(link.key)}
                    </NavLink>
                )}
                </nav>
                <div className="space-y-3 border-t border-line p-5">
                  <LanguageSwitch className="w-full justify-center border border-line bg-white" />
                  <div className="grid grid-cols-2 gap-3" onClick={() => setOpen(false)}>
                    <Button to={isAuthenticated ? '/account' : '/sign-in'} variant="secondary">
                      {isAuthenticated ? t('nav.account') : t('common.signIn')}
                    </Button>
                    <Button to="/book">{t('common.bookCare')}</Button>
                  </div>
                </div>
              </m.div>
            </Dialog.Content>
          </Dialog.Portal>
        }
      </AnimatePresence>
    </Dialog.Root>);

}