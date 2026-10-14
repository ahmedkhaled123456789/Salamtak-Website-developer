import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircleIcon } from 'lucide-react';
import { PasswordField } from '../../components/forms/PasswordField';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import { authErrorKey } from '../../utils/authErrors';
import { careApi } from '../../utils/careApi';
import { safeRedirect } from '../../utils/safeRedirect';

const schema = z.
object({
  firstName: z.string().trim().min(2, 'nameMin'),
  lastName: z.string().trim().min(2, 'nameMin'),
  email: z.string().trim().min(1, 'required').email('email'),
  phone: z.string().trim().regex(/^\+[1-9]\d{7,14}$/, 'phone'),
  // same rule as the backend (min 10, upper + lower + digit)
  password: z.string().min(10, 'passwordMin').regex(/[a-z]/, 'passwordMin').regex(/[A-Z]/, 'passwordMin').regex(/\d/, 'passwordMin'),
  confirm: z.string().min(1, 'required'),
  terms: z.literal(true, { errorMap: () => ({ message: 'terms' }) })
}).
refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'passwordMatch' });
type Values = z.infer<typeof schema>;

export function SignUpPage() {
  const { t } = useI18n();
  const { startSession } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = safeRedirect(params.get('redirect'));
  const { register, handleSubmit, formState } = useForm<Values>({ resolver: zodResolver(schema) });
  const mutation = useMutation({
    mutationFn: (v: Values) => careApi.signUp({ firstName: v.firstName, lastName: v.lastName, email: v.email, phone: v.phone, password: v.password }),
    onSuccess: (session) => {
      startSession(session);
      navigate(redirect, { replace: true });
    }
  });
  const err = (key?: string) => key ? t(`validation.${key as 'email'}`) : undefined;

  return (
    <>
      <h1 className="font-display text-[40px] font-medium leading-tight text-ink">{t('auth.signUpTitle')}</h1>
      <p className="mt-2 text-[16px] text-muted">{t('auth.signUpBody')}</p>
      {mutation.isError &&
      <p role="alert" className="mt-6 flex items-start gap-2 rounded-2xl bg-coral-soft p-4 text-sm text-[#7A2E19]">
          <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {t(authErrorKey(mutation.error))}
        </p>
      }
      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label={t('auth.firstName')} autoComplete="given-name" error={err(formState.errors.firstName?.message)} {...register('firstName')} />
          <TextField label={t('auth.lastName')} autoComplete="family-name" error={err(formState.errors.lastName?.message)} {...register('lastName')} />
        </div>
        <TextField label={t('auth.email')} type="email" autoComplete="email" error={err(formState.errors.email?.message)} {...register('email')} />
        <TextField label={t('auth.phone')} type="tel" dir="ltr" autoComplete="tel" placeholder="+966501234567" error={err(formState.errors.phone?.message)} {...register('phone')} />
        <PasswordField label={t('auth.password')} autoComplete="new-password" hint={t('validation.passwordMin')} error={err(formState.errors.password?.message)} {...register('password')} />
        <PasswordField label={t('auth.confirmPassword')} autoComplete="new-password" error={err(formState.errors.confirm?.message)} {...register('confirm')} />
        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
            <input type="checkbox" className="mt-0.5 h-4 w-4 rounded accent-brand" aria-invalid={formState.errors.terms ? true : undefined} {...register('terms')} />
            {t('auth.terms')}
          </label>
          {formState.errors.terms && <p className="mt-1.5 text-[13px] font-medium text-coral-dark">{t('validation.terms')}</p>}
        </div>
        <Button type="submit" size="lg" className="w-full" loading={mutation.isPending}>
          {t('auth.submitSignUp')}
        </Button>
      </form>
      <p className="mt-8 text-center text-[15px] text-muted">
        {t('auth.haveAccount')}{' '}
        <Link to={`/sign-in${params.toString() ? `?${params.toString()}` : ''}`} className="font-semibold text-brand hover:text-brand-dark">
          {t('common.signIn')}
        </Link>
      </p>
    </>);

}