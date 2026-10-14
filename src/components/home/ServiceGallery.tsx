import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { images } from '../../data/images';
import { useI18n, type TranslationKey } from '../../contexts/I18nContext';
import type { Localized } from '../../types/i18n';
import { Container } from '../ui/Container';
import { SectionHeader } from '../ui/SectionHeader';
import { SmartImage } from '../ui/SmartImage';

const items: {img: string;alt: Localized;caption: TranslationKey;slug: string;service: Localized;}[] = [
{ img: images.galleryVisit, alt: { en: 'Nurse greeting an older woman at her front door', ar: 'ممرضة تحيّي سيدة مسنّة عند باب منزلها' }, caption: 'gallery.c1', slug: 'care-planning-visit', service: { en: 'Care Planning Visit', ar: 'زيارة تخطيط الرعاية' } },
{ img: images.galleryBedside, alt: { en: 'Nurse checking a resting man’s pulse at his bedside', ar: 'ممرضة تقيس نبض رجل مستلقٍ بجانب سريره' }, caption: 'gallery.c2', slug: 'overnight-bedside-care', service: { en: 'Overnight Bedside Care', ar: 'الرعاية الليلية بجانب السرير' } },
{ img: images.galleryMeal, alt: { en: 'Caregiver and older woman preparing vegetables together', ar: 'مقدّمة رعاية وسيدة مسنّة تحضّران الخضار معاً' }, caption: 'gallery.c3', slug: 'companionship-and-meals', service: { en: 'Companionship & Meals', ar: 'الرفقة والوجبات' } },
{ img: images.galleryConsult, alt: { en: 'Nurse explaining notes on a tablet to a man at home', ar: 'ممرضة تشرح ملاحظات على جهاز لوحي لرجل في منزله' }, caption: 'gallery.c4', slug: 'home-health-check-ins', service: { en: 'Home Health Check-ins', ar: 'زيارات المتابعة الصحية' } }];


export function ServiceGallery() {
  const { t, l, dir } = useI18n();
  const track = useRef<HTMLUListElement>(null);

  const scroll = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const step = el.clientWidth * 0.7 * direction * (dir === 'rtl' ? -1 : 1);
    el.scrollBy({ left: step, behavior: 'smooth' });
  };

  const btn = 'flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors duration-150 hover:border-brand/40 hover:text-brand';

  return (
    <section className="overflow-hidden bg-white py-20 lg:py-28" aria-labelledby="gallery-title">
      <Container>
        <SectionHeader
          id="gallery-title"
          title={t('gallery.title')}
          body={t('gallery.body')}
          action={
          <div className="flex gap-2">
              <button type="button" className={btn} onClick={() => scroll(-1)} aria-label={t('gallery.prev')}>
                <ArrowLeftIcon className="h-5 w-5 rtl:rotate-180" aria-hidden />
              </button>
              <button type="button" className={btn} onClick={() => scroll(1)} aria-label={t('gallery.next')}>
                <ArrowRightIcon className="h-5 w-5 rtl:rotate-180" aria-hidden />
              </button>
            </div>
          } />
        
      </Container>
      <ul
        ref={track}
        className="scrollbar-none mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-5 px-5 sm:scroll-px-8 sm:px-8 lg:scroll-px-[max(2.5rem,calc((100vw_-_1200px)/2))] lg:px-[max(2.5rem,calc((100vw_-_1200px)/2))]">
        
        {items.map((item) =>
        <li key={item.slug} className="w-[82vw] shrink-0 snap-start sm:w-[520px] lg:w-[600px]">
            <Link to={`/services/${item.slug}`} className="group block">
              <SmartImage
              src={item.img}
              alt={l(item.alt)}
              className="aspect-[3/2] rounded-3xl"
              sizes="(min-width: 1024px) 600px, (min-width: 640px) 520px, 82vw"
              imgClassName="transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
            
              <div className="mt-5 flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm font-semibold text-brand">{l(item.service)}</p>
                  <p className="mt-1 font-display text-[22px] leading-snug text-ink">{t(item.caption)}</p>
                </div>
                <ArrowRightIcon className="mt-1 h-5 w-5 shrink-0 text-muted transition-[transform,color] duration-150 group-hover:translate-x-1 group-hover:text-brand rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden />
              </div>
            </Link>
          </li>
        )}
      </ul>
    </section>);

}