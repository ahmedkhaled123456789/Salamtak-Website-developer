import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2Icon, KeyRoundIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SelectField } from '../../components/ui/SelectField';
import { TextField } from '../../components/ui/TextField';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import { emirates, findEmirate } from '../../data/emirates';
import { careApi } from '../../utils/careApi';
import { isDemoMode } from '../../utils/config';

const schema = z.object({
  firstName: z.string().trim().min(2, 'nameMin'),
  lastName: z.string().trim().min(2, 'nameMin'),
  phone: z.string().trim().optional(),
  city: z.string().trim().optional(),
  address: z.string().trim().optional(),
  language: z.enum(['en', 'ar']),
  genderPreference: z.enum(['any', 'female', 'male']),
  emailUpdates: z.boolean()
});
type Values = z.infer<typeof schema>;

export function ProfilePage() {
  const { t, l, setLocale } = useI18n();
  const { user, updateUser } = useAuth();
  const { register, handleSubmit, formState, reset } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.phone ?? '',
      city: findEmirate(user?.city)?.name.en ?? user?.city ?? '',
      address: user?.address ?? '',
      language: user?.preferences.language ?? 'en',
      genderPreference: user?.preferences.genderPreference ?? 'any',
      emailUpdates: user?.preferences.emailUpdates ?? false
    }
  });
  const mutation = useMutation({
    mutationFn: (v: Values) =>
    careApi.updateProfile({
      ...(user as NonNullable<typeof user>),
      firstName: v.firstName,
      lastName: v.lastName,
      phone: v.phone,
      city: v.city,
      address: v.address,
      preferences: { language: v.language, genderPreference: v.genderPreference, emailUpdates: v.emailUpdates }
    }),
    onSuccess: (saved, v) => {
      updateUser(saved);
      setLocale(v.language);
      reset(v);
    }
  });
  const avatar = useMutation({
    mutationFn: (file: File) => careApi.uploadAvatar(file),
    onSuccess: (saved) => updateUser(saved)
  });
  const err = (key?: string) => key ? t(`validation.${key as 'email'}`) : undefined;
  const card = 'rounded-3xl border border-line bg-white p-6 sm:p-8';
  const h2 = 'text-lg font-bold text-ink';

  return (
    <div>
      <h1 className="font-display text-[34px] font-medium text-ink sm:text-[40px]">{t('nav.profile')}</h1>
      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate className="mt-8 max-w-3xl space-y-6">
        <section className={card} aria-labelledby="personal-h">
          <h2 id="personal-h" className={h2}>{t('account.personal')}</h2>
          <div className="mt-5 flex items-center gap-4">
            {user?.avatarUrl ?
            <img src={user.avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover" /> :
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-mint text-lg font-bold text-brand" aria-hidden>
                {`${user?.firstName.charAt(0) ?? ''}${user?.lastName.charAt(0) ?? ''}`.toUpperCase()}
              </span>
            }
            <div>
              <label className="inline-flex cursor-pointer items-center rounded-xl border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-mint/40">
                {avatar.isPending ? t('common.saving') : t('account.changePhoto')}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  disabled={avatar.isPending}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) avatar.mutate(file);
                    e.target.value = '';
                  }} />

              </label>
              <p className="mt-1 text-xs text-muted">{avatar.isError ? t('common.errorBody') : t('account.photoHint')}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <TextField label={t('auth.firstName')} autoComplete="given-name" error={err(formState.errors.firstName?.message)} {...register('firstName')} />
            <TextField label={t('auth.lastName')} autoComplete="family-name" error={err(formState.errors.lastName?.message)} {...register('lastName')} />
          </div>
        </section>
        <section className={card} aria-labelledby="contact-h">
          <h2 id="contact-h" className={h2}>{t('account.contactDetails')}</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <TextField label={t('auth.email')} value={user?.email ?? ''} readOnly disabled />
            {/* the backend verifies the phone number, so it cannot be edited here */}
            <TextField label={t('account.phone')} type="tel" autoComplete="tel" dir="ltr" readOnly={!isDemoMode} disabled={!isDemoMode} {...register('phone')} />
            <SelectField
              label={t('account.city')}
              autoComplete="address-level2"
              options={[
              { value: '', label: '—' },
              ...emirates.map((e) => ({ value: e.name.en, label: l(e.name) })),
              // keep a previously typed city selectable instead of silently dropping it
              ...(user?.city && !findEmirate(user.city) ? [{ value: user.city, label: user.city }] : [])]
              }
              {...register('city')} />
            <TextField label={t('account.address')} autoComplete="street-address" {...register('address')} />
          </div>
        </section>
        <section className={card} aria-labelledby="pref-h">
          <h2 id="pref-h" className={h2}>{t('account.preferences')}</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <SelectField
              label={t('account.preferredLanguage')}
              options={[
              { value: 'en', label: 'English' },
              { value: 'ar', label: 'العربية' }]
              }
              {...register('language')} />
            
            <SelectField
              label={t('account.preferredGender')}
              options={[
              { value: 'any', label: t('common.noPreference') },
              { value: 'female', label: t('common.female') },
              { value: 'male', label: t('common.male') }]
              }
              {...register('genderPreference')} />
            
          </div>
          <label className="mt-5 flex cursor-pointer items-center gap-3 text-[15px] text-ink">
            <input type="checkbox" className="h-4 w-4 rounded accent-brand" {...register('emailUpdates')} />
            {t('account.emailUpdates')}
          </label>
        </section>
        <section className={card} aria-labelledby="sec-h">
          <h2 id="sec-h" className={h2}>{t('account.security')}</h2>
          <p className="mt-3 flex items-start gap-3 text-[15px] text-muted">
            <KeyRoundIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
            {t('account.passwordUnsupported')}
          </p>
        </section>
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg" loading={mutation.isPending} disabled={!formState.isDirty}>
            {mutation.isPending ? t('common.saving') : t('common.save')}
          </Button>
          <div aria-live="polite">
            {mutation.isSuccess && !formState.isDirty &&
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-dark">
                <CheckCircle2Icon className="h-4 w-4" aria-hidden />
                {t('account.saved')}
              </span>
            }
            {mutation.isError && <span className="text-sm text-coral-dark">{t('common.errorBody')}</span>}
          </div>
        </div>
      </form>
    </div>);

}