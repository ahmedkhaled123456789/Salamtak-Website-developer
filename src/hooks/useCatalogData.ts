import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Nurse } from '../types/nurse';
import type { CareService } from '../types/service';
import { careApi } from '../utils/careApi';
import { queryKeys } from '../utils/queryKeys';

const NONE: never[] = [];

/**
 * The whole catalogue (services + nurses) as served by the active data source. Components that need to look
 * things up by id (booking cards, checkout, menus) use this instead of importing the bundled sample arrays, so
 * ids, prices and pictures always come from the backend in live mode.
 */
export function useCatalogData() {
  const query = useQuery({
    queryKey: queryKeys.catalog,
    queryFn: async () => {
      const [services, nurses] = await Promise.all([careApi.listServices({ pageSize: 100 }), careApi.listNurses({})]);
      return { services: services.items, nurses };
    },
    staleTime: 5 * 60 * 1000
  });
  const services: CareService[] = query.data?.services ?? NONE;
  const nurses: Nurse[] = query.data?.nurses ?? NONE;

  /** Matches the live id, the slug, or the id the bundled sample content (testimonials, articles) uses. */
  const serviceById = useCallback(
    (id: string | undefined) => services.find((s) => s.id === id || s.legacyId === id || s.slug === id),
    [services]
  );
  const nurseById = useCallback((id: string | undefined) => nurses.find((n) => n.id === id), [nurses]);

  return useMemo(
    () => ({ services, nurses, serviceById, nurseById, isLoading: query.isLoading, isError: query.isError }),
    [services, nurses, serviceById, nurseById, query.isLoading, query.isError]
  );
}
