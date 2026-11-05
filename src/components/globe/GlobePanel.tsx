import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Compass, MapPin, Play, Send } from 'lucide-react';
import { forwardRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import type { Franchise } from '../../data/franchises';
import type { Investor } from '../../data/investors';
import { cities, investorTypes, sectors, type L } from '../../i18n/dictionary';
import { formatSAR, formatSARRange, formatUSDRange } from '../../lib/currency';
import { investorGradient, sectorGradient, sectorIcon } from '../../lib/icons';
import { InterestBadge } from '../Badges';
import { Monogram } from '../Monogram';

export type Opportunity = { kind: 'franchise'; item: Franchise } | { kind: 'investor'; item: Investor };

export type PanelView =
  | { mode: 'city'; title: L; eyebrow: L; items: Opportunity[] }
  | { mode: 'country'; title: L; items: Opportunity[] }
  | { mode: 'hint' };

interface Props {
  view: PanelView;
  path: 'franchises' | 'investors';
  touring: boolean;
  expandedId: string | null;
  onToggle: (id: string) => void;
  onOpenInCountry: (o: Opportunity) => void;
  onInterest: (o: Opportunity) => void;
  onRequestMarket: () => void;
  onResumeTour: () => void;
}

const itemId = (o: Opportunity) => o.item.id;

export const GlobePanel = forwardRef<HTMLDivElement, Props>(function GlobePanel(p, ref) {
  const { t, tr, lang, hasInterest } = useApp();
  const isFr = p.path === 'franchises';
  const view = p.view;

  const countLabel = (n: number) =>
    `${n} ${isFr ? (n === 1 ? t('brandHere') : t('brandsHere')) : n === 1 ? t('investorHere') : t('investorsHere')}`;

  const header = (eyebrow: ReactNode, title: string, sub?: string) => (
    <div className="pb-4">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted">{eyebrow}</div>
      <h2 className="mt-1.5 text-2xl font-semibold leading-tight text-text">{title}</h2>
      {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
    </div>
  );

  const tourLine = p.touring ? (
    <p className="flex items-center gap-2 text-xs text-muted" aria-live="polite">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary-ink motion-reduce:animate-none" />
      {t('touring')}
    </p>
  ) : (
    <button type="button" onClick={p.onResumeTour} className="-ms-2 inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-secondary-ink hover:underline">
      <Play className="h-3.5 w-3.5 rtl-flip" />
      {t('resumeTour')}
    </button>
  );

  const row = (o: Opportunity, inCountry: boolean) => {
    const id = itemId(o);
    const open = !inCountry && p.expandedId === id;
    const sent = hasInterest(o.kind, id);
    const name = tr(o.item.name);
    const isF = o.kind === 'franchise';
    const SectorIcon = isF ? sectorIcon[o.item.sector] : null;
    const sub = isF ? tr(sectors[o.item.sector]) : tr(investorTypes[o.item.type]);
    const range = isF ? [o.item.investmentMin, o.item.investmentMax] : [o.item.capitalMin, o.item.capitalMax];
    const detailsTo = isF ? `/franchises/${id}` : `/investors/${id}`;
    return (
      <li key={id} className="border-t border-border first:border-t-0">
        <button
          type="button"
          aria-expanded={inCountry ? undefined : open}
          onClick={() => (inCountry ? p.onOpenInCountry(o) : p.onToggle(id))}
          className="flex min-h-[64px] w-full items-center gap-3 py-3 text-start transition-colors hover:bg-white/[0.03]"
        >
          <span className="scale-[0.8]">
            <Monogram name={o.item.name.en} gradient={isF ? sectorGradient[o.item.sector] : investorGradient[o.item.type]} rounded={isF ? 'xl' : 'full'} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-semibold text-text">{name}</span>
              {sent && <InterestBadge />}
            </span>
            <span className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
              {SectorIcon && <SectorIcon className="h-3.5 w-3.5 shrink-0" />}
              {sub}
              {inCountry && (
                <>
                  <span aria-hidden="true">·</span>
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {tr(cities[isF ? o.item.originCity : o.item.city])}
                </>
              )}
            </span>
            <span className="mt-0.5 block text-sm font-medium text-text tabular">{formatSARRange(range[0], range[1], lang)}</span>
            <span className="block text-xs text-muted tabular">{formatUSDRange(range[0], range[1], lang)}</span>
          </span>
          {inCountry ? (
            <ArrowRight className="rtl-flip h-4 w-4 shrink-0 text-muted" />
          ) : (
            <ChevronDown className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          )}
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <dl className="grid grid-cols-2 gap-2 pb-3 text-sm">
                {(isF
                  ? [
                      [t('branches'), String(o.item.branchesTotal)],
                      [t('franchiseFee'), formatSAR(o.item.franchiseFee, lang)],
                      [t('royalty'), `${o.item.royaltyPct}%`],
                      [t('payback'), `${o.item.paybackMonths[0]}–${o.item.paybackMonths[1]} ${t('months')}`],
                    ]
                  : [
                      [t('investorType'), tr(investorTypes[o.item.type])],
                      [t('ticketSize'), formatSARRange(o.item.ticketMin, o.item.ticketMax, lang)],
                      [t('preferredSector'), o.item.sectors.map((s) => tr(sectors[s])).join(lang === 'ar' ? '، ' : ', ')],
                      [t('unitsOperated'), String(o.item.unitsOperated)],
                    ]
                ).map(([k, v]) => (
                  <div key={k} className="min-w-0 rounded-lg bg-surface-2 px-3 py-2">
                    <dt className="text-xs text-muted">{k}</dt>
                    <dd className="mt-0.5 break-words font-medium text-text tabular">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap gap-2 pb-4">
                <Link to={detailsTo} className="btn-outline flex-1 whitespace-nowrap px-3 text-sm">
                  {t('viewFullProfile')}
                </Link>
                <button type="button" onClick={() => p.onInterest(o)} className={`${sent ? 'btn-outline' : 'btn-primary'} flex-1 whitespace-nowrap px-3 text-sm`}>
                  <Send className="rtl-flip h-4 w-4" />
                  {sent ? t('interestSent') : t('expressInterest')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </li>
    );
  };

  let body: ReactNode;
  if (view.mode === 'hint') {
    body = (
      <>
        {header(
          <>
            <Compass className="h-3.5 w-3.5" />
            {t('brand')}
          </>,
          t('oceanTitle'),
        )}
        <p className="text-[15px] leading-relaxed text-muted">{t('oceanHint')}</p>
      </>
    );
  } else if (view.mode === 'city') {
    body = (
      <>
        {header(
          <>
            <MapPin className="h-3.5 w-3.5" />
            {tr(view.eyebrow)}
          </>,
          tr(view.title),
          countLabel(view.items.length),
        )}
        <ul>{view.items.map((o) => row(o, false))}</ul>
      </>
    );
  } else {
    body = (
      <>
        {header(<>{isFr ? t('fromThisCountry') : t('basedInThisCountry')}</>, tr(view.title), view.items.length ? countLabel(view.items.length) : undefined)}
        {view.items.length ? (
          <ul>{view.items.map((o) => row(o, true))}</ul>
        ) : (
          <div>
            <p className="text-[15px] leading-relaxed text-muted">{t('noListings')}</p>
            <button type="button" onClick={p.onRequestMarket} className="btn-primary mt-4 w-full">
              <Send className="rtl-flip h-4 w-4" />
              {t('requestMarket')}
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <div ref={ref} className="flex min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{body}</div>
      <div className="mt-2 border-t border-border pt-1">{tourLine}</div>
    </div>
  );
});
