import { CalendarClockIcon, LayoutDashboardIcon, ReceiptTextIcon, UserRoundCogIcon } from 'lucide-react';
import { images } from '../../data/images';
import { useI18n, type TranslationKey } from '../../contexts/I18nContext';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { SmartImage } from '../ui/SmartImage';

const benefits: {icon: typeof CalendarClockIcon;title: TranslationKey;body: TranslationKey;}[] = [
{ icon: UserRoundCogIcon, title: 'why.t1', body: 'why.b1' },
{ icon: CalendarClockIcon, title: 'why.t2', body: 'why.b2' },
{ icon: ReceiptTextIcon, title: 'why.t3', body: 'why.b3' },
{ icon: LayoutDashboardIcon, title: 'why.t4', body: 'why.b4' }];


export function WhyChoose() {
  const { t, l } = useI18n();
  return (
    <section className="bg-white py-20 lg:py-28" aria-labelledby="why-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SmartImage
              src={images.whyMain}
              alt={l({ en: 'Nurse holding a tablet in a bright home hallway', ar: 'ممرضة تحمل جهازاً لوحياً في ممر منزل مشرق' })}
              className="aspect-[4/5] rounded-[32px] lg:sticky lg:top-28"
              position="50% 30%" />
            
          </div>
          <div className="lg:col-span-7 lg:ps-6">
            <h2 id="why-title" className="max-w-xl font-display text-[38px] font-medium leading-[1.06] tracking-[-0.02em] text-ink sm:text-[50px]">
              {t('why.title')}
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">{t('why.body')}</p>
            <ul className="mt-12 grid gap-x-10 sm:grid-cols-2">
              {benefits.map(({ icon: Icon, title, body }) =>
              <li key={title} className="border-t border-line py-7">
                  <Icon className="h-6 w-6 text-brand" aria-hidden />
                  <h3 className="mt-4 text-lg font-bold text-ink">{t(title)}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{t(body)}</p>
                </li>
              )}
            </ul>
            <div className="mt-6 grid grid-cols-[1fr_1.3fr] gap-4">
              <SmartImage
                src={images.whyEquipment}
                alt={l({ en: 'Stethoscope, blood pressure cuff and notebook on a wooden table', ar: 'سماعة طبية وجهاز ضغط ودفتر على طاولة خشبية' })}
                className="aspect-square rounded-3xl"
                sizes="(min-width: 1024px) 20vw, 45vw" />
              
              <SmartImage
                src={images.whyFamily}
                alt={l({ en: 'Daughter and nurse discussing a care plan with an older father', ar: 'ابنة وممرضة تناقشان خطة رعاية مع أب مسن' })}
                className="aspect-[13/10] self-end rounded-3xl"
                sizes="(min-width: 1024px) 25vw, 55vw" />
              
            </div>
            <Button to="/why-careflow" variant="secondary" className="mt-10">
              {t('why.cta')}
            </Button>
          </div>
        </div>
      </Container>
    </section>);

}