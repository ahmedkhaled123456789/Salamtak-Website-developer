import { useI18n, type TranslationKey } from '../../contexts/I18nContext';
import type { CareService } from '../../types/service';
import { todayIso } from '../../utils/format';
import { controlClass, labelClass } from '../../utils/styles';
import { DaysStepper } from '../ui/DaysStepper';
import { FieldError } from './FieldError';

type Err = {key: TranslationKey;vars?: Record<string, number>;};

interface StepScheduleProps {
  service: CareService;
  startDate?: string;
  days: number;
  onChange: (patch: {startDate?: string;days?: number;}) => void;
  errors: {startDate?: Err;days?: Err;};
}

export function StepSchedule({ service, startDate, days, onChange, errors }: StepScheduleProps) {
  const { t } = useI18n();
  return (
    <div>
      <h2 className="font-display text-[30px] font-medium text-ink">{t('booking.scheduleTitle')}</h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="start-date" className={labelClass}>
            {t('booking.startDate')}
          </label>
          <input
            id="start-date"
            type="date"
            min={todayIso()}
            value={startDate ?? ''}
            onChange={(e) => onChange({ startDate: e.target.value })}
            aria-invalid={errors.startDate ? true : undefined}
            aria-describedby={errors.startDate ? 'start-date-error' : undefined}
            className={controlClass} />
          
          <FieldError id="start-date-error" error={errors.startDate} />
        </div>
        <div>
          <p id="days-label" className={labelClass}>
            {t('booking.days')}
          </p>
          <DaysStepper id="days-label" value={days} min={service.minDays} max={service.maxDays} onChange={(d) => onChange({ days: d })} className="h-[50px]" />
          <p className="mt-1.5 text-[13px] text-muted">{t('serviceDetail.durationHint', { min: service.minDays, max: service.maxDays })}</p>
          <FieldError error={errors.days} />
        </div>
      </div>
    </div>);

}