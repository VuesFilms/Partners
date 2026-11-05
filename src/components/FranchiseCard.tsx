import { ArrowRight, Globe2, MapPin, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { Franchise } from '../data/franchises';
import { cities, countries, sectors } from '../i18n/dictionary';
import { formatSARRange, formatUSDRange } from '../lib/currency';
import { sectorGradient, sectorIcon } from '../lib/icons';
import { InterestBadge, NewBadge } from './Badges';
import { Monogram } from './Monogram';

export function FranchiseCard({ f, isNew }: { f: Franchise; isNew?: boolean }) {
  const { t, tr, lang, hasInterest } = useApp();
  const SectorIcon = sectorIcon[f.sector];
  const sent = hasInterest('franchise', f.id);
  const shownCities = f.targetCities.slice(0, 2);
  const extra = f.targetCities.length - shownCities.length;

  return (
    <Link
      to={`/franchises/${f.id}`}
      className="card group flex h-full flex-col p-5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <Monogram name={f.name.en} gradient={sectorGradient[f.sector]} />
        {sent ? <InterestBadge /> : isNew ? <NewBadge /> : null}
      </div>
      <h3 className="mt-4 line-clamp-2 text-[17px] font-semibold leading-tight">{tr(f.name)}</h3>
      <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm text-muted">
        <SectorIcon className="h-3.5 w-3.5 shrink-0" />
        <span>{tr(sectors[f.sector])}</span>
        <span aria-hidden="true">·</span>
        <span>{tr(f.format)}</span>
      </p>

      <p className="mt-3 line-clamp-2 text-sm text-muted">{tr(f.tagline)}</p>

      <div className="mt-4 rounded-xl bg-surface-2 p-3.5">
        <div className="text-xs font-medium uppercase tracking-wider text-muted">{t('investment')}</div>
        <div className="mt-1 text-lg font-semibold tabular">{formatSARRange(f.investmentMin, f.investmentMax, lang)}</div>
        <div className="text-xs text-muted tabular">{formatUSDRange(f.investmentMin, f.investmentMax, lang)}</div>
      </div>

      <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Globe2 className="h-4 w-4 shrink-0 text-muted" />
          <dt className="sr-only">{t('origin')}</dt>
          <dd>{tr(countries[f.origin])}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 shrink-0 text-muted" />
          <dt className="sr-only">{t('branches')}</dt>
          <dd className="tabular">
            {f.branchesTotal} {t('branchesCount')}
          </dd>
        </div>
      </dl>

      <div className="mt-3 flex items-start gap-2 text-sm">
        <MapPin className="mt-1 h-4 w-4 shrink-0 text-muted" />
        <div className="flex flex-wrap gap-1.5">
          <span className="sr-only">{t('targetCities')}:</span>
          {shownCities.map((c) => (
            <span key={c} className="tag">{tr(cities[c])}</span>
          ))}
          {extra > 0 && <span className="tag">+{extra}</span>}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between pt-5 text-sm font-medium text-primary-ink">
        <span>{t('viewDetails')}</span>
        <ArrowRight className="rtl-flip h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
      </div>
    </Link>
  );
}
