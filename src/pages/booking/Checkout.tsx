import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { m, useReducedMotion } from 'framer-motion';
import { CheckCircle2Icon, Clock3Icon, FlaskConicalIcon, Loader2Icon, XCircleIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Container } from '../../components/ui/Container';
import { Skeleton } from '../../components/ui/Skeleton';
import { StateMessage } from '../../components/ui/StateMessage';
import { useI18n } from '../../contexts/I18nContext';
import { useBooking, useStartPayment } from '../../hooks/useBookings';
import { useCatalogData } from '../../hooks/useCatalogData';
import type { PaymentSimulation, PaymentStatus } from '../../types/booking';
import { isDemoMode } from '../../utils/config';
import { cn } from '../../utils/cn';
import { withBrand } from '../../seo/meta';
import { usePageMeta } from '../../seo/usePageMeta';

const visuals: Record<PaymentStatus, {icon: typeof Clock3Icon;ring: string;}> = {
  pending: { icon: Clock3Icon, ring: 'bg-[#FDF3DC] text-[#7A5310]' },
  processing: { icon: Loader2Icon, ring: 'bg-mint text-brand' },
  succeeded: { icon: CheckCircle2Icon, ring: 'bg-mint text-brand' },
  failed: { icon: XCircleIcon, ring: 'bg-coral-soft text-coral' }
};

/** Every state shown here reflects the booking as returned by the backend. */
export function CheckoutPage() {
  const { bookingId = '' } = useParams();
  const { t, l, money, date, daysLabel, locale } = useI18n();
  usePageMeta({ title: withBrand(t('payment.title'), locale), noindex: true });
  const reduce = useReducedMotion();
  const { data: booking, isLoading, isError } = useBooking(bookingId);
  const pay = useStartPayment();
  const { serviceById, nurseById } = useCatalogData();
  const [simulate, setSimulate] = useState<PaymentSimulation>('success');

  if (isLoading) {
    return (
      <Container className="min-h-[100svh] max-w-2xl py-16">
        <Skeleton className="mx-auto h-16 w-16 rounded-full" />
        <Skeleton className="mx-auto mt-6 h-10 w-2/3" />
        <Skeleton className="mt-10 h-56 rounded-3xl" />
      </Container>);

  }
  if (isError || !booking) {
    return (
      <Container className="py-20">
        <StateMessage kind="error" title={t('account.notFound')} action={<Button to="/account/bookings">{t('nav.bookings')}</Button>} />
      </Container>);

  }

  const status = booking.payment.status;
  const { icon: Icon, ring } = visuals[status];
  const service = serviceById(booking.serviceId);
  const nurse = nurseById(booking.nurseId);
  const canPay = booking.permissions.canPay && !pay.isPending;
  const amount = money(booking.payment.amount, booking.payment.currency);

  return (
    <Container className="max-w-2xl py-14 lg:py-20">
      <div className="text-center" aria-live="polite">
        <m.span
          key={status}
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className={cn('mx-auto flex h-16 w-16 items-center justify-center rounded-full', ring)}>
          
          <Icon className={cn('h-8 w-8', status === 'processing' && 'animate-spin')} aria-hidden />
        </m.span>
        <p className="mt-6 text-sm font-semibold text-muted">{t('payment.title')}</p>
        <h1 className="mt-1 font-display text-[36px] font-medium leading-tight text-ink sm:text-[44px]">{t(`payment.${status}`)}</h1>
        <p className="mx-auto mt-3 max-w-md text-[16px] text-muted">{t(`payment.${status}Body`)}</p>
      </div>

      <div className="mt-10 rounded-3xl border border-line bg-white p-6">
        <div className="flex items-center gap-4">
          {service && <img src={service.image} alt="" className="h-16 w-16 rounded-xl object-cover" />}
          <div className="min-w-0 flex-1">
            <p className="font-bold text-ink">{service ? l(service.title) : booking.serviceId}</p>
            <p className="text-[13px] text-muted">
              {date(booking.startDate)} · {daysLabel(booking.days)} {nurse && <>· {l(nurse.name)}</>}
            </p>
          </div>
        </div>
        <dl className="mt-5 space-y-2 border-t border-line pt-5 text-[15px]">
          <div className="flex justify-between">
            <dt className="text-muted">{t('account.reference')}</dt>
            <dd className="font-semibold">{booking.reference}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">{t('account.amount')}</dt>
            <dd className="font-semibold tabular-nums">{amount}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">{t('account.status')}</dt>
            <dd>{t(`status.${booking.status}`)}</dd>
          </div>
        </dl>
      </div>

      {canPay &&
      <div className="mt-6 rounded-3xl border border-line bg-white p-6">
          {isDemoMode &&
        <fieldset>
              <legend className="flex items-center gap-2 text-sm font-semibold text-ink">
                <FlaskConicalIcon className="h-4 w-4 text-coral" aria-hidden />
                {t('payment.simulate')}
              </legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {(['success', 'failure'] as const).map((opt) =>
            <label
              key={opt}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-[15px] font-medium',
                simulate === opt ? 'border-brand bg-mint/40' : 'border-line'
              )}>
              
                    <input type="radio" name="simulate" checked={simulate === opt} onChange={() => setSimulate(opt)} className="h-4 w-4 accent-brand" />
                    {opt === 'success' ? t('payment.simulateSuccess') : t('payment.simulateFailure')}
                  </label>
            )}
              </div>
            </fieldset>
        }
          {pay.isError &&
        <p role="alert" className="mt-4 rounded-xl bg-coral-soft p-3 text-sm text-[#7A2E19]">
              {t('common.errorBody')}
            </p>
        }
          <Button size="lg" className="mt-5 w-full" loading={pay.isPending} onClick={() => pay.mutate({ id: booking.id, simulate })}>
            {status === 'failed' ? t('payment.retry') : t('payment.pay', { amount })}
          </Button>
        </div>
      }

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to={`/account/bookings/${booking.id}`} variant="secondary">
          {t('payment.viewBooking')}
        </Button>
        {status === 'succeeded' && <Button to="/account">{t('payment.goDashboard')}</Button>}
      </div>
    </Container>);

}