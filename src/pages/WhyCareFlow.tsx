import { BookingPreview } from '../components/home/BookingPreview';
import { CareStandards } from '../components/home/CareStandards';
import { FinalCta } from '../components/home/FinalCta';
import { WhyChoose } from '../components/home/WhyChoose';
import { PageHero } from '../components/layout/PageHero';
import { useI18n } from '../contexts/I18nContext';
import { images } from '../data/images';
import { useStaticPageMeta } from '../seo/usePageMeta';

export function WhyCareFlowPage() {
  const { t, l } = useI18n();
  useStaticPageMeta('/why-careflow');
  return (
    <>
      <PageHero
        title={t('whyPage.title')}
        body={t('whyPage.body')}
        crumbs={[{ label: t('nav.why') }]}
        image={images.galleryConsult}
        imageAlt={l({ en: 'Nurse explaining notes on a tablet to a man at home', ar: 'ممرضة تشرح ملاحظات على جهاز لوحي لرجل في منزله' })} />
      
      <WhyChoose />
      <BookingPreview />
      <CareStandards />
      <FinalCta />
    </>);

}