import { useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { BookingCard } from '../../components/cards/BookingCard';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { StateMessage } from '../../components/ui/StateMessage';
import { useI18n } from '../../contexts/I18nContext';
import { useBookingHistory } from '../../hooks/useBookings';
import { useCatalogData } from '../../hooks/useCatalogData';
import type { BookingTab } from '../../types/booking';
import { tabForBooking } from '../../utils/bookings';
import { cn } from '../../utils/cn';
import { controlClass } from '../../utils/styles';

const tabs: BookingTab[] = ['upcoming', 'in_progress', 'completed', 'cancelled'];

export function BookingsPage() {
  const { t, num } = useI18n();
  const [tab, setTab] = useState<BookingTab>('upcoming');
  const [term, setTerm] = useState('');
  const { data, isLoading, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } = useBookingHistory();
  const { serviceById } = useCatalogData();
  const all = data?.pages.flatMap((p) => p.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;
  const q = term.trim().toLowerCase();
  const list = all.
  filter((b) => tabForBooking(b) === tab).
  filter((b) => {
    if (!q) return true;
    const svc = serviceById(b.serviceId);
    return `${b.reference} ${svc?.title.en ?? ''} ${svc?.title.ar ?? ''}`.toLowerCase().includes(q);
  }).
  sort((a, b) => tab === 'upcoming' ? a.startDate.localeCompare(b.startDate) : b.startDate.localeCompare(a.startDate));

  return (
    <div>
      <h1 className="font-display text-[34px] font-medium text-ink sm:text-[40px]">{t('nav.bookings')}</h1>
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label={t('nav.bookings')} className="scrollbar-none flex gap-1 overflow-x-auto rounded-full bg-white p-1 ring-1 ring-line">
          {tabs.map((tb) => {
            const count = all.filter((b) => tabForBooking(b) === tb).length;
            return (
              <button
                key={tb}
                role="tab"
                type="button"
                aria-selected={tab === tb}
                onClick={() => setTab(tb)}
                className={cn(
                  'flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors duration-150',
                  tab === tb ? 'bg-brand text-white' : 'text-ink hover:bg-ivory'
                )}>
                
                {t(`account.tabs.${tb}`)}
                <span className={cn('rounded-full px-1.5 text-xs', tab === tb ? 'bg-white/20' : 'bg-ivory text-muted')}>{num(count)}</span>
              </button>);

          })}
        </div>
        <div className="relative md:w-80">
          <label htmlFor="booking-search" className="sr-only">{t('account.searchBookings')}</label>
          <SearchIcon className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input id="booking-search" type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder={t('account.searchBookings')} className={cn(controlClass, 'ps-11')} />
        </div>
      </div>
      <div role="tabpanel" className="mt-6 space-y-3" aria-live="polite">
        {isError ?
        <StateMessage kind="error" title={t('common.errorTitle')} body={t('common.errorBody')} action={<Button onClick={() => refetch()}>{t('common.retry')}</Button>} /> :
        isLoading ?
        [0, 1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />) :
        list.length === 0 ?
        <StateMessage title={t('account.emptyTab')} action={<Button to="/book">{t('account.qaBook')}</Button>} /> :

        list.map((b) => <BookingCard key={b.id} booking={b} />)
        }
      </div>
      {hasNextPage &&
      <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-sm text-muted">{t('account.loadedOf', { shown: all.length, total })}</p>
          <Button variant="secondary" loading={isFetchingNextPage} onClick={() => fetchNextPage()}>
            {t('account.loadMore')}
          </Button>
        </div>
      }
    </div>);

}