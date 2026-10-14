import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { NurseQuery } from '../types/nurse';
import type { ServiceQuery } from '../types/service';
import { careApi } from '../utils/careApi';
import { queryKeys } from '../utils/queryKeys';

export function useServicesInfinite(query: Omit<ServiceQuery, 'page'>) {
  return useInfiniteQuery({
    queryKey: queryKeys.services(query),
    queryFn: ({ pageParam }) => careApi.listServices({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) => last.hasMore ? last.page + 1 : undefined,
    placeholderData: (previous) => previous
  });
}

/** Full catalog (used by selectors and related-service lists). */
export function useAllServices() {
  return useQuery({
    queryKey: queryKeys.services({ pageSize: 100 }),
    queryFn: () => careApi.listServices({ pageSize: 100 }),
    select: (page) => page.items,
    staleTime: 5 * 60 * 1000
  });
}

export function useService(slug: string) {
  return useQuery({ queryKey: queryKeys.service(slug), queryFn: () => careApi.getService(slug) });
}

export function useNurses(query: NurseQuery) {
  return useQuery({
    queryKey: queryKeys.nurses(query),
    queryFn: () => careApi.listNurses(query),
    placeholderData: (previous) => previous
  });
}

export function useNurse(slug: string) {
  return useQuery({ queryKey: queryKeys.nurse(slug), queryFn: () => careApi.getNurse(slug) });
}