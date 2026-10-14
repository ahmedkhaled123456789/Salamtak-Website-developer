import { useI18n } from '../../contexts/I18nContext';
import type { Availability } from '../../types/nurse';
import { cn } from '../../utils/cn';

const dot: Record<Availability, string> = {
  available: 'bg-[#16A34A]',
  limited: 'bg-[#D69E2E]',
  unavailable: 'bg-[#9AA8A5]'
};

export function AvailabilityPill({ availability, className }: {availability: Availability;className?: string;}) {
  const { t } = useI18n();
  return (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-medium text-ink', className)}>
      <span className={cn('h-2 w-2 rounded-full', dot[availability])} aria-hidden />
      {t(`common.${availability}`)}
    </span>);

}