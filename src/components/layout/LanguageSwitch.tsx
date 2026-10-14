import { GlobeIcon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { cn } from '../../utils/cn';

/** Toggles EN ⇄ AR. The label is always shown in the target language. */
export function LanguageSwitch({ className, tone = 'dark' }: {className?: string;tone?: 'dark' | 'light';}) {
  const { locale, setLocale, t } = useI18n();
  const next = locale === 'en' ? 'ar' : 'en';
  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      className={cn(
        'inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-colors duration-150 ease-out',
        tone === 'dark' ? 'text-ink hover:bg-mint/60' : 'text-white hover:bg-white/10',
        className
      )}
      aria-label={`${t('common.language')}: ${next === 'ar' ? 'العربية' : 'English'}`}>
      
      <GlobeIcon className="h-4 w-4" aria-hidden />
      <span lang={next}>{next === 'ar' ? 'العربية' : 'English'}</span>
    </button>);

}