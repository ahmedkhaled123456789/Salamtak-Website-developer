import { useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { FlaskConicalIcon, XIcon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { config, isDemoMode } from '../../utils/config';

/** Persistent, explicit indicator of the active data source. */
export function DemoModeBadge() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  if (!isDemoMode && !config.portfolioDemo) return null;
  return (
    <div className="fixed bottom-4 start-4 z-30 flex flex-col items-start gap-2">
      <AnimatePresence>
        {open &&
        <m.div
          id="demo-note"
          initial={{ opacity: 0, y: 6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.97 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className="w-[280px] rounded-2xl border border-line bg-white p-4 text-[13px] leading-relaxed text-muted shadow-lift">
          
            <div className="mb-1 flex items-center justify-between font-semibold text-ink">
              {t('common.demoMode')}
              <button type="button" onClick={() => setOpen(false)} aria-label={t('common.close')} className="rounded-full p-1 hover:bg-mint/60">
                <XIcon className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
            {t(isDemoMode ? 'common.demoModeNote' : 'common.portfolioNote')}
          </m.div>
        }
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="demo-note"
        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-white/95 px-3 text-xs font-semibold text-ink shadow-soft backdrop-blur">
        
        <FlaskConicalIcon className="h-3.5 w-3.5 text-coral" aria-hidden />
        {t('demo.badge')}
      </button>
    </div>);

}