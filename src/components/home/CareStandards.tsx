import { BookOpenCheckIcon, FileSearchIcon, HeartHandshakeIcon, InfoIcon } from 'lucide-react';
import { images } from '../../data/images';
import { useI18n, type TranslationKey } from '../../contexts/I18nContext';
import { Container } from '../ui/Container';
import { SampleNote } from '../ui/SampleNote';
import { SmartImage } from '../ui/SmartImage';

const points: {icon: typeof InfoIcon;title: TranslationKey;body: TranslationKey;}[] = [
{ icon: FileSearchIcon, title: 'standards.t1', body: 'standards.b1' },
{ icon: BookOpenCheckIcon, title: 'standards.t2', body: 'standards.b2' },
{ icon: HeartHandshakeIcon, title: 'standards.t3', body: 'standards.b3' },
{ icon: InfoIcon, title: 'standards.t4', body: 'standards.b4' }];


export function CareStandards() {
  const { t, l } = useI18n();
  return (
    <section className="bg-white py-20 lg:py-28" aria-labelledby="standards-title">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_440px] lg:gap-20">
          <div>
            <h2 id="standards-title" className="max-w-xl font-display text-[38px] font-medium leading-[1.06] tracking-[-0.02em] text-ink sm:text-[50px]">
              {t('standards.title')}
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">{t('standards.body')}</p>
            <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {points.map(({ icon: Icon, title, body }) =>
              // a <dl> group may only contain <dt>/<dd>: the icon lives inside the <dt>, same layout as before
              <div key={title} className="relative min-h-10 ps-14">
                  <dt className="font-bold text-ink">
                    <span className="absolute start-0 top-0 flex h-10 w-10 items-center justify-center rounded-xl bg-mint text-brand" aria-hidden>
                      <Icon className="h-5 w-5" />
                    </span>
                    {t(title)}
                  </dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-muted">{t(body)}</dd>
                </div>
              )}
            </dl>
            <SampleNote className="mt-10 max-w-lg">{t('standards.disclaimer')}</SampleNote>
          </div>
          <SmartImage
            src={images.standards}
            alt={l({ en: 'Nurse reviewing a care checklist on a clipboard in a bright entryway', ar: 'ممرضة تراجع قائمة رعاية على لوح في مدخل منزل مشرق' })}
            className="aspect-[4/5] rounded-[32px]" />
          
        </div>
      </Container>
    </section>);

}