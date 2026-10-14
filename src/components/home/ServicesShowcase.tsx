import { useI18n } from '../../contexts/I18nContext';
import { useCatalogData } from '../../hooks/useCatalogData';
import { ServiceCard } from '../cards/ServiceCard';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { SampleNote } from '../ui/SampleNote';
import { SectionHeader } from '../ui/SectionHeader';

export function ServicesShowcase() {
  const { t } = useI18n();
  const showcase = useCatalogData().services.slice(0, 8);
  return (
    <section className="bg-ivory py-20 lg:py-28" aria-labelledby="services-title">
      <Container>
        <SectionHeader
          id="services-title"
          title={t('servicesSection.title')}
          body={t('servicesSection.body')}
          action={
          <Button to="/services" variant="secondary">
              {t('servicesSection.cta')}
            </Button>
          } />
        
        <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {showcase.map((s) =>
          <ServiceCard key={s.id} service={s} />
          )}
        </div>
        <SampleNote className="mt-12">{t('servicesSection.note')}</SampleNote>
      </Container>
    </section>);

}