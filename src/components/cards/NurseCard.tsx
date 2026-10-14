import { Link } from 'react-router-dom';
import { LanguagesIcon, MapPinIcon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { useCatalogData } from '../../hooks/useCatalogData';
import type { Nurse } from '../../types/nurse';
import { cn } from '../../utils/cn';
import { AvailabilityPill } from '../ui/AvailabilityPill';
import { SmartImage } from '../ui/SmartImage';

interface NurseCardProps {
  nurse: Nurse;
  selected?: boolean;
  onSelect?: () => void;
  actionLabel?: string;
}

/** Professional profile card. In selection mode it acts as a radio-like button. */
export function NurseCard({ nurse, selected, onSelect, actionLabel }: NurseCardProps) {
  const { t, l, money, date } = useI18n();
  const { services } = useCatalogData();
  const offered = services.filter((s) => nurse.serviceIds.includes(s.id)).slice(0, 3);
  const selectable = Boolean(onSelect);

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col rounded-3xl border bg-white p-3 transition-[border-color,box-shadow] duration-200 ease-out',
        selected ? 'border-brand shadow-[0_0_0_3px_rgba(15,118,110,0.15)]' : 'border-line hover:shadow-soft'
      )}>
      
      <div className="relative">
        <SmartImage src={nurse.portrait} alt={l(nurse.name)} className="aspect-[4/5] rounded-[18px]" position="50% 20%" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
        <span className="absolute start-3 top-3 rounded-full bg-white/95 px-2.5 py-1 shadow-sm">
          <AvailabilityPill availability={nurse.availability} />
        </span>
      </div>
      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        <p className="text-[13px] font-medium text-brand">{l(nurse.role)}</p>
        <h3 className="mt-0.5 text-lg font-bold text-ink">
          {selectable ?
          l(nurse.name) :

          <Link to={`/nurses/${nurse.slug}`} className="after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none">
              {l(nurse.name)}
            </Link>
          }
        </h3>
        <div className="mt-3 space-y-1.5 text-[13px] text-muted">
          <p className="flex items-center gap-1.5">
            <LanguagesIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {nurse.languages.map(l).join(' · ')}
          </p>
          <p className="flex items-center gap-1.5">
            <MapPinIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {l(nurse.city)}
            {nurse.experienceYears !== undefined && <span>· {t('common.experience', { n: nurse.experienceYears })}</span>}
          </p>
        </div>
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={t('common.services')}>
          {offered.map((s) =>
          <li key={s.id} className="rounded-full bg-ivory px-2.5 py-1 text-xs font-medium text-ink">
              {l(s.title)}
            </li>
          )}
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div className="text-[13px] text-muted">
            {nurse.dailyRateSample !== undefined &&
            <p>
                <span className="text-base font-bold text-ink">{money(nurse.dailyRateSample)}</span> {t('common.perDay')}
              </p>
            }
            {nurse.nextAvailable && <p>{t('common.nextAvailable', { date: date(nurse.nextAvailable, { day: 'numeric', month: 'short' }) })}</p>}
          </div>
          {selectable ?
          <button
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            disabled={nurse.availability === 'unavailable'}
            className={cn(
              'h-9 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors duration-150 disabled:opacity-40',
              selected ? 'bg-brand text-white' : 'border border-line text-ink hover:border-brand/50'
            )}>
            
              {actionLabel}
            </button> :

          <span className="shrink-0 text-sm font-semibold text-brand group-hover:text-brand-dark">{t('common.viewProfile')}</span>
          }
        </div>
      </div>
    </article>);

}