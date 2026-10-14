import { useI18n } from '../../contexts/I18nContext';
import { NewsletterForm } from '../forms/NewsletterForm';
import { Container } from '../ui/Container';

export function NewsletterSection() {
  const { t } = useI18n();
  return (
    <section className="bg-ivory pb-20 lg:pb-24" aria-labelledby="newsletter-title">
      <Container>
        <div className="grid items-center gap-8 rounded-[28px] bg-mint px-8 py-10 sm:px-12 lg:grid-cols-[1fr_520px] lg:gap-16 lg:py-12">
          <div>
            <h2 id="newsletter-title" className="font-display text-[30px] font-medium leading-tight text-ink sm:text-[36px]">
              {t('newsletter.title')}
            </h2>
            <p className="mt-2 text-[16px] text-ink/70">{t('newsletter.body')}</p>
          </div>
          <NewsletterForm />
        </div>
      </Container>
    </section>);

}