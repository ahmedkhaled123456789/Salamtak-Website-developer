import { useI18n, type TranslationKey } from '../../contexts/I18nContext';

export function FieldError({ error, id }: {error?: {key: TranslationKey;vars?: Record<string, number>;};id?: string;}) {
  const { t } = useI18n();
  if (!error) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-[13px] font-medium text-coral-dark">
      {t(error.key, error.vars)}
    </p>);

}