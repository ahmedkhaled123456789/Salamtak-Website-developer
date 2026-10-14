import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from 'lucide-react';
import { images } from '../../data/images';
import { useI18n, type TranslationKey } from '../../contexts/I18nContext';
import type { Localized } from '../../types/i18n';
import { cn } from '../../utils/cn';
import { Container } from '../ui/Container';
import { SectionHeader } from '../ui/SectionHeader';
import { SmartImage } from '../ui/SmartImage';

const stages: {img: string;alt: Localized;title: TranslationKey;body: TranslationKey;to: string;}[] = [
{ img: images.stageOlder, alt: { en: 'Older couple in a sunny living room as a caregiver brings tea', ar: 'زوجان مسنّان في غرفة معيشة مشمسة بينما تحضر مقدّمة رعاية الشاي' }, title: 'stages.t1', body: 'stages.b1', to: '/services/elderly-care' },
{ img: images.stageSurgery, alt: { en: 'Woman walking with crutches as a nurse supports her', ar: 'سيدة تمشي بعكازات وممرضة تساندها' }, title: 'stages.t2', body: 'stages.b2', to: '/services/post-surgery-care' },
{ img: images.stageOngoing, alt: { en: 'Caregiver helping a man in a wheelchair at his desk', ar: 'مقدّم رعاية يساعد رجلاً على كرسي متحرك عند مكتبه' }, title: 'stages.t3', body: 'stages.b3', to: '/services/daily-living-assistance' },
{ img: images.stageFamilies, alt: { en: 'Family talking with a home care nurse at the kitchen table', ar: 'عائلة تتحدث مع ممرضة رعاية منزلية على طاولة المطبخ' }, title: 'stages.t4', body: 'stages.b4', to: '/services/long-term-home-care' }];


export function LifeStages() {
  const { t, l } = useI18n();
  return (
    <section className="bg-ivory py-20 lg:py-28" aria-labelledby="stages-title">
      <Container>
        <SectionHeader id="stages-title" title={t('stages.title')} body={t('stages.body')} />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((s, i) =>
          <Link
            key={s.title}
            to={s.to}
            className={cn('group relative block overflow-hidden rounded-3xl', i % 2 === 1 && 'lg:mt-12')}>
            
              <SmartImage
              src={s.img}
              alt={l(s.alt)}
              className="aspect-[3/4]"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              imgClassName="transition-transform duration-300 ease-out group-hover:scale-[1.04]" />
            
              <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/95 p-5 backdrop-blur">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[17px] font-bold leading-snug text-ink">{t(s.title)}</h3>
                  <ArrowUpRightIcon className="h-5 w-5 shrink-0 text-brand transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden />
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{t(s.body)}</p>
              </div>
            </Link>
          )}
        </div>
      </Container>
    </section>);

}