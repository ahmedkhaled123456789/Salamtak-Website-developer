import { MinusIcon, PlusIcon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { cn } from '../../utils/cn';

interface DaysStepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  id?: string;
  className?: string;
}

export function DaysStepper({ value, min, max, onChange, id, className }: DaysStepperProps) {
  const { t, daysLabel } = useI18n();
  const btn =
  'flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition-[background-color,border-color,transform] duration-150 ease-out hover:border-brand/40 hover:bg-mint/50 active:scale-95 disabled:opacity-40 disabled:pointer-events-none';
  return (
    <div className={cn('flex items-center gap-3', className)} role="group" aria-labelledby={id}>
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={t('bookingPreview.decrease')}>
        <MinusIcon className="h-4 w-4" aria-hidden />
      </button>
      <output aria-live="polite" className="min-w-[92px] text-center text-lg font-semibold tabular-nums text-ink">
        {daysLabel(value)}
      </output>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={t('bookingPreview.increase')}>
        <PlusIcon className="h-4 w-4" aria-hidden />
      </button>
    </div>);

}