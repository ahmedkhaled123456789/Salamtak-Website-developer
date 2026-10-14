import type { Booking } from '../types/booking';

/** DEMO BOOKINGS for the demo patient account. */
export const demoBookings: Booking[] = [
{
  id: 'bk-1042',
  reference: 'CF-26-1042',
  serviceId: 'svc-elderly',
  nurseId: 'nr-layla',
  startDate: '2026-10-14',
  endDate: '2026-10-20',
  days: 7,
  status: 'confirmed',
  address: 'Sample address — Al Olaya district',
  createdAt: '2026-10-02T09:14:00Z',
  payment: { status: 'succeeded', amount: 2940, currency: 'AED', method: 'Card •••• 4242' },
  timeline: [
  { status: 'created', at: '2026-10-02T09:14:00Z' },
  { status: 'pending_payment', at: '2026-10-02T09:15:00Z' },
  { status: 'confirmed', at: '2026-10-02T09:17:00Z' }],

  permissions: { canCancel: true, canPay: false }
},
{
  id: 'bk-1038',
  reference: 'CF-26-1038',
  serviceId: 'svc-medication',
  nurseId: 'nr-priya',
  startDate: '2026-10-06',
  endDate: '2026-10-12',
  days: 7,
  status: 'in_progress',
  address: 'Sample address — Al Olaya district',
  createdAt: '2026-09-28T15:40:00Z',
  payment: { status: 'succeeded', amount: 1820, currency: 'AED', method: 'Card •••• 4242' },
  timeline: [
  { status: 'created', at: '2026-09-28T15:40:00Z' },
  { status: 'confirmed', at: '2026-09-28T15:44:00Z' },
  { status: 'in_progress', at: '2026-10-06T08:00:00Z' }],

  permissions: { canCancel: false, canPay: false }
},
{
  id: 'bk-1051',
  reference: 'CF-26-1051',
  serviceId: 'svc-recovery',
  nurseId: 'nr-omar',
  startDate: '2026-10-27',
  endDate: '2026-10-31',
  days: 5,
  status: 'pending_payment',
  address: 'Sample address — Al Olaya district',
  createdAt: '2026-10-08T18:02:00Z',
  payment: { status: 'pending', amount: 2000, currency: 'AED' },
  timeline: [
  { status: 'created', at: '2026-10-08T18:02:00Z' },
  { status: 'pending_payment', at: '2026-10-08T18:02:00Z' }],

  permissions: { canCancel: true, canPay: true }
},
{
  id: 'bk-0997',
  reference: 'CF-26-0997',
  serviceId: 'svc-postsurgery',
  nurseId: 'nr-daniel',
  startDate: '2026-08-18',
  endDate: '2026-08-31',
  days: 14,
  status: 'completed',
  address: 'Sample address — Al Olaya district',
  createdAt: '2026-08-10T11:20:00Z',
  payment: { status: 'succeeded', amount: 7280, currency: 'AED', method: 'Card •••• 4242' },
  timeline: [
  { status: 'created', at: '2026-08-10T11:20:00Z' },
  { status: 'confirmed', at: '2026-08-10T11:25:00Z' },
  { status: 'in_progress', at: '2026-08-18T08:00:00Z' },
  { status: 'completed', at: '2026-08-31T18:00:00Z' }],

  permissions: { canCancel: false, canPay: false }
},
{
  id: 'bk-0961',
  reference: 'CF-26-0961',
  serviceId: 'svc-daily',
  nurseId: 'nr-grace',
  startDate: '2026-07-04',
  endDate: '2026-07-06',
  days: 3,
  status: 'cancelled',
  address: 'Sample address — Al Olaya district',
  createdAt: '2026-06-29T10:05:00Z',
  payment: { status: 'failed', amount: 1380, currency: 'AED' },
  timeline: [
  { status: 'created', at: '2026-06-29T10:05:00Z' },
  { status: 'pending_payment', at: '2026-06-29T10:05:00Z' },
  { status: 'cancelled', at: '2026-06-30T10:05:00Z' }],

  permissions: { canCancel: false, canPay: false }
}];