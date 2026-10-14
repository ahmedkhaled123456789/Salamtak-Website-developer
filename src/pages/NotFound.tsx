import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { SmartImage } from '../components/ui/SmartImage';
import { useI18n } from '../contexts/I18nContext';
import { articles } from '../data/articles';
import { withBrand } from '../seo/meta';
import { usePageMeta } from '../seo/usePageMeta';

export function NotFoundPage() {
  const { t, l, num, locale } = useI18n();
  // a SPA answers unknown URLs with HTTP 200, so the page itself must say "don't index me"
  usePageMeta({ title: withBrand(t('notFound.title'), locale), noindex: true });
  return (
    <Container className="py-16 lg:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <p className="font-display text-[96px] leading-none text-brand/20 sm:text-[140px]" aria-hidden>
            {num(404)}
          </p>
          <h1 className="mt-2 font-display text-[40px] font-medium leading-tight text-ink sm:text-[52px]">{t('notFound.title')}</h1>
          <p className="mt-4 max-w-md text-lg text-muted">{t('notFound.body')}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button to="/" size="lg">
              {t('notFound.home')}
            </Button>
            <Button to="/services" size="lg" variant="secondary">
              {t('notFound.services')}
            </Button>
          </div>
        </div>
        <SmartImage src={articles[0].cover} alt={l({ en: 'A calm, empty living room with an armchair by the window', ar: 'غرفة معيشة هادئة وخالية بها كرسي بجانب النافذة' })} className="aspect-[4/3] rounded-[32px]" />
      </div>
    </Container>);

}