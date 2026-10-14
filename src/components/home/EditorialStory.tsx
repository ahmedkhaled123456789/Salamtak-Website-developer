import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { images } from '../../data/images';
import { useI18n } from '../../contexts/I18nContext';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SmartImage } from '../ui/SmartImage';

export function EditorialStory() {
  const { t, l } = useI18n();
  return (
    <section className="bg-white py-20 lg:py-28" aria-labelledby="story-title">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div className="relative">
            <SmartImage
              src={images.story}
              alt={l({ en: 'Caregiver and an older man laughing together while pouring tea at the kitchen table', ar: 'مقدّم رعاية ورجل مسن يضحكان معاً أثناء سكب الشاي على طاولة المطبخ' })}
              className="aspect-[4/5] rounded-[32px]" />
            
            <figure className="absolute -bottom-8 end-4 max-w-[300px] rounded-3xl bg-brand-deep p-6 text-white shadow-lift sm:end-[-32px]">
              <blockquote className="font-display text-[22px] italic leading-snug">“{t('story.quote')}”</blockquote>
            </figure>
          </div>
          <Reveal>
            <h2 id="story-title" className="font-display text-[40px] font-medium leading-[1.05] tracking-[-0.02em] text-ink sm:text-[56px]">
              {t('story.title')}
            </h2>
            <p className="mt-7 text-lg leading-relaxed text-ink/85">{t('story.p1')}</p>
            <p className="mt-5 text-[17px] leading-relaxed text-muted">{t('story.p2')}</p>
            <Link to="/how-it-works" className="group mt-9 inline-flex items-center gap-2 border-b-2 border-brand pb-1 font-semibold text-brand-dark">
              {t('story.cta')}
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>);

}