import { faqs } from '../../data/faqs';
import { useI18n } from '../../contexts/I18nContext';
import { Accordion } from '../ui/Accordion';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';

export function HomeFaq() {
  const { t, l } = useI18n();
  const items = faqs.slice(0, 7).map((f) => ({
    id: f.id,
    title: l(f.question),
    content:
    <>
        {f.placeholder &&
      <Badge tone="amber" className="mb-3">
            {t('faqSection.placeholder')}
          </Badge>
      }
        <p>{l(f.answer)}</p>
      </>

  }));
  return (
    <section className="bg-white py-20 lg:py-28" aria-labelledby="faq-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[380px_1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 id="faq-title" className="font-display text-[38px] font-medium leading-[1.06] tracking-[-0.02em] text-ink sm:text-[50px]">
              {t('faqSection.title')}
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-muted">{t('faqSection.body')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/faqs" variant="secondary">
                {t('faqSection.cta')}
              </Button>
              <Button to="/contact" variant="ghost">
                {t('nav.contact')}
              </Button>
            </div>
          </div>
          <Accordion items={items} defaultOpen={items[0]?.id} />
        </div>
      </Container>
    </section>);

}