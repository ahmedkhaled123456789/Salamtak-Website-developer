import React, { useState } from 'react';
import { CheckCircle2Icon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { careApi } from '../../utils/careApi';
import { cn } from '../../utils/cn';
import { isDemoMode } from '../../utils/config';
import { Button } from '../ui/Button';

/** Deliberately dependency-free: this form is in every page's footer, so it must not pull zod/react-hook-form into the entry bundle. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Frontend demonstration only: no subscription API exists, so the email is
 * validated and the user is told plainly that nothing was saved.
 */
export function NewsletterForm({ tone = 'dark', compact = false }: {tone?: 'dark' | 'light';compact?: boolean;}) {
  const { t, locale } = useI18n();
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);
  const id = React.useId();
  const light = tone === 'light';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitted(true);
    const bad = !EMAIL.test(email.trim());
    setInvalid(bad);
    if (bad) return;
    setSubmitting(true);
    setFailed(false);
    try {
      await careApi.subscribeNewsletter(email.trim(), locale);
      setDone(true);
      setEmail('');
      setSubmitted(false);
    } catch {
      setFailed(true); // keep the address so the visitor can retry
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <label htmlFor={id} className="sr-only">
        {t('newsletter.label')}
      </label>
      <div className={cn('flex gap-2', compact ? 'flex-col sm:flex-row' : 'flex-col sm:flex-row')}>
        <input
          id={id}
          type="email"
          autoComplete="email"
          placeholder={t('newsletter.placeholder')}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={`${id}-msg`}
          onFocus={() => setDone(false)}
          className={cn(
            'h-12 w-full flex-1 rounded-full border px-5 text-[15px] outline-none transition-[border-color,box-shadow] duration-150 focus:ring-4',
            light ?
            'border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:border-white/60 focus:ring-white/10' :
            'border-line bg-white text-ink placeholder:text-muted focus:border-brand focus:ring-brand/10'
          )}
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            // like before: once submitted, re-validate as the user types
            if (submitted) setInvalid(!EMAIL.test(e.target.value.trim()));
          }} />
        
        <Button type="submit" variant={light ? 'light' : 'primary'} size="lg" className="h-12" loading={submitting}>
          {t('newsletter.submit')}
        </Button>
      </div>
      <div id={`${id}-msg`} aria-live="polite" className="mt-3 min-h-[20px] text-[13px]">
        {invalid ?
        <span className={light ? 'text-[#FFC9B8]' : 'text-coral-dark'}>{t('validation.email')}</span> :
        done ?
        <span className={cn('inline-flex items-start gap-1.5', light ? 'text-mint' : 'text-brand-dark')}>
            <CheckCircle2Icon className="mt-[1px] h-4 w-4 shrink-0" aria-hidden />
            {isDemoMode ? t('newsletter.success') : t('newsletter.successLive')}
          </span> :
        failed ?
        <span role="alert" className={light ? 'text-[#FFC9B8]' : 'text-coral-dark'}>{t('newsletter.error')}</span> :

        <span className={light ? 'text-white/60' : 'text-muted'}>{t('newsletter.privacy')}</span>
        }
      </div>
    </form>);

}