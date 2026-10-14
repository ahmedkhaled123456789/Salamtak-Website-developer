import { useI18n } from '../../contexts/I18nContext';
import { useCatalogData } from '../../hooks/useCatalogData';
import type { GenderPreference } from '../../types/nurse';
import { cn } from '../../utils/cn';

export interface NurseFilterState {
  serviceId: string;
  gender: GenderPreference;
  availableOnly: boolean;
}

interface NurseFiltersProps {
  value: NurseFilterState;
  onChange: (patch: Partial<NurseFilterState>) => void;
}

export function NurseFilters({ value, onChange }: NurseFiltersProps) {
  const { t, l } = useI18n();
  const { services } = useCatalogData();
  const option = (active: boolean) =>
  cn(
    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-[15px] transition-colors duration-150',
    active ? 'bg-mint font-semibold text-brand-dark' : 'text-ink hover:bg-ivory'
  );
  const genders: {value: GenderPreference;label: string;}[] = [
  { value: 'any', label: t('common.noPreference') },
  { value: 'female', label: t('common.female') },
  { value: 'male', label: t('common.male') }];


  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="mb-3 text-sm font-bold text-ink">{t('nursesPage.filterService')}</legend>
        <div className="space-y-0.5">
          <button type="button" className={option(value.serviceId === '')} aria-pressed={value.serviceId === ''} onClick={() => onChange({ serviceId: '' })}>
            {t('hero.anyService')}
          </button>
          {services.map((s) =>
          <button key={s.id} type="button" className={option(value.serviceId === s.id)} aria-pressed={value.serviceId === s.id} onClick={() => onChange({ serviceId: s.id })}>
              {l(s.title)}
            </button>
          )}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-3 text-sm font-bold text-ink">{t('nursesPage.filterGender')}</legend>
        <div className="space-y-1">
          {genders.map((g) =>
          <label key={g.value} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-[15px] text-ink hover:bg-ivory">
              <input type="radio" name="nurse-gender" checked={value.gender === g.value} onChange={() => onChange({ gender: g.value })} className="h-4 w-4 accent-brand" />
              {g.label}
            </label>
          )}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-3 text-sm font-bold text-ink">{t('nursesPage.filterAvailability')}</legend>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-[15px] text-ink hover:bg-ivory">
          <input type="checkbox" checked={value.availableOnly} onChange={(e) => onChange({ availableOnly: e.target.checked })} className="h-4 w-4 rounded accent-brand" />
          {t('nursesPage.availableOnly')}
        </label>
      </fieldset>
    </div>);

}