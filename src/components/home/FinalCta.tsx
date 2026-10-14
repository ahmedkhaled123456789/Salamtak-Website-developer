import { images } from '../../data/images';
import { useI18n } from '../../contexts/I18nContext';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { SmartImage } from '../ui/SmartImage';

export function FinalCta() {
  const { t, l } = useI18n();
  return (
    <section className="bg-ivory py-20 lg:py-24" aria-labelledby="final-title">
      <Container>
        <div className="grid overflow-hidden rounded-[36px] bg-brand-deep lg:grid-cols-[1.05fr_1fr]">
          <div className="relative flex flex-col justify-center overflow-hidden p-10 sm:p-14 lg:p-16">
            <svg aria-hidden viewBox="0 0 400 400" className="pointer-events-none absolute -bottom-40 -end-40 h-[420px] w-[420px] text-white/[0.06]">
              {[60, 110, 160, 200].map((r) =>
              <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
            <h2 id="final-title" className="relative font-display text-[42px] font-medium leading-[1.02] tracking-[-0.02em] text-white sm:text-[60px]">
              {t('finalCta.title')}
            </h2>
            <p className="relative mt-6 max-w-md text-lg leading-relaxed text-white/75">{t('finalCta.body')}</p>
            <div className="relative mt-10 flex flex-wrap gap-3">
              <Button to="/nurses" variant="light" size="lg">
                {t('finalCta.primary')}
              </Button>
              <Button to="/services" variant="outlineLight" size="lg">
                {t('finalCta.secondary')}
              </Button>
            </div>
          </div>
          <SmartImage
            src={images.finalCta}
            alt={l({ en: 'Caregiver holding an older woman’s hands on a knitted blanket', ar: 'مقدّمة رعاية تمسك يدي سيدة مسنّة فوق بطانية محاكة' })}
            className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[520px]" />
          
        </div>
      </Container>
    </section>);

}