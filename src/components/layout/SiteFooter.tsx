import { Link } from 'react-router-dom';
import { FacebookIcon, InstagramIcon, LinkedinIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { useI18n, type TranslationKey } from '../../contexts/I18nContext';
import { useCatalogData } from '../../hooks/useCatalogData';
import { NewsletterForm } from '../forms/NewsletterForm';
import { Container } from '../ui/Container';
import { Logo } from '../ui/Logo';

const company: {to: string;key: TranslationKey;}[] = [
{ to: '/about', key: 'nav.about' },
{ to: '/why-careflow', key: 'nav.why' },
{ to: '/how-it-works', key: 'nav.howItWorks' },
{ to: '/stories', key: 'nav.reviews' },
{ to: '/contact', key: 'nav.contact' }];


const patients: {to: string;key: TranslationKey;}[] = [
{ to: '/nurses', key: 'nav.findNurse' },
{ to: '/resources', key: 'nav.resources' },
{ to: '/faqs', key: 'nav.faqs' },
{ to: '/account', key: 'nav.account' }];


export function SiteFooter() {
  const { t, l } = useI18n();
  const { services } = useCatalogData();
  const heading = 'mb-4 text-sm font-semibold text-white';
  const link = 'text-[15px] text-white/70 transition-colors duration-150 hover:text-white';

  return (
    <footer className="bg-brand-deep text-white">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm">
            <Logo tone="light" />
            <p className="mt-5 text-[15px] leading-relaxed text-white/70">{t('footer.tagline')}</p>
            <p className="mt-8 text-sm font-semibold">{t('footer.newsletter')}</p>
            <div className="mt-3">
              <NewsletterForm tone="light" compact />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            <div>
              <h3 className={heading}>{t('footer.services')}</h3>
              <ul className="space-y-3">
                {services.slice(0, 5).map((s) =>
                <li key={s.id}>
                    <Link to={`/services/${s.slug}`} className={link}>
                      {l(s.title)}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h3 className={heading}>{t('footer.company')}</h3>
              <ul className="space-y-3">
                {company.map((c) =>
                <li key={c.to}>
                    <Link to={c.to} className={link}>
                      {t(c.key)}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h3 className={heading}>{t('footer.resources')}</h3>
              <ul className="space-y-3">
                {patients.map((c) =>
                <li key={c.to}>
                    <Link to={c.to} className={link}>
                      {t(c.key)}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h3 className={heading}>{t('footer.contact')}</h3>
              <ul className="space-y-3 text-[15px] text-white/70">
                <li className="flex items-center gap-2">
                  <MailIcon className="h-4 w-4 shrink-0" aria-hidden />
                  {t('footer.contactEmail')}
                </li>
                <li className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 shrink-0" aria-hidden />
                  {t('footer.contactPhone')}
                </li>
                <li className="text-[13px] text-white/60">{t('footer.contactNote')}</li>
              </ul>
              <div className="mt-6 flex gap-2" aria-label={t('footer.socialNote')}>
                {[FacebookIcon, InstagramIcon, LinkedinIcon].map((Icon, i) =>
                <span key={i} title={t('footer.socialNote')} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/50">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>{t('footer.rights', { year: String(new Date().getFullYear()) })}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li><Link to="/legal/privacy" className="hover:text-white">{t('footer.privacy')}</Link></li>
            <li><Link to="/legal/terms" className="hover:text-white">{t('footer.terms')}</Link></li>
            <li><Link to="/legal/accessibility" className="hover:text-white">{t('footer.accessibility')}</Link></li>
          </ul>
        </div>
      </Container>
    </footer>);

}