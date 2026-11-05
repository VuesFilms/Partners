/**
 * Single translation dictionary for the whole platform.
 *
 *  - `ui`        : every interface string.
 *  - `sectors`, `cities`, `countries`, … : labels for the shared taxonomy.
 *
 * Sample data (brand names, profiles, descriptions) lives in src/data and uses
 * the same `{ en, ar }` shape so every visible string exists in both languages.
 */

export type Lang = 'en' | 'ar';
export type L = { en: string; ar: string };

export const ui = {
  brand: { en: 'Partners', ar: 'شركاء' },
  brandAlt: { en: 'شركاء', ar: 'Partners' },
  valueStatement: {
    en: 'Where Saudi investors and franchise brands find each other.',
    ar: 'حيث يلتقي المستثمرون في السعودية بالعلامات التجارية الباحثة عن امتياز.',
  },
  heroEyebrow: { en: 'Franchise matchmaking in Saudi Arabia', ar: 'منصة توفيق الامتيازات التجارية في السعودية' },
  whoAreYou: { en: 'Who are you?', ar: 'من أنت؟' },
  chooseSide: { en: 'Choose your side to get started.', ar: 'اختر صفتك للبدء.' },
  imInvestor: { en: "I'm an Investor", ar: 'أنا مستثمر' },
  imInvestorDesc: {
    en: 'Browse vetted franchise brands ready to expand across Saudi Arabia.',
    ar: 'تصفّح علامات امتياز موثوقة جاهزة للتوسع في أنحاء المملكة.',
  },
  imInvestorCta: { en: 'Explore franchises', ar: 'استكشف الامتيازات' },
  imFranchise: { en: "I'm a Franchise", ar: 'أنا صاحب امتياز تجاري' },
  imFranchiseDesc: {
    en: 'Meet individuals, family offices and firms with capital ready to deploy.',
    ar: 'تعرّف على أفراد ومكاتب عائلية وشركات لديها رأس مال جاهز للاستثمار.',
  },
  imFranchiseCta: { en: 'Find investors', ar: 'ابحث عن مستثمرين' },
  brandsListed: { en: 'brands listed', ar: 'علامة مدرجة' },
  investorsActive: { en: 'active investors', ar: 'مستثمر نشط' },
  howItWorks: { en: 'How it works', ar: 'كيف تعمل المنصة' },
  step1: { en: 'Choose your side', ar: 'اختر صفتك' },
  step2: { en: 'Filter for fit', ar: 'صفِّ حسب الملاءمة' },
  step3: { en: 'Express interest', ar: 'أبدِ اهتمامك' },

  // Navigation / chrome
  navFranchises: { en: 'Franchises', ar: 'الامتيازات' },
  navInvestors: { en: 'Investors', ar: 'المستثمرون' },
  navHome: { en: 'Home', ar: 'الرئيسية' },
  menu: { en: 'Menu', ar: 'القائمة' },
  close: { en: 'Close', ar: 'إغلاق' },
  switchLang: { en: 'العربية', ar: 'English' },
  switchLangShort: { en: 'ع', ar: 'EN' },
  switchLangLabel: { en: 'Switch to Arabic', ar: 'التبديل إلى الإنجليزية' },
  themeLight: { en: 'Light mode', ar: 'الوضع الفاتح' },
  themeDark: { en: 'Dark mode', ar: 'الوضع الداكن' },
  footerNote: {
    en: 'Demo platform. All brands, investors and figures are illustrative.',
    ar: 'منصة تجريبية. جميع العلامات والمستثمرين والأرقام توضيحية.',
  },
  rights: { en: 'Partners demo', ar: 'نسخة تجريبية من شركاء' },

  // Stats
  statBrands: { en: 'Franchise brands listed', ar: 'علامة امتياز مدرجة' },
  statInvestors: { en: 'Active investors', ar: 'مستثمر نشط' },
  statCapital: { en: 'Total capital available', ar: 'إجمالي رأس المال المتاح' },
  statRequests: { en: 'Interest requests sent', ar: 'طلب اهتمام مُرسل' },

  // Marketplace
  marketTitle: { en: 'Franchise marketplace', ar: 'سوق الامتيازات' },
  marketSubtitle: {
    en: 'Brands actively looking for investors and operators across Saudi Arabia.',
    ar: 'علامات تبحث عن مستثمرين ومشغّلين في أنحاء المملكة.',
  },
  directoryTitle: { en: 'Investor directory', ar: 'دليل المستثمرين' },
  directorySubtitle: {
    en: 'Capital partners ready to open, grow or master-franchise your brand.',
    ar: 'شركاء برأس مال جاهز لافتتاح علامتك أو توسيعها أو امتلاك امتيازها الرئيسي.',
  },
  searchBrands: { en: 'Search brands', ar: 'ابحث عن علامة' },
  searchInvestors: { en: 'Search investors', ar: 'ابحث عن مستثمر' },
  filters: { en: 'Filters', ar: 'التصفية' },
  apply: { en: 'Apply', ar: 'تطبيق' },
  reset: { en: 'Reset', ar: 'إعادة ضبط' },
  clearAll: { en: 'Clear all', ar: 'مسح الكل' },
  sector: { en: 'Sector', ar: 'القطاع' },
  sectors: { en: 'Sectors', ar: 'القطاعات' },
  preferredSector: { en: 'Preferred sector', ar: 'القطاع المفضّل' },
  investmentRange: { en: 'Investment range', ar: 'نطاق الاستثمار' },
  capitalRange: { en: 'Capital available', ar: 'رأس المال المتاح' },
  location: { en: 'Region / city', ar: 'المنطقة / المدينة' },
  baseLocation: { en: 'Base region / city', ar: 'منطقة / مدينة المقر' },
  allLocations: { en: 'All of Saudi Arabia', ar: 'كل مناطق المملكة' },
  allRegion: { en: 'All of', ar: 'كل' },
  investorType: { en: 'Investor type', ar: 'نوع المستثمر' },
  sortBy: { en: 'Sort by', ar: 'ترتيب حسب' },
  sortNewest: { en: 'Newest', ar: 'الأحدث' },
  sortInvLow: { en: 'Investment: low to high', ar: 'الاستثمار: من الأقل' },
  sortInvHigh: { en: 'Investment: high to low', ar: 'الاستثمار: من الأعلى' },
  sortCapLow: { en: 'Capital: low to high', ar: 'رأس المال: من الأقل' },
  sortCapHigh: { en: 'Capital: high to low', ar: 'رأس المال: من الأعلى' },
  results: { en: 'results', ar: 'نتيجة' },
  result: { en: 'result', ar: 'نتيجة' },
  showResults: { en: 'Show results', ar: 'عرض النتائج' },
  noResults: { en: 'No matches yet', ar: 'لا توجد نتائج' },
  noResultsHint: {
    en: 'Try widening the range or clearing a filter.',
    ar: 'جرّب توسيع النطاق أو إزالة أحد عوامل التصفية.',
  },

  // Cards
  investment: { en: 'Investment', ar: 'الاستثمار' },
  branches: { en: 'Branches', ar: 'الفروع' },
  branchesCount: { en: 'branches', ar: 'فرعًا' },
  targetCities: { en: 'Target cities', ar: 'المدن المستهدفة' },
  origin: { en: 'Origin', ar: 'المنشأ' },
  capital: { en: 'Capital', ar: 'رأس المال' },
  unitsOperated: { en: 'Units operated', ar: 'الوحدات المُشغّلة' },
  units: { en: 'units', ar: 'وحدة' },
  baseCity: { en: 'Based in', ar: 'المقر' },
  viewDetails: { en: 'View details', ar: 'عرض التفاصيل' },
  interestSent: { en: 'Interest sent', ar: 'تم إرسال الاهتمام' },
  newListing: { en: 'New', ar: 'جديد' },
  more: { en: 'more', ar: 'أخرى' },

  // Franchise detail
  back: { en: 'Back', ar: 'رجوع' },
  backToMarket: { en: 'Back to marketplace', ar: 'العودة إلى السوق' },
  backToDirectory: { en: 'Back to directory', ar: 'العودة إلى الدليل' },
  overview: { en: 'Overview', ar: 'نظرة عامة' },
  founded: { en: 'Founded', ar: 'سنة التأسيس' },
  ksaBranches: { en: 'Branches in Saudi Arabia', ar: 'الفروع في السعودية' },
  totalBranches: { en: 'Branches worldwide', ar: 'الفروع حول العالم' },
  investmentBreakdown: { en: 'Investment breakdown', ar: 'تفاصيل الاستثمار' },
  franchiseFee: { en: 'Franchise fee', ar: 'رسوم الامتياز' },
  setupCost: { en: 'Total setup cost', ar: 'إجمالي تكلفة التأسيس' },
  royalty: { en: 'Royalty', ar: 'الإتاوة' },
  marketingFee: { en: 'Marketing fee', ar: 'رسوم التسويق' },
  ofSales: { en: 'of gross sales', ar: 'من إجمالي المبيعات' },
  payback: { en: 'Estimated payback', ar: 'فترة الاسترداد المتوقعة' },
  months: { en: 'months', ar: 'شهرًا' },
  unitSize: { en: 'Typical unit size', ar: 'المساحة النموذجية' },
  sqm: { en: 'm²', ar: 'م²' },
  whatProvided: { en: 'What the franchisor provides', ar: 'ما يقدّمه مانح الامتياز' },
  expansionCities: { en: 'Target expansion cities', ar: 'مدن التوسع المستهدفة' },
  expressInterest: { en: 'Express interest', ar: 'أبدِ اهتمامك' },
  interestAlready: { en: 'Interest sent · Send again', ar: 'تم الإرسال · أرسل مجددًا' },
  noCommitment: {
    en: 'No commitment. The brand team will reply directly.',
    ar: 'دون أي التزام. سيتواصل معك فريق العلامة مباشرة.',
  },
  noCommitmentInvestor: {
    en: 'No commitment. The investor will review your brand and reply.',
    ar: 'دون أي التزام. سيراجع المستثمر علامتك ويرد عليك.',
  },
  atAGlance: { en: 'At a glance', ar: 'لمحة سريعة' },
  notFound: { en: 'We couldn’t find that page.', ar: 'تعذّر العثور على هذه الصفحة.' },
  goHome: { en: 'Go to home', ar: 'الذهاب إلى الرئيسية' },

  // Investor detail
  profile: { en: 'Profile', ar: 'نبذة' },
  investmentFocus: { en: 'Investment focus', ar: 'التركيز الاستثماري' },
  ticketSize: { en: 'Ticket size', ar: 'حجم الاستثمار للصفقة' },
  dealStructure: { en: 'Preferred deal structure', ar: 'هيكل الصفقة المفضّل' },
  portfolio: { en: 'Current portfolio', ar: 'المحفظة الحالية' },
  memberSince: { en: 'On Partners since', ar: 'عضو في شركاء منذ' },

  // Interest modal
  modalTitleFranchise: { en: 'Express interest in', ar: 'أبدِ اهتمامك بـ' },
  modalTitleInvestor: { en: 'Introduce your brand to', ar: 'قدّم علامتك إلى' },
  modalIntro: {
    en: 'Share a few details and we’ll pass your note along.',
    ar: 'شاركنا بعض التفاصيل وسنوصل رسالتك.',
  },
  fullName: { en: 'Full name', ar: 'الاسم الكامل' },
  company: { en: 'Company', ar: 'الشركة' },
  email: { en: 'Email', ar: 'البريد الإلكتروني' },
  phone: { en: 'Phone', ar: 'رقم الجوال' },
  message: { en: 'Message', ar: 'الرسالة' },
  optional: { en: 'optional', ar: 'اختياري' },
  phNameFr: { en: 'e.g. Faisal Al-Harbi', ar: 'مثال: فيصل الحربي' },
  phCompanyFr: { en: 'e.g. Harbi Holding', ar: 'مثال: الحربي القابضة' },
  phNameInv: { en: 'e.g. Lina Haddad', ar: 'مثال: لينا حداد' },
  phCompanyInv: { en: 'e.g. Your brand name', ar: 'مثال: اسم علامتك' },
  phEmail: { en: 'name@company.com', ar: 'name@company.com' },
  phPhone: { en: '+966 5x xxx xxxx', ar: '+966 5x xxx xxxx' },
  send: { en: 'Send interest', ar: 'إرسال الاهتمام' },
  sending: { en: 'Sending…', ar: 'جارٍ الإرسال…' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  errRequired: { en: 'Required', ar: 'حقل مطلوب' },
  errEmail: { en: 'Enter a valid email', ar: 'أدخل بريدًا إلكترونيًا صحيحًا' },
  successTitle: { en: 'Interest sent', ar: 'تم إرسال اهتمامك' },
  successBodyFranchise: {
    en: 'Your note is on its way to the {name} team. In the live platform they would reply within 2 business days.',
    ar: 'رسالتك في طريقها إلى فريق {name}. في المنصة الفعلية سيتم الرد خلال يومي عمل.',
  },
  successBodyInvestor: {
    en: 'Your introduction is on its way to {name}. In the live platform they would reply within 2 business days.',
    ar: 'تعريفك في طريقه إلى {name}. في المنصة الفعلية سيتم الرد خلال يومي عمل.',
  },
  demoNoEmail: {
    en: 'Demo only: nothing was emailed. Your request is saved in this browser.',
    ar: 'نسخة تجريبية: لم يُرسل أي بريد. حُفظ طلبك في هذا المتصفح.',
  },
  done: { en: 'Done', ar: 'تم' },
  templateToFranchise: {
    en: 'Hello {name} team,\n\nI’m interested in opening {name} in Saudi Arabia and would like to learn more about your requirements, available territories and next steps.\n\nLooking forward to hearing from you.',
    ar: 'مرحبًا فريق {name}،\n\nأنا مهتم بافتتاح {name} في السعودية وأود معرفة المزيد عن متطلباتكم والمناطق المتاحة والخطوات التالية.\n\nبانتظار ردكم.',
  },
  templateToInvestor: {
    en: 'Hello {name},\n\nWe believe our franchise could be a strong fit for your investment focus and would welcome the chance to share our expansion plan and unit economics with you.\n\nKind regards.',
    ar: 'مرحبًا {name}،\n\nنعتقد أن امتيازنا يتوافق مع تركيزكم الاستثماري، ويسعدنا أن نعرض عليكم خطة التوسع واقتصاديات الوحدة.\n\nمع خالص التحية.',
  },

  // Globe
  globeHeadlineInv: { en: 'Franchise brands from around the world', ar: 'علامات امتياز من حول العالم' },
  globeTextInv: { en: 'Each pin is a brand’s home city. All of them are expanding in Saudi Arabia.', ar: 'كل دبوس هو مدينة منشأ علامة، وجميعها تتوسع في السعودية.' },
  globeHeadlineFr: { en: 'Investors ready to back your brand', ar: 'مستثمرون مستعدون لدعم علامتك' },
  globeTextFr: { en: 'Each pin is an investor’s base city across the Kingdom.', ar: 'كل دبوس هو مدينة مقر مستثمر في أنحاء المملكة.' },
  browseAll: { en: 'Browse all', ar: 'عرض الكل' },
  globeView: { en: 'Globe view', ar: 'عرض الكرة الأرضية' },
  skip: { en: 'Skip', ar: 'تخطٍّ' },
  dragToRotate: { en: 'Drag to rotate', ar: 'اسحب للتدوير' },
  resumeTour: { en: 'Resume tour', ar: 'استئناف الجولة' },
  touring: { en: 'Touring cities…', ar: 'جولة بين المدن…' },
  statCities: { en: 'cities', ar: 'مدينة' },
  statBrandsShort: { en: 'brands', ar: 'علامة' },
  statInvestorsShort: { en: 'investors', ar: 'مستثمر' },
  statCapitalShort: { en: 'capital available', ar: 'رأس مال متاح' },
  brandsHere: { en: 'franchise brands', ar: 'علامة امتياز' },
  brandHere: { en: 'franchise brand', ar: 'علامة امتياز' },
  investorsHere: { en: 'investors', ar: 'مستثمرين' },
  investorHere: { en: 'investor', ar: 'مستثمر' },
  fromThisCountry: { en: 'Opportunities from this country', ar: 'الفرص من هذه الدولة' },
  basedInThisCountry: { en: 'Investors based in this country', ar: 'مستثمرون مقيمون في هذه الدولة' },
  noListings: {
    en: 'There are no listings from this market yet. Tell us what you are looking for and we will reach out to brands and investors there.',
    ar: 'لا توجد فرص مدرجة من هذا السوق بعد. أخبرنا بما تبحث عنه وسنتواصل مع العلامات والمستثمرين هناك.',
  },
  requestMarket: { en: 'Request opportunities from this market', ar: 'اطلب فرصًا من هذا السوق' },
  oceanHint: {
    en: 'Click a pin to see the opportunities in that city, or click any country to explore its market.',
    ar: 'اضغط على دبوس لعرض الفرص في تلك المدينة، أو اضغط على أي دولة لاستكشاف سوقها.',
  },
  oceanTitle: { en: 'Explore the map', ar: 'استكشف الخريطة' },
  viewFullProfile: { en: 'View full profile', ar: 'عرض الملف الكامل' },
  showDetails: { en: 'Show details', ar: 'عرض التفاصيل' },
  hideDetails: { en: 'Hide details', ar: 'إخفاء التفاصيل' },
  globeLabel: { en: 'Interactive globe of opportunities', ar: 'كرة أرضية تفاعلية للفرص' },
  modalTitleMarket: { en: 'Request opportunities from', ar: 'اطلب فرصًا من' },
  phCompanyMarket: { en: 'e.g. Your company', ar: 'مثال: اسم شركتك' },
  templateToMarket: {
    en: 'Hello Partners team,\n\nI’m interested in franchise opportunities from {name}. Please let me know when brands or investors from this market join the platform.\n\nThank you.',
    ar: 'مرحبًا فريق شركاء،\n\nأنا مهتم بفرص الامتياز من {name}. يرجى إبلاغي عند انضمام علامات أو مستثمرين من هذا السوق إلى المنصة.\n\nشكرًا لكم.',
  },
  successBodyMarket: {
    en: 'Your request for opportunities from {name} has been noted. In the live platform our team would follow up within 2 business days.',
    ar: 'تم تسجيل طلبك للفرص من {name}. في المنصة الفعلية سيتابع فريقنا معك خلال يومي عمل.',
  },
} satisfies Record<string, L>;

export type UiKey = keyof typeof ui;

// ---------- Taxonomy ----------

export const sectors = {
  fnb: { en: 'Food & Beverage', ar: 'الأغذية والمشروبات' },
  coffee: { en: 'Coffee', ar: 'القهوة' },
  fitness: { en: 'Fitness', ar: 'اللياقة البدنية' },
  education: { en: 'Education', ar: 'التعليم' },
  retail: { en: 'Retail', ar: 'التجزئة' },
  beauty: { en: 'Beauty & Wellness', ar: 'التجميل والعافية' },
  healthcare: { en: 'Healthcare', ar: 'الرعاية الصحية' },
  services: { en: 'Services', ar: 'الخدمات' },
} satisfies Record<string, L>;
export type SectorId = keyof typeof sectors;
export const sectorIds = Object.keys(sectors) as SectorId[];

/** Brand countries of origin (where a franchise brand was founded). */
export const countries = {
  SA: { en: 'Saudi Arabia', ar: 'السعودية' },
  AE: { en: 'UAE', ar: 'الإمارات' },
  KW: { en: 'Kuwait', ar: 'الكويت' },
  TR: { en: 'Türkiye', ar: 'تركيا' },
  BR: { en: 'Brazil', ar: 'البرازيل' },
  US: { en: 'United States', ar: 'الولايات المتحدة' },
  GB: { en: 'United Kingdom', ar: 'المملكة المتحدة' },
  IT: { en: 'Italy', ar: 'إيطاليا' },
  FR: { en: 'France', ar: 'فرنسا' },
  JP: { en: 'Japan', ar: 'اليابان' },
  KR: { en: 'South Korea', ar: 'كوريا الجنوبية' },
  AU: { en: 'Australia', ar: 'أستراليا' },
  ES: { en: 'Spain', ar: 'إسبانيا' },
} satisfies Record<string, L>;
export type CountryId = keyof typeof countries;

/** Saudi regions, used to group cities in the location filter. */
export const regions = {
  central: { en: 'Central Region', ar: 'المنطقة الوسطى' },
  western: { en: 'Western Region', ar: 'المنطقة الغربية' },
  eastern: { en: 'Eastern Province', ar: 'المنطقة الشرقية' },
  southern: { en: 'Southern Region', ar: 'المنطقة الجنوبية' },
  northern: { en: 'Northern Region', ar: 'المنطقة الشمالية' },
} satisfies Record<string, L>;
export type RegionId = keyof typeof regions;
export const regionIds = Object.keys(regions) as RegionId[];

export interface CityInfo extends L {
  /** ISO 3166-1 alpha-2 country code */
  country: CountryId;
  lat: number;
  lon: number;
  /** Saudi region. Only cities with a region are Saudi target/base cities and appear in the location filter. */
  region?: RegionId;
}

/**
 * Every city used in the sample data. Coordinates place the pins on the globe:
 * add a city here, use it in the data, and its pin appears automatically.
 */
const cityData = {
  // Saudi Arabia: target expansion and investor base cities
  riyadh: { en: 'Riyadh', ar: 'الرياض', country: 'SA', lat: 24.71, lon: 46.68, region: 'central' },
  buraidah: { en: 'Buraidah', ar: 'بريدة', country: 'SA', lat: 26.33, lon: 43.97, region: 'central' },
  jeddah: { en: 'Jeddah', ar: 'جدة', country: 'SA', lat: 21.49, lon: 39.19, region: 'western' },
  makkah: { en: 'Makkah', ar: 'مكة المكرمة', country: 'SA', lat: 21.39, lon: 39.86, region: 'western' },
  madinah: { en: 'Madinah', ar: 'المدينة المنورة', country: 'SA', lat: 24.47, lon: 39.61, region: 'western' },
  taif: { en: 'Taif', ar: 'الطائف', country: 'SA', lat: 21.27, lon: 40.42, region: 'western' },
  dammam: { en: 'Dammam', ar: 'الدمام', country: 'SA', lat: 26.43, lon: 50.1, region: 'eastern' },
  khobar: { en: 'Al Khobar', ar: 'الخبر', country: 'SA', lat: 26.28, lon: 50.21, region: 'eastern' },
  ahsa: { en: 'Al Ahsa', ar: 'الأحساء', country: 'SA', lat: 25.38, lon: 49.59, region: 'eastern' },
  abha: { en: 'Abha', ar: 'أبها', country: 'SA', lat: 18.22, lon: 42.51, region: 'southern' },
  tabuk: { en: 'Tabuk', ar: 'تبوك', country: 'SA', lat: 28.38, lon: 36.57, region: 'northern' },
  // Brand origin cities around the world
  dubai: { en: 'Dubai', ar: 'دبي', country: 'AE', lat: 25.2, lon: 55.27 },
  kuwait: { en: 'Kuwait City', ar: 'مدينة الكويت', country: 'KW', lat: 29.38, lon: 47.99 },
  istanbul: { en: 'Istanbul', ar: 'إسطنبول', country: 'TR', lat: 41.01, lon: 28.98 },
  paris: { en: 'Paris', ar: 'باريس', country: 'FR', lat: 48.86, lon: 2.35 },
  london: { en: 'London', ar: 'لندن', country: 'GB', lat: 51.51, lon: -0.13 },
  milan: { en: 'Milan', ar: 'ميلانو', country: 'IT', lat: 45.46, lon: 9.19 },
  newyork: { en: 'New York', ar: 'نيويورك', country: 'US', lat: 40.71, lon: -74.01 },
  saopaulo: { en: 'São Paulo', ar: 'ساو باولو', country: 'BR', lat: -23.55, lon: -46.63 },
  tokyo: { en: 'Tokyo', ar: 'طوكيو', country: 'JP', lat: 35.68, lon: 139.69 },
  seoul: { en: 'Seoul', ar: 'سيول', country: 'KR', lat: 37.57, lon: 126.98 },
  sydney: { en: 'Sydney', ar: 'سيدني', country: 'AU', lat: -33.87, lon: 151.21 },
} satisfies Record<string, CityInfo>;
export type CityId = keyof typeof cityData;
export const cities: Record<CityId, CityInfo> = cityData;
export const cityIds = Object.keys(cities) as CityId[];
/** Region for Saudi cities, country for the rest. */
export const cityArea = (id: CityId): L => {
  const c = cities[id];
  return c.region ? regions[c.region] : countries[c.country];
};
/** Saudi cities (used for target expansion, investor bases and the location filter). */
export const saudiCityIds = cityIds.filter((id) => cities[id].region);

export const investorTypes = {
  individual: { en: 'Individual', ar: 'فرد' },
  family: { en: 'Family Office', ar: 'مكتب عائلي' },
  firm: { en: 'Investment Firm', ar: 'شركة استثمار' },
  corporate: { en: 'Corporate', ar: 'شركة' },
} satisfies Record<string, L>;
export type InvestorTypeId = keyof typeof investorTypes;
export const investorTypeIds = Object.keys(investorTypes) as InvestorTypeId[];

export const dealStructures = {
  single: { en: 'Single unit', ar: 'وحدة واحدة' },
  multi: { en: 'Multi-unit', ar: 'وحدات متعددة' },
  master: { en: 'Master franchise', ar: 'امتياز رئيسي' },
} satisfies Record<string, L>;
export type DealStructureId = keyof typeof dealStructures;

export const provisions = {
  training: {
    en: 'Training',
    ar: 'التدريب',
    desc: { en: 'Owner and staff training before opening and ongoing.', ar: 'تدريب المالك والموظفين قبل الافتتاح وبشكل مستمر.' },
  },
  supply: {
    en: 'Supply chain',
    ar: 'سلسلة الإمداد',
    desc: { en: 'Approved suppliers, logistics and core product supply.', ar: 'موردون معتمدون وخدمات لوجستية وتوريد المنتجات الأساسية.' },
  },
  marketing: {
    en: 'Marketing',
    ar: 'التسويق',
    desc: { en: 'Launch campaign, brand assets and regional marketing.', ar: 'حملة الافتتاح وأصول العلامة والتسويق الإقليمي.' },
  },
  site: {
    en: 'Site selection',
    ar: 'اختيار الموقع',
    desc: { en: 'Location scouting, lease review and fit-out guidance.', ar: 'البحث عن الموقع ومراجعة الإيجار وتوجيهات التجهيز.' },
  },
  tech: {
    en: 'Technology',
    ar: 'التقنية',
    desc: { en: 'POS, ordering app and operations dashboards.', ar: 'نقاط البيع وتطبيق الطلبات ولوحات متابعة التشغيل.' },
  },
  fitout: {
    en: 'Design & fit-out',
    ar: 'التصميم والتجهيز',
    desc: { en: 'Store design package and approved contractors.', ar: 'حزمة تصميم الفرع ومقاولون معتمدون.' },
  },
} satisfies Record<string, L & { desc: L }>;
export type ProvisionId = keyof typeof provisions;

// ---------- helpers ----------

/** Translate a `{ en, ar }` object. */
export const tr = (value: L, lang: Lang) => value[lang];

/** Replace `{name}` style placeholders. */
export const fill = (text: string, vars: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
