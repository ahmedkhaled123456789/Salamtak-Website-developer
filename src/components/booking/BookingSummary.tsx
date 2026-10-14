import { useI18n } from '../../contexts/I18nContext';
import { useQuote } from '../../hooks/useBookings';
import type { BookingDraft } from '../../types/booking';
import type { Nurse } from '../../types/nurse';
import type { CareService } from '../../types/service';
import { addDays } from '../../utils/format';
import { SampleNote } from '../ui/SampleNote';
import { Skeleton } from '../ui/Skeleton';

interface BookingSummaryProps {
  draft: BookingDraft;
  service?: CareService;
  nurse?: Nurse;
  detailed?: boolean;
}

/** Price figures always come from the quote endpoint, never computed here. */
export function BookingSummary({ draft, service, nurse, detailed = false }: BookingSummaryProps) {
  const { t, l, money, date, daysLabel } = useI18n();
  const quote = useQuote(draft);
  const row = 'flex justify-between gap-4 py-2.5 text-[15px]';
  const gender = draft.genderPreference === 'any' ? t('common.noPreference') : t(`common.${draft.genderPreference}`);

  return (
    <div className="rounded-3xl border border-line bg-white p-6">
      <p className="text-sm font-semibold text-ink">{t('serviceDetail.summary')}</p>
      {service &&
      <div className="mt-4 flex items-center gap-3">
          <img src={service.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
          <p className="font-bold text-ink">{l(service.title)}</p>
        </div>
      }
      <dl className="mt-3 divide-y divide-line">
        {draft.startDate &&
        <div className={row}>
            <dt className="text-muted">{t('account.schedule')}</dt>
            <dd className="text-end font-medium">
              {date(draft.startDate, { day: 'numeric', month: 'short' })} – {date(addDays(draft.startDate, draft.days - 1), { day: 'numeric', month: 'short' })}
            </dd>
          </div>
        }
        <div className={row}>
          <dt className="text-muted">{t('bookingPreview.duration')}</dt>
          <dd className="font-medium">{daysLabel(draft.days)}</dd>
        </div>
        <div className={row}>
          <dt className="text-muted">{t('bookingPreview.preference')}</dt>
          <dd className="font-medium">{gender}</dd>
        </div>
        {nurse &&
        <div className={row}>
            <dt className="text-muted">{t('booking.steps.nurse')}</dt>
            <dd className="font-medium">{l(nurse.name)}</dd>
          </div>
        }
        {detailed && draft.address &&
        <div className={row}>
            <dt className="text-muted">{t('account.address')}</dt>
            <dd className="max-w-[60%] text-end font-medium">{draft.address}</dd>
          </div>
        }
      </dl>
      {service &&
      <div className="mt-3 border-t-2 border-ink pt-4">
          {quote.isLoading || !quote.data ?
        <Skeleton className="h-16" /> :

        <dl className="space-y-2 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-muted">
                  {money(quote.data.dailyRate, quote.data.currency)} × {daysLabel(quote.data.days)}
                </dt>
                <dd className="font-semibold tabular-nums">{money(quote.data.subtotal, quote.data.currency)}</dd>
              </div>
              {detailed &&
          <>
                  <div className="flex justify-between">
                    <dt className="text-muted">{t('booking.fees')}</dt>
                    <dd className="text-muted">{quote.data.fees === null ? t('booking.atCheckout') : money(quote.data.fees, quote.data.currency)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">{t('booking.discount')}</dt>
                    <dd className="text-muted">{quote.data.discount === null ? t('booking.atCheckout') : money(quote.data.discount, quote.data.currency)}</dd>
                  </div>
                </>
          }
              <div className="flex items-end justify-between pt-2">
                <dt className="font-semibold text-ink">{t('bookingPreview.estimatedTotal')}</dt>
                <dd className="font-display text-3xl tabular-nums text-brand-dark">{money(quote.data.estimatedTotal, quote.data.currency)}</dd>
              </div>
            </dl>
        }
          {quote.data?.isSample && <SampleNote className="mt-4">{t('booking.sampleQuote')}</SampleNote>}
        </div>
      }
    </div>);

}