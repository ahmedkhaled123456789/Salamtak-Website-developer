import { images } from '../../data/images';
import { useI18n } from '../../contexts/I18nContext';
import { Button } from '../ui/Button';
import { SmartImage } from '../ui/SmartImage';

export function RealLifeBanner() {
  const { t, l } = useI18n();
  return (
    <section className="relative bg-ivory" aria-labelledby="reallife-title">
      <SmartImage
        src={images.realLife}
        alt={l({ en: 'Nurse and older man reviewing a care notebook on a sofa by a large window', ar: 'ممرضة ورجل مسن يراجعان دفتر رعاية على أريكة قرب نافذة كبيرة' })}
        className="h-[460px] w-full sm:h-[560px] lg:h-[680px]"
        position="65% 50%" />
      
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:absolute lg:inset-0 lg:flex lg:items-center lg:px-10">
        <div className="relative -mt-24 rounded-[28px] bg-white p-8 shadow-lift sm:p-10 lg:mt-0 lg:max-w-[460px]">
          <h2 id="reallife-title" className="font-display text-[36px] font-medium leading-[1.06] tracking-[-0.02em] text-ink sm:text-[46px]">
            {t('realLife.title')}
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-muted">{t('realLife.body')}</p>
          <Button to="/services" className="mt-8">
            {t('realLife.cta')}
          </Button>
        </div>
      </div>
      <div className="h-20 lg:hidden" aria-hidden />
    </section>);

}