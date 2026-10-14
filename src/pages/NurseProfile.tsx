import { Link, useNavigate, useParams } from 'react-router-dom';
import { CalendarDaysIcon, LanguagesIcon, LockIcon, MapPinIcon, MessageSquareDashedIcon } from 'lucide-react';
import { AvailabilityPill } from '../components/ui/AvailabilityPill';
import { Badge } from '../components/ui/Badge';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { SampleNote } from '../components/ui/SampleNote';
import { Skeleton } from '../components/ui/Skeleton';
import { SmartImage } from '../components/ui/SmartImage';
import { StateMessage } from '../components/ui/StateMessage';
import { useBookingDraft } from '../contexts/BookingDraftContext';
import { useI18n } from '../contexts/I18nContext';
import { useNurse } from '../hooks/useCatalog';
import { useCatalogData } from '../hooks/useCatalogData';
import { withBrand } from '../seo/meta';
import { usePageMeta } from '../seo/usePageMeta';

export function NurseProfilePage() {
  const { slug = '' } = useParams();
  const { t, l, money, date, locale } = useI18n();
  const navigate = useNavigate();
  const { reset } = useBookingDraft();
  const { data: nurse, isLoading, isError } = useNurse(slug);
  const { services } = useCatalogData();
  // individual people: kept out of search (see seo/meta.ts) but titled for tabs and shares
  usePageMeta({ title: withBrand(nurse ? l(nurse.name) : t('nav.findNurse'), locale), noindex: true });

  if (isLoading) {
    return (
      <Container className="grid min-h-[100svh] gap-10 py-12 lg:grid-cols-[420px_1fr]">
        <Skeleton className="aspect-[4/5] rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-14 w-2/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </Container>);

  }
  if (isError || !nurse) {
    return (
      <Container className="py-20">
        <StateMessage kind="error" title={t('nurseProfile.notFound')} action={<Button to="/nurses">{t('nav.findNurse')}</Button>} />
      </Container>);

  }

  const offered = services.filter((s) => nurse.serviceIds.includes(s.id));
  const book = () => {
    reset({ serviceId: offered[0]?.id, nurseId: nurse.id, genderPreference: nurse.gender });
    navigate('/book');
  };
  const name = l(nurse.name);

  return (
    <Container className="py-10 lg:py-14">
      <Breadcrumbs items={[{ label: t('nav.findNurse'), to: '/nurses' }, { label: name }]} />
      <div className="mt-8 grid gap-10 lg:grid-cols-[420px_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SmartImage src={nurse.portrait} alt={name} priority className="aspect-[4/5] rounded-[32px]" position="50% 20%" />
          <div className="mt-5 rounded-3xl border border-line bg-white p-6">
            <div className="flex items-center justify-between">
              <AvailabilityPill availability={nurse.availability} />
              {nurse.nextAvailable &&
              <span className="text-[13px] text-muted">{t('common.nextAvailable', { date: date(nurse.nextAvailable, { day: 'numeric', month: 'short' }) })}</span>
              }
            </div>
            {nurse.dailyRateSample !== undefined &&
            <p className="mt-4 text-muted">
                <span className="font-display text-3xl text-ink">{money(nurse.dailyRateSample)}</span> {t('common.perDay')}
                <span className="block text-[13px]">{t('common.sampleRate')}</span>
              </p>
            }
            <Button className="mt-5 w-full" size="lg" onClick={book} disabled={nurse.availability === 'unavailable'}>
              {t('nurseProfile.book', { name: name.split(' ')[0] })}
            </Button>
          </div>
        </div>

        <div>
          <p className="text-[15px] font-semibold text-brand">{l(nurse.role)}</p>
          <h1 className="mt-2 font-display text-[44px] font-medium leading-[1.04] tracking-[-0.02em] text-ink sm:text-[60px]">{name}</h1>

          <section className="mt-10" aria-labelledby="np-about">
            <h2 id="np-about" className="text-sm font-bold text-ink">{t('nurseProfile.about')}</h2>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink/80">{l(nurse.bio)}</p>
          </section>

          <section className="mt-10" aria-labelledby="np-details">
            <h2 id="np-details" className="text-sm font-bold text-ink">{t('nurseProfile.details')}</h2>
            <dl className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
              <div className="bg-white p-5">
                <dt className="flex items-center gap-2 text-[13px] text-muted"><LanguagesIcon className="h-4 w-4" aria-hidden />{t('common.languages')}</dt>
                <dd className="mt-1.5 font-semibold text-ink">{nurse.languages.map(l).join(', ')}</dd>
              </div>
              <div className="bg-white p-5">
                <dt className="flex items-center gap-2 text-[13px] text-muted"><MapPinIcon className="h-4 w-4" aria-hidden />{t('nurseProfile.location')}</dt>
                <dd className="mt-1.5 font-semibold text-ink">{l(nurse.city)}</dd>
              </div>
              {nurse.experienceYears !== undefined &&
              <div className="bg-white p-5">
                  <dt className="flex items-center gap-2 text-[13px] text-muted"><CalendarDaysIcon className="h-4 w-4" aria-hidden />{t('nurseProfile.experience')}</dt>
                  <dd className="mt-1.5 font-semibold text-ink">{t('common.experience', { n: nurse.experienceYears })}</dd>
                </div>
              }
            </dl>
          </section>

          <section className="mt-10" aria-labelledby="np-services">
            <h2 id="np-services" className="text-sm font-bold text-ink">{t('nurseProfile.services')}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {offered.map((s) =>
              <li key={s.id}>
                  <Link to={`/services/${s.slug}`} className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-3 transition-shadow duration-200 hover:shadow-soft">
                    <img src={s.image} alt="" className="h-14 w-14 rounded-xl object-cover" loading="lazy" />
                    <span className="font-semibold text-ink group-hover:text-brand-dark">{l(s.title)}</span>
                  </Link>
                </li>
              )}
            </ul>
          </section>

          {nurse.qualifications && nurse.qualifications.length > 0 &&
          <section className="mt-10" aria-labelledby="np-q">
              <h2 id="np-q" className="text-sm font-bold text-ink">{t('nurseProfile.qualifications')}</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {nurse.qualifications.map((q) =>
              <li key={q.en}><Badge tone="neutral">{l(q)}</Badge></li>
              )}
              </ul>
              <SampleNote className="mt-3">{t('nurseProfile.qualificationsNote')}</SampleNote>
            </section>
          }

          <section className="mt-10" aria-labelledby="np-reviews">
            <h2 id="np-reviews" className="text-sm font-bold text-ink">{t('nurseProfile.reviews')}</h2>
            <div className="mt-4 flex items-start gap-4 rounded-2xl border border-dashed border-line bg-white p-5 text-[15px] text-muted">
              <MessageSquareDashedIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
              {t('nurseProfile.noReviews')}
            </div>
          </section>

          <p className="mt-10 flex items-start gap-3 rounded-2xl bg-mint p-5 text-[15px] text-ink/80">
            <LockIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
            {t('nurseProfile.privacy')}
          </p>
          <SampleNote className="mt-6">{t('finder.sampleNote')}</SampleNote>
        </div>
      </div>
    </Container>);

}