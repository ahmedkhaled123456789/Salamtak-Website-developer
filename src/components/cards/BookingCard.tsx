import { Link } from 'react-router-dom';
import { ArrowRightIcon, CalendarIcon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { useCatalogData } from '../../hooks/useCatalogData';
import type { Booking } from '../../types/booking';
import { bookingStatusTone } from '../../utils/bookings';
import { cn } from '../../utils/cn';
import { Badge } from '../ui/Badge';

export function BookingCard({ booking, emphasis = false }: {booking: Booking;emphasis?: boolean;}) {
  const { t, l, date, money, daysLabel } = useI18n();
  const { serviceById, nurseById } = useCatalogData();
  const service = serviceById(booking.serviceId);
  const nurse = nurseById(booking.nurseId);
  const range = `${date(booking.startDate, { day: 'numeric', month: 'short' })} – ${date(booking.endDate)}`;

  return (
    <article className={cn('group relative flex gap-4 rounded-2xl border border-line bg-white p-4 transition-shadow duration-200 hover:shadow-soft', emphasis && 'sm:p-5')}>
      {service && <img src={service.image} alt="" className={cn('shrink-0 rounded-xl object-cover', emphasis ? 'h-24 w-24 sm:h-28 sm:w-32' : 'h-16 w-16')} loading="lazy" />}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={bookingStatusTone[booking.status]}>{t(`status.${booking.status}`)}</Badge>
          <span className="text-xs text-muted">{booking.reference}</span>
        </div>
        <h3 className={cn('mt-1.5 truncate font-bold text-ink', emphasis ? 'text-lg' : 'text-[15px]')}>
          <Link to={`/account/bookings/${booking.id}`} className="after:absolute after:inset-0 after:rounded-2xl">
            {service ? l(service.title) : booking.serviceId}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-[13px] text-muted">
          <CalendarIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="truncate">
            {range} · {daysLabel(booking.days)}
          </span>
        </p>
        {emphasis && nurse &&
        <p className="mt-2 flex items-center gap-2 text-[13px] text-ink">
            <img src={nurse.portrait} alt="" className="h-6 w-6 rounded-full object-cover object-top" />
            {l(nurse.name)}
          </p>
        }
      </div>
      <div className="hidden shrink-0 flex-col items-end justify-between sm:flex">
        <span className="text-[15px] font-semibold tabular-nums text-ink">{money(booking.payment.amount, booking.payment.currency)}</span>
        <ArrowRightIcon className="h-4 w-4 text-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-brand rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden />
      </div>
    </article>);

}