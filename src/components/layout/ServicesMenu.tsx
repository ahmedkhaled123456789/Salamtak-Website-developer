import { Link, useNavigate } from 'react-router-dom';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { ArrowRightIcon, ChevronDownIcon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { useCatalogData } from '../../hooks/useCatalogData';

export function ServicesMenu() {
  const { t, l } = useI18n();
  const featured = useCatalogData().services.slice(0, 8);
  const navigate = useNavigate();
  return (
    <Dropdown.Root modal={false}>
      <Dropdown.Trigger className="group inline-flex h-9 items-center gap-1 rounded-full px-3 text-[15px] font-medium text-ink outline-none transition-colors duration-150 hover:text-brand data-[state=open]:text-brand">
        {t('nav.services')}
        <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 ease-out group-data-[state=open]:rotate-180" aria-hidden />
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content
          align="start"
          sideOffset={12}
          className="z-50 w-[560px] origin-[var(--radix-dropdown-menu-content-transform-origin)] rounded-3xl border border-line bg-white p-3 shadow-lift data-[state=open]:animate-[menu-in_180ms_cubic-bezier(0.23,1,0.32,1)]">
          
          <div className="grid grid-cols-[1fr_180px] gap-3">
            <div className="grid grid-cols-1 gap-0.5">
              {featured.map((s) =>
              <Dropdown.Item
                key={s.id}
                onSelect={() => navigate(`/services/${s.slug}`)}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-[15px] text-ink outline-none data-[highlighted]:bg-mint/60">
                
                  <img src={s.image} alt="" className="h-9 w-9 rounded-lg object-cover" loading="lazy" />
                  <span className="font-medium">{l(s.title)}</span>
                </Dropdown.Item>
              )}
            </div>
            <div className="flex flex-col justify-between rounded-2xl bg-mint p-5">
              <p className="font-display text-xl leading-snug text-brand-deep">{t('nav.servicesIntro')}</p>
              <Dropdown.Item asChild>
                <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark outline-none data-[highlighted]:underline">
                  {t('nav.allServices')}
                  <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" aria-hidden />
                </Link>
              </Dropdown.Item>
            </div>
          </div>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>);

}