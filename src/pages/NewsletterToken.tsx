import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { StateMessage } from '../components/ui/StateMessage';
import { useI18n } from '../contexts/I18nContext';
import { withBrand } from '../seo/meta';
import { usePageMeta } from '../seo/usePageMeta';
import { careApi } from '../utils/careApi';

/** Target of the links in newsletter emails: `/newsletter/confirm?token=…` and `/newsletter/unsubscribe?token=…`. */
export function NewsletterTokenPage({ mode }: {mode: 'confirm' | 'unsubscribe';}) {
  const { t, locale } = useI18n();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [state, setState] = useState<'working' | 'ok' | 'invalid'>(token ? 'working' : 'invalid');
  const started = useRef(false);
  const title = mode === 'confirm' ? t('newsletter.confirmTitle') : t('newsletter.unsubscribeTitle');
  usePageMeta({ title: withBrand(title, locale), noindex: true });

  useEffect(() => {
    if (!token || started.current) return; // once, even under StrictMode
    started.current = true;
    const run = mode === 'confirm' ? careApi.confirmNewsletter(token) : careApi.unsubscribeNewsletter(token);
    run.then(() => setState('ok'), () => setState('invalid'));
  }, [mode, token]);

  return (
    <Container className="min-h-[60svh] py-20">
      <h1 className="sr-only">{title}</h1>
      {state === 'working' ?
      <StateMessage title={t('newsletter.working')} /> :
      <StateMessage
        kind={state === 'ok' ? 'success' : 'error'}
        title={
        state === 'ok' ?
        mode === 'confirm' ? t('newsletter.confirmOk') : t('newsletter.unsubscribeOk') :
        t('newsletter.tokenInvalid')
        }
        action={<Button to="/">{t('nav.home')}</Button>} />

      }
    </Container>);

}
