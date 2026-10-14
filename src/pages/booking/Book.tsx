import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { BookingProgress } from '../../components/booking/BookingProgress';
import { BookingSummary } from '../../components/booking/BookingSummary';
import { StepAccount } from '../../components/booking/StepAccount';
import { StepNurse } from '../../components/booking/StepNurse';
import { StepPreferences } from '../../components/booking/StepPreferences';
import { StepSchedule } from '../../components/booking/StepSchedule';
import { StepService } from '../../components/booking/StepService';
import { Button } from '../../components/ui/Button';
import { Container } from '../../components/ui/Container';
import { useI18n } from '../../contexts/I18nContext';
import { BOOKING_STEPS, useBookingFlow } from '../../hooks/useBookingFlow';
import { withBrand } from '../../seo/meta';
import { usePageMeta } from '../../seo/usePageMeta';

export function BookPage() {
  const { t, locale } = useI18n();
  usePageMeta({ title: withBrand(t('booking.title'), locale), noindex: true });
  const reduce = useReducedMotion();
  const flow = useBookingFlow();
  const { draft, step, stepId, errors, patch, service, nurse } = flow;
  const isLast = step === BOOKING_STEPS.length - 1;

  return (
    <div className="bg-ivory">
      <Container className="py-10 lg:py-14">
        <h1 className="font-display text-[40px] font-medium leading-tight text-ink sm:text-[52px]">{t('booking.title')}</h1>
        <div className="mt-8">
          <BookingProgress step={step} onJump={flow.goTo} />
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          <div>
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={stepId}
                initial={reduce ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: -12 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
                
                {stepId === 'service' &&
                <StepService
                  value={draft.serviceId}
                  error={errors.service}
                  onSelect={(serviceId, min, max) => patch({ serviceId, days: Math.max(min, Math.min(draft.days, max)) })} />

                }
                {stepId === 'schedule' && service &&
                <StepSchedule service={service} startDate={draft.startDate} days={draft.days} onChange={patch} errors={errors} />
                }
                {stepId === 'preference' && <StepPreferences draft={draft} onChange={patch} error={errors.address} />}
                {stepId === 'nurse' && <StepNurse draft={draft} onSelect={(nurseId) => patch({ nurseId })} error={errors.nurse} conflict={flow.conflict} />}
                {stepId === 'review' &&
                <div>
                    <h2 className="font-display text-[30px] font-medium text-ink">{t('booking.reviewTitle')}</h2>
                    <div className="mt-6">
                      <BookingSummary draft={draft} service={service} nurse={nurse} detailed />
                    </div>
                    {draft.notes &&
                  <div className="mt-4 rounded-2xl bg-white p-5 text-[15px] text-ink/80 ring-1 ring-line">
                        <p className="text-sm font-semibold text-ink">{t('account.notes')}</p>
                        <p className="mt-1">{draft.notes}</p>
                      </div>
                  }
                  </div>
                }
                {stepId === 'account' && <StepAccount onConfirm={flow.submit} pending={flow.create.isPending} failed={flow.create.isError && !flow.conflict} />}
              </m.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6">
              <Button variant="ghost" onClick={flow.back} disabled={step === 0 || flow.create.isPending} iconStart={<ArrowLeftIcon className="h-4 w-4 rtl:rotate-180" aria-hidden />}>
                {t('common.back')}
              </Button>
              {!isLast &&
              <Button size="lg" onClick={flow.next} iconEnd={<ArrowRightIcon className="h-4 w-4 rtl:rotate-180" aria-hidden />}>
                  {t('common.continue')}
                </Button>
              }
            </div>
          </div>
          {stepId !== 'review' &&
          <aside className="lg:sticky lg:top-28 lg:self-start">
              <BookingSummary draft={draft} service={service} nurse={nurse} />
            </aside>
          }
        </div>
      </Container>
    </div>);

}