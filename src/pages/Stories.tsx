import { useState } from 'react';
import { TestimonialCard } from '../components/cards/TestimonialCard';
import { PageHero } from '../components/layout/PageHero';
import { Container } from '../components/ui/Container';
import { SampleNote } from '../components/ui/SampleNote';
import { StateMessage } from '../components/ui/StateMessage';
import { useI18n } from '../contexts/I18nContext';
import { images } from '../data/images';
import { testimonials } from '../data/testimonials';
import { useCatalogData } from '../hooks/useCatalogData';
import { cn } from '../utils/cn';
import { useStaticPageMeta } from '../seo/usePageMeta';

export function StoriesPage() {
  const { t, l } = useI18n();
  useStaticPageMeta('/stories');
  const { services, serviceById } = useCatalogData();
  const [filter, setFilter] = useState('all');
  // testimonials reference the bundled sample ids, so match through the catalogue (live id, slug or sample id)
  const usedServices = services.filter((s) => testimonials.some((x) => serviceById(x.serviceId)?.id === s.id));
  const list = filter === 'all' ? testimonials : testimonials.filter((x) => serviceById(x.serviceId)?.id === filter);

  return (
    <>
      <PageHero
        title={t('reviewsPage.title')}
        body={t('reviewsPage.body')}
        crumbs={[{ label: t('nav.reviews') }]}
        image={images.stories}
        imageAlt={l({ en: 'Grandmother and granddaughter laughing with a caregiver', ar: 'جدة وحفيدتها تضحكان مع مقدّمة رعاية' })}>
        
        <SampleNote>{t('stories.sampleLabel')}</SampleNote>
      </PageHero>
      <Container className="py-14 lg:py-20">
        <div className="scrollbar-none flex gap-2 overflow-x-auto" role="group" aria-label={t('reviewsPage.filter')}>
          {[{ id: 'all', label: t('categories.all') }, ...usedServices.map((s) => ({ id: s.id, label: l(s.title) }))].map((opt) =>
          <button
            key={opt.id}
            type="button"
            aria-pressed={filter === opt.id}
            onClick={() => setFilter(opt.id)}
            className={cn(
              'h-10 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors duration-150',
              filter === opt.id ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink hover:border-brand/40'
            )}>
            
              {opt.label}
            </button>
          )}
        </div>
        {list.length === 0 ?
        <StateMessage className="mt-10" title={t('common.emptyTitle')} /> :

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((item) =>
          <TestimonialCard key={item.id} testimonial={item} />
          )}
          </div>
        }
      </Container>
    </>);

}