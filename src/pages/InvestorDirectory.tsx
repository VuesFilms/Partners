import { Users } from 'lucide-react';
import { useMemo } from 'react';
import { DirectoryLayout, GridItem } from '../components/DirectoryLayout';
import { InvestorCard } from '../components/InvestorCard';
import { ChipGroup, FilterSection, LocationSelect, RangeSlider, SearchInput, SortSelect, matchesLocation } from '../components/filters';
import { useApp } from '../context/AppContext';
import { investors, type Investor } from '../data/investors';
import { investorTypeIds, investorTypes, sectorIds, sectors, type InvestorTypeId, type SectorId } from '../i18n/dictionary';
import { compact } from '../lib/currency';
import { useSessionState } from '../lib/hooks';
import { investorTypeIcon, sectorIcon } from '../lib/icons';

const STOPS = [0, 1_000_000, 2_000_000, 5_000_000, 10_000_000, 20_000_000, 30_000_000, 50_000_000, 75_000_000, 100_000_000, 150_000_000];

type Sort = 'newest' | 'capLow' | 'capHigh';
interface Filters {
  types: InvestorTypeId[];
  sectors: SectorId[];
  range: [number, number];
  location: string;
}
const DEFAULTS: Filters = { types: [], sectors: [], range: [0, STOPS.length - 1], location: '' };

const newestIds = new Set([...investors].sort((a, b) => b.listedAt.localeCompare(a.listedAt)).slice(0, 3).map((i) => i.id));

function apply(list: Investor[], q: string, f: Filters) {
  const query = q.trim().toLowerCase();
  const lo = STOPS[f.range[0]];
  const hi = f.range[1] === STOPS.length - 1 ? Infinity : STOPS[f.range[1]];
  return list.filter(
    (x) =>
      (!query || x.name.en.toLowerCase().includes(query) || x.name.ar.includes(q.trim())) &&
      (!f.types.length || f.types.includes(x.type)) &&
      (!f.sectors.length || f.sectors.some((s) => x.sectors.includes(s))) &&
      x.capitalMax >= lo &&
      x.capitalMin <= hi &&
      matchesLocation(f.location, [x.city]),
  );
}

export default function InvestorDirectory() {
  const { t, lang } = useApp();
  const [q, setQ] = useSessionState('partners.i.q', '');
  const [filters, setFilters] = useSessionState<Filters>('partners.i.filters', DEFAULTS);
  const [sort, setSort] = useSessionState<Sort>('partners.i.sort', 'newest');

  const results = useMemo(() => {
    const r = apply(investors, q, filters);
    return r.sort((a, b) =>
      sort === 'capLow' ? a.capitalMin - b.capitalMin : sort === 'capHigh' ? b.capitalMax - a.capitalMax : b.listedAt.localeCompare(a.listedAt),
    );
  }, [q, filters, sort]);

  const fmt = (n: number, top: boolean) => {
    const v = n === 0 ? '0' : compact(n, lang);
    return lang === 'ar' ? `${v}${top ? '+' : ''} ر.س` : `SAR ${v}${top ? '+' : ''}`;
  };

  return (
    <DirectoryLayout<Filters>
      tone="plum"
      icon={<Users className="h-4 w-4" />}
      title={t('directoryTitle')}
      subtitle={t('directorySubtitle')}
      search={<SearchInput value={q} onChange={setQ} placeholder={t('searchInvestors')} />}
      sort={
        <SortSelect<Sort>
          value={sort}
          onChange={setSort}
          options={[
            { id: 'newest', label: t('sortNewest') },
            { id: 'capLow', label: t('sortCapLow') },
            { id: 'capHigh', label: t('sortCapHigh') },
          ]}
        />
      }
      filters={filters}
      setFilters={setFilters}
      defaults={DEFAULTS}
      activeCount={(f) =>
        f.types.length + f.sectors.length + (f.range[0] !== 0 || f.range[1] !== STOPS.length - 1 ? 1 : 0) + (f.location ? 1 : 0)
      }
      countFor={(f) => apply(investors, q, f).length}
      resultCount={results.length}
      renderFilters={(value, set) => (
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
            <RangeSlider stops={STOPS} value={value.range} onChange={(r) => set({ ...value, range: r })} format={fmt} label={t('capitalRange')} />
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
      )}
    >
      {results.map((inv) => (
        <GridItem key={inv.id}>
          <InvestorCard inv={inv} isNew={newestIds.has(inv.id)} />
        </GridItem>
      ))}
    </DirectoryLayout>
  );
}
