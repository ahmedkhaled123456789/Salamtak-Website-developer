import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckIcon, InfoIcon } from 'lucide-react';
import { ServiceCard } from '../components/cards/ServiceCard';
import { Accordion } from '../components/ui/Accordion';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { DaysStepper } from '../components/ui/DaysStepper';
import { SampleNote } from '../components/ui/SampleNote';
import { Skeleton } from '../components/ui/Skeleton';
import { SmartImage } from '../components/ui/SmartImage';
import { StateMessage } from '../components/ui/StateMessage';
import { useBookingDraft } from '../contexts/BookingDraftContext';
import { useI18n } from '../contexts/I18nContext';
import { faqs } from '../data/faqs';
import { useAllServices, useService } from '../hooks/useCatalog';
import { breadcrumbLd, serviceLd, withBrand } from '../seo/meta';
import { usePageMeta } from '../seo/usePageMeta';
import { config } from '../utils/config';
import { localizedPath } from '../utils/localeRoute';

export function ServiceDetailPage() {
  const { slug = '' } = useParams();
  const { t, l, money, locale } = useI18n();
  const navigate = useNavigate();
  const { reset } = useBookingDraft();
  const { data: service, isLoading, isError, error } = useService(slug);
  const { data: all } = useAllServices();
  const [days, setDays] = useState<number | null>(null);
  const site = config.siteUrl || window.location.origin;
  const path = localizedPath(`/services/${slug}`, locale);
  usePageMeta({
    title: withBrand(service ? l(service.title) : t('nav.services'), locale),
    description: service ? l(service.summary) : undefined,
    image: service?.image || undefined,
    noindex: isError,
    jsonLd: service ? [
    serviceLd(site, { name: l(service.title), description: l(service.summary), path, image: service.image || undefined }),
    breadcrumbLd(site, [{ name: t('nav.services'), path: localizedPath('/services', locale) }, { name: l(service.title), path }])] :
    undefined
  });

  if (isLoading) {
    return (
      // at least one screen tall: keeps the footer below the fold so it doesn't jump when the page arrives (CLS)
      <Container className="min-h-[100svh] py-12">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="mt-8 h-14 w-2/3" />
        <Skeleton className="mt-8 aspect-[21/9] w-full rounded-3xl" />
      </Container>);

  }
  if (isError || !service) {
    const notFound = (error as {code?: string;} | null)?.code === 'not_found';
    return (
      <Container className="py-20">
        <StateMessage kind="error" title={notFound ? t('serviceDetail.notFound') : t('common.errorTitle')} action={<Button to="/services">{t('nav.allServices')}</Button>} />
      </Container>);

  }

  const chosenDays = days ?? Math.max(service.minDays, Math.min(5, service.maxDays));
  const rate = service.dailyRateSample;
  const related = (all ?? []).filter((s) => s.category === service.category && s.id !== service.id).slice(0, 3);
  const faqItems = faqs.
  filter((f) => f.topic === 'booking' || f.topic === 'pricing').
  map((f) => ({ id: f.id, title: l(f.question), content: l(f.answer) }));

  const startBooking = () => {
    reset({ serviceId: service.id, days: chosenDays });
    navigate('/book');
  };

  const summary =
  <div className="rounded-3xl border border-line bg-white p-6 shadow-soft">
      <p className="text-sm font-semibold text-ink">{t('serviceDetail.summary')}</p>
      <p id="detail-days" className="mt-5 text-[13px] font-medium text-muted">{t('serviceDetail.duration')}</p>
      <DaysStepper id="detail-days" value={chosenDays} min={service.minDays} max={service.maxDays} onChange={setDays} className="mt-2" />
      <p className="mt-2 text-[13px] text-muted">{t('serviceDetail.durationHint', { min: service.minDays, max: service.maxDays })}</p>
      {rate !== null &&
    <dl className="mt-6 space-y-2 border-t border-line pt-5 text-[15px]">
          <div className="flex justify-between">
            <dt className="text-muted">{t('bookingPreview.dailyRate')}</dt>
            <dd className="font-semibold tabular-nums">{money(rate)}</dd>
          </div>
          <div className="flex items-end justify-between pt-2">
            <dt className="font-semibold">{t('serviceDetail.estimate')}</dt>
            <dd className="font-display text-3xl tabular-nums text-brand-dark">{money(rate * chosenDays)}</dd>
          </div>
        </dl>
    }
      <Button className="mt-6 w-full" size="lg" onClick={startBooking}>
        {t('serviceDetail.book')}
      </Button>
      <SampleNote className="mt-4">{t('booking.sampleQuote')}</SampleNote>
    </div>;


  return (
    <>
      <Container className="pt-10">
        <Breadcrumbs items={[{ label: t('nav.services'), to: '/services' }, { label: l(service.title) }]} />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-brand">{t(`categories.${service.category}`)}</p>
            <h1 className="mt-2 font-display text-[44px] font-medium leading-[1.04] tracking-[-0.02em] text-ink sm:text-[60px]">{l(service.title)}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{l(service.summary)}</p>
          </div>
          {rate !== null &&
          <p className="text-muted">
              {t('common.from')} <span className="font-display text-3xl text-ink">{money(rate)}</span> {t('common.perDay')}
              <span className="block text-[13px]">{t('common.sampleRate')}</span>
            </p>
          }
        </div>
        <SmartImage src={service.image} alt={l(service.imageAlt)} priority className="mt-10 aspect-[16/9] rounded-[32px] lg:aspect-[21/9]" />
      </Container>

      <Container className="py-14 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[1fr_380px] lg:gap-16">
          <div>
            <section aria-labelledby="about-svc">
              <h2 id="about-svc" className="font-display text-3xl font-medium text-ink">{t('serviceDetail.about')}</h2>
              <p className="mt-4 text-[17px] leading-relaxed text-ink/80">{l(service.description)}</p>
            </section>
            <section aria-labelledby="included" className="mt-12">
              <h2 id="included" className="font-display text-3xl font-medium text-ink">{t('serviceDetail.included')}</h2>
              <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
                {service.includes.map((item) =>
                <li key={item.en} className="flex items-start gap-3 border-t border-line py-4 text-[15px] text-ink">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                    {l(item)}
                  </li>
                )}
              </ul>
            </section>
            <section aria-labelledby="notes" className="mt-12 rounded-3xl bg-mint p-7">
              <h2 id="notes" className="flex items-center gap-2 text-lg font-bold text-ink">
                <InfoIcon className="h-5 w-5 text-brand" aria-hidden />
                {t('serviceDetail.notes')}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{l(service.notes)}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{t('serviceDetail.scopeNote')}</p>
            </section>
            <section aria-labelledby="svc-faq" className="mt-14">
              <h2 id="svc-faq" className="mb-4 font-display text-3xl font-medium text-ink">{t('serviceDetail.faq')}</h2>
              <Accordion items={faqItems} />
            </section>
          </div>
          <aside className="hidden lg:block">
            <div className="sticky top-28">{summary}</div>
          </aside>
          <div className="lg:hidden">{summary}</div>
        </div>
      </Container>

      {related.length > 0 &&
      <section className="border-t border-line bg-white py-16" aria-labelledby="related">
          <Container>
            <h2 id="related" className="font-display text-3xl font-medium text-ink">{t('serviceDetail.related')}</h2>
            <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) =>
            <ServiceCard key={s.id} service={s} showPrice />
            )}
            </div>
          </Container>
        </section>
      }

      <div className="sticky bottom-0 z-20 flex items-center justify-between gap-4 border-t border-line bg-white/95 px-5 py-3 backdrop-blur lg:hidden">
        {rate !== null &&
        <p className="text-sm text-muted">
            <span className="font-bold text-ink">{money(rate * chosenDays)}</span> · {t('serviceDetail.estimate')}
          </p>
        }
        <Button onClick={startBooking}>{t('common.bookCare')}</Button>
      </div>
    </>);

}