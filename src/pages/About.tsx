import { CareStandards } from '../components/home/CareStandards';
import { FinalCta } from '../components/home/FinalCta';
import { PageHero } from '../components/layout/PageHero';
import { Container } from '../components/ui/Container';
import { SmartImage } from '../components/ui/SmartImage';
import { useI18n, type TranslationKey } from '../contexts/I18nContext';
import { images } from '../data/images';
import { useStaticPageMeta } from '../seo/usePageMeta';

const values: {title: TranslationKey;body: TranslationKey;}[] = [
{ title: 'aboutPage.v1', body: 'aboutPage.vb1' },
{ title: 'aboutPage.v2', body: 'aboutPage.vb2' },
{ title: 'aboutPage.v3', body: 'aboutPage.vb3' }];


export function AboutPage() {
  const { t, l } = useI18n();
  useStaticPageMeta('/about');
  return (
    <>
      <PageHero
        title={t('aboutPage.title')}
        body={t('aboutPage.body')}
        crumbs={[{ label: t('nav.about') }]}
        image={images.about}
        imageAlt={l({ en: 'Two nurses reviewing a care schedule on a tablet in a bright kitchen', ar: 'ممرضتان تراجعان جدول رعاية على جهاز لوحي في مطبخ مشرق' })} />
      
      <section className="bg-white py-20 lg:py-28" aria-labelledby="mission">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <h2 id="mission" className="font-display text-[38px] font-medium text-ink sm:text-[50px]">{t('aboutPage.missionTitle')}</h2>
          <p className="font-display text-[26px] leading-[1.4] text-ink/85 sm:text-[30px]">{t('aboutPage.mission')}</p>
        </Container>
      </section>
      <section className="bg-ivory py-20 lg:py-28" aria-labelledby="values">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
            <div>
              <h2 id="values" className="font-display text-[38px] font-medium text-ink sm:text-[50px]">{t('aboutPage.valuesTitle')}</h2>
              <dl className="mt-10 divide-y divide-line border-y border-line">
                {values.map((v) =>
                <div key={v.title} className="grid gap-2 py-7 sm:grid-cols-[160px_1fr]">
                    <dt className="font-display text-2xl text-brand-dark">{t(v.title)}</dt>
                    <dd className="text-[17px] leading-relaxed text-muted">{t(v.body)}</dd>
                  </div>
                )}
              </dl>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SmartImage src={images.stageOlder} alt={l({ en: 'Older couple at home with a caregiver', ar: 'زوجان مسنّان في المنزل مع مقدّمة رعاية' })} className="aspect-[3/4] rounded-3xl" />
              <SmartImage src={images.whyFamily} alt={l({ en: 'Family discussing care with a nurse', ar: 'عائلة تناقش الرعاية مع ممرضة' })} className="mt-12 aspect-[3/4] rounded-3xl" />
            </div>
          </div>
        </Container>
      </section>
      <CareStandards />
      <FinalCta />
    </>);

}