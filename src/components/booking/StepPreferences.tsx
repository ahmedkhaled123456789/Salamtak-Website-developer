import { useState } from 'react';
import { CheckCircle2Icon, LocateFixedIcon } from 'lucide-react';
import { useI18n, type TranslationKey } from '../../contexts/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
import { emirates, findEmirate } from '../../data/emirates';
import type { BookingDraft } from '../../types/booking';
import type { GenderPreference } from '../../types/nurse';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { SelectField } from '../ui/SelectField';
import { TextField } from '../ui/TextField';

interface StepPreferencesProps {
  draft: BookingDraft;
  onChange: (patch: Partial<BookingDraft>) => void;
  error?: {key: TranslationKey;};
}

export function StepPreferences({ draft, onChange, error }: StepPreferencesProps) {
  const { t, l } = useI18n();
  const { user } = useAuth();
  const [locating, setLocating] = useState<'idle' | 'busy' | 'error'>('idle');
  // default to the emirate in the patient's profile, if it names one
  const emirate = draft.emirate ?? findEmirate(user?.city)?.id ?? '';
  const geoSupported = typeof navigator !== 'undefined' && 'geolocation' in navigator;

  const shareLocation = () => {
    setLocating('busy');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating('idle');
        onChange({ coords: { latitude: pos.coords.latitude, longitude: pos.coords.longitude } });
      },
      () => setLocating('error'),
      { enableHighAccuracy: false, timeout: 15_000, maximumAge: 300_000 }
    );
  };
  const options: {value: GenderPreference;label: string;}[] = [
  { value: 'any', label: t('common.noPreference') },
  { value: 'female', label: t('common.female') },
  { value: 'male', label: t('common.male') }];

  return (
    <div>
      <h2 className="font-display text-[30px] font-medium text-ink">{t('booking.preferenceTitle')}</h2>
      <fieldset className="mt-8">
        <legend className="mb-3 text-sm font-semibold text-ink">{t('booking.genderLabel')}</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {options.map((o) => {
            const selected = draft.genderPreference === o.value;
            return (
              <label
                key={o.value}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-2xl border bg-white px-4 py-4 text-[15px] font-semibold transition-[border-color,box-shadow] duration-150',
                  selected ? 'border-brand text-brand-dark shadow-[0_0_0_3px_rgba(15,118,110,0.12)]' : 'border-line text-ink hover:border-brand/40'
                )}>
                
                <input type="radio" name="gender" checked={selected} onChange={() => onChange({ genderPreference: o.value })} className="h-4 w-4 accent-brand" />
                {o.label}
              </label>);

          })}
        </div>
      </fieldset>
      <div className="mt-8 space-y-5">
        <SelectField
          label={t('booking.emirate')}
          value={emirate}
          onChange={(e) => onChange({ emirate: e.target.value || undefined })}
          options={[{ value: '', label: '—' }, ...emirates.map((e) => ({ value: e.id, label: l(e.name) }))]} />
        {geoSupported &&
        <div aria-live="polite">
            {draft.coords ?
          <p className="flex flex-wrap items-center gap-2 text-[14px] text-brand-dark">
                <CheckCircle2Icon className="h-4 w-4 shrink-0" aria-hidden />
                {t('booking.locationShared')}
                <button type="button" className="font-semibold underline underline-offset-2" onClick={() => onChange({ coords: undefined })}>
                  {t('booking.clearLocation')}
                </button>
              </p> :

          <>
                <Button
              variant="secondary"
              size="sm"
              loading={locating === 'busy'}
              iconStart={<LocateFixedIcon className="h-4 w-4" aria-hidden />}
              onClick={shareLocation}>
                  {locating === 'busy' ? t('booking.locating') : t('booking.useLocation')}
                </Button>
                {locating === 'error' && <p className="mt-2 text-[13px] font-medium text-coral-dark">{t('booking.locationError')}</p>}
              </>
          }
          </div>
        }
        <TextField
          label={t('booking.address')}
          placeholder={t('booking.addressPlaceholder')}
          autoComplete="street-address"
          value={draft.address ?? ''}
          onChange={(e) => onChange({ address: e.target.value })}
          error={error ? t(error.key) : undefined} />
        
        <TextField
          label={t('booking.notes')}
          placeholder={t('booking.notesPlaceholder')}
          multiline
          rows={4}
          value={draft.notes ?? ''}
          onChange={(e) => onChange({ notes: e.target.value })} />
        
      </div>
    </div>);

}