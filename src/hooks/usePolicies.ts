import { useQuery } from '@tanstack/react-query';
import { careApi } from '../utils/careApi';
import { queryKeys } from '../utils/queryKeys';

/** Booking/cancellation rules in force. Rarely change: cached for 10 minutes. */
export function usePolicies() {
  return useQuery({ queryKey: queryKeys.policies, queryFn: () => careApi.getPolicies(), staleTime: 10 * 60 * 1000 });
}
