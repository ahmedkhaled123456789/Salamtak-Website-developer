import { HeartHandshakeIcon } from 'lucide-react';
import { images } from '../../../data/images';
import { HOME_HERO_SIZES } from '../../../seo/meta';
import { useI18n } from '../../../contexts/I18nContext';
import { useCatalogData } from '../../../hooks/useCatalogData';
import { Button } from '../../ui/Button';
import { Container } from '../../ui/Container';
import { SmartImage } from '../../ui/SmartImage';
import { HeroSearchPanel } from './HeroSearchPanel';
import { HeroVisitCard } from './HeroVisitCard';

export function HomeHero() {
  const { t, l } = useI18n();
  const heroNurse = useCatalogData().nurses[0];
  return (
    <section className="relative overflow-hidden bg-ivory pb-16 pt-10 lg:pb-24 lg:pt-14" aria-labelledby="hero-title">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_1fr] lg:gap-16">
          <div className="relative z-10">
            <p className="inline-flex items-center gap-2.5 text-[15px] font-semibold text-brand-dark">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mint">
                <HeartHandshakeIcon className="h-4 w-4" aria-hidden />
              </span>
              {t('hero.trust')}
            </p>
            <h1 id="hero-title" className="mt-7 font-display text-[54px] font-medium leading-[0.98] tracking-[-0.025em] text-ink sm:text-[72px] xl:text-[84px]">
              <span className="block">{t('hero.title1')}</span>
              <span className="block italic text-brand">{t('hero.title2')}</span>
            </h1>
            <p className="mt-7 max-w-[520px] text-lg leading-relaxed text-muted sm:text-[19px]">{t('hero.body')}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button to="/nurses" size="lg">
                {t('hero.primary')}
              </Button>
              <Button to="/services" size="lg" variant="secondary">
                {t('hero.secondary')}
              </Button>
            </div>
          </div>

          <div className="relative">
            <SmartImage
              src={images.hero}
              alt={l({ en: 'Home care nurse kneeling beside an older woman in an armchair, holding her hand', ar: 'ممرضة رعاية منزلية تجثو بجانب سيدة مسنّة على كرسي وتمسك يدها' })}
              priority
              className="aspect-[4/5] rounded-[32px] shadow-lift sm:aspect-square lg:aspect-[4/5]"
              position="40% 50%"
              sizes={HOME_HERO_SIZES} />
            
            {heroNurse && <HeroVisitCard nurse={heroNurse} />}
            <div className="absolute end-4 top-4 hidden max-w-[220px] items-center gap-2.5 rounded-2xl bg-white/95 px-4 py-3 text-[13px] font-semibold leading-snug text-ink shadow-soft backdrop-blur sm:flex">
              <span className="h-2 w-2 shrink-0 rounded-full bg-brand" aria-hidden />
              {t('hero.trustCard')}
            </div>
          </div>
        </div>
        <HeroSearchPanel />
      </Container>
    </section>);

}