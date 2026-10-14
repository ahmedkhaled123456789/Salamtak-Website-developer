import { CheckIcon } from 'lucide-react';
import { useI18n, type TranslationKey } from '../../contexts/I18nContext';
import { useAllServices } from '../../hooks/useCatalog';
import { cn } from '../../utils/cn';
import { Skeleton } from '../ui/Skeleton';
import { FieldError } from './FieldError';

interface StepServiceProps {
  value?: string;
  onSelect: (serviceId: string, minDays: number, maxDays: number) => void;
  error?: {key: TranslationKey;};
}

export function StepService({ value, onSelect, error }: StepServiceProps) {
  const { t, l, money } = useI18n();
  const { data, isLoading } = useAllServices();
  return (
    <fieldset>
      <legend className="font-display text-[30px] font-medium text-ink">{t('booking.serviceTitle')}</legend>
      <FieldError error={error} />
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {isLoading ?
        Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />) :
        (data ?? []).map((s) => {
          const selected = value === s.id;
          return (
            <label
              key={s.id}
              className={cn(
                'relative flex cursor-pointer items-center gap-4 rounded-2xl border bg-white p-3 transition-[border-color,box-shadow] duration-150',
                selected ? 'border-brand shadow-[0_0_0_3px_rgba(15,118,110,0.12)]' : 'border-line hover:border-brand/40'
              )}>
              
                  <input type="radio" name="service" className="sr-only" checked={selected} onChange={() => onSelect(s.id, s.minDays, s.maxDays)} />
                  <img src={s.image} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" loading="lazy" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-ink">{l(s.title)}</span>
                    {s.dailyRateSample !== null &&
                <span className="block text-[13px] text-muted">
                        {money(s.dailyRateSample)} {t('common.perDay')}
                      </span>
                }
                  </span>
                  <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full border', selected ? 'border-brand bg-brand text-white' : 'border-line')}>
                    {selected && <CheckIcon className="h-3.5 w-3.5" aria-hidden />}
                  </span>
                </label>);

        })}
      </div>
    </fieldset>);

}