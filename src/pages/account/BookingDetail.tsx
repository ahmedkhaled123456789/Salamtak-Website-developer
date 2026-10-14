import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, CalendarIcon, LanguagesIcon, LockIcon, MapPinIcon, NotebookPenIcon } from 'lucide-react';
import { CancelBookingDialog } from '../../components/account/CancelBookingDialog';
import { StatusTimeline } from '../../components/account/StatusTimeline';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { StateMessage } from '../../components/ui/StateMessage';
import { useI18n } from '../../contexts/I18nContext';
import { useBooking } from '../../hooks/useBookings';
import { useCatalogData } from '../../hooks/useCatalogData';
import { bookingStatusTone, paymentStatusTone } from '../../utils/bookings';

export function BookingDetailPage() {
  const { id = '' } = useParams();
  const { t, l, date, money, daysLabel } = useI18n();
  const { data: booking, isLoading, isError } = useBooking(id);
  const { serviceById, nurseById } = useCatalogData();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>);

  }
  if (isError || !booking) {
    return <StateMessage kind="error" title={t('account.notFound')} action={<Button to="/account/bookings">{t('nav.bookings')}</Button>} />;
  }

  const service = serviceById(booking.serviceId);
  const nurse = nurseById(booking.nurseId);
  const card = 'rounded-3xl border border-line bg-white p-6';
  const hasActions = booking.permissions.canPay || booking.permissions.canCancel;

  return (
    <div>
      <Link to="/account/bookings" className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark">
        <ArrowLeftIcon className="h-4 w-4 rtl:rotate-180" aria-hidden />
        {t('nav.bookings')}
      </Link>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-[32px] font-medium text-ink sm:text-[40px]">{service ? l(service.title) : booking.serviceId}</h1>
        <Badge tone={bookingStatusTone[booking.status]}>{t(`status.${booking.status}`)}</Badge>
      </div>
      <p className="mt-1 text-sm text-muted">
        {t('account.reference')}: <span className="font-semibold text-ink">{booking.reference}</span>
      </p>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className={card} aria-labelledby="schedule-h">
            <div className="flex gap-5">
              {service && <img src={service.image} alt="" className="hidden h-24 w-28 shrink-0 rounded-2xl object-cover sm:block" />}
              <div className="flex-1">
                <h2 id="schedule-h" className="text-lg font-bold text-ink">{t('account.schedule')}</h2>
                <dl className="mt-3 grid gap-4 text-[15px] sm:grid-cols-2">
                  <div className="flex gap-3">
                    <CalendarIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                    <div>
                      <dt className="sr-only">{t('account.schedule')}</dt>
                      <dd className="font-semibold text-ink">{date(booking.startDate)} – {date(booking.endDate)}</dd>
                      <dd className="text-muted">{daysLabel(booking.days)}</dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                    <div>
                      <dt className="text-muted">{t('account.address')}</dt>
                      <dd className="font-semibold text-ink">{booking.address || '—'}</dd>
                    </div>
                  </div>
                  {booking.notes &&
                  <div className="flex gap-3 sm:col-span-2">
                      <NotebookPenIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                      <div>
                        <dt className="text-muted">{t('account.notes')}</dt>
                        <dd className="text-ink">{booking.notes}</dd>
                      </div>
                    </div>
                  }
                </dl>
              </div>
            </div>
          </section>

          {nurse &&
          <section className={card} aria-labelledby="nurse-h">
              <h2 id="nurse-h" className="text-lg font-bold text-ink">{t('account.yourNurse')}</h2>
              <div className="mt-4 flex items-center gap-4">
                <img src={nurse.portrait} alt="" className="h-16 w-16 rounded-2xl object-cover object-top" />
                <div className="flex-1">
                  <p className="font-bold text-ink">{l(nurse.name)}</p>
                  <p className="text-sm text-brand">{l(nurse.role)}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[13px] text-muted">
                    <LanguagesIcon className="h-3.5 w-3.5" aria-hidden />
                    {nurse.languages.map(l).join(' · ')}
                  </p>
                </div>
                <Button to={`/nurses/${nurse.slug}`} variant="secondary" size="sm" className="hidden sm:inline-flex">
                  {t('common.viewProfile')}
                </Button>
              </div>
              <p className="mt-4 flex items-start gap-2 text-[13px] text-muted">
                <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                {t('nurseProfile.privacy')}
              </p>
            </section>
          }

          <section className={card} aria-labelledby="timeline-h">
            <h2 id="timeline-h" className="mb-5 text-lg font-bold text-ink">{t('account.timeline')}</h2>
            <StatusTimeline entries={booking.timeline} />
          </section>
        </div>

        <div className="space-y-6">
          <section className={card} aria-labelledby="pay-h">
            <h2 id="pay-h" className="text-lg font-bold text-ink">{t('account.paymentSummary')}</h2>
            <dl className="mt-4 space-y-3 text-[15px]">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">{t('account.amount')}</dt>
                <dd className="font-semibold tabular-nums">{money(booking.payment.amount, booking.payment.currency)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">{t('account.method')}</dt>
                <dd className="font-semibold">{booking.payment.method ?? '—'}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">{t('payment.title')}</dt>
                <dd><Badge tone={paymentStatusTone[booking.payment.status]}>{t(`payment.${booking.payment.status}`)}</Badge></dd>
              </div>
            </dl>
          </section>
          <section className={card} aria-labelledby="actions-h">
            <h2 id="actions-h" className="text-lg font-bold text-ink">{t('account.actions')}</h2>
            <div className="mt-4 space-y-3">
              {booking.permissions.canPay &&
              <Button to={`/checkout/${booking.id}`} className="w-full">
                  {t('account.payNow')}
                </Button>
              }
              {booking.permissions.canCancel && <CancelBookingDialog bookingId={booking.id} />}
              {!hasActions && <p className="text-sm text-muted">{t('account.noActions')}</p>}
            </div>
          </section>
        </div>
      </div>
    </div>);

}