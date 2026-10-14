import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, m } from 'framer-motion';
import { SlidersHorizontalIcon, XIcon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { Button } from '../ui/Button';

interface FilterDrawerProps {
  children: React.ReactNode;
  resultCount: number;
  activeCount: number;
}

/** Mobile bottom sheet for nurse filters. */
export function FilterDrawer({ children, resultCount, activeCount }: FilterDrawerProps) {
  const { t, dir } = useI18n();
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="secondary" iconStart={<SlidersHorizontalIcon className="h-4 w-4" aria-hidden />}>
          {t('common.showFilters')}
          {activeCount > 0 && <span className="ms-1 rounded-full bg-brand px-1.5 text-xs text-white">{activeCount}</span>}
        </Button>
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
              className="fixed inset-x-0 bottom-0 z-50 flex max-h-[88vh] flex-col rounded-t-[28px] bg-white"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}>
              
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <Dialog.Title className="text-lg font-bold text-ink">{t('common.showFilters')}</Dialog.Title>
                  <Dialog.Close className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-ivory" aria-label={t('common.close')}>
                    <XIcon className="h-5 w-5" aria-hidden />
                  </Dialog.Close>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-5">{children}</div>
                <div className="border-t border-line p-4">
                  <Button className="w-full" size="lg" onClick={() => setOpen(false)}>
                    {t('nursesPage.apply')} ({resultCount})
                  </Button>
                </div>
              </m.div>
            </Dialog.Content>
          </Dialog.Portal>
        }
      </AnimatePresence>
    </Dialog.Root>);

}