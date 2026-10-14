import { AlertCircleIcon, UserRoundCheckIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import { Button } from '../ui/Button';

interface StepAccountProps {
  onConfirm: () => void;
  pending: boolean;
  failed: boolean;
}

export function StepAccount({ onConfirm, pending, failed }: StepAccountProps) {
  const { t } = useI18n();
  const { isAuthenticated, user } = useAuth();
  const redirect = encodeURIComponent('/book');
  return (
    <div>
      <h2 className="font-display text-[30px] font-medium text-ink">{t('booking.accountTitle')}</h2>
      <p className="mt-2 text-[16px] text-muted">{t('booking.accountBody')}</p>
      {isAuthenticated ?
      <div className="mt-8 rounded-3xl border border-line bg-white p-6">
          <p className="flex items-center gap-3 text-[15px] font-semibold text-ink">
            <UserRoundCheckIcon className="h-5 w-5 text-brand" aria-hidden />
            {t('booking.signedInAs', { email: user?.email ?? '' })}
          </p>
          {failed &&
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-2xl bg-coral-soft p-4 text-sm text-[#7A2E19]">
              <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {t('common.errorBody')}
            </p>
        }
          <Button size="lg" className="mt-6 w-full sm:w-auto" onClick={onConfirm} loading={pending}>
            {pending ? t('booking.creating') : t('booking.confirm')}
          </Button>
        </div> :

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button to={`/sign-in?redirect=${redirect}&reason=required`} size="lg">
            {t('common.signIn')}
          </Button>
          <Button to={`/sign-up?redirect=${redirect}`} size="lg" variant="secondary">
            {t('common.signUp')}
          </Button>
        </div>
      }
    </div>);

}