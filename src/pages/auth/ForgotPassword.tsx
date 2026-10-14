import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircleIcon, ArrowLeftIcon, MailCheckIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { useI18n } from '../../contexts/I18nContext';
import { authErrorKey } from '../../utils/authErrors';
import { careApi } from '../../utils/careApi';

const schema = z.object({ email: z.string().trim().min(1, 'required').email('email') });
type Values = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const { t } = useI18n();
  const { register, handleSubmit, formState } = useForm<Values>({ resolver: zodResolver(schema) });
  const mutation = useMutation({ mutationFn: (v: Values) => careApi.requestPasswordReset(v.email) });
  const err = (key?: string) => key ? t(`validation.${key as 'email'}`) : undefined;

  return (
    <>
      <Link to="/sign-in" className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark">
        <ArrowLeftIcon className="h-4 w-4 rtl:rotate-180" aria-hidden />
        {t('auth.backToSignIn')}
      </Link>
      <h1 className="mt-8 font-display text-[40px] font-medium leading-tight text-ink">{t('auth.forgotTitle')}</h1>
      <p className="mt-2 text-[16px] text-muted">{t('auth.forgotBody')}</p>

      {mutation.isSuccess ?
      <div role="status" className="mt-8 rounded-3xl bg-mint p-6">
          <MailCheckIcon className="h-6 w-6 text-brand" aria-hidden />
          <p className="mt-3 text-[15px] leading-relaxed text-ink">{t('auth.forgotSent')}</p>
        </div> :

      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate className="mt-8 space-y-5">
          {mutation.isError &&
        <p role="alert" className="flex items-start gap-2 rounded-2xl bg-coral-soft p-4 text-sm text-[#7A2E19]">
              <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {t(authErrorKey(mutation.error))}
            </p>
        }
          <TextField label={t('auth.email')} type="email" autoComplete="email" error={err(formState.errors.email?.message)} {...register('email')} />
          <Button type="submit" size="lg" className="w-full" loading={mutation.isPending}>
            {t('auth.submitForgot')}
          </Button>
        </form>
      }
    </>);

}