import type { Localized } from '../types/i18n';

/**
 * DRAFT legal documents — written for a UAE home-care platform but NOT reviewed by a lawyer and NOT in force.
 * The pages show a "draft" banner and are `noindex` until the owner approves them (remove `draft: true`).
 * Square-bracketed values ([…]) are facts only the company can supply; they are deliberately not invented.
 */
export interface LegalSection {
  heading: Localized;
  paragraphs: Localized[];
}
export interface LegalDocument {
  draft: boolean;
  updated: string;
  intro: Localized;
  sections: LegalSection[];
}

const p = (en: string, ar: string): Localized => ({ en, ar });

export const legalDocuments: Record<'privacy' | 'terms' | 'accessibility', LegalDocument> = {
  privacy: {
    draft: true,
    updated: '2026-10-11',
    intro: p(
      'This policy explains what personal data CareFlow collects when you use our website and app, why we use it, where it is kept and the choices you have. It is written to meet the UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021) and the law on the use of information and communication technology in health fields (Federal Law No. 2 of 2019).',
      'توضح هذه السياسة البيانات الشخصية التي تجمعها كيرفلو عند استخدامك لموقعنا وتطبيقنا، وسبب استخدامها، ومكان حفظها، والخيارات المتاحة لك. وقد أُعدّت بما يتوافق مع قانون حماية البيانات الشخصية في دولة الإمارات (المرسوم بقانون اتحادي رقم 45 لسنة 2021) وقانون استخدام تقنية المعلومات والاتصالات في المجالات الصحية (القانون الاتحادي رقم 2 لسنة 2019).'
    ),
    sections: [
    {
      heading: p('Who we are', 'من نحن'),
      paragraphs: [
      p(
        'CareFlow is operated by [Company legal name], [Trade licence no.], registered at [Registered address], United Arab Emirates. Home healthcare services are delivered by professionals licensed by [Dubai Health Authority / Department of Health – Abu Dhabi / Ministry of Health and Prevention] under licence no. [Facility licence no.]. You can reach our data protection contact at [privacy@careflow.ae].',
        'تُدار كيرفلو من قِبل [الاسم القانوني للشركة]، [رقم الرخصة التجارية]، ومقرها المسجّل [العنوان المسجّل]، الإمارات العربية المتحدة. يقدّم خدمات الرعاية الصحية المنزلية مختصون مرخّصون من [هيئة الصحة بدبي / دائرة الصحة – أبوظبي / وزارة الصحة ووقاية المجتمع] بموجب الترخيص رقم [رقم ترخيص المنشأة]. يمكنك التواصل مع مسؤول حماية البيانات لدينا عبر [privacy@careflow.ae].'
      )]

    },
    {
      heading: p('What we collect', 'البيانات التي نجمعها'),
      paragraphs: [
      p(
        'Account details: your name, email address, mobile number (which we verify with a one-time code) and password (stored only as a secure hash).',
        'بيانات الحساب: اسمك وبريدك الإلكتروني ورقم هاتفك المحمول (الذي نتحقق منه برمز لمرة واحدة) وكلمة المرور (التي تُحفظ فقط على شكل قيمة مشفّرة آمنة).'
      ),
      p(
        'Care and booking information: the service, dates, address and location you give for a visit, preferences such as the professional’s gender, notes you choose to add, and the booking’s status history. Information about health or care needs is sensitive personal data; we collect only what you choose to provide and use it only to arrange and deliver your care.',
        'معلومات الرعاية والحجز: الخدمة والتواريخ والعنوان والموقع الذي تقدّمه للزيارة، والتفضيلات مثل جنس المختص، والملاحظات التي تختار إضافتها، وسجل حالة الحجز. تُعد المعلومات المتعلقة بالصحة أو احتياجات الرعاية بيانات شخصية حساسة؛ ولا نجمع منها إلا ما تختار تقديمه، ولا نستخدمها إلا لترتيب رعايتك وتقديمها.'
      ),
      p(
        'Payments: payments are processed by our payment provider (Stripe). We receive the payment status and a reference — never your full card number or security code.',
        'المدفوعات: تُعالج المدفوعات عبر مزوّد الدفع لدينا (Stripe). نتلقى حالة الدفع ومرجعاً له فقط، ولا نطّلع أبداً على رقم بطاقتك الكامل أو رمز الأمان.'
      ),
      p(
        'Professionals: for nurses and caregivers we also process identity and licensing documents for verification, profile details shown to patients (first name, initial, photo, experience, languages) and payout information.',
        'المختصون: نعالج أيضاً بالنسبة للممرضين ومقدّمي الرعاية وثائق الهوية والترخيص للتحقق منها، وبيانات الملف الشخصي التي تظهر للمرضى (الاسم الأول والحرف الأول من اسم العائلة والصورة والخبرة واللغات) وبيانات صرف المستحقات.'
      ),
      p(
        'Messages to us: what you write in the contact form, and your email address if you subscribe to our newsletter (only after you confirm by email).',
        'رسائلك إلينا: ما تكتبه في نموذج التواصل، وبريدك الإلكتروني إذا اشتركت في نشرتنا (بعد تأكيدك عبر البريد الإلكتروني فقط).'
      ),
      p(
        'On your device: the website stores your language choice and sign-in session in your browser; the app stores your session in the device’s secure storage. We do not use advertising or third-party tracking cookies.',
        'على جهازك: يحفظ الموقع اختيار اللغة وجلسة تسجيل الدخول في متصفحك، ويحفظ التطبيق جلستك في التخزين الآمن للجهاز. لا نستخدم ملفات تعريف ارتباط إعلانية أو ملفات تتبّع تابعة لجهات خارجية.'
      )]

    },
    {
      heading: p('Why we use it', 'لماذا نستخدمها'),
      paragraphs: [
      p(
        'To provide the service you ask for (creating your account, matching you with a professional, taking bookings and payments, refunds and support); with your explicit consent for health-related information and for newsletters; and to meet legal obligations such as healthcare record-keeping, tax and fraud prevention.',
        'لتقديم الخدمة التي تطلبها (إنشاء حسابك، ومطابقتك مع مختص، وتلقي الحجوزات والمدفوعات، والاسترداد والدعم)؛ وبموافقتك الصريحة على المعلومات المتعلقة بالصحة وعلى النشرات البريدية؛ وللوفاء بالالتزامات القانونية مثل حفظ السجلات الصحية والضرائب ومنع الاحتيال.'
      )]

    },
    {
      heading: p('Who we share it with', 'مع من نشاركها'),
      paragraphs: [
      p(
        'The professional assigned to your booking sees what they need to care for you (name, address, visit details and notes). Service providers act on our instructions: hosting and storage, payments (Stripe), email and SMS delivery, and app notifications. Messages sent through these providers never contain health information. We disclose data to authorities only when the law requires it. We do not sell personal data.',
        'يطّلع المختص المكلّف بحجزك على ما يحتاجه لرعايتك (الاسم والعنوان وتفاصيل الزيارة والملاحظات). ويعمل مزوّدو الخدمات وفق تعليماتنا: الاستضافة والتخزين، والمدفوعات (Stripe)، وإرسال البريد الإلكتروني والرسائل النصية، وإشعارات التطبيق. ولا تتضمن الرسائل المرسلة عبر هؤلاء المزوّدين أي معلومات صحية. ولا نفصح عن البيانات للجهات الرسمية إلا عندما يقتضي القانون ذلك. ولا نبيع البيانات الشخصية.'
      )]

    },
    {
      heading: p('Where it is kept', 'أين تُحفظ'),
      paragraphs: [
      p(
        'Health and booking data is stored and processed in the United Arab Emirates, as required by Federal Law No. 2 of 2019 and its implementing decisions. Limited non-health data (for example an email address and message for delivery) may be processed by providers outside the UAE with appropriate safeguards.',
        'تُحفظ البيانات الصحية وبيانات الحجز وتُعالج داخل دولة الإمارات العربية المتحدة وفقاً لما يقتضيه القانون الاتحادي رقم 2 لسنة 2019 وقراراته التنفيذية. وقد يعالج مزوّدون خارج الدولة بيانات محدودة غير صحية (مثل عنوان البريد الإلكتروني ونص الرسالة لغرض الإرسال) مع ضمانات مناسبة.'
      )]

    },
    {
      heading: p('How long we keep it', 'مدة الاحتفاظ بها'),
      paragraphs: [
      p(
        'Account data for as long as your account is open; booking, health and financial records for the periods required by UAE healthcare and tax law ([retention period to be confirmed]); contact-form messages for two years; newsletter data until you unsubscribe.',
        'نحتفظ ببيانات الحساب ما دام حسابك مفتوحاً؛ وبسجلات الحجز والسجلات الصحية والمالية للمدد التي تقتضيها قوانين الرعاية الصحية والضرائب في الدولة ([مدة الاحتفاظ قيد التأكيد])؛ وبرسائل نموذج التواصل لمدة سنتين؛ وببيانات النشرة البريدية حتى إلغاء اشتراكك.'
      )]

    },
    {
      heading: p('How we protect it', 'كيف نحميها'),
      paragraphs: [
      p(
        'Encryption in transit, private storage for documents with short-lived access links, role-based access for our staff with an audit trail of administrative actions, and verified sign-in with session revocation.',
        'التشفير أثناء النقل، والتخزين الخاص للوثائق مع روابط وصول قصيرة الأجل، والوصول حسب الأدوار لموظفينا مع سجل تدقيق للإجراءات الإدارية، وتسجيل دخول موثّق مع إمكانية إنهاء الجلسات.'
      )]

    },
    {
      heading: p('Your rights', 'حقوقك'),
      paragraphs: [
      p(
        'You can ask to access, correct or delete your data, restrict or object to its use, receive a copy in a portable format, and withdraw consent at any time (withdrawal does not affect earlier processing). Write to [privacy@careflow.ae]; we reply within the period set by law. You may also complain to the UAE Data Office.',
        'يحق لك طلب الاطلاع على بياناتك أو تصحيحها أو حذفها، وتقييد استخدامها أو الاعتراض عليه، والحصول على نسخة منها بصيغة قابلة للنقل، وسحب موافقتك في أي وقت (ولا يؤثر السحب على المعالجة السابقة). راسلنا على [privacy@careflow.ae] وسنرد خلال المدة التي يحددها القانون. ويمكنك أيضاً تقديم شكوى إلى مكتب الإمارات للبيانات.'
      )]

    },
    {
      heading: p('Children', 'الأطفال'),
      paragraphs: [
      p(
        'Accounts are for adults (18+). Care for a child is booked by a parent or legal guardian, who provides and controls the child’s information.',
        'الحسابات مخصّصة للبالغين (18 عاماً فأكثر). يحجز الوالد أو الوصي القانوني الرعاية الخاصة بالطفل، ويكون هو من يقدّم معلوماته ويتحكّم بها.'
      )]

    },
    {
      heading: p('Changes', 'التعديلات'),
      paragraphs: [
      p(
        'We will post updates here with a new date and tell you in advance about significant changes.',
        'سننشر أي تحديثات هنا مع تاريخ جديد، وسنبلغك مسبقاً بالتغييرات الجوهرية.'
      )]

    }]

  },

  terms: {
    draft: true,
    updated: '2026-10-11',
    intro: p(
      'These terms govern your use of the CareFlow website and app and the bookings you make through them. By creating an account or booking care you agree to them.',
      'تحكم هذه الشروط استخدامك لموقع كيرفلو وتطبيقها والحجوزات التي تجريها من خلالهما. وبإنشاء حساب أو حجز رعاية فإنك توافق عليها.'
    ),
    sections: [
    {
      heading: p('Not for emergencies', 'ليست لحالات الطوارئ'),
      paragraphs: [
      p(
        'CareFlow is not an emergency service. In a medical emergency call 998 (ambulance) or 999.',
        'كيرفلو ليست خدمة طوارئ. في حالات الطوارئ الطبية اتصل بالرقم 998 (الإسعاف) أو 999.'
      )]

    },
    {
      heading: p('Our role', 'دورنا'),
      paragraphs: [
      p(
        'CareFlow, operated by [Company legal name] ([Trade licence no.]), arranges home care delivered by professionals whose identity and licences we verify before they can be booked. [Describe whether professionals are employed by CareFlow or independent, as confirmed by legal counsel.]',
        'تتولى كيرفلو، التي تديرها [الاسم القانوني للشركة] ([رقم الرخصة التجارية])، ترتيب الرعاية المنزلية التي يقدّمها مختصون نتحقق من هويتهم وتراخيصهم قبل إتاحة حجزهم. [يُوضَّح ما إذا كان المختصون موظفين لدى كيرفلو أم مستقلين، وفق ما يؤكده المستشار القانوني.]'
      )]

    },
    {
      heading: p('Your account', 'حسابك'),
      paragraphs: [
      p(
        'You must be 18 or older, give accurate information and keep your password private. You are responsible for bookings made with your account. We may suspend accounts that are misused.',
        'يجب أن يكون عمرك 18 عاماً أو أكثر، وأن تقدّم معلومات صحيحة، وأن تحافظ على سرية كلمة المرور. وتتحمّل مسؤولية الحجوزات التي تتم من خلال حسابك. ويجوز لنا تعليق الحسابات التي يُساء استخدامها.'
      )]

    },
    {
      heading: p('Bookings and prices', 'الحجوزات والأسعار'),
      paragraphs: [
      p(
        'Prices are in UAE dirhams (AED). Rates shown while browsing are informational; the binding price is the quote shown before you pay, including any fees, discounts and VAT where applicable. A booking is held for a limited time while you pay and is confirmed only after payment succeeds and the professional accepts.',
        'الأسعار بالدرهم الإماراتي. الأسعار المعروضة أثناء التصفح للاطلاع فقط؛ والسعر الملزم هو عرض السعر الذي يظهر قبل الدفع، بما في ذلك أي رسوم وخصومات وضريبة القيمة المضافة حيثما تنطبق. ويُحجز الموعد لفترة محدودة أثناء الدفع، ولا يُؤكَّد الحجز إلا بعد نجاح الدفع وقبول المختص له.'
      )]

    },
    {
      heading: p('Cancellations and refunds', 'الإلغاء والاسترداد'),
      paragraphs: [
      p(
        'Refunds depend on how far ahead of the start you cancel, under the cancellation rules in force (shown on our FAQ page and before you confirm a cancellation). If a professional declines or does not respond to a paid booking, you are refunded in full. Refunds are returned to the original payment method.',
        'يعتمد الاسترداد على المدة المتبقية قبل بدء الرعاية عند الإلغاء، وفق قواعد الإلغاء المعمول بها (المعروضة في صفحة الأسئلة الشائعة وقبل تأكيد الإلغاء). وإذا رفض المختص حجزاً مدفوعاً أو لم يرد عليه، يُسترد المبلغ كاملاً. وتُعاد المبالغ المستردة إلى وسيلة الدفع الأصلية.'
      )]

    },
    {
      heading: p('Care at home', 'الرعاية في المنزل'),
      paragraphs: [
      p(
        'Please give accurate information about the care needed and a safe place to work. Professionals may decline tasks outside their licence or that are unsafe. Do not pay professionals outside the platform.',
        'يُرجى تقديم معلومات دقيقة عن الرعاية المطلوبة وتوفير مكان آمن للعمل. ويحق للمختصين رفض المهام التي تتجاوز نطاق ترخيصهم أو غير الآمنة. ولا تدفع للمختصين خارج المنصة.'
      )]

    },
    {
      heading: p('Reviews and conduct', 'التقييمات والسلوك'),
      paragraphs: [
      p(
        'Reviews must be honest and about your own experience. We may remove content that is abusive, misleading or reveals other people’s personal information.',
        'يجب أن تكون التقييمات صادقة وتتعلق بتجربتك الشخصية. ويجوز لنا حذف المحتوى المسيء أو المضلل أو الذي يكشف معلومات شخصية لآخرين.'
      )]

    },
    {
      heading: p('Liability', 'المسؤولية'),
      paragraphs: [
      p(
        '[Limitation-of-liability wording to be drafted by legal counsel in line with UAE consumer protection law (Federal Law No. 15 of 2020).]',
        '[تُصاغ أحكام تحديد المسؤولية من قِبل المستشار القانوني بما يتوافق مع قانون حماية المستهلك في الدولة (القانون الاتحادي رقم 15 لسنة 2020).]'
      )]

    },
    {
      heading: p('Governing law', 'القانون الواجب التطبيق'),
      paragraphs: [
      p(
        'These terms are governed by the laws of the United Arab Emirates as applied in [Emirate]. Disputes are subject to the courts of [Emirate].',
        'تخضع هذه الشروط لقوانين دولة الإمارات العربية المتحدة كما تُطبَّق في [الإمارة]، وتختص محاكم [الإمارة] بالنظر في أي نزاع.'
      )]

    }]

  },

  accessibility: {
    draft: true,
    updated: '2026-10-11',
    intro: p(
      'We want everyone — including older adults and people with disabilities — to be able to find and book care with CareFlow.',
      'نريد أن يتمكن الجميع — ومنهم كبار السن والأشخاص ذوو الإعاقة — من العثور على الرعاية وحجزها عبر كيرفلو.'
    ),
    sections: [
    {
      heading: p('Our target', 'هدفنا'),
      paragraphs: [
      p(
        'We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 level AA on the website and app.',
        'نسعى إلى استيفاء إرشادات إتاحة محتوى الويب (WCAG) 2.1 بالمستوى AA في الموقع والتطبيق.'
      )]

    },
    {
      heading: p('What we do', 'ما نقوم به'),
      paragraphs: [
      p(
        'Text colours meet AA contrast, every page can be used with a keyboard with a visible focus indicator and a “skip to content” link, images have text alternatives, forms announce errors, Arabic is shown right-to-left, and animations respect your device’s reduced-motion setting.',
        'تستوفي ألوان النصوص متطلبات التباين للمستوى AA، ويمكن استخدام كل صفحة بلوحة المفاتيح مع مؤشر تركيز واضح ورابط «تخطَّ إلى المحتوى»، وللصور بدائل نصية، وتعلن النماذج عن الأخطاء، وتُعرض العربية من اليمين إلى اليسار، وتحترم الحركات إعداد تقليل الحركة في جهازك.'
      )]

    },
    {
      heading: p('Known limitations', 'قيود معروفة'),
      paragraphs: [
      p(
        'Some charts in your account are visual summaries; the same information is available as text in your booking list. We test accessibility with automated tools (such as Lighthouse) and by hand.',
        'بعض الرسوم البيانية في حسابك ملخصات مرئية، وتتوفر المعلومات نفسها نصاً في قائمة حجوزاتك. ونختبر إمكانية الوصول بأدوات آلية (مثل Lighthouse) وبالمراجعة اليدوية.'
      )]

    },
    {
      heading: p('Tell us', 'أخبرنا'),
      paragraphs: [
      p(
        'If something is hard to use, contact us through the contact page or at [accessibility@careflow.ae] and we will help you book by another way while we fix it.',
        'إذا واجهت صعوبة في استخدام أي جزء، تواصل معنا عبر صفحة التواصل أو على [accessibility@careflow.ae] وسنساعدك على الحجز بطريقة أخرى ريثما نصلح المشكلة.'
      )]

    }]

  }
};
