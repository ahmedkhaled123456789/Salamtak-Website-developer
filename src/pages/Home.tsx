import { BookingPreview } from '../components/home/BookingPreview';
import { CareProfessionals } from '../components/home/CareProfessionals';
import { CareStandards } from '../components/home/CareStandards';
import { EditorialStory } from '../components/home/EditorialStory';
import { FamilyStories } from '../components/home/FamilyStories';
import { FinalCta } from '../components/home/FinalCta';
import { HomeFaq } from '../components/home/HomeFaq';
import { HomeHero } from '../components/home/hero/HomeHero';
import { HomeJournal } from '../components/home/HomeJournal';
import { HowItWorksSteps } from '../components/home/HowItWorksSteps';
import { LifeStages } from '../components/home/LifeStages';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { NurseFinder } from '../components/home/NurseFinder';
import { RealLifeBanner } from '../components/home/RealLifeBanner';
import { ServiceGallery } from '../components/home/ServiceGallery';
import { ServicesShowcase } from '../components/home/ServicesShowcase';
import { TrustStrip } from '../components/home/TrustStrip';
import { WhyChoose } from '../components/home/WhyChoose';
import { organizationLd, websiteLd } from '../seo/meta';
import { useStaticPageMeta } from '../seo/usePageMeta';
import { config } from '../utils/config';

/** Announcement bar, navigation and footer are provided by PublicLayout. */
export function HomePage() {
  const site = config.siteUrl || window.location.origin;
  useStaticPageMeta('/', { jsonLd: [organizationLd(site), websiteLd(site)] });
  return (
    <>
      <HomeHero />
      <TrustStrip />
      <ServicesShowcase />
      <EditorialStory />
      <NurseFinder />
      <HowItWorksSteps />
      <LifeStages />
      <WhyChoose />
      <RealLifeBanner />
      <BookingPreview />
      <CareProfessionals />
      <ServiceGallery />
      <FamilyStories />
      <CareStandards />
      <HomeJournal />
      <HomeFaq />
      <FinalCta />
      <NewsletterSection />
    </>);

}