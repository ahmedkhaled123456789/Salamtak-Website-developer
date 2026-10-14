import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { useCatalogData } from '../../hooks/useCatalogData';
import { AvailabilityPill } from '../ui/AvailabilityPill';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { SampleNote } from '../ui/SampleNote';
import { SectionHeader } from '../ui/SectionHeader';
import { SmartImage } from '../ui/SmartImage';

export function CareProfessionals() {
  const { t, l } = useI18n();
  const { nurses, services } = useCatalogData();
  // the most experienced nurse is the spotlight; the rest follow
  const ordered = [...nurses].sort((a, b) => Number(b.featured) - Number(a.featured) || (b.experienceYears ?? 0) - (a.experienceYears ?? 0));
  const spotlight = ordered[0];
  if (!spotlight) return null;
  const supporting = ordered.slice(1, 5);
  const spotlightServices = services.filter((s) => spotlight.serviceIds.includes(s.id));
  return (
    <section className="bg-ivory py-20 lg:py-28" aria-labelledby="pros-title">
      <Container>
        <SectionHeader
          id="pros-title"
          title={t('pros.title')}
          body={t('pros.body')}
          action={
          <Button to="/nurses" variant="secondary">
              {t('pros.cta')}
            </Button>
          } />
        
        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <article className="grid overflow-hidden rounded-[32px] bg-white sm:grid-cols-2 lg:col-span-7">
            <SmartImage src={spotlight.portrait} alt={l(spotlight.name)} className="aspect-[4/5] sm:aspect-auto sm:h-full" position="50% 20%" />
            <div className="flex flex-col p-7 sm:p-8">
              <span className="text-[13px] font-semibold text-coral-dark">{t('pros.spotlight')}</span>
              <h3 className="mt-3 font-display text-[32px] font-medium leading-tight text-ink">{l(spotlight.name)}</h3>
              <p className="mt-1 text-[15px] font-medium text-brand">{l(spotlight.role)}</p>
              <p className="mt-5 text-[15px] leading-relaxed text-muted">{l(spotlight.bio)}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {spotlightServices.map((s) =>
                <li key={s.id} className="rounded-full bg-ivory px-2.5 py-1 text-xs font-medium text-ink">
                    {l(s.title)}
                  </li>
                )}
              </ul>
              <div className="mt-auto flex items-center justify-between gap-3 pt-7">
                <AvailabilityPill availability={spotlight.availability} />
                <Link to={`/nurses/${spotlight.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark">
                  {t('common.viewProfile')}
                  <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" aria-hidden />
                </Link>
              </div>
            </div>
          </article>
          <ul className="grid gap-3 lg:col-span-5">
            {supporting.map((n) =>
            <li key={n.id}>
                <Link
                to={`/nurses/${n.slug}`}
                className="group flex items-center gap-5 rounded-3xl bg-white p-3 pe-6 transition-shadow duration-200 ease-out hover:shadow-soft">
                
                  <SmartImage src={n.portrait} alt="" className="h-24 w-20 shrink-0 rounded-2xl" position="50% 15%" sizes="80px" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[17px] font-bold text-ink">{l(n.name)}</p>
                    <p className="truncate text-sm text-brand">{l(n.role)}</p>
                    <p className="mt-1.5 truncate text-[13px] text-muted">{n.languages.map(l).join(' · ')}</p>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 shrink-0 text-muted transition-[transform,color] duration-150 ease-out group-hover:translate-x-1 group-hover:text-brand rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden />
                </Link>
              </li>
            )}
          </ul>
        </div>
        <SampleNote className="mt-8">{t('finder.sampleNote')}</SampleNote>
      </Container>
    </section>);

}