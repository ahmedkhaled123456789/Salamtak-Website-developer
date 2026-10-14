import { Link } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';
import type { Article } from '../../types/content';
import { cn } from '../../utils/cn';
import { SmartImage } from '../ui/SmartImage';

interface ArticleCardProps {
  article: Article;
  layout?: 'stacked' | 'row';
  aspect?: string;
}

export function ArticleCard({ article, layout = 'stacked', aspect = 'aspect-[4/3]' }: ArticleCardProps) {
  const { t, l, date } = useI18n();
  const row = layout === 'row';
  return (
    <article className={cn('group relative', row ? 'grid grid-cols-[132px_1fr] items-center gap-5 sm:grid-cols-[180px_1fr]' : 'flex flex-col')}>
      <SmartImage
        src={article.cover}
        alt={l(article.coverAlt)}
        className={cn('rounded-2xl', row ? 'aspect-square sm:aspect-[4/3]' : aspect)}
        sizes={row ? '180px' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
        imgClassName="transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
      
      <div className={row ? '' : 'pt-5'}>
        <p className="text-[13px] font-semibold text-brand">{l(article.category)}</p>
        <h3 className={cn('mt-1.5 font-display font-medium leading-snug text-ink group-hover:text-brand-dark', row ? 'text-lg sm:text-xl' : 'text-[22px]')}>
          <Link to={`/resources/${article.slug}`} className="after:absolute after:inset-0">
            {l(article.title)}
          </Link>
        </h3>
        <p className="mt-2 text-[13px] text-muted">
          <time dateTime={article.date}>{date(article.date)}</time> · {t('common.minRead', { n: article.readMinutes })}
        </p>
      </div>
    </article>);

}