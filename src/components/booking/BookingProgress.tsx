import { m } from 'framer-motion';
import { CheckIcon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { BOOKING_STEPS } from '../../hooks/useBookingFlow';
import { cn } from '../../utils/cn';

export function BookingProgress({ step, onJump }: {step: number;onJump: (i: number) => void;}) {
  const { t, num } = useI18n();
  const pct = (step + 1) / BOOKING_STEPS.length * 100;
  return (
    <nav aria-label={t('booking.title')}>
      <div className="md:hidden">
        <p className="text-sm font-semibold text-ink">
          {t(`booking.steps.${BOOKING_STEPS[step]}`)} <span className="font-normal text-muted">· {num(step + 1)}/{num(BOOKING_STEPS.length)}</span>
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
          <m.div className="h-full rounded-full bg-brand" initial={false} animate={{ width: `${pct}%` }} transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }} />
        </div>
      </div>
      <ol className="hidden items-center gap-2 md:flex">
        {BOOKING_STEPS.map((id, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li key={id} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => onJump(i)}
                disabled={!done}
                aria-current={current ? 'step' : undefined}
                className={cn('flex items-center gap-2 whitespace-nowrap text-sm font-semibold', current ? 'text-ink' : done ? 'text-brand hover:text-brand-dark' : 'text-muted')}>
                
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs transition-colors duration-200',
                    done ? 'bg-brand text-white' : current ? 'border-2 border-brand text-brand' : 'border border-line bg-white text-muted'
                  )}>
                  
                  {done ? <CheckIcon className="h-3.5 w-3.5" aria-hidden /> : num(i + 1)}
                </span>
                {t(`booking.steps.${id}`)}
              </button>
              {i < BOOKING_STEPS.length - 1 && <span aria-hidden className={cn('h-px flex-1', done ? 'bg-brand' : 'bg-line')} />}
            </li>);

        })}
      </ol>
    </nav>);

}