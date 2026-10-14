import { QuoteIcon } from 'lucide-react';
import { images } from '../../data/images';
import { testimonials } from '../../data/testimonials';
import { useI18n } from '../../contexts/I18nContext';
import { TestimonialCard } from '../cards/TestimonialCard';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { SampleNote } from '../ui/SampleNote';
import { SmartImage } from '../ui/SmartImage';

const [lead, ...rest] = testimonials;

export function FamilyStories() {
  const { t, l } = useI18n();
  return (
    <section className="bg-ivory py-20 lg:py-28" aria-labelledby="stories-title">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 id="stories-title" className="font-display text-[38px] font-medium leading-[1.06] tracking-[-0.02em] text-ink sm:text-[50px]">
              {t('stories.title')}
            </h2>
            <p className="mt-4 text-[17px] text-muted">{t('stories.body')}</p>
          </div>
          <Button to="/stories" variant="secondary">
            {t('stories.all')}
          </Button>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <figure className="grid overflow-hidden rounded-[32px] bg-brand-deep text-white md:grid-cols-2 lg:col-span-8">
            <SmartImage
              src={images.stories}
              alt={l({ en: 'Grandmother laughing with her granddaughter as a caregiver smiles nearby', ar: 'جدة تضحك مع حفيدتها بينما تبتسم مقدّمة الرعاية بالقرب' })}
              className="aspect-[4/3] md:aspect-auto md:h-full" />
            
            <div className="flex flex-col p-8 sm:p-10">
              <QuoteIcon className="h-8 w-8 text-mint" aria-hidden />
              <blockquote className="mt-6 font-display text-[26px] leading-[1.3] sm:text-[30px]">{l(lead.quote)}</blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mint text-sm font-bold text-brand-deep" aria-hidden>
                  {lead.initials}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{l(lead.author)}</span>
                  <span className="block text-[13px] text-white/65">{l(lead.relation)}</span>
                </span>
              </figcaption>
            </div>
          </figure>
          <div className="lg:col-span-4">
            <TestimonialCard testimonial={rest[0]} />
          </div>
          {rest.slice(1, 4).map((item) =>
          <div key={item.id} className="lg:col-span-4">
              <TestimonialCard testimonial={item} />
            </div>
          )}
        </div>
        <SampleNote className="mt-8">{t('stories.sampleLabel')}</SampleNote>
      </Container>
    </section>);

}