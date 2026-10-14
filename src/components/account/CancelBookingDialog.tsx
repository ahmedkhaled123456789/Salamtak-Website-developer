import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, m } from 'framer-motion';
import { useI18n } from '../../contexts/I18nContext';
import { useCancelBooking } from '../../hooks/useBookings';
import { Button } from '../ui/Button';

export function CancelBookingDialog({ bookingId }: {bookingId: string;}) {
  const { t, dir } = useI18n();
  const [open, setOpen] = useState(false);
  const cancel = useCancelBooking();

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !cancel.isPending && setOpen(v)}>
      <Dialog.Trigger asChild>
        <Button variant="secondary" className="w-full text-[#9A3B22] hover:border-coral/50 hover:text-[#7A2E19]">
          {t('account.cancelBooking')}
        </Button>
      </Dialog.Trigger>
      <AnimatePresence>
        {open &&
        <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <m.div className="fixed inset-0 z-50 bg-ink/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} />
            </Dialog.Overlay>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
              <Dialog.Content asChild>
                <m.div
                dir={dir}
                className="w-full max-w-md rounded-3xl bg-white p-7 shadow-lift"
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
                
                  <Dialog.Title className="font-display text-2xl text-ink">{t('account.cancelConfirm')}</Dialog.Title>
                  <Dialog.Description className="mt-2 text-[15px] leading-relaxed text-muted">{t('account.cancelBody')}</Dialog.Description>
                  {cancel.isError &&
                <p role="alert" className="mt-4 rounded-xl bg-coral-soft p-3 text-sm text-[#7A2E19]">
                      {t('common.errorBody')}
                    </p>
                }
                  <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Dialog.Close asChild>
                      <Button variant="secondary" disabled={cancel.isPending}>
                        {t('account.keep')}
                      </Button>
                    </Dialog.Close>
                    <Button
                    className="bg-coral hover:bg-[#B9553A]"
                    loading={cancel.isPending}
                    onClick={() => cancel.mutate(bookingId, { onSuccess: () => setOpen(false) })}>
                    
                      {cancel.isPending ? t('account.cancelling') : t('account.cancelBooking')}
                    </Button>
                  </div>
                </m.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        }
      </AnimatePresence>
    </Dialog.Root>);

}