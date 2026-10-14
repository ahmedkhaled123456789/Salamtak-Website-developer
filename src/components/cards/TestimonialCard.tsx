import { useI18n } from '../../contexts/I18nContext';
import { useCatalogData } from '../../hooks/useCatalogData';
import type { Testimonial } from '../../types/content';
import { cn } from '../../utils/cn';

export function TestimonialCard({ testimonial, className }: {testimonial: Testimonial;className?: string;}) {
  const { l, t } = useI18n();
  const { serviceById } = useCatalogData();
  const service = serviceById(testimonial.serviceId);
  return (
    <figure className={cn('flex h-full flex-col rounded-3xl border border-line bg-white p-7', className)}>
      <div className="flex items-center justify-between gap-3">
        {service && <span className="rounded-full bg-mint px-2.5 py-1 text-xs font-semibold text-brand-dark">{l(service.title)}</span>}
        <span className="text-xs font-medium text-muted">{t('common.sample')}</span>
      </div>
      <blockquote className="mt-5 flex-1 text-[16px] leading-relaxed text-ink">“{l(testimonial.quote)}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white" aria-hidden>
          {testimonial.initials}
        </span>
        <span>
          <span className="block text-sm font-semibold text-ink">{l(testimonial.author)}</span>
          <span className="block text-[13px] text-muted">{l(testimonial.relation)}</span>
        </span>
      </figcaption>
    </figure>);

}