import { useMemo, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { Accordion } from '../components/ui/Accordion';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { StateMessage } from '../components/ui/StateMessage';
import { useI18n } from '../contexts/I18nContext';
import { faqs } from '../data/faqs';
import { usePolicies } from '../hooks/usePolicies';
import { faqAnswer } from '../utils/policies';
import type { FaqTopic } from '../types/content';
import { cn } from '../utils/cn';
import { controlClass } from '../utils/styles';
import { faqLd } from '../seo/meta';
import { useStaticPageMeta } from '../seo/usePageMeta';

const topics: Array<FaqTopic | 'all'> = ['all', 'booking', 'pricing', 'payment', 'changes', 'account'];

export function FaqsPage() {
  const { t, l, locale } = useI18n();
  const ld = faqLd(faqs, locale);
  useStaticPageMeta('/faqs', { jsonLd: ld ? [ld] : undefined });
  const [topic, setTopic] = useState<FaqTopic | 'all'>('all');
  const [term, setTerm] = useState('');
  const { data: policies } = usePolicies();

  const items = useMemo(() => {
    const q = term.trim().toLowerCase();
    return faqs.
    filter((f) => (topic === 'all' || f.topic === topic) && (!q || `${l(f.question)} ${faqAnswer(f, locale, policies)}`.toLowerCase().includes(q))).
    map((f) => ({
      id: f.id,
      title: l(f.question),
      content:
      <>
            {f.placeholder &&
        <Badge tone="amber" className="mb-3">
                {t('faqSection.placeholder')}
              </Badge>
        }
            <p>{faqAnswer(f, locale, policies)}</p>
          </>

    }));
  }, [topic, term, l, t, locale, policies]);

  return (
    <>
      <PageHero title={t('faqPage.title')} body={t('faqPage.body')} crumbs={[{ label: t('nav.faqs') }]} />
      <Container className="py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[260px_1fr] lg:gap-16">
          <nav aria-label={t('faqPage.title')} className="lg:sticky lg:top-28 lg:self-start">
            <ul className="scrollbar-none flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
              {topics.map((tp) =>
              <li key={tp} className="shrink-0">
                  <button
                  type="button"
                  aria-pressed={topic === tp}
                  onClick={() => setTopic(tp)}
                  className={cn(
                    'w-full whitespace-nowrap rounded-full px-4 py-2.5 text-start text-[15px] font-semibold transition-colors duration-150 lg:rounded-xl',
                    topic === tp ? 'bg-mint text-brand-dark' : 'text-ink hover:bg-white'
                  )}>
                  
                    {t(`faqPage.${tp}`)}
                  </button>
                </li>
              )}
            </ul>
          </nav>
          <div>
            <div className="relative max-w-md">
              <label htmlFor="faq-search" className="sr-only">
                {t('faqPage.searchPlaceholder')}
              </label>
              <SearchIcon className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
              <input id="faq-search" type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder={t('faqPage.searchPlaceholder')} className={cn(controlClass, 'ps-11')} />
            </div>
            <div className="mt-8">{items.length ? <Accordion items={items} /> : <StateMessage title={t('faqPage.empty')} />}</div>
            <div className="mt-12 flex flex-col items-start gap-4 rounded-3xl bg-mint p-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[17px] font-semibold text-ink">{t('faqSection.body')}</p>
              <Button to="/contact">{t('nav.contact')}</Button>
            </div>
          </div>
        </div>
      </Container>
    </>);

}