import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangleIcon, CheckCircle2Icon, MailIcon, PhoneIcon } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { SelectField } from '../components/ui/SelectField';
import { TextField } from '../components/ui/TextField';
import { useI18n } from '../contexts/I18nContext';
import { useStaticPageMeta } from '../seo/usePageMeta';
import { careApi } from '../utils/careApi';
import { isDemoMode } from '../utils/config';

const schema = z.object({
  name: z.string().trim().min(2, 'nameMin'),
  email: z.string().trim().email('email'),
  topic: z.enum(['care', 'booking', 'partner', 'other']),
  message: z.string().trim().min(20, 'messageMin'),
  /** honeypot: hidden from people, filled by bots */
  website: z.string().optional()
});
type Values = z.infer<typeof schema>;

export function ContactPage() {
  const { t, locale } = useI18n();
  useStaticPageMeta('/contact');
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const { register, handleSubmit, formState, reset } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { topic: 'care' }
  });
  const err = (key?: string) => key ? t(`validation.${key as 'email'}`) : undefined;

  const onSubmit = async (v: Values) => {
    setFailed(false);
    try {
      await careApi.sendContact({ ...v, locale });
      setSent(true);
      reset({ topic: 'care', name: '', email: '', message: '', website: '' });
    } catch {
      // the form keeps what was typed so the visitor can simply try again
      setFailed(true);
    }
  };

  return (
    <>
      <PageHero title={t('contactPage.title')} body={t('contactPage.body')} crumbs={[{ label: t('nav.contact') }]} />
      <Container className="py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative rounded-[28px] border border-line bg-white p-6 sm:p-10">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label={t('contactPage.name')} autoComplete="name" error={err(formState.errors.name?.message)} {...register('name')} />
              <TextField label={t('contactPage.email')} type="email" autoComplete="email" error={err(formState.errors.email?.message)} {...register('email')} />
            </div>
            <SelectField
              label={t('contactPage.topic')}
              wrapperClassName="mt-5"
              options={[
              { value: 'care', label: t('contactPage.topicCare') },
              { value: 'booking', label: t('contactPage.topicBooking') },
              { value: 'partner', label: t('contactPage.topicPartner') },
              { value: 'other', label: t('contactPage.topicOther') }]
              }
              {...register('topic')} />
            
            <TextField label={t('contactPage.message')} multiline rows={6} wrapperClassName="mt-5" error={err(formState.errors.message?.message)} {...register('message')} />
            <div aria-hidden className="absolute -start-[9999px] h-px w-px overflow-hidden">
              <label>
                Website
                <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
              </label>
            </div>
            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button type="submit" size="lg" loading={formState.isSubmitting}>
                {formState.isSubmitting ? t('contactPage.sending') : t('contactPage.send')}
              </Button>
              <div aria-live="polite">
                {sent &&
                <p className="flex items-start gap-2 text-sm text-brand-dark">
                    <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    {isDemoMode ? t('contactPage.success') : t('contactPage.successLive')}
                  </p>
                }
                {failed && <p role="alert" className="text-sm font-medium text-coral-dark">{t('contactPage.error')}</p>}
              </div>
            </div>
          </form>
          <aside className="space-y-6">
            <div className="rounded-[28px] bg-mint p-8">
              <h2 className="text-lg font-bold text-ink">{t('contactPage.detailsTitle')}</h2>
              <ul className="mt-5 space-y-3 text-[15px] text-ink/80">
                <li className="flex items-center gap-3"><MailIcon className="h-4 w-4 text-brand" aria-hidden />{t('footer.contactEmail')}</li>
                <li className="flex items-center gap-3"><PhoneIcon className="h-4 w-4 text-brand" aria-hidden />{t('footer.contactPhone')}</li>
              </ul>
              <p className="mt-4 text-[13px] text-muted">{t('footer.contactNote')}</p>
            </div>
            <div role="note" className="flex gap-3 rounded-[28px] border border-coral/30 bg-coral-soft p-6 text-[15px] leading-relaxed text-[#7A2E19]">
              <AlertTriangleIcon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              {t('contactPage.emergency')}
            </div>
          </aside>
        </div>
      </Container>
    </>);

}