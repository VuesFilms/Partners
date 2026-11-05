import { Store } from 'lucide-react';
import { useMemo } from 'react';
import { DirectoryLayout, GridItem } from '../components/DirectoryLayout';
import { FranchiseCard } from '../components/FranchiseCard';
import { SearchInput, SortSelect } from '../components/filters';
import { useApp } from '../context/AppContext';
import { franchises } from '../data/franchises';
import {
  FR_DEFAULTS,
  FranchiseFilterFields,
  applyFranchiseFilters,
  frActiveCount,
  sortFranchises,
  useFranchiseFilterState,
  type FrFilters,
  type FrSort,
} from '../lib/directoryFilters';

const newestIds = new Set([...franchises].sort((a, b) => b.listedAt.localeCompare(a.listedAt)).slice(0, 3).map((f) => f.id));

export default function Marketplace() {
  const { t } = useApp();
  const { q, setQ, filters, setFilters, sort, setSort } = useFranchiseFilterState();
  const results = useMemo(() => sortFranchises(applyFranchiseFilters(franchises, q, filters), sort), [q, filters, sort]);

  return (
    <DirectoryLayout<FrFilters>
      tone="teal"
      icon={<Store className="h-4 w-4" />}
      title={t('marketTitle')}
      subtitle={t('marketSubtitle')}
      globeTo="/explore/franchises"
      search={<SearchInput value={q} onChange={setQ} placeholder={t('searchBrands')} />}
      sort={
        <SortSelect<FrSort>
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
      defaults={FR_DEFAULTS}
      activeCount={frActiveCount}
      countFor={(f) => applyFranchiseFilters(franchises, q, f).length}
      resultCount={results.length}
      renderFilters={(value, set) => <FranchiseFilterFields value={value} set={set} />}
    >
      {results.map((f) => (
        <GridItem key={f.id}>
          <FranchiseCard f={f} isNew={newestIds.has(f.id)} />
        </GridItem>
      ))}
    </DirectoryLayout>
  );
}
