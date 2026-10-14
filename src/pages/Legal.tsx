import { useParams } from 'react-router-dom';
import { FileWarningIcon } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { Container } from '../components/ui/Container';
import { useI18n, type TranslationKey } from '../contexts/I18nContext';
import { legalDocuments } from '../data/legal';
import { withBrand } from '../seo/meta';
import { usePageMeta } from '../seo/usePageMeta';

const titles: Record<string, TranslationKey> = {
  privacy: 'footer.privacy',
  terms: 'footer.terms',
  accessibility: 'footer.accessibility'
};

export function LegalPage() {
  const { doc = 'privacy' } = useParams();
  const { t, l, locale, date } = useI18n();
  const key = (doc in legalDocuments ? doc : 'privacy') as keyof typeof legalDocuments;
  const document = legalDocuments[key];
  const title = t(titles[key] ?? 'footer.privacy');
  // drafts stay out of search results until the official text is approved (see seo/meta.ts NOINDEX_PREFIXES)
  usePageMeta({ title: withBrand(title, locale), noindex: true });
  return (
    <>
      <PageHero title={title} crumbs={[{ label: title }]} />
      <Container className="py-14">
        <article className="max-w-3xl">
          {document.draft &&
          <div role="note" className="mb-10 flex items-start gap-3 rounded-2xl border border-dashed border-coral/40 bg-coral-soft p-5 text-[15px] leading-relaxed text-[#7A2E19]">
              <FileWarningIcon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              {l({
              en: 'Draft pending legal review — this document is not yet in force. Bracketed items will be completed by CareFlow before launch.',
              ar: 'مسودة بانتظار المراجعة القانونية — هذا المستند غير ساري بعد. ستستكمل كيرفلو العناصر الواردة بين أقواس قبل الإطلاق.'
            })}
            </div>
          }
          <p className="text-sm text-muted">
            {l({ en: 'Last updated', ar: 'آخر تحديث' })}: <time dateTime={document.updated}>{date(document.updated, { day: 'numeric', month: 'long', year: 'numeric' })}</time>
          </p>
          <p className="mt-6 text-[17px] leading-relaxed text-ink/85">{l(document.intro)}</p>
          {document.sections.map((s, i) =>
          <section key={i} className="mt-10" aria-labelledby={`legal-${i}`}>
              <h2 id={`legal-${i}`} className="font-display text-2xl font-medium text-ink">{l(s.heading)}</h2>
              {s.paragraphs.map((para, j) =>
            <p key={j} className="mt-3 text-[16px] leading-relaxed text-ink/80">{l(para)}</p>
            )}
            </section>
          )}
        </article>
      </Container>
    </>);

}
