import { Store } from 'lucide-react';
import { useMemo } from 'react';
import { DirectoryLayout, GridItem } from '../components/DirectoryLayout';
import { FranchiseCard } from '../components/FranchiseCard';
import { ChipGroup, FilterSection, LocationSelect, RangeSlider, SearchInput, SortSelect, matchesLocation } from '../components/filters';
import { useApp } from '../context/AppContext';
import { franchises, type Franchise } from '../data/franchises';
import { sectorIds, sectors, type SectorId } from '../i18n/dictionary';
import { compact } from '../lib/currency';
import { useSessionState } from '../lib/hooks';
import { sectorIcon } from '../lib/icons';

/** Slider stops (SAR). Non-linear so a kiosk and a master franchise both fit. */
const STOPS = [0, 250_000, 500_000, 750_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000, 4_000_000, 5_000_000, 7_500_000, 10_000_000, 15_000_000];

type Sort = 'newest' | 'invLow' | 'invHigh';
interface Filters {
  sectors: SectorId[];
  range: [number, number];
  location: string;
}
const DEFAULTS: Filters = { sectors: [], range: [0, STOPS.length - 1], location: '' };

const newestIds = new Set([...franchises].sort((a, b) => b.listedAt.localeCompare(a.listedAt)).slice(0, 3).map((f) => f.id));

function apply(list: Franchise[], q: string, f: Filters) {
  const query = q.trim().toLowerCase();
  const lo = STOPS[f.range[0]];
  const hi = f.range[1] === STOPS.length - 1 ? Infinity : STOPS[f.range[1]];
  return list.filter(
    (x) =>
      (!query || x.name.en.toLowerCase().includes(query) || x.name.ar.includes(q.trim())) &&
      (!f.sectors.length || f.sectors.includes(x.sector)) &&
      x.investmentMax >= lo &&
      x.investmentMin <= hi &&
      matchesLocation(f.location, x.targetCities),
  );
}

export default function Marketplace() {
  const { t, lang } = useApp();
  const [q, setQ] = useSessionState('partners.f.q', '');
  const [filters, setFilters] = useSessionState<Filters>('partners.f.filters', DEFAULTS);
  const [sort, setSort] = useSessionState<Sort>('partners.f.sort', 'newest');

  const results = useMemo(() => {
    const r = apply(franchises, q, filters);
    return r.sort((a, b) =>
      sort === 'invLow' ? a.investmentMin - b.investmentMin : sort === 'invHigh' ? b.investmentMax - a.investmentMax : b.listedAt.localeCompare(a.listedAt),
    );
  }, [q, filters, sort]);

  const fmt = (n: number, top: boolean) => {
    const v = n === 0 ? '0' : compact(n, lang);
    return lang === 'ar' ? `${v}${top ? '+' : ''} ر.س` : `SAR ${v}${top ? '+' : ''}`;
  };

  return (
    <DirectoryLayout<Filters>
      tone="teal"
      icon={<Store className="h-4 w-4" />}
      title={t('marketTitle')}
      subtitle={t('marketSubtitle')}
      search={<SearchInput value={q} onChange={setQ} placeholder={t('searchBrands')} />}
      sort={
        <SortSelect<Sort>
          value={sort}
          onChange={setSort}
          options={[
            { id: 'newest', label: t('sortNewest') },
            { id: 'invLow', label: t('sortInvLow') },
            { id: 'invHigh', label: t('sortInvHigh') },
          ]}
        />
      }
      filters={filters}
      setFilters={setFilters}
      defaults={DEFAULTS}
      activeCount={(f) => f.sectors.length + (f.range[0] !== 0 || f.range[1] !== STOPS.length - 1 ? 1 : 0) + (f.location ? 1 : 0)}
      countFor={(f) => apply(franchises, q, f).length}
      resultCount={results.length}
      renderFilters={(value, set) => (
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
            <RangeSlider stops={STOPS} value={value.range} onChange={(r) => set({ ...value, range: r })} format={fmt} label={t('investmentRange')} />
          </FilterSection>
          <FilterSection title={t('location')}>
            <LocationSelect value={value.location} onChange={(v) => set({ ...value, location: v })} label={t('location')} />
          </FilterSection>
        </div>
      )}
    >
      {results.map((f) => (
        <GridItem key={f.id}>
          <FranchiseCard f={f} isNew={newestIds.has(f.id)} />
        </GridItem>
      ))}
    </DirectoryLayout>
  );
}
