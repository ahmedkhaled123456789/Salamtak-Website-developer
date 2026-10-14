import { Link } from 'react-router-dom';
import { ChevronRightIcon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: {items: Crumb[];}) {
  const { t } = useI18n();
  const all: Crumb[] = [{ label: t('common.breadcrumbHome'), to: '/' }, ...items];
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        {all.map((c, i) =>
        <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRightIcon className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />}
            {c.to && i < all.length - 1 ?
          <Link to={c.to} className="transition-colors duration-150 hover:text-brand">
                {c.label}
              </Link> :

          <span aria-current="page" className="font-medium text-ink">
                {c.label}
              </span>
          }
          </li>
        )}
      </ol>
    </nav>);

}