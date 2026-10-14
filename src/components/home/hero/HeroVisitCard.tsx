import { m, useReducedMotion } from 'framer-motion';
import { CalendarCheck2Icon } from 'lucide-react';
import { useI18n } from '../../../contexts/I18nContext';
import type { Nurse } from '../../../types/nurse';
import { isHydrating } from '../../../utils/hydration';

/** Illustrative appointment preview floating over the hero photograph. */
export function HeroVisitCard({ nurse }: {nurse: Nurse;}) {
  const { t, l } = useI18n();
  const reduce = useReducedMotion();
  return (
    <m.div
      initial={reduce || isHydrating() ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="absolute -bottom-6 start-4 w-[272px] rounded-2xl border border-line bg-white p-4 shadow-lift sm:start-[-28px]"
      aria-label={`${t('hero.previewLabel')} (${t('common.sample')})`}>
      
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted">
          <CalendarCheck2Icon className="h-3.5 w-3.5 text-brand" aria-hidden />
          {t('hero.previewLabel')}
        </span>
        <span className="rounded-full bg-mint px-2 py-0.5 text-[11px] font-bold text-brand-dark">{t('hero.previewStatus')}</span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <img src={nurse.portrait} alt="" className="h-11 w-11 rounded-full object-cover object-top" />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-ink">{l(nurse.name)}</p>
          <p className="truncate text-[13px] text-muted">{t('hero.previewTime')}</p>
        </div>
      </div>
      <p className="mt-3 border-t border-line pt-2 text-[11px] text-muted">{t('common.sample')}</p>
    </m.div>);

}