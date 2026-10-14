import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';

export function AnnouncementBar() {
  const { t } = useI18n();
  return (
    <div className="bg-brand-deep text-white">
      <div className="mx-auto flex h-10 max-w-[1280px] items-center justify-center gap-3 px-5 text-[13px]">
        <span className="hidden text-white/85 sm:inline">{t('announcement.text')}</span>
        <Link to="/services" className="group inline-flex items-center gap-1 font-semibold text-mint hover:text-white">
          {t('announcement.link')}
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden />
        </Link>
      </div>
    </div>);

}