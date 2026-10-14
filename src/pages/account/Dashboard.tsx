import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CalendarPlusIcon, UserRoundPenIcon, UsersRoundIcon } from 'lucide-react';
import { BookingCard } from '../../components/cards/BookingCard';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { StateMessage } from '../../components/ui/StateMessage';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n, type TranslationKey } from '../../contexts/I18nContext';
import { useBookings } from '../../hooks/useBookings';
import { useCatalogData } from '../../hooks/useCatalogData';
import { careDaysByMonth, tabForBooking } from '../../utils/bookings';

// recharts is ~100 kB gzipped: load it after the rest of the dashboard is on screen
const CareDaysChart = lazy(() => import('../../components/account/CareDaysChart').then((m) => ({ default: m.CareDaysChart })));

const quick: {to: string;key: TranslationKey;icon: typeof CalendarPlusIcon;}[] = [
{ to: '/book', key: 'account.qaBook', icon: CalendarPlusIcon },
{ to: '/nurses', key: 'account.qaNurses', icon: UsersRoundIcon },
{ to: '/account/profile', key: 'account.qaProfile', icon: UserRoundPenIcon }];


export function DashboardPage() {
  const { t, l, date } = useI18n();
  const { user } = useAuth();
  const { serviceById } = useCatalogData();
  const { data, isLoading, isError, refetch } = useBookings();
  const bookings = data ?? [];
  const upcoming = bookings.
  filter((b) => ['upcoming', 'in_progress'].includes(tabForBooking(b))).
  sort((a, b) => a.startDate.localeCompare(b.startDate));
  const activity = bookings.
  flatMap((b) => b.timeline.map((e) => ({ ...e, booking: b }))).
  sort((a, b) => b.at.localeCompare(a.at)).
  slice(0, 5);
  const fields = [user?.firstName, user?.lastName, user?.email, user?.phone, user?.city, user?.address];
  const completion = Math.round(fields.filter(Boolean).length / fields.length * 100);
  const card = 'rounded-3xl border border-line bg-white p-6';

  return (
    <div>
      <h1 className="font-display text-[34px] font-medium leading-tight text-ink sm:text-[40px]">{t('account.welcome', { name: user?.firstName ?? '' })}</h1>
      <p className="mt-1 text-muted">{t('account.welcomeBody')}</p>

      {isError ?
      <StateMessage className="mt-8" kind="error" title={t('common.errorTitle')} body={t('common.errorBody')} action={<Button onClick={() => refetch()}>{t('common.retry')}</Button>} /> :

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <section className={card} aria-labelledby="upcoming-title">
              <div className="flex items-center justify-between">
                <h2 id="upcoming-title" className="text-lg font-bold text-ink">{t('account.upcoming')}</h2>
                <Link to="/account/bookings" className="text-sm font-semibold text-brand hover:text-brand-dark">{t('common.viewAll')}</Link>
              </div>
              <div className="mt-5 space-y-3">
                {isLoading ?
              [0, 1].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />) :
              upcoming.length === 0 ?
              <StateMessage title={t('account.noUpcoming')} action={<Button to="/book">{t('account.qaBook')}</Button>} /> :

              upcoming.slice(0, 3).map((b, i) => <BookingCard key={b.id} booking={b} emphasis={i === 0} />)
              }
              </div>
            </section>
            <section className={card} aria-labelledby="chart-title">
              <h2 id="chart-title" className="text-lg font-bold text-ink">{t('account.careDays')}</h2>
              <p className="text-[13px] text-muted">{t('account.careDaysNote')}</p>
              <div className="mt-5">{isLoading ? <Skeleton className="h-56" /> : <Suspense fallback={<Skeleton className="h-56" />}><CareDaysChart data={careDaysByMonth(bookings)} /></Suspense>}</div>
            </section>
          </div>

          <div className="space-y-6">
            <section className={card} aria-labelledby="qa-title">
              <h2 id="qa-title" className="text-lg font-bold text-ink">{t('account.quickActions')}</h2>
              <ul className="mt-4 space-y-1">
                {quick.map(({ to, key, icon: Icon }) =>
              <li key={to}>
                    <Link to={to} className="group flex items-center gap-3 rounded-xl px-2 py-2.5 text-[15px] font-medium text-ink hover:bg-ivory">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint text-brand"><Icon className="h-4 w-4" aria-hidden /></span>
                      <span className="flex-1">{t(key)}</span>
                      <ArrowRightIcon className="h-4 w-4 text-muted rtl:rotate-180" aria-hidden />
                    </Link>
                  </li>
              )}
              </ul>
            </section>
            {completion < 100 &&
          <section className="rounded-3xl bg-mint p-6" aria-labelledby="completion-title">
                <div className="flex items-baseline justify-between">
                  <h2 id="completion-title" className="font-bold text-ink">{t('account.completion')}</h2>
                  <span className="font-display text-2xl text-brand-dark">{completion}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuenow={completion} aria-valuemin={0} aria-valuemax={100} aria-labelledby="completion-title">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${completion}%` }} />
                </div>
                <p className="mt-3 text-[13px] text-ink/70">{t('account.completionBody')}</p>
              </section>
          }
            <section className={card} aria-labelledby="activity-title">
              <h2 id="activity-title" className="text-lg font-bold text-ink">{t('account.activity')}</h2>
              {isLoading ?
            <Skeleton className="mt-4 h-40" /> :

            <ol className="mt-4 space-y-4">
                  {activity.map((a) => {
                const svc = serviceById(a.booking.serviceId);
                return (
                  <li key={`${a.booking.id}-${a.status}-${a.at}`} className="flex gap-3">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" aria-hidden />
                        <div className="min-w-0 text-sm">
                          <p className="font-semibold text-ink">{t(`status.${a.status}`)}</p>
                          <p className="truncate text-muted">
                            {svc ? l(svc.title) : ''} · {date(a.at, { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </li>);

              })}
                </ol>
            }
            </section>
          </div>
        </div>
      }
    </div>);

}