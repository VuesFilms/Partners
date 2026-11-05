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
    targetCities: ['riyadh', 'buraidah'],
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
    id: 'nouf-alshehri',
    name: { en: 'Nouf Al-Shehri', ar: 'نوف الشهري' },
    type: 'individual',
    city: 'khobar',
    capitalMin: 800_000,
    capitalMax: 2_000_000,
    ticketMin: 350_000,
    ticketMax: 1_000_000,
    sectors: ['beauty', 'education'],
    unitsOperated: 1,
    structures: ['single'],
    targetCities: ['khobar', 'dammam'],
    profile: {
      en: 'Entrepreneur with a background in marketing and a beauty salon she founded in Al Khobar. Wants to add a recognised franchise brand.',
      ar: 'رائدة أعمال بخلفية في التسويق، أسست صالون تجميل في الخبر. ترغب في إضافة علامة امتياز معروفة.',
    },
    focus: {
      en: 'Women-focused beauty and kids’ education concepts with low fit-out costs and strong brand recognition.',
      ar: 'مفاهيم التجميل الموجهة للمرأة وتعليم الأطفال ذات تكاليف تجهيز منخفضة وعلامة معروفة.',
    },
    portfolio: {
      en: '1 independent beauty salon in Al Khobar (operating since 2019).',
      ar: 'صالون تجميل مستقل واحد في الخبر (يعمل منذ 2019).',
    },
    since: 2026,
    listedAt: '2026-10-27',
  },
  {
    id: 'saad-alghamdi',
    name: { en: 'Saad Al-Ghamdi', ar: 'سعد الغامدي' },
    type: 'individual',
    city: 'abha',
    capitalMin: 2_000_000,
    capitalMax: 4_000_000,
    ticketMin: 800_000,
    ticketMax: 2_500_000,
    sectors: ['fitness', 'services', 'coffee'],
    unitsOperated: 3,
    structures: ['single', 'multi'],
    targetCities: ['abha', 'taif'],
    profile: {
      en: 'Engineer and serial small-business owner in Abha. Owns two car-care centres and a neighbourhood café.',
      ar: 'مهندس وصاحب مشاريع صغيرة متعددة في أبها. يملك مركزين للعناية بالسيارات ومقهى في أحد الأحياء.',
    },
    focus: {
      en: 'Brands opening their first units in the Southern Region, especially fitness and convenience services.',
      ar: 'العلامات التي تفتتح أولى وحداتها في المنطقة الجنوبية، خاصة اللياقة البدنية والخدمات اليومية.',
    },
    portfolio: {
      en: '2 car-care centres and 1 café in Abha.',
      ar: 'مركزان للعناية بالسيارات ومقهى واحد في أبها.',
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
    targetCities: ['jeddah', 'makkah', 'madinah', 'riyadh'],
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
    city: 'riyadh',
    capitalMin: 25_000_000,
    capitalMax: 60_000_000,
    ticketMin: 3_000_000,
    ticketMax: 15_000_000,
    sectors: ['fnb', 'beauty', 'fitness'],
    unitsOperated: 18,
    structures: ['multi', 'master'],
    targetCities: ['riyadh', 'khobar', 'jeddah'],
    profile: {
      en: 'Riyadh-based family holding company with real estate, hospitality and lifestyle investments across the Kingdom.',
      ar: 'شركة قابضة عائلية مقرها الرياض تستثمر في العقارات والضيافة ونمط الحياة في أنحاء المملكة.',
    },
    focus: {
      en: 'Premium lifestyle brands that can anchor its own mixed-use developments in Riyadh and the Eastern Province.',
      ar: 'علامات نمط حياة راقية يمكن أن تكون ركيزة لمشاريعها متعددة الاستخدامات في الرياض والمنطقة الشرقية.',
    },
    portfolio: {
      en: '10 restaurants and cafés, 5 beauty salons and 3 fitness studios in Riyadh and Al Khobar.',
      ar: '10 مطاعم ومقاهٍ و5 صالونات تجميل و3 استوديوهات لياقة في الرياض والخبر.',
    },
    since: 2023,
    listedAt: '2026-04-02',
  },
  {
    id: 'daraljassim-fo',
    name: { en: 'Dar Al-Jassim Family Office', ar: 'مكتب دار الجاسم العائلي' },
    type: 'family',
    city: 'madinah',
    capitalMin: 10_000_000,
    capitalMax: 30_000_000,
    ticketMin: 2_000_000,
    ticketMax: 10_000_000,
    sectors: ['education', 'healthcare'],
    unitsOperated: 6,
    structures: ['multi', 'master'],
    targetCities: ['madinah', 'makkah', 'tabuk'],
    profile: {
      en: 'Madinah family office focused on long-term, community-oriented assets in education and healthcare.',
      ar: 'مكتب عائلي في المدينة المنورة يركز على الأصول طويلة الأجل ذات الأثر المجتمعي في التعليم والرعاية الصحية.',
    },
    focus: {
      en: 'Exclusive regional rights in Madinah, Makkah and Tabuk for accredited nursery, tutoring and outpatient brands.',
      ar: 'حقوق إقليمية حصرية في المدينة المنورة ومكة المكرمة وتبوك لعلامات معتمدة في الحضانات والدروس الخصوصية والعيادات الخارجية.',
    },
    portfolio: {
      en: '4 nurseries and 2 outpatient clinics in Madinah.',
      ar: '4 حضانات وعيادتان خارجيتان في المدينة المنورة.',
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
    targetCities: ['riyadh', 'jeddah', 'dammam', 'khobar'],
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
    id: 'najd-meridian',
    name: { en: 'Najd Meridian Ventures', ar: 'نجد ميريديان فنتشرز' },
    type: 'firm',
    city: 'riyadh',
    capitalMin: 30_000_000,
    capitalMax: 90_000_000,
    ticketMin: 4_000_000,
    ticketMax: 20_000_000,
    sectors: ['education', 'healthcare', 'services'],
    unitsOperated: 21,
    structures: ['multi', 'master'],
    targetCities: ['riyadh', 'jeddah', 'dammam', 'abha'],
    profile: {
      en: 'Riyadh growth investor backing essential-services franchises with recurring revenue and regulatory moats.',
      ar: 'مستثمر نمو في الرياض يدعم امتيازات الخدمات الأساسية ذات الإيرادات المتكررة والحواجز التنظيمية.',
    },
    focus: {
      en: 'Education, outpatient healthcare and subscription services with development rights across several Saudi regions.',
      ar: 'التعليم والرعاية الصحية الخارجية وخدمات الاشتراك مع حقوق تطوير في عدة مناطق بالمملكة.',
    },
    portfolio: {
      en: '12 learning centres, 6 clinics and 3 laundry plants across Riyadh, Jeddah and Dammam.',
      ar: '12 مركزًا تعليميًا و6 عيادات و3 مصانع مغاسل في الرياض وجدة والدمام.',
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
    targetCities: ['dammam', 'khobar', 'ahsa', 'riyadh'],
    profile: {
      en: 'Eastern Province fund that co-invests with local operators, providing capital and back-office support for multi-unit roll-outs.',
      ar: 'صندوق في المنطقة الشرقية يستثمر بالشراكة مع مشغّلين محليين، ويوفر رأس المال والدعم الإداري لخطط التوسع متعدد الوحدات.',
    },
    focus: {
      en: 'Coffee, retail and everyday services in Dammam, Al Khobar and Al Ahsa.',
      ar: 'القهوة والتجزئة والخدمات اليومية في الدمام والخبر والأحساء.',
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
    city: 'khobar',
    capitalMin: 8_000_000,
    capitalMax: 25_000_000,
    ticketMin: 1_500_000,
    ticketMax: 6_000_000,
    sectors: ['fnb', 'beauty'],
    unitsOperated: 7,
    structures: ['multi', 'master'],
    targetCities: ['khobar', 'dammam', 'ahsa'],
    profile: {
      en: 'Al Khobar boutique investment house specialising in bringing international lifestyle brands to the Eastern Province.',
      ar: 'دار استثمار متخصصة في الخبر تجلب علامات نمط الحياة العالمية إلى المنطقة الشرقية.',
    },
    focus: {
      en: 'Regional master franchise rights for the Eastern Province in casual dining and beauty.',
      ar: 'حقوق الامتياز الرئيسي الإقليمية في المنطقة الشرقية للمطاعم غير الرسمية والتجميل.',
    },
    portfolio: {
      en: '5 restaurants and 2 beauty bars in Al Khobar and Dammam.',
      ar: '5 مطاعم وركنا تجميل في الخبر والدمام.',
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
    targetCities: ['jeddah', 'riyadh', 'dammam', 'makkah'],
    profile: {
      en: 'Saudi retail group operating fashion, fragrance and café brands in major malls, with in-house fit-out and leasing teams.',
      ar: 'مجموعة تجزئة سعودية تدير علامات أزياء وعطور ومقاهٍ في كبرى المراكز التجارية، مع فرق داخلية للتجهيز والتأجير.',
    },
    focus: {
      en: 'Mall-based retail and beauty brands that benefit from its landlord relationships and prime locations.',
      ar: 'علامات التجزئة والتجميل داخل المراكز التجارية التي تستفيد من علاقاتها مع الملّاك ومواقعها المميزة.',
    },
    portfolio: {
      en: '42 stores across 6 franchised brands in 8 Saudi cities.',
      ar: '42 متجرًا لـ 6 علامات امتياز في 8 مدن سعودية.',
    },
    since: 2023,
    listedAt: '2026-02-19',
  },
  {
    id: 'dune-palm',
    name: { en: 'Dune & Palm Hospitality', ar: 'ديون آند بالم للضيافة' },
    type: 'corporate',
    city: 'riyadh',
    capitalMin: 50_000_000,
    capitalMax: 150_000_000,
    ticketMin: 8_000_000,
    ticketMax: 40_000_000,
    sectors: ['fnb', 'coffee', 'fitness'],
    unitsOperated: 58,
    structures: ['master'],
    targetCities: ['riyadh', 'jeddah', 'dammam', 'makkah', 'madinah'],
    profile: {
      en: 'Saudi hospitality operator running restaurants, cafés and leisure concepts in hotels, malls and airports across the Kingdom.',
      ar: 'مشغّل ضيافة سعودي يدير مطاعم ومقاهي ومفاهيم ترفيهية في الفنادق والمراكز التجارية والمطارات في أنحاء المملكة.',
    },
    focus: {
      en: 'Kingdom-wide master franchise rights for international dining and coffee brands entering Saudi Arabia.',
      ar: 'حقوق الامتياز الرئيسي على مستوى المملكة لعلامات المطاعم والقهوة العالمية الجديدة على السعودية.',
    },
    portfolio: {
      en: '58 units across 9 brands in 7 Saudi cities, including airport and hotel concessions.',
      ar: '58 وحدة لـ 9 علامات في 7 مدن سعودية، منها مواقع في المطارات والفنادق.',
    },
    since: 2023,
    listedAt: '2026-10-03',
  },
];

export const getInvestor = (id: string) => investors.find((i) => i.id === id);
