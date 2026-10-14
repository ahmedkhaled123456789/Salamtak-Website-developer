import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from 'lucide-react';
import { useI18n } from '../../../contexts/I18nContext';
import { useCatalogData } from '../../../hooks/useCatalogData';
import type { GenderPreference } from '../../../types/nurse';
import { Button } from '../../ui/Button';
import { SelectField } from '../../ui/SelectField';

const durations = [3, 7, 14, 30];

export function HeroSearchPanel() {
  const { t, l, daysLabel } = useI18n();
  const navigate = useNavigate();
  const { services } = useCatalogData();
  const [serviceId, setServiceId] = useState('');
  const [gender, setGender] = useState<GenderPreference>('any');
  const [days, setDays] = useState('7');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (serviceId) params.set('service', serviceId);
    if (gender !== 'any') params.set('gender', gender);
    params.set('days', days);
    navigate(`/nurses?${params.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className="relative z-10 mt-16 rounded-3xl border border-line bg-white p-5 shadow-lift sm:p-6 lg:mt-14 lg:max-w-[980px]"
      aria-label={t('hero.searchTitle')}>
      
      <p className="mb-4 text-sm font-semibold text-ink">{t('hero.searchTitle')}</p>
      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-end">
        <SelectField
          label={t('hero.service')}
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          options={[{ value: '', label: t('hero.anyService') }, ...services.map((s) => ({ value: s.id, label: l(s.title) }))]} />
        
        <SelectField
          label={t('hero.gender')}
          value={gender}
          onChange={(e) => setGender(e.target.value as GenderPreference)}
          options={[
          { value: 'any', label: t('common.noPreference') },
          { value: 'female', label: t('common.female') },
          { value: 'male', label: t('common.male') }]
          } />
        
        <SelectField
          label={t('hero.duration')}
          value={days}
          onChange={(e) => setDays(e.target.value)}
          options={durations.map((d) => ({ value: String(d), label: daysLabel(d) }))} />
        
        <Button type="submit" size="lg" className="h-[50px]" iconStart={<SearchIcon className="h-4 w-4" aria-hidden />}>
          {t('hero.search')}
        </Button>
      </div>
    </form>);

}