import { HeadsetIcon, LockKeyholeIcon, SlidersHorizontalIcon, UserRoundCheckIcon } from 'lucide-react';
import { useI18n, type TranslationKey } from '../../contexts/I18nContext';
import { Container } from '../ui/Container';

const items: {icon: typeof HeadsetIcon;title: TranslationKey;body: TranslationKey;}[] = [
{ icon: UserRoundCheckIcon, title: 'trust.t1', body: 'trust.d1' },
{ icon: SlidersHorizontalIcon, title: 'trust.t2', body: 'trust.d2' },
{ icon: LockKeyholeIcon, title: 'trust.t3', body: 'trust.d3' },
{ icon: HeadsetIcon, title: 'trust.t4', body: 'trust.d4' }];


export function TrustStrip() {
  const { t } = useI18n();
  return (
    <section className="border-y border-line bg-white">
      <Container>
        <ul className="grid divide-line sm:grid-cols-2 lg:grid-cols-4 lg:divide-x rtl:lg:divide-x-reverse">
          {items.map(({ icon: Icon, title, body }) =>
          <li key={title} className="flex gap-4 py-8 lg:px-8 lg:first:ps-0 lg:last:pe-0">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mint text-brand">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-[15px] font-bold text-ink">{t(title)}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{t(body)}</p>
              </div>
            </li>
          )}
        </ul>
      </Container>
    </section>);

}