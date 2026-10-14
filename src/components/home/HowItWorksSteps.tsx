import { CalendarHeartIcon, ClipboardListIcon, ShieldCheckIcon, UsersRoundIcon } from 'lucide-react';
import { useI18n, type TranslationKey } from '../../contexts/I18nContext';
import { Container } from '../ui/Container';
import { SectionHeader } from '../ui/SectionHeader';

const steps: {icon: typeof ClipboardListIcon;title: TranslationKey;body: TranslationKey;}[] = [
{ icon: ClipboardListIcon, title: 'how.s1', body: 'how.b1' },
{ icon: CalendarHeartIcon, title: 'how.s2', body: 'how.b2' },
{ icon: UsersRoundIcon, title: 'how.s3', body: 'how.b3' },
{ icon: ShieldCheckIcon, title: 'how.s4', body: 'how.b4' }];


/** Sequential steps: horizontal timeline on desktop, vertical on mobile. */
export function HowItWorksSteps({ showHeader = true }: {showHeader?: boolean;}) {
  const { t, num } = useI18n();
  return (
    <section className="bg-mint py-20 lg:py-28" aria-labelledby={showHeader ? 'how-title' : undefined}>
      <Container>
        {showHeader && <SectionHeader id="how-title" title={t('how.title')} body={t('how.body')} align="center" />}
        <ol className="relative mt-16 grid gap-10 lg:grid-cols-4 lg:gap-8">
          <span aria-hidden className="absolute start-[27px] top-2 h-[calc(100%-16px)] w-px bg-brand/25 lg:start-0 lg:top-[27px] lg:h-px lg:w-full" />
          {steps.map(({ icon: Icon, title, body }, i) =>
          <li key={title} className="relative flex gap-6 lg:block">
              <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-brand/20 bg-white font-display text-xl font-semibold text-brand">
                {num(i + 1)}
              </span>
              <div className="lg:mt-8">
                <Icon className="h-6 w-6 text-brand-dark" aria-hidden />
                <h3 className="mt-3 text-xl font-bold text-ink">{t(title)}</h3>
                <p className="mt-2 max-w-[280px] text-[15px] leading-relaxed text-ink/70">{t(body)}</p>
              </div>
            </li>
          )}
        </ol>
      </Container>
    </section>);

}