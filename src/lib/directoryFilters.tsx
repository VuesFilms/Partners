/**
 * Filter definitions shared by the directory pages and the globe, so both
 * views use the same filters and the same saved filter state.
 */
import { ChipGroup, FilterSection, LocationSelect, RangeSlider, matchesLocation } from '../components/filters';
import { useApp } from '../context/AppContext';
import type { Franchise } from '../data/franchises';
import type { Investor } from '../data/investors';
import { investorTypeIds, investorTypes, sectorIds, sectors, type InvestorTypeId, type Lang, type SectorId } from '../i18n/dictionary';
import { compact } from './currency';
import { useSessionState } from './hooks';
import { investorTypeIcon, sectorIcon } from './icons';

const fmtStop = (lang: Lang) => (n: number, top: boolean) => {
  const v = n === 0 ? '0' : compact(n, lang);
  return lang === 'ar' ? `${v}${top ? '+' : ''} ر.س` : `SAR ${v}${top ? '+' : ''}`;
};
const textMatch = (q: string, name: { en: string; ar: string }) => {
  const query = q.trim();
  return !query || name.en.toLowerCase().includes(query.toLowerCase()) || name.ar.includes(query);
};

// ---------------- Franchises ----------------

/** Slider stops (SAR). Non-linear so a kiosk and a master franchise both fit. */
export const FR_STOPS = [0, 250_000, 500_000, 750_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000, 4_000_000, 5_000_000, 7_500_000, 10_000_000, 15_000_000];
export type FrSort = 'newest' | 'invLow' | 'invHigh';
export interface FrFilters {
  sectors: SectorId[];
  range: [number, number];
  location: string;
}
export const FR_DEFAULTS: FrFilters = { sectors: [], range: [0, FR_STOPS.length - 1], location: '' };

export function applyFranchiseFilters(list: Franchise[], q: string, f: FrFilters) {
  const lo = FR_STOPS[f.range[0]];
  const hi = f.range[1] === FR_STOPS.length - 1 ? Infinity : FR_STOPS[f.range[1]];
  return list.filter(
    (x) =>
      textMatch(q, x.name) &&
      (!f.sectors.length || f.sectors.includes(x.sector)) &&
      x.investmentMax >= lo &&
      x.investmentMin <= hi &&
      matchesLocation(f.location, x.targetCities),
  );
}
export const sortFranchises = (list: Franchise[], sort: FrSort) =>
  [...list].sort((a, b) =>
    sort === 'invLow' ? a.investmentMin - b.investmentMin : sort === 'invHigh' ? b.investmentMax - a.investmentMax : b.listedAt.localeCompare(a.listedAt),
  );
export const frActiveCount = (f: FrFilters) =>
  f.sectors.length + (f.range[0] !== 0 || f.range[1] !== FR_STOPS.length - 1 ? 1 : 0) + (f.location ? 1 : 0);

export function useFranchiseFilterState() {
  const [q, setQ] = useSessionState('partners.f.q', '');
  const [filters, setFilters] = useSessionState<FrFilters>('partners.f.filters', FR_DEFAULTS);
  const [sort, setSort] = useSessionState<FrSort>('partners.f.sort', 'newest');
  return { q, setQ, filters, setFilters, sort, setSort };
}

export function FranchiseFilterFields({ value, set }: { value: FrFilters; set: (f: FrFilters) => void }) {
  const { t, lang } = useApp();
  return (
    <div>
      <FilterSection title={t('sector')}>
        <ChipGroup<SectorId>
          options={sectorIds.map((id) => ({ id, label: sectors[id] }))}
          value={value.sectors}
          onChange={(v) => set({ ...value, sectors: v })}
          icon={(id) => {
            const I = sectorIcon[id];
            return <I className="h-3.5 w-3.5" />;
          }}
        />
      </FilterSection>
      <FilterSection title={t('investmentRange')}>
        <RangeSlider stops={FR_STOPS} value={value.range} onChange={(r) => set({ ...value, range: r })} format={fmtStop(lang)} label={t('investmentRange')} />
      </FilterSection>
      <FilterSection title={t('location')}>
        <LocationSelect value={value.location} onChange={(v) => set({ ...value, location: v })} label={t('location')} />
      </FilterSection>
    </div>
  );
}

// ---------------- Investors ----------------

export const INV_STOPS = [0, 1_000_000, 2_000_000, 5_000_000, 10_000_000, 20_000_000, 30_000_000, 50_000_000, 75_000_000, 100_000_000, 150_000_000];
export type InvSort = 'newest' | 'capLow' | 'capHigh';
export interface InvFilters {
  types: InvestorTypeId[];
  sectors: SectorId[];
  range: [number, number];
  location: string;
}
export const INV_DEFAULTS: InvFilters = { types: [], sectors: [], range: [0, INV_STOPS.length - 1], location: '' };

export function applyInvestorFilters(list: Investor[], q: string, f: InvFilters) {
  const lo = INV_STOPS[f.range[0]];
  const hi = f.range[1] === INV_STOPS.length - 1 ? Infinity : INV_STOPS[f.range[1]];
  return list.filter(
    (x) =>
      textMatch(q, x.name) &&
      (!f.types.length || f.types.includes(x.type)) &&
      (!f.sectors.length || f.sectors.some((s) => x.sectors.includes(s))) &&
      x.capitalMax >= lo &&
      x.capitalMin <= hi &&
      matchesLocation(f.location, [x.city]),
  );
}
export const sortInvestors = (list: Investor[], sort: InvSort) =>
  [...list].sort((a, b) =>
    sort === 'capLow' ? a.capitalMin - b.capitalMin : sort === 'capHigh' ? b.capitalMax - a.capitalMax : b.listedAt.localeCompare(a.listedAt),
  );
export const invActiveCount = (f: InvFilters) =>
  f.types.length + f.sectors.length + (f.range[0] !== 0 || f.range[1] !== INV_STOPS.length - 1 ? 1 : 0) + (f.location ? 1 : 0);

export function useInvestorFilterState() {
  const [q, setQ] = useSessionState('partners.i.q', '');
  const [filters, setFilters] = useSessionState<InvFilters>('partners.i.filters', INV_DEFAULTS);
  const [sort, setSort] = useSessionState<InvSort>('partners.i.sort', 'newest');
  return { q, setQ, filters, setFilters, sort, setSort };
}

export function InvestorFilterFields({ value, set }: { value: InvFilters; set: (f: InvFilters) => void }) {
  const { t, lang } = useApp();
  return (
    <div>
      <FilterSection title={t('investorType')}>
        <ChipGroup<InvestorTypeId>
          options={investorTypeIds.map((id) => ({ id, label: investorTypes[id] }))}
          value={value.types}
          onChange={(v) => set({ ...value, types: v })}
          icon={(id) => {
            const I = investorTypeIcon[id];
            return <I className="h-3.5 w-3.5" />;
          }}
        />
      </FilterSection>
      <FilterSection title={t('capitalRange')}>
        <RangeSlider stops={INV_STOPS} value={value.range} onChange={(r) => set({ ...value, range: r })} format={fmtStop(lang)} label={t('capitalRange')} />
      </FilterSection>
      <FilterSection title={t('preferredSector')}>
        <ChipGroup<SectorId>
          options={sectorIds.map((id) => ({ id, label: sectors[id] }))}
          value={value.sectors}
          onChange={(v) => set({ ...value, sectors: v })}
          icon={(id) => {
            const I = sectorIcon[id];
            return <I className="h-3.5 w-3.5" />;
          }}
        />
      </FilterSection>
      <FilterSection title={t('baseLocation')}>
        <LocationSelect value={value.location} onChange={(v) => set({ ...value, location: v })} label={t('baseLocation')} />
      </FilterSection>
    </div>
  );
}
