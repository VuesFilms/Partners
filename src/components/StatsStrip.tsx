import { Banknote, Send, Store, Users, type LucideIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { franchises } from '../data/franchises';
import { investors } from '../data/investors';
import { compact, formatNumber, toUSD } from '../lib/currency';
import { useCountUp } from '../lib/hooks';

export const totalCapital = investors.reduce((sum, i) => sum + i.capitalMax, 0);

function Stat({
  icon: Icon,
  value,
  format,
  label,
  sub,
  tone,
  variant,
}: {
  icon: LucideIcon;
  value: number;
  format: (n: number) => string;
  label: string;
  sub?: (n: number) => string;
  tone: string;
  variant: 'card' | 'glass';
}) {
  const { ref, value: v } = useCountUp(value);
  const glass = variant === 'glass';
  return (
    <div
      className={`flex min-w-0 flex-col gap-3 rounded-2xl p-4 sm:p-5 ${
        glass ? 'glass text-white' : 'border border-border bg-surface shadow-card'
      }`}
    >
      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}>
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0">
        <div ref={ref as React.RefObject<HTMLDivElement>} className="tabular break-words text-xl font-semibold tracking-tight sm:text-3xl">
          {format(v)}
        </div>
        {sub && <div className={`tabular mt-0.5 break-words text-xs ${glass ? 'text-white/60' : 'text-muted'}`}>{sub(v)}</div>}
        <div className={`mt-1 text-sm ${glass ? 'text-white/75' : 'text-muted'}`}>{label}</div>
      </div>
    </div>
  );
}

export function StatsStrip({ variant = 'card' }: { variant?: 'card' | 'glass' }) {
  const { t, lang, requestCount } = useApp();
  const glass = variant === 'glass';
  const fmt = (n: number) => formatNumber(n);
  const capitalM = Math.round(totalCapital / 1_000_000);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <Stat variant={variant} icon={Store} value={franchises.length} format={fmt} label={t('statBrands')} tone={glass ? 'bg-white/10' : 'bg-primary/10 text-primary-ink'} />
      <Stat variant={variant} icon={Users} value={investors.length} format={fmt} label={t('statInvestors')} tone={glass ? 'bg-white/10' : 'bg-secondary/10 text-secondary-ink'} />
      <Stat
        variant={variant}
        icon={Banknote}
        value={capitalM}
        format={(n) => (lang === 'ar' ? `${compact(n * 1e6, lang)} ر.س` : `SAR ${compact(n * 1e6, lang)}`)}
        sub={(n) => (lang === 'ar' ? `≈ ${compact(toUSD(n * 1e6), lang)} دولار` : `≈ USD ${compact(toUSD(n * 1e6), lang)}`)}
        label={t('statCapital')}
        tone={glass ? 'bg-white/10' : 'bg-accent text-night'}
      />
      <Stat variant={variant} icon={Send} value={requestCount} format={fmt} label={t('statRequests')} tone={glass ? 'bg-white/10' : 'bg-navy/10 text-navy dark:bg-white/10 dark:text-text'} />
    </div>
  );
}
