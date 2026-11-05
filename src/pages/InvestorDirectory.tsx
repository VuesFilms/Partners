import { Users } from 'lucide-react';
import { useMemo } from 'react';
import { DirectoryLayout, GridItem } from '../components/DirectoryLayout';
import { InvestorCard } from '../components/InvestorCard';
import { SearchInput, SortSelect } from '../components/filters';
import { useApp } from '../context/AppContext';
import { investors } from '../data/investors';
import {
  INV_DEFAULTS,
  InvestorFilterFields,
  applyInvestorFilters,
  invActiveCount,
  sortInvestors,
  useInvestorFilterState,
  type InvFilters,
  type InvSort,
} from '../lib/directoryFilters';

const newestIds = new Set([...investors].sort((a, b) => b.listedAt.localeCompare(a.listedAt)).slice(0, 3).map((i) => i.id));

export default function InvestorDirectory() {
  const { t } = useApp();
  const { q, setQ, filters, setFilters, sort, setSort } = useInvestorFilterState();
  const results = useMemo(() => sortInvestors(applyInvestorFilters(investors, q, filters), sort), [q, filters, sort]);

  return (
    <DirectoryLayout<InvFilters>
      tone="plum"
      icon={<Users className="h-4 w-4" />}
      title={t('directoryTitle')}
      subtitle={t('directorySubtitle')}
      globeTo="/explore/investors"
      search={<SearchInput value={q} onChange={setQ} placeholder={t('searchInvestors')} />}
      sort={
        <SortSelect<InvSort>
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
      defaults={INV_DEFAULTS}
      activeCount={invActiveCount}
      countFor={(f) => applyInvestorFilters(investors, q, f).length}
      resultCount={results.length}
      renderFilters={(value, set) => <InvestorFilterFields value={value} set={set} />}
    >
      {results.map((inv) => (
        <GridItem key={inv.id}>
          <InvestorCard inv={inv} isNew={newestIds.has(inv.id)} />
        </GridItem>
      ))}
    </DirectoryLayout>
  );
}
