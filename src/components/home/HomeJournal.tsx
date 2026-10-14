import { Link } from 'react-router-dom';
import { articles } from '../../data/articles';
import { useI18n } from '../../contexts/I18nContext';
import { ArticleCard } from '../cards/ArticleCard';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { SectionHeader } from '../ui/SectionHeader';
import { SmartImage } from '../ui/SmartImage';

const [featured, ...secondary] = articles;

export function HomeJournal() {
  const { t, l, date } = useI18n();
  return (
    <section className="bg-ivory py-20 lg:py-28" aria-labelledby="journal-title">
      <Container>
        <SectionHeader
          id="journal-title"
          title={t('journal.title')}
          body={t('journal.body')}
          action={
          <Button to="/resources" variant="secondary">
              {t('journal.cta')}
            </Button>
          } />
        
        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <article className="group relative lg:col-span-7">
            <SmartImage
              src={featured.cover}
              alt={l(featured.coverAlt)}
              className="aspect-[16/10] rounded-[28px]"
              imgClassName="transition-transform duration-300 ease-out group-hover:scale-[1.02]" />
            
            <div className="mt-6">
              <p className="text-[13px] font-semibold text-brand">
                {t('journal.featured')} · {l(featured.category)}
              </p>
              <h3 className="mt-2 max-w-xl font-display text-[30px] font-medium leading-tight text-ink group-hover:text-brand-dark sm:text-[36px]">
                <Link to={`/resources/${featured.slug}`} className="after:absolute after:inset-0">
                  {l(featured.title)}
                </Link>
              </h3>
              <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-muted">{l(featured.excerpt)}</p>
              <p className="mt-4 text-[13px] text-muted">
                {featured.author && <>{t('common.by', { name: l(featured.author.name) })} · </>}
                <time dateTime={featured.date}>{date(featured.date)}</time> · {t('common.minRead', { n: featured.readMinutes })}
              </p>
            </div>
          </article>
          <div className="flex flex-col gap-8 lg:col-span-5 lg:border-s lg:border-line lg:ps-10">
            {secondary.map((a) =>
            <ArticleCard key={a.id} article={a} layout="row" />
            )}
          </div>
        </div>
      </Container>
    </section>);

}