import { BellRingIcon, CreditCardIcon, ListChecksIcon } from 'lucide-react';
import { BookingPreview } from '../components/home/BookingPreview';
import { FinalCta } from '../components/home/FinalCta';
import { HowItWorksSteps } from '../components/home/HowItWorksSteps';
import { PageHero } from '../components/layout/PageHero';
import { Container } from '../components/ui/Container';
import { useI18n, type TranslationKey } from '../contexts/I18nContext';
import { images } from '../data/images';
import { useStaticPageMeta } from '../seo/usePageMeta';

const after: {icon: typeof ListChecksIcon;key: TranslationKey;}[] = [
{ icon: ListChecksIcon, key: 'howPage.a1' },
{ icon: CreditCardIcon, key: 'howPage.a2' },
{ icon: BellRingIcon, key: 'howPage.a3' }];


export function HowItWorksPage() {
  const { t, l } = useI18n();
  useStaticPageMeta('/how-it-works');
  return (
    <>
      <PageHero
        title={t('howPage.title')}
        body={t('howPage.body')}
        crumbs={[{ label: t('nav.howItWorks') }]}
        image={images.galleryVisit}
        imageAlt={l({ en: 'Nurse greeting an older woman at her front door', ar: 'ممرضة تحيّي سيدة مسنّة عند باب منزلها' })} />
      
      <HowItWorksSteps showHeader={false} />
      <section className="bg-white py-20" aria-labelledby="after-title">
        <Container>
          <h2 id="after-title" className="font-display text-[38px] font-medium text-ink sm:text-[46px]">{t('howPage.afterTitle')}</h2>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {after.map(({ icon: Icon, key }) =>
            <li key={key} className="border-t-2 border-brand pt-6">
                <Icon className="h-6 w-6 text-brand" aria-hidden />
                <p className="mt-4 text-[17px] leading-relaxed text-ink">{t(key)}</p>
              </li>
            )}
          </ul>
        </Container>
      </section>
      <BookingPreview />
      <FinalCta />
    </>);

}