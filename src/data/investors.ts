import type { CityId, DealStructureId, InvestorTypeId, L, SectorId } from '../i18n/dictionary';

/**
 * Fictional investors. All people, firms and figures are invented for demo
 * purposes. Amounts are in SAR.
 */
export interface Investor {
  id: string;
  name: L;
  type: InvestorTypeId;
  city: CityId;
  capitalMin: number;
  capitalMax: number;
  ticketMin: number;
  ticketMax: number;
  sectors: SectorId[];
  unitsOperated: number;
  structures: DealStructureId[];
  targetCities: CityId[];
  profile: L;
  focus: L;
  portfolio: L;
  since: number;
  /** ISO date used for "Newest" sorting */
  listedAt: string;
}

export const investors: Investor[] = [
  {
    id: 'turki-alsabeel',
    name: { en: 'Turki Al-Sabeel', ar: 'تركي السبيل' },
    type: 'individual',
    city: 'riyadh',
    capitalMin: 1_500_000,
    capitalMax: 3_000_000,
    ticketMin: 450_000,
    ticketMax: 1_500_000,
    sectors: ['coffee', 'fnb'],
    unitsOperated: 2,
    structures: ['single', 'multi'],
    targetCities: ['riyadh', 'dammam'],
    profile: {
      en: 'Former banking professional turned hands-on operator. Opened his first coffee kiosk in 2022 and runs it day to day with a small team.',
      ar: 'مصرفي سابق تحوّل إلى مشغّل ميداني. افتتح أول كشك قهوة عام 2022 ويديره يوميًا مع فريق صغير.',
    },
    focus: {
      en: 'Compact, proven coffee and quick-service formats with fast payback in Riyadh’s growing northern districts.',
      ar: 'نماذج قهوة ووجبات سريعة صغيرة ومثبتة ذات استرداد سريع في أحياء شمال الرياض المتنامية.',
    },
    portfolio: {
      en: '2 coffee kiosks in north Riyadh. Looking to add a third unit and a first fast-casual restaurant.',
      ar: 'كشكا قهوة في شمال الرياض. يسعى لإضافة وحدة ثالثة وأول مطعم وجبات سريعة عصري.',
    },
    since: 2025,
    listedAt: '2026-10-12',
  },
  {
    id: 'noura-alfadhli',
    name: { en: 'Noura Al-Fadhli', ar: 'نورة الفضلي' },
    type: 'individual',
    city: 'kuwait',
    capitalMin: 800_000,
    capitalMax: 2_000_000,
    ticketMin: 350_000,
    ticketMax: 1_000_000,
    sectors: ['beauty', 'education'],
    unitsOperated: 1,
    structures: ['single'],
    targetCities: ['kuwait'],
    profile: {
      en: 'Entrepreneur with a background in marketing and a beauty salon she founded in Salmiya. Wants to add a recognised franchise brand.',
      ar: 'رائدة أعمال بخلفية في التسويق، أسست صالون تجميل في السالمية. ترغب في إضافة علامة امتياز معروفة.',
    },
    focus: {
      en: 'Women-focused beauty and kids’ education concepts with low fit-out costs and strong brand recognition.',
      ar: 'مفاهيم التجميل الموجهة للمرأة وتعليم الأطفال ذات تكاليف تجهيز منخفضة وعلامة معروفة.',
    },
    portfolio: {
      en: '1 independent beauty salon (operating since 2019).',
      ar: 'صالون تجميل مستقل واحد (يعمل منذ 2019).',
    },
    since: 2026,
    listedAt: '2026-10-27',
  },
  {
    id: 'salim-alrawahi',
    name: { en: 'Salim Al-Rawahi', ar: 'سالم الرواحي' },
    type: 'individual',
    city: 'muscat',
    capitalMin: 2_000_000,
    capitalMax: 4_000_000,
    ticketMin: 800_000,
    ticketMax: 2_500_000,
    sectors: ['fitness', 'services', 'coffee'],
    unitsOperated: 3,
    structures: ['single', 'multi'],
    targetCities: ['muscat'],
    profile: {
      en: 'Engineer and serial small-business owner in Muscat. Owns two car-care centres and a neighbourhood café.',
      ar: 'مهندس وصاحب مشاريع صغيرة متعددة في مسقط. يملك مركزين للعناية بالسيارات ومقهى في أحد الأحياء.',
    },
    focus: {
      en: 'First-mover international brands entering Oman, especially fitness and convenience services.',
      ar: 'العلامات العالمية التي تدخل السوق العُماني لأول مرة، خاصة اللياقة البدنية والخدمات اليومية.',
    },
    portfolio: {
      en: '2 car-care centres and 1 café in Muscat.',
      ar: 'مركزان للعناية بالسيارات ومقهى واحد في مسقط.',
    },
    since: 2025,
    listedAt: '2026-09-03',
  },
  {
    id: 'alrashidan-fo',
    name: { en: 'Al-Rashidan Family Office', ar: 'مكتب عائلة الراشدان' },
    type: 'family',
    city: 'jeddah',
    capitalMin: 15_000_000,
    capitalMax: 40_000_000,
    ticketMin: 2_000_000,
    ticketMax: 8_000_000,
    sectors: ['fnb', 'retail', 'healthcare'],
    unitsOperated: 11,
    structures: ['multi', 'master'],
    targetCities: ['jeddah', 'riyadh', 'dammam'],
    profile: {
      en: 'Third-generation Jeddah family office with roots in trading. Operates restaurants and retail units through a dedicated franchise arm.',
      ar: 'مكتب عائلي من الجيل الثالث في جدة بجذور تجارية. يدير مطاعم ومتاجر عبر ذراع مخصصة للامتيازات.',
    },
    focus: {
      en: 'Multi-unit and regional development deals with established international brands, plus selective healthcare clinics.',
      ar: 'صفقات الوحدات المتعددة والتطوير الإقليمي مع علامات عالمية راسخة، إضافة إلى عيادات صحية مختارة.',
    },
    portfolio: {
      en: '7 restaurants across 2 brands, 3 retail stores and 1 dental clinic in western Saudi Arabia.',
      ar: '7 مطاعم لعلامتين و3 متاجر تجزئة وعيادة أسنان واحدة في غرب السعودية.',
    },
    since: 2024,
    listedAt: '2026-06-20',
  },
  {
    id: 'binhamoud-holdings',
    name: { en: 'Bin Hamoud Family Holdings', ar: 'بن حمود العائلية القابضة' },
    type: 'family',
    city: 'dubai',
    capitalMin: 25_000_000,
    capitalMax: 60_000_000,
    ticketMin: 3_000_000,
    ticketMax: 15_000_000,
    sectors: ['fnb', 'beauty', 'fitness'],
    unitsOperated: 18,
    structures: ['multi', 'master'],
    targetCities: ['dubai', 'abudhabi', 'riyadh'],
    profile: {
      en: 'Dubai-based family holding company with real estate, hospitality and lifestyle investments across the UAE.',
      ar: 'شركة قابضة عائلية مقرها دبي تستثمر في العقارات والضيافة ونمط الحياة في الإمارات.',
    },
    focus: {
      en: 'Premium lifestyle brands that can anchor their own mixed-use developments, with ambitions to expand into Saudi Arabia.',
      ar: 'علامات نمط حياة راقية يمكن أن تكون ركيزة لمشاريعها متعددة الاستخدامات، مع طموح للتوسع في السعودية.',
    },
    portfolio: {
      en: '10 restaurants and cafés, 5 beauty salons and 3 fitness studios in Dubai and Abu Dhabi.',
      ar: '10 مطاعم ومقاهٍ و5 صالونات تجميل و3 استوديوهات لياقة في دبي وأبوظبي.',
    },
    since: 2023,
    listedAt: '2026-04-02',
  },
  {
    id: 'daraljassim-fo',
    name: { en: 'Dar Al-Jassim Family Office', ar: 'مكتب دار الجاسم العائلي' },
    type: 'family',
    city: 'doha',
    capitalMin: 10_000_000,
    capitalMax: 30_000_000,
    ticketMin: 2_000_000,
    ticketMax: 10_000_000,
    sectors: ['education', 'healthcare'],
    unitsOperated: 6,
    structures: ['multi', 'master'],
    targetCities: ['doha'],
    profile: {
      en: 'Doha family office focused on long-term, community-oriented assets in education and healthcare.',
      ar: 'مكتب عائلي في الدوحة يركز على الأصول طويلة الأجل ذات الأثر المجتمعي في التعليم والرعاية الصحية.',
    },
    focus: {
      en: 'Exclusive Qatar rights for internationally accredited nursery, tutoring and outpatient brands.',
      ar: 'حقوق حصرية في قطر لعلامات معتمدة دوليًا في الحضانات والدروس الخصوصية والعيادات الخارجية.',
    },
    portfolio: {
      en: '4 nurseries and 2 outpatient clinics in Doha.',
      ar: '4 حضانات وعيادتان خارجيتان في الدوحة.',
    },
    since: 2024,
    listedAt: '2026-05-14',
  },
  {
    id: 'wahat-capital',
    name: { en: 'Wahat Capital', ar: 'واحات كابيتال' },
    type: 'firm',
    city: 'riyadh',
    capitalMin: 40_000_000,
    capitalMax: 120_000_000,
    ticketMin: 5_000_000,
    ticketMax: 30_000_000,
    sectors: ['fnb', 'coffee', 'fitness'],
    unitsOperated: 34,
    structures: ['multi', 'master'],
    targetCities: ['riyadh', 'jeddah', 'dammam'],
    profile: {
      en: 'Riyadh-based private investment firm that builds consumer platforms by acquiring master franchise rights for Saudi Arabia.',
      ar: 'شركة استثمار خاصة في الرياض تبني منصات استهلاكية عبر الاستحواذ على حقوق الامتياز الرئيسي في السعودية.',
    },
    focus: {
      en: 'Master franchise rights for high-growth food, coffee and fitness concepts with a path to 30+ units.',
      ar: 'حقوق الامتياز الرئيسي لمفاهيم الأغذية والقهوة واللياقة سريعة النمو مع إمكانية تجاوز 30 وحدة.',
    },
    portfolio: {
      en: 'Master franchisee for 3 brands: 22 restaurants, 9 coffee shops and 3 gyms across the Kingdom.',
      ar: 'صاحب امتياز رئيسي لـ 3 علامات: 22 مطعمًا و9 مقاهٍ و3 نوادٍ رياضية في أنحاء المملكة.',
    },
    since: 2023,
    listedAt: '2026-03-08',
  },
  {
    id: 'gulf-meridian',
    name: { en: 'Gulf Meridian Ventures', ar: 'جلف ميريديان فنتشرز' },
    type: 'firm',
    city: 'abudhabi',
    capitalMin: 30_000_000,
    capitalMax: 90_000_000,
    ticketMin: 4_000_000,
    ticketMax: 20_000_000,
    sectors: ['education', 'healthcare', 'services'],
    unitsOperated: 21,
    structures: ['multi', 'master'],
    targetCities: ['abudhabi', 'dubai', 'riyadh', 'muscat'],
    profile: {
      en: 'Abu Dhabi growth investor backing essential-services franchises with recurring revenue and regulatory moats.',
      ar: 'مستثمر نمو في أبوظبي يدعم امتيازات الخدمات الأساسية ذات الإيرادات المتكررة والحواجز التنظيمية.',
    },
    focus: {
      en: 'Education, outpatient healthcare and subscription services with multi-country GCC development rights.',
      ar: 'التعليم والرعاية الصحية الخارجية وخدمات الاشتراك مع حقوق تطوير في عدة دول خليجية.',
    },
    portfolio: {
      en: '12 learning centres, 6 clinics and 3 laundry plants across the UAE and Oman.',
      ar: '12 مركزًا تعليميًا و6 عيادات و3 مصانع مغاسل في الإمارات وعُمان.',
    },
    since: 2024,
    listedAt: '2026-07-17',
  },
  {
    id: 'sadeem-fund',
    name: { en: 'Sadeem Franchise Fund', ar: 'صندوق سديم للامتياز' },
    type: 'firm',
    city: 'dammam',
    capitalMin: 20_000_000,
    capitalMax: 50_000_000,
    ticketMin: 1_500_000,
    ticketMax: 10_000_000,
    sectors: ['coffee', 'services', 'retail'],
    unitsOperated: 15,
    structures: ['single', 'multi'],
    targetCities: ['dammam', 'riyadh', 'manama'],
    profile: {
      en: 'Eastern Province fund that co-invests with local operators, providing capital and back-office support for multi-unit roll-outs.',
      ar: 'صندوق في المنطقة الشرقية يستثمر بالشراكة مع مشغّلين محليين، ويوفر رأس المال والدعم الإداري لخطط التوسع متعدد الوحدات.',
    },
    focus: {
      en: 'Coffee, retail and everyday services in Dammam, Khobar and across the causeway to Bahrain.',
      ar: 'القهوة والتجزئة والخدمات اليومية في الدمام والخبر وعبر الجسر إلى البحرين.',
    },
    portfolio: {
      en: '15 units with 6 operating partners: coffee, perfume retail and laundry.',
      ar: '15 وحدة مع 6 شركاء تشغيل: القهوة وتجزئة العطور والمغاسل.',
    },
    since: 2025,
    listedAt: '2026-09-21',
  },
  {
    id: 'pearl-bay',
    name: { en: 'Pearl Bay Capital', ar: 'بيرل باي كابيتال' },
    type: 'firm',
    city: 'manama',
    capitalMin: 8_000_000,
    capitalMax: 25_000_000,
    ticketMin: 1_500_000,
    ticketMax: 6_000_000,
    sectors: ['fnb', 'beauty'],
    unitsOperated: 7,
    structures: ['multi', 'master'],
    targetCities: ['manama', 'kuwait'],
    profile: {
      en: 'Bahrain boutique investment house specialising in bringing international lifestyle brands to smaller GCC markets.',
      ar: 'دار استثمار متخصصة في البحرين تجلب علامات نمط الحياة العالمية إلى أسواق الخليج الأصغر.',
    },
    focus: {
      en: 'Master franchise rights for Bahrain and Kuwait in casual dining and beauty.',
      ar: 'حقوق الامتياز الرئيسي في البحرين والكويت في المطاعم غير الرسمية والتجميل.',
    },
    portfolio: {
      en: '5 restaurants and 2 beauty bars in Bahrain.',
      ar: '5 مطاعم وركنا تجميل في البحرين.',
    },
    since: 2025,
    listedAt: '2026-08-09',
  },
  {
    id: 'tamr-retail',
    name: { en: 'Tamr Retail Group', ar: 'مجموعة تمر للتجزئة' },
    type: 'corporate',
    city: 'jeddah',
    capitalMin: 30_000_000,
    capitalMax: 75_000_000,
    ticketMin: 3_000_000,
    ticketMax: 20_000_000,
    sectors: ['retail', 'beauty', 'coffee'],
    unitsOperated: 42,
    structures: ['multi', 'master'],
    targetCities: ['jeddah', 'riyadh', 'dammam', 'kuwait'],
    profile: {
      en: 'Saudi retail group operating fashion, fragrance and café brands in major malls, with in-house fit-out and leasing teams.',
      ar: 'مجموعة تجزئة سعودية تدير علامات أزياء وعطور ومقاهٍ في كبرى المراكز التجارية، مع فرق داخلية للتجهيز والتأجير.',
    },
    focus: {
      en: 'Mall-based retail and beauty brands that benefit from its landlord relationships and prime locations.',
      ar: 'علامات التجزئة والتجميل داخل المراكز التجارية التي تستفيد من علاقاتها مع الملّاك ومواقعها المميزة.',
    },
    portfolio: {
      en: '42 stores across 6 franchised brands in Saudi Arabia and Kuwait.',
      ar: '42 متجرًا لـ 6 علامات امتياز في السعودية والكويت.',
    },
    since: 2023,
    listedAt: '2026-02-19',
  },
  {
    id: 'dune-palm',
    name: { en: 'Dune & Palm Hospitality', ar: 'ديون آند بالم للضيافة' },
    type: 'corporate',
    city: 'dubai',
    capitalMin: 50_000_000,
    capitalMax: 150_000_000,
    ticketMin: 8_000_000,
    ticketMax: 40_000_000,
    sectors: ['fnb', 'coffee', 'fitness'],
    unitsOperated: 58,
    structures: ['master'],
    targetCities: ['dubai', 'abudhabi', 'riyadh', 'jeddah', 'doha'],
    profile: {
      en: 'Regional hospitality operator running restaurants, cafés and leisure concepts in hotels, malls and airports across the GCC.',
      ar: 'مشغّل ضيافة إقليمي يدير مطاعم ومقاهي ومفاهيم ترفيهية في الفنادق والمراكز التجارية والمطارات في الخليج.',
    },
    focus: {
      en: 'GCC-wide master franchise rights for international dining and coffee brands entering the region.',
      ar: 'حقوق الامتياز الرئيسي على مستوى الخليج لعلامات المطاعم والقهوة العالمية الجديدة على المنطقة.',
    },
    portfolio: {
      en: '58 units across 9 brands in 4 countries, including airport and hotel concessions.',
      ar: '58 وحدة لـ 9 علامات في 4 دول، منها مواقع في المطارات والفنادق.',
    },
    since: 2023,
    listedAt: '2026-10-03',
  },
];

export const getInvestor = (id: string) => investors.find((i) => i.id === id);
