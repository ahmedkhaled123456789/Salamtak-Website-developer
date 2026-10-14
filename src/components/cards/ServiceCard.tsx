import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import type { CareService } from '../../types/service';
import { SmartImage } from '../ui/SmartImage';

export function ServiceCard({ service, showPrice = false }: {service: CareService;showPrice?: boolean;}) {
  const { t, l, money } = useI18n();
  return (
    <article className="group relative flex h-full flex-col">
      <SmartImage
        src={service.image}
        alt={l(service.imageAlt)}
        className="aspect-[4/3] rounded-2xl"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        imgClassName="transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
      
      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-snug text-ink">
            <Link to={`/services/${service.slug}`} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">
              {l(service.title)}
            </Link>
          </h3>
          {showPrice && service.dailyRateSample !== null &&
          <span className="shrink-0 pt-0.5 text-sm text-muted">
              <span className="font-semibold text-ink">{money(service.dailyRateSample)}</span>
              {t('common.perDay')}
            </span>
          }
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{l(service.summary)}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-brand group-hover:text-brand-dark">
          {t('common.exploreService')}
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden />
        </span>
      </div>
    </article>);

}