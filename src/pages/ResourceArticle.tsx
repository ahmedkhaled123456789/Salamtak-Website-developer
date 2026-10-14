import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { ArticleCard } from '../components/cards/ArticleCard';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { SampleNote } from '../components/ui/SampleNote';
import { SmartImage } from '../components/ui/SmartImage';
import { StateMessage } from '../components/ui/StateMessage';
import { useI18n } from '../contexts/I18nContext';
import { articles } from '../data/articles';
import { articleLd, breadcrumbLd, withBrand } from '../seo/meta';
import { usePageMeta } from '../seo/usePageMeta';
import { config } from '../utils/config';
import { localizedPath } from '../utils/localeRoute';

export function ResourceArticlePage() {
  const { slug } = useParams();
  const { t, l, date, locale } = useI18n();
  const article = articles.find((a) => a.slug === slug);
  const site = config.siteUrl || window.location.origin;
  usePageMeta({
    title: withBrand(article ? l(article.title) : t('nav.resources'), locale),
    description: article ? l(article.excerpt) : undefined,
    image: article?.cover,
    type: 'article',
    noindex: !article,
    jsonLd: article ? [
    articleLd(site, article, locale, localizedPath(`/resources/${article.slug}`, locale)),
    breadcrumbLd(site, [
    { name: t('nav.resources'), path: localizedPath('/resources', locale) },
    { name: l(article.title), path: localizedPath(`/resources/${article.slug}`, locale) }])] :
    undefined
  });

  if (!article) {
    return (
      <Container className="py-20">
        <StateMessage kind="error" title={t('articlePage.notFound')} action={<Button to="/resources">{t('articlePage.back')}</Button>} />
      </Container>);

  }
  const related = articles.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <article>
      <Container className="pt-10">
        <Link to="/resources" className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark">
          <ArrowLeftIcon className="h-4 w-4 rtl:rotate-180" aria-hidden />
          {t('articlePage.back')}
        </Link>
        <header className="mx-auto mt-10 max-w-3xl text-center">
          <p className="text-sm font-semibold text-brand">{l(article.category)}</p>
          <h1 className="mt-4 font-display text-[40px] font-medium leading-[1.08] tracking-[-0.02em] text-ink sm:text-[56px]">{l(article.title)}</h1>
          <p className="mt-6 text-[15px] text-muted">
            {article.author && <>{t('common.by', { name: l(article.author.name) })} · </>}
            <time dateTime={article.date}>{date(article.date, { day: 'numeric', month: 'long', year: 'numeric' })}</time> · {t('common.minRead', { n: article.readMinutes })}
          </p>
        </header>
        <SmartImage src={article.cover} alt={l(article.coverAlt)} priority className="mx-auto mt-12 aspect-[16/9] max-w-5xl rounded-[32px]" />
      </Container>
      <Container className="py-14">
        <div className="mx-auto max-w-[680px]">
          <p className="font-display text-[24px] leading-[1.45] text-ink">{l(article.excerpt)}</p>
          {article.body.map((p) =>
          <p key={p.en} className="mt-6 text-[18px] leading-[1.75] text-ink/85">
              {l(p)}
            </p>
          )}
          <SampleNote className="mt-12 border-t border-line pt-6">{t('blogPage.disclaimer')}</SampleNote>
        </div>
      </Container>
      <section className="border-t border-line bg-white py-16" aria-labelledby="related-articles">
        <Container>
          <h2 id="related-articles" className="font-display text-3xl font-medium text-ink">{t('articlePage.related')}</h2>
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) =>
            <ArticleCard key={a.id} article={a} />
            )}
          </div>
        </Container>
      </section>
    </article>);

}