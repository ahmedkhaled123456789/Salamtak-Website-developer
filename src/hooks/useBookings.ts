import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { BookingDraft, PaymentSimulation } from '../types/booking';
import { careApi } from '../utils/careApi';
import { queryKeys } from '../utils/queryKeys';

export function useBookings(enabled = true) {
  return useQuery({ queryKey: queryKeys.bookings, queryFn: () => careApi.listBookings(), enabled });
}

/** Full booking history, 50 at a time (newest first). Shares the `bookings` key prefix, so mutations refresh it. */
export function useBookingHistory() {
  return useInfiniteQuery({
    queryKey: queryKeys.bookingsPage,
    queryFn: ({ pageParam }) => careApi.listBookingsPage(pageParam, 50),
    initialPageParam: 1,
    getNextPageParam: (last) => last.hasMore ? last.page + 1 : undefined
  });
}

/** Polls while the backend reports a payment in flight. */
export function useBooking(id: string) {
  return useQuery({
    queryKey: queryKeys.booking(id),
    queryFn: () => careApi.getBooking(id),
    refetchInterval: (query) => query.state.data?.payment.status === 'processing' ? 1200 : false
  });
}

export function useQuote(draft: BookingDraft) {
  return useQuery({
    queryKey: queryKeys.quote(draft),
    queryFn: () => careApi.quote(draft),
    enabled: Boolean(draft.serviceId) && draft.days > 0,
    placeholderData: (previous) => previous
  });
}

export function useCreateBooking() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ draft, key }: {draft: BookingDraft;key: string;}) => careApi.createBooking(draft, key),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.bookings })
  });
}

export function useCancelBooking() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => careApi.cancelBooking(id),
    onSuccess: (booking) => {
      client.setQueryData(queryKeys.booking(booking.id), booking);
      client.invalidateQueries({ queryKey: queryKeys.bookings });
    }
  });
}

export function useStartPayment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, simulate }: {id: string;simulate: PaymentSimulation;}) => careApi.startPayment(id, simulate),
    onSuccess: (booking) => {
      client.setQueryData(queryKeys.booking(booking.id), booking);
      client.invalidateQueries({ queryKey: queryKeys.bookings });
    }
  });
}