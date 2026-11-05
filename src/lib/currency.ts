import type { Lang } from '../i18n/dictionary';

/** Fixed demo exchange rate. */
export const SAR_PER_USD = 3.75;

const nf = new Intl.NumberFormat('en-US');

export const toUSD = (sar: number) => {
  const usd = sar / SAR_PER_USD;
  const step = usd >= 100_000 ? 1_000 : 100;
  return Math.round(usd / step) * step;
};

const trim = (n: number) => {
  const d = n < 10 ? 100 : n < 100 ? 10 : 1;
  return (Math.round(n * d) / d).toString();
};

/** 450000 → "450K" / "450 ألف", 1750000 → "1.75M" / "1.75 مليون" */
export function compact(n: number, lang: Lang): string {
  if (n >= 1_000_000_000) return lang === 'ar' ? `${trim(n / 1e9)} مليار` : `${trim(n / 1e9)}B`;
  if (n >= 1_000_000) return lang === 'ar' ? `${trim(n / 1e6)} مليون` : `${trim(n / 1e6)}M`;
  if (n >= 1_000) return lang === 'ar' ? `${Math.round(n / 1e3)} ألف` : `${Math.round(n / 1e3)}K`;
  return String(n);
}

const sar = (v: string, lang: Lang) => (lang === 'ar' ? `${v} ر.س` : `SAR ${v}`);
const usd = (v: string, lang: Lang) => (lang === 'ar' ? `${v} دولار` : `USD ${v}`);

/** "SAR 1,500,000" */
export const formatSAR = (n: number, lang: Lang) => sar(nf.format(n), lang);
/** "≈ USD 400,000" */
export const formatUSD = (n: number, lang: Lang) => `≈ ${usd(nf.format(toUSD(n)), lang)}`;
/** "SAR 1,500,000 (≈ USD 400,000)" */
export const formatMoney = (n: number, lang: Lang) => `${formatSAR(n, lang)} (${formatUSD(n, lang)})`;

/** "SAR 450K – 820K" */
export const formatSARRange = (min: number, max: number, lang: Lang) =>
  sar(`${compact(min, lang)} – ${compact(max, lang)}`, lang);
/** "≈ USD 120K – 219K" */
export const formatUSDRange = (min: number, max: number, lang: Lang) =>
  `≈ ${usd(`${compact(toUSD(min), lang)} – ${compact(toUSD(max), lang)}`, lang)}`;
/** "SAR 450K – 820K (≈ USD 120K – 219K)" */
export const formatMoneyRange = (min: number, max: number, lang: Lang) =>
  `${formatSARRange(min, max, lang)} (${formatUSDRange(min, max, lang)})`;

export const formatNumber = (n: number) => nf.format(n);

/** "SAR 450,000 – 820,000 (≈ USD 120,000 – 219,000)" */
export const formatMoneyRangeFull = (min: number, max: number, lang: Lang) => {
  const s = sar(`${nf.format(min)} – ${nf.format(max)}`, lang);
  const u = usd(`${nf.format(toUSD(min))} – ${nf.format(toUSD(max))}`, lang);
  return { sar: s, usd: `≈ ${u}`, full: `${s} (≈ ${u})` };
};
