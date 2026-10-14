import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArticleCard } from '../components/cards/ArticleCard';
import { PageHero } from '../components/layout/PageHero';
import { Container } from '../components/ui/Container';
import { SampleNote } from '../components/ui/SampleNote';
import { SmartImage } from '../components/ui/SmartImage';
import { useI18n } from '../contexts/I18nContext';
import { articles } from '../data/articles';
import { cn } from '../utils/cn';
import { useStaticPageMeta } from '../seo/usePageMeta';

export function ResourcesPage() {
  const { t, l, date } = useI18n();
  useStaticPageMeta('/resources');
  const [category, setCategory] = useState('all');
  const categories = Array.from(new Map(articles.map((a) => [a.category.en, a.category])).values());
  const list = category === 'all' ? articles : articles.filter((a) => a.category.en === category);
  const [featured, ...rest] = list;

  return (
    <>
      <PageHero title={t('blogPage.title')} body={t('blogPage.body')} crumbs={[{ label: t('nav.resources') }]}>
        <SampleNote>{t('blogPage.disclaimer')}</SampleNote>
      </PageHero>
      <Container className="py-14 lg:py-20">
        <div className="scrollbar-none flex gap-2 overflow-x-auto" role="group" aria-label={t('common.showFilters')}>
          {[{ key: 'all', label: t('blogPage.all') }, ...categories.map((c) => ({ key: c.en, label: l(c) }))].map((c) =>
          <button
            key={c.key}
            type="button"
            aria-pressed={category === c.key}
            onClick={() => setCategory(c.key)}
            className={cn(
              'h-10 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors duration-150',
              category === c.key ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink hover:border-brand/40'
            )}>
            
              {c.label}
            </button>
          )}
        </div>

        {featured &&
        <article className="group relative mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-14">
            <SmartImage src={featured.cover} alt={l(featured.coverAlt)} priority className="aspect-[16/10] rounded-[28px]" imgClassName="transition-transform duration-300 ease-out group-hover:scale-[1.02]" />
            <div>
              <p className="text-[13px] font-semibold text-brand">{l(featured.category)}</p>
              <h2 className="mt-3 font-display text-[34px] font-medium leading-tight text-ink group-hover:text-brand-dark sm:text-[42px]">
                <Link to={`/resources/${featured.slug}`} className="after:absolute after:inset-0">
                  {l(featured.title)}
                </Link>
              </h2>
              <p className="mt-4 text-[17px] leading-relaxed text-muted">{l(featured.excerpt)}</p>
              <p className="mt-5 text-[13px] text-muted">
                {featured.author && <>{t('common.by', { name: l(featured.author.name) })} · </>}
                <time dateTime={featured.date}>{date(featured.date)}</time> · {t('common.minRead', { n: featured.readMinutes })}
              </p>
            </div>
          </article>
        }
        {rest.length > 0 &&
        <div className="mt-16 grid gap-x-6 gap-y-12 border-t border-line pt-14 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a) =>
          <ArticleCard key={a.id} article={a} />
          )}
          </div>
        }
      </Container>
    </>);

}