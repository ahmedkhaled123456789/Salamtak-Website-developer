import { CheckIcon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import type { BookingTimelineEntry } from '../../types/booking';
import { cn } from '../../utils/cn';

export function StatusTimeline({ entries }: {entries: BookingTimelineEntry[];}) {
  const { t, date } = useI18n();
  return (
    <ol className="relative space-y-6">
      {entries.map((e, i) => {
        const last = i === entries.length - 1;
        return (
          <li key={`${e.status}-${e.at}`} className="relative flex gap-4">
            {!last && <span aria-hidden className="absolute start-[13px] top-7 h-[calc(100%+4px)] w-px bg-line" />}
            <span
              className={cn(
                'relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                last ? e.status === 'cancelled' ? 'bg-coral text-white' : 'bg-brand text-white' : 'bg-mint text-brand'
              )}>
              
              <CheckIcon className="h-3.5 w-3.5" aria-hidden />
            </span>
            <div>
              <p className="text-[15px] font-semibold text-ink">{t(`status.${e.status}`)}</p>
              <p className="text-[13px] text-muted">
                <time dateTime={e.at}>{date(e.at, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</time>
              </p>
            </div>
          </li>);

      })}
    </ol>);

}