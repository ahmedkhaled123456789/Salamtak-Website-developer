import type { Faq, Policies } from '../types/content';
import type { Locale } from '../types/i18n';

/** Human-readable cancellation tiers, e.g. "48 hours or more before the start: 100% refund." */
export function cancellationTiers(p: Policies, locale: Locale): string[] {
  const tiers = [...p.cancellationRefunds].sort((a, b) => b.minHoursBeforeStart - a.minHoursBeforeStart);
  return tiers.map((t, i) => {
    const upper = tiers[i - 1]?.minHoursBeforeStart ?? null;
    const refund =
    locale === 'ar' ?
    t.refundPercent === 0 ? 'لا يوجد استرداد' : `استرداد ${t.refundPercent}%` :
    t.refundPercent === 0 ? 'no refund' : `${t.refundPercent}% refund`;
    if (locale === 'ar') {
      if (upper === null) return `قبل ${t.minHoursBeforeStart} ساعة أو أكثر من البدء: ${refund}.`;
      if (t.minHoursBeforeStart === 0) return `أقل من ${upper} ساعة: ${refund}.`;
      return `بين ${t.minHoursBeforeStart} و${upper} ساعة: ${refund}.`;
    }
    if (upper === null) return `${t.minHoursBeforeStart} hours or more before the start: ${refund}.`;
    if (t.minHoursBeforeStart === 0) return `Less than ${upper} hours: ${refund}.`;
    return `Between ${t.minHoursBeforeStart} and ${upper} hours: ${refund}.`;
  });
}

/** The FAQ answer with live data appended where the entry asks for it. */
export function faqAnswer(f: Faq, locale: Locale, policies: Policies | undefined): string {
  const base = f.answer[locale] || f.answer.en;
  if (f.dynamic === 'cancellation' && policies) return `${base} ${cancellationTiers(policies, locale).join(' ')}`;
  return base;
}
