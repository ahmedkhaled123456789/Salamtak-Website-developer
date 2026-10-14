import { useI18n, type TranslationKey } from '../../contexts/I18nContext';
import { useNurses } from '../../hooks/useCatalog';
import type { BookingDraft } from '../../types/booking';
import { NurseCard } from '../cards/NurseCard';
import { Skeleton } from '../ui/Skeleton';
import { StateMessage } from '../ui/StateMessage';
import { FieldError } from './FieldError';

interface StepNurseProps {
  draft: BookingDraft;
  onSelect: (nurseId: string) => void;
  error?: {key: TranslationKey;};
  conflict: boolean;
}

export function StepNurse({ draft, onSelect, error, conflict }: StepNurseProps) {
  const { t } = useI18n();
  const { data, isLoading, isError } = useNurses({ serviceId: draft.serviceId, gender: draft.genderPreference, availableOnly: true });
  return (
    <div>
      <h2 className="font-display text-[30px] font-medium text-ink">{t('booking.nurseTitle')}</h2>
      {conflict &&
      <p role="alert" className="mt-4 rounded-2xl bg-coral-soft p-4 text-sm text-[#7A2E19]">
          {t('booking.conflict')}
        </p>
      }
      <FieldError error={error} />
      <div className="mt-6" aria-live="polite">
        {isError ?
        <StateMessage kind="error" title={t('common.errorTitle')} body={t('common.errorBody')} /> :
        isLoading ?
        <div className="grid gap-5 sm:grid-cols-2">
            {[0, 1].map((i) =>
          <Skeleton key={i} className="h-[480px] rounded-3xl" />
          )}
          </div> :
        (data ?? []).length === 0 ?
        <StateMessage title={t('booking.nurseEmpty')} /> :

        <div className="grid gap-5 sm:grid-cols-2">
            {(data ?? []).map((n) =>
          <NurseCard
            key={n.id}
            nurse={n}
            selected={draft.nurseId === n.id}
            onSelect={() => onSelect(n.id)}
            actionLabel={draft.nurseId === n.id ? t('booking.selected') : t('booking.choose')} />

          )}
          </div>
        }
      </div>
    </div>);

}