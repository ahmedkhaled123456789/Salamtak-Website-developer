import { useDeferredValue } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchIcon } from 'lucide-react';
import { ServiceCard } from '../components/cards/ServiceCard';
import { PageHero } from '../components/layout/PageHero';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { SampleNote } from '../components/ui/SampleNote';
import { SelectField } from '../components/ui/SelectField';
import { Skeleton } from '../components/ui/Skeleton';
import { StateMessage } from '../components/ui/StateMessage';
import { useI18n } from '../contexts/I18nContext';
import { useServicesInfinite } from '../hooks/useCatalog';
import type { ServiceCategory, ServiceSort } from '../types/service';
import { cn } from '../utils/cn';
import { controlClass } from '../utils/styles';
import { useStaticPageMeta } from '../seo/usePageMeta';

const categories: Array<ServiceCategory | 'all'> = ['all', 'elderly', 'recovery', 'nursing', 'daily-living'];
const sorts: ServiceSort[] = ['popular', 'price-asc', 'price-desc', 'name'];

export function ServicesPage() {
  const { t } = useI18n();
  useStaticPageMeta('/services');
  const [params, setParams] = useSearchParams();
  const search = params.get('q') ?? '';
  const category = params.get('category') as ServiceCategory | 'all' | null ?? 'all';
  const sort = params.get('sort') as ServiceSort | null ?? 'popular';
  const deferredSearch = useDeferredValue(search);

  const query = useServicesInfinite({ search: deferredSearch, category, sort, pageSize: 9 });
  const items = query.data?.pages.flatMap((p) => p.items) ?? [];
  const total = query.data?.pages[0]?.total ?? 0;

  const setParam = (key: string, value: string, fallback: string) => {
    const next = new URLSearchParams(params);
    if (value && value !== fallback) next.set(key, value);else
    next.delete(key);
    setParams(next, { replace: true });
  };

  return (
    <>
      <PageHero title={t('servicesPage.title')} body={t('servicesPage.body')} crumbs={[{ label: t('nav.services') }]} />
      <Container className="py-12 lg:py-16">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0" role="group" aria-label={t('common.showFilters')}>
            {categories.map((c) =>
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setParam('category', c, 'all')}
              className={cn(
                'h-10 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors duration-150',
                category === c ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink hover:border-brand/40'
              )}>
              
                {t(`categories.${c}`)}
              </button>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative sm:w-72">
              <label htmlFor="service-search" className="sr-only">
                {t('servicesPage.searchPlaceholder')}
              </label>
              <SearchIcon className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
              <input
                id="service-search"
                type="search"
                value={search}
                onChange={(e) => setParam('q', e.target.value, '')}
                placeholder={t('servicesPage.searchPlaceholder')}
                className={cn(controlClass, 'ps-11')} />
              
            </div>
            <SelectField
              label={t('sort.label')}
              hideLabel
              wrapperClassName="sm:w-56"
              value={sort}
              onChange={(e) => setParam('sort', e.target.value, 'popular')}
              options={sorts.map((s) => ({ value: s, label: `${t('sort.label')}: ${t(`sort.${s}`)}` }))} />
            
          </div>
        </div>

        <div className="mt-10" aria-live="polite" aria-busy={query.isLoading}>
          {query.isError ?
          <StateMessage kind="error" title={t('common.errorTitle')} body={t('common.errorBody')} action={<Button onClick={() => query.refetch()}>{t('common.retry')}</Button>} /> :
          query.isLoading ?
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) =>
            <div key={i}>
                  <Skeleton className="aspect-[4/3] rounded-2xl" />
                  <Skeleton className="mt-5 h-5 w-1/2" />
                  <Skeleton className="mt-3 h-4 w-full" />
                </div>
            )}
            </div> :
          items.length === 0 ?
          <StateMessage
            title={t('servicesPage.emptyTitle')}
            body={t('servicesPage.emptyBody')}
            action={
            <Button variant="secondary" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                  {t('common.clearFilters')}
                </Button>
            } /> :


          <>
              <h2 className="sr-only">{t('nav.allServices')}</h2>
              <p className="mb-6 text-sm text-muted">{t('servicesPage.showing', { shown: items.length, total })}</p>
              <div className={cn('grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3', query.isFetching && !query.isFetchingNextPage && 'opacity-60')}>
                {items.map((s) =>
              <ServiceCard key={s.id} service={s} showPrice />
              )}
              </div>
              {query.hasNextPage &&
            <div className="mt-14 flex justify-center">
                  <Button variant="secondary" size="lg" loading={query.isFetchingNextPage} onClick={() => query.fetchNextPage()}>
                    {t('servicesPage.loadMore')}
                  </Button>
                </div>
            }
            </>
          }
        </div>
        <SampleNote className="mt-14">{t('servicesSection.note')}</SampleNote>
      </Container>
    </>);

}