import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircleIcon, FlaskConicalIcon, InfoIcon } from 'lucide-react';
import { PasswordField } from '../../components/forms/PasswordField';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import { authErrorKey } from '../../utils/authErrors';
import { careApi } from '../../utils/careApi';
import { isDemoMode } from '../../utils/config';
import { DEMO_ACCOUNT } from '../../utils/demoAdapter';
import { safeRedirect } from '../../utils/safeRedirect';

const schema = z.object({
  email: z.string().trim().min(1, 'required').email('email'),
  password: z.string().min(1, 'required')
});
type Values = z.infer<typeof schema>;

export function SignInPage() {
  const { t } = useI18n();
  const { startSession } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = safeRedirect(params.get('redirect'));
  const reason = params.get('reason');

  const { register, handleSubmit, formState, setValue } = useForm<Values>({ resolver: zodResolver(schema) });
  const mutation = useMutation({
    mutationFn: (v: Values) => careApi.signIn(v.email, v.password),
    onSuccess: (session) => {
      startSession(session);
      navigate(redirect, { replace: true });
    }
  });
  const err = (key?: string) => key ? t(`validation.${key as 'email'}`) : undefined;

  return (
    <>
      <h1 className="font-display text-[40px] font-medium leading-tight text-ink">{t('auth.signInTitle')}</h1>
      <p className="mt-2 text-[16px] text-muted">{t('auth.signInBody')}</p>

      {reason &&
      <p role="status" className="mt-6 flex items-start gap-2 rounded-2xl bg-mint p-4 text-sm text-brand-dark">
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {reason === 'expired' ? t('auth.sessionExpired') : t('auth.signInRequired')}
        </p>
      }
      {mutation.isError &&
      <p role="alert" className="mt-6 flex items-start gap-2 rounded-2xl bg-coral-soft p-4 text-sm text-[#7A2E19]">
          <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {t(authErrorKey(mutation.error))}
        </p>
      }

      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate className="mt-8 space-y-5">
        <TextField label={t('auth.email')} type="email" autoComplete="email" error={err(formState.errors.email?.message)} {...register('email')} />
        <PasswordField label={t('auth.password')} autoComplete="current-password" error={err(formState.errors.password?.message)} {...register('password')} />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-semibold text-brand hover:text-brand-dark">
            {t('auth.forgot')}
          </Link>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={mutation.isPending}>
          {t('auth.submitSignIn')}
        </Button>
      </form>

      {isDemoMode &&
      <button
        type="button"
        onClick={() => {
          setValue('email', DEMO_ACCOUNT.email);
          setValue('password', DEMO_ACCOUNT.password);
        }}
        className="mt-5 flex w-full items-center gap-2 rounded-2xl border border-dashed border-line bg-white p-4 text-start text-[13px] text-muted hover:border-brand/40">
        
          <FlaskConicalIcon className="h-4 w-4 shrink-0 text-coral" aria-hidden />
          {t('auth.demoHint', { email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password })}
        </button>
      }

      <p className="mt-8 text-center text-[15px] text-muted">
        {t('auth.noAccount')}{' '}
        <Link to={`/sign-up${params.toString() ? `?${params.toString()}` : ''}`} className="font-semibold text-brand hover:text-brand-dark">
          {t('common.signUp')}
        </Link>
      </p>
    </>);

}