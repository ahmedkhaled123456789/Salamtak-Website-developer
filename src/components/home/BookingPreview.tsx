import { useState } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { useI18n } from '../../contexts/I18nContext';
import { useCatalogData } from '../../hooks/useCatalogData';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { DaysStepper } from '../ui/DaysStepper';
import { SampleNote } from '../ui/SampleNote';
import { isHydrating } from '../../utils/hydration';

/** Illustrative calculator: estimate = daily rate × number of days. */
export function BookingPreview() {
  const { t, l, money, daysLabel } = useI18n();
  const reduce = useReducedMotion();
  const [days, setDays] = useState(5);
  const sampleService = useCatalogData().services[0];
  if (!sampleService) return null;
  const rate = sampleService.dailyRateSample ?? 0;
  const total = rate * days;

  const row = 'flex items-center justify-between gap-4 py-3.5 text-[15px]';

  return (
    <section className="bg-mint py-20 lg:py-28" aria-labelledby="preview-title">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_520px] lg:gap-20">
          <div>
            <h2 id="preview-title" className="font-display text-[38px] font-medium leading-[1.06] tracking-[-0.02em] text-ink sm:text-[50px]">
              {t('bookingPreview.title')}
            </h2>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink/75">{t('bookingPreview.body')}</p>
            <p className="mt-8 inline-flex rounded-full border border-brand/20 bg-white/60 px-4 py-2 font-mono text-sm text-brand-dark">
              {t('bookingPreview.formula')}
            </p>
            <SampleNote className="mt-6 max-w-md text-ink/70">{t('bookingPreview.backendNote')}</SampleNote>
            <Button to={`/book?service=${sampleService.slug}`} className="mt-9">
              {t('bookingPreview.cta')}
            </Button>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-lift sm:p-8">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-muted">{t('bookingPreview.sampleLabel')}</p>
            </div>
            <div className="mt-5 flex items-center gap-4 rounded-2xl bg-ivory p-3">
              <img src={sampleService.image} alt="" className="h-16 w-16 rounded-xl object-cover" loading="lazy" />
              <div>
                <p className="text-[13px] text-muted">{t('bookingPreview.service')}</p>
                <p className="font-bold text-ink">{l(sampleService.title)}</p>
              </div>
            </div>
            <dl className="mt-4 divide-y divide-line">
              <div className={row}>
                <dt className="text-muted">{t('bookingPreview.preference')}</dt>
                <dd className="font-semibold text-ink">{t('common.female')}</dd>
              </div>
              <div className={row}>
                <dt id="preview-days" className="text-muted">{t('bookingPreview.duration')}</dt>
                <dd>
                  <DaysStepper id="preview-days" value={days} min={1} max={14} onChange={setDays} />
                </dd>
              </div>
              <div className={row}>
                <dt className="text-muted">{t('bookingPreview.dailyRate')}</dt>
                <dd className="font-semibold tabular-nums text-ink">{money(rate)}</dd>
              </div>
              <div className={row}>
                <dt className="text-muted">{t('bookingPreview.numberOfDays')}</dt>
                <dd className="font-semibold tabular-nums text-ink">× {daysLabel(days)}</dd>
              </div>
            </dl>
            <div className="mt-2 flex items-end justify-between border-t-2 border-ink pt-5">
              <span className="text-[15px] font-semibold text-ink">{t('bookingPreview.estimatedTotal')}</span>
              <m.span
                key={total}
                initial={reduce || isHydrating() ? false : { opacity: 0.4, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                className="font-display text-[40px] font-medium leading-none tabular-nums text-brand-dark"
                aria-live="polite">
                
                {money(total)}
              </m.span>
            </div>
          </div>
        </div>
      </Container>
    </section>);

}