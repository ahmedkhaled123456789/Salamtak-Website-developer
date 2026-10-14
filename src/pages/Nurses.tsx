import { useDeferredValue } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchIcon } from 'lucide-react';
import { NurseCard } from '../components/cards/NurseCard';
import { PageHero } from '../components/layout/PageHero';
import { FilterDrawer } from '../components/nurses/FilterDrawer';
import { NurseFilters, type NurseFilterState } from '../components/nurses/NurseFilters';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { SampleNote } from '../components/ui/SampleNote';
import { SelectField } from '../components/ui/SelectField';
import { Skeleton } from '../components/ui/Skeleton';
import { StateMessage } from '../components/ui/StateMessage';
import { useI18n } from '../contexts/I18nContext';
import { useNurses } from '../hooks/useCatalog';
import type { GenderPreference, NurseSort } from '../types/nurse';
import { cn } from '../utils/cn';
import { controlClass } from '../utils/styles';
import { useStaticPageMeta } from '../seo/usePageMeta';

const sorts: NurseSort[] = ['recommended', 'price-asc', 'price-desc', 'experience'];

export function NursesPage() {
  const { t } = useI18n();
  useStaticPageMeta('/nurses');
  const [params, setParams] = useSearchParams();
  const filters: NurseFilterState = {
    serviceId: params.get('service') ?? '',
    gender: params.get('gender') as GenderPreference | null ?? 'any',
    availableOnly: params.get('available') === '1'
  };
  const sort = params.get('sort') as NurseSort | null ?? 'recommended';
  const search = params.get('q') ?? '';
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading, isError, isFetching, refetch } = useNurses({
    serviceId: filters.serviceId || undefined,
    gender: filters.gender,
    availableOnly: filters.availableOnly,
    sort,
    search: deferredSearch
  });
  const list = data ?? [];
  const activeCount = Number(Boolean(filters.serviceId)) + Number(filters.gender !== 'any') + Number(filters.availableOnly);

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => v ? next.set(k, v) : next.delete(k));
    setParams(next, { replace: true });
  };
  const onFilter = (patch: Partial<NurseFilterState>) =>
  update({
    ...(patch.serviceId !== undefined && { service: patch.serviceId || null }),
    ...(patch.gender !== undefined && { gender: patch.gender === 'any' ? null : patch.gender }),
    ...(patch.availableOnly !== undefined && { available: patch.availableOnly ? '1' : null })
  });
  const clear = () => setParams(new URLSearchParams(), { replace: true });

  return (
    <>
      <PageHero title={t('nursesPage.title')} body={t('nursesPage.body')} crumbs={[{ label: t('nav.findNurse') }]} />
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block" aria-label={t('common.showFilters')}>
            <div className="sticky top-28">
              <NurseFilters value={filters} onChange={onFilter} />
              {activeCount > 0 &&
              <button type="button" onClick={clear} className="mt-6 px-3 text-sm font-semibold text-brand hover:underline">
                  {t('common.clearFilters')}
                </button>
              }
            </div>
          </aside>
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <label htmlFor="nurse-search" className="sr-only">
                  {t('nursesPage.searchPlaceholder')}
                </label>
                <SearchIcon className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
                <input
                  id="nurse-search"
                  type="search"
                  value={search}
                  onChange={(e) => update({ q: e.target.value || null })}
                  placeholder={t('nursesPage.searchPlaceholder')}
                  className={cn(controlClass, 'ps-11')} />
                
              </div>
              <div className="flex gap-3">
                <div className="lg:hidden">
                  <FilterDrawer resultCount={list.length} activeCount={activeCount}>
                    <NurseFilters value={filters} onChange={onFilter} />
                  </FilterDrawer>
                </div>
                <SelectField
                  label={t('sort.label')}
                  hideLabel
                  wrapperClassName="flex-1 sm:w-60"
                  value={sort}
                  onChange={(e) => update({ sort: e.target.value === 'recommended' ? null : e.target.value })}
                  options={sorts.map((s) => ({ value: s, label: `${t('sort.label')}: ${t(`sort.${s}`)}` }))} />
                
              </div>
            </div>

            <div className="mt-8" aria-live="polite" aria-busy={isLoading}>
              {isError ?
              <StateMessage kind="error" title={t('common.errorTitle')} body={t('common.errorBody')} action={<Button onClick={() => refetch()}>{t('common.retry')}</Button>} /> :
              isLoading ?
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {[0, 1, 2].map((i) =>
                <Skeleton key={i} className="h-[540px] rounded-3xl" />
                )}
                </div> :
              list.length === 0 ?
              <StateMessage
                title={t('nursesPage.emptyTitle')}
                body={t('nursesPage.emptyBody')}
                action={
                <Button variant="secondary" onClick={clear}>
                      {t('common.clearFilters')}
                    </Button>
                } /> :


              <>
                  <h2 className="sr-only">{t('nav.findNurse')}</h2>
                  <p className="mb-5 text-sm text-muted">{t('common.results', { n: list.length })}</p>
                  <div className={cn('grid gap-6 transition-opacity duration-150 sm:grid-cols-2 xl:grid-cols-3', isFetching && 'opacity-60')}>
                    {list.map((n) =>
                  <NurseCard key={n.id} nurse={n} />
                  )}
                  </div>
                </>
              }
            </div>
            <SampleNote className="mt-10">{t('finder.sampleNote')}</SampleNote>
          </div>
        </div>
      </Container>
    </>);

}