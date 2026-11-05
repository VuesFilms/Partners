import { ArrowRight, Building, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { Investor } from '../data/investors';
import { cities, investorTypes, cityArea, sectors } from '../i18n/dictionary';
import { formatSARRange, formatUSDRange } from '../lib/currency';
import { investorGradient, investorTypeIcon, sectorIcon } from '../lib/icons';
import { InterestBadge, NewBadge } from './Badges';
import { Monogram } from './Monogram';

export function InvestorCard({ inv, isNew }: { inv: Investor; isNew?: boolean }) {
  const { t, tr, lang, hasInterest } = useApp();
  const TypeIcon = investorTypeIcon[inv.type];
  const sent = hasInterest('investor', inv.id);

  return (
    <Link
      to={`/investors/${inv.id}`}
      className="card group flex h-full flex-col p-5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-secondary/40 hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <Monogram name={inv.name.en} gradient={investorGradient[inv.type]} rounded="full" />
        {sent ? <InterestBadge /> : isNew ? <NewBadge /> : null}
      </div>
      <h3 className="mt-4 line-clamp-2 text-[17px] font-semibold leading-tight">{tr(inv.name)}</h3>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
        <TypeIcon className="h-3.5 w-3.5 shrink-0" />
        <span>{tr(investorTypes[inv.type])}</span>
      </p>

      <p className="mt-3 flex items-center gap-2 text-sm">
        <MapPin className="h-4 w-4 shrink-0 text-muted" />
        <span className="truncate">
          {tr(cities[inv.city])}, {tr(cityArea(inv.city))}
        </span>
      </p>

      <div className="mt-4 rounded-xl bg-surface-2 p-3.5">
        <div className="text-xs font-medium uppercase tracking-wider text-muted">{t('capitalRange')}</div>
        <div className="mt-1 text-lg font-semibold tabular">{formatSARRange(inv.capitalMin, inv.capitalMax, lang)}</div>
        <div className="text-xs text-muted tabular">{formatUSDRange(inv.capitalMin, inv.capitalMax, lang)}</div>
      </div>

      <div className="mt-4">
        <div className="sr-only">{t('sectors')}</div>
        <div className="flex flex-wrap gap-1.5">
          {inv.sectors.map((s) => {
            const Icon = sectorIcon[s];
            return (
              <span key={s} className="tag">
                <Icon className="h-3.5 w-3.5" />
                {tr(sectors[s])}
              </span>
            );
          })}
        </div>
      </div>

      <p className="mt-3 flex items-center gap-2 text-sm">
        <Building className="h-4 w-4 shrink-0 text-muted" />
        <span>
          <span className="font-semibold tabular">{inv.unitsOperated}</span> <span className="text-muted">{t('units')} · {t('unitsOperated')}</span>
        </span>
      </p>

      <div className="mt-auto flex items-center justify-between pt-5 text-sm font-medium text-secondary-ink">
        <span>{t('viewDetails')}</span>
        <ArrowRight className="rtl-flip h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
      </div>
    </Link>
  );
}
