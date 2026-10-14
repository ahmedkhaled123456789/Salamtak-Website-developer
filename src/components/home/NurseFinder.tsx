import { useState } from 'react';
import { useNurses } from '../../hooks/useCatalog';
import { useCatalogData } from '../../hooks/useCatalogData';
import { useI18n } from '../../contexts/I18nContext';
import type { GenderPreference } from '../../types/nurse';
import { cn } from '../../utils/cn';
import { NurseCard } from '../cards/NurseCard';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { SampleNote } from '../ui/SampleNote';
import { SectionHeader } from '../ui/SectionHeader';
import { SelectField } from '../ui/SelectField';
import { Skeleton } from '../ui/Skeleton';
import { StateMessage } from '../ui/StateMessage';

export function NurseFinder() {
  const { t, l } = useI18n();
  const { services } = useCatalogData();
  const [serviceId, setServiceId] = useState('');
  const [gender, setGender] = useState<GenderPreference>('any');
  const [availableOnly, setAvailableOnly] = useState(true);
  const { data, isLoading, isError, refetch } = useNurses({ serviceId: serviceId || undefined, gender, availableOnly });
  const shown = (data ?? []).slice(0, 4);
  const genders: {value: GenderPreference;label: string;}[] = [
  { value: 'any', label: t('common.noPreference') },
  { value: 'female', label: t('common.female') },
  { value: 'male', label: t('common.male') }];


  return (
    <section className="bg-ivory py-20 lg:py-28" aria-labelledby="finder-title">
      <Container>
        <SectionHeader id="finder-title" title={t('finder.title')} body={t('finder.body')} />
        <div className="mt-10 flex flex-col gap-4 rounded-3xl border border-line bg-white p-4 sm:p-5 lg:flex-row lg:items-end">
          <SelectField
            label={t('hero.service')}
            wrapperClassName="lg:w-72"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            options={[{ value: '', label: t('hero.anyService') }, ...services.map((s) => ({ value: s.id, label: l(s.title) }))]} />
          
          <fieldset>
            <legend className="mb-1.5 text-sm font-semibold text-ink">{t('hero.gender')}</legend>
            <div className="flex rounded-full bg-ivory p-1">
              {genders.map((g) =>
              <button
                key={g.value}
                type="button"
                aria-pressed={gender === g.value}
                onClick={() => setGender(g.value)}
                className={cn(
                  'h-10 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors duration-150',
                  gender === g.value ? 'bg-white text-brand-dark shadow-sm' : 'text-muted hover:text-ink'
                )}>
                
                  {g.label}
                </button>
              )}
            </div>
          </fieldset>
          <label className="flex h-12 cursor-pointer items-center gap-3 text-sm font-medium text-ink lg:ms-auto">
            <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} className="h-4 w-4 rounded border-line accent-brand" />
            {t('finder.availableOnly')}
          </label>
        </div>

        <div className="mt-10" aria-live="polite" aria-busy={isLoading}>
          {isError ?
          <StateMessage kind="error" title={t('common.errorTitle')} body={t('common.errorBody')} action={<Button onClick={() => refetch()}>{t('common.retry')}</Button>} /> :
          isLoading ?
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) =>
            <Skeleton key={i} className="h-[520px] rounded-3xl" />
            )}
            </div> :
          shown.length === 0 ?
          <StateMessage title={t('finder.empty')} /> :

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {shown.map((n) =>
            <NurseCard key={n.id} nurse={n} />
            )}
            </div>
          }
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <SampleNote>{t('finder.sampleNote')}</SampleNote>
          <Button to="/nurses" variant="secondary">
            {t('finder.browseAll')}
          </Button>
        </div>
      </Container>
    </section>);

}