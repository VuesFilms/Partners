import { motion } from 'framer-motion';
import { Coins, Globe2, Hourglass, Info, MapPin, Megaphone, Percent, Ruler, Store, Wallet } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { InterestBadge } from '../components/Badges';
import { BackLink, InterestCta, KeyFigure, Section, Stat } from '../components/Detail';
import { InterestModal } from '../components/InterestModal';
import { Monogram } from '../components/Monogram';
import { useApp } from '../context/AppContext';
import { getFranchise } from '../data/franchises';
import { cities, countries, provisions, sectors } from '../i18n/dictionary';
import { formatMoneyRangeFull, formatSAR, formatSARRange, formatUSD, formatUSDRange } from '../lib/currency';
import { provisionIcon, sectorGradient, sectorIcon } from '../lib/icons';
import NotFound from './NotFound';

export default function FranchiseDetail() {
  const { id = '' } = useParams();
  const f = getFranchise(id);
  const { t, tr, lang, hasInterest } = useApp();
  const [open, setOpen] = useState(false);
  if (!f) return <NotFound />;

  const SectorIcon = sectorIcon[f.sector];
  const sent = hasInterest('franchise', f.id);
  const setup = formatMoneyRangeFull(f.investmentMin, f.investmentMax, lang);
  const fee = { sar: formatSAR(f.franchiseFee, lang), usd: formatUSD(f.franchiseFee, lang) };

  return (
    <div className="container-x pb-28 pt-2 lg:pb-0">
      <BackLink to="/franchises" label={t('backToMarket')} />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glow-panel mt-2 px-5 py-8 sm:px-10 sm:py-10"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Monogram name={f.name.en} gradient={sectorGradient[f.sector]} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                <SectorIcon className="h-3.5 w-3.5" /> {tr(sectors[f.sector])}
              </span>
              <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                <Globe2 className="h-3.5 w-3.5" /> {tr(countries[f.origin])}
              </span>
              <span className="glass inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">{tr(f.format)}</span>
              {sent && <InterestBadge />}
            </div>
            <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-5xl">{tr(f.name)}</h1>
            <p className="mt-2 max-w-2xl text-[15px] text-white/75 sm:text-base">{tr(f.tagline)}</p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KeyFigure label={t('investment')} value={formatSARRange(f.investmentMin, f.investmentMax, lang)} sub={formatUSDRange(f.investmentMin, f.investmentMax, lang)} />
          <KeyFigure label={t('franchiseFee')} value={fee.sar} sub={fee.usd} />
          <KeyFigure label={t('payback')} value={`${f.paybackMonths[0]}–${f.paybackMonths[1]} ${t('months')}`} />
          <KeyFigure label={t('gccBranches')} value={f.branchesGcc} sub={`${f.branchesTotal} ${t('branchesCount')}`} />
        </div>
      </motion.section>

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
        <div className="grid min-w-0 gap-6">
          <Section title={t('overview')} icon={<Info className="h-5 w-5" />}>
            <p className="text-[15px] leading-relaxed text-text/90">{tr(f.overview)}</p>
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-border pt-5 sm:grid-cols-4">
              {[
                [t('sector'), tr(sectors[f.sector])],
                [t('founded'), f.founded],
                [t('totalBranches'), f.branchesTotal],
                [t('gccBranches'), f.branchesGcc],
              ].map(([k, v]) => (
                <div key={String(k)}>
                  <dt className="text-sm text-muted">{k}</dt>
                  <dd className="mt-0.5 font-semibold tabular">{v}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section title={t('investmentBreakdown')} icon={<Wallet className="h-5 w-5" />}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat icon={<Coins className="h-4 w-4" />} label={t('franchiseFee')} value={fee.sar} sub={fee.usd} />
              <Stat icon={<Wallet className="h-4 w-4" />} label={t('setupCost')} value={setup.sar} sub={setup.usd} />
              <Stat icon={<Percent className="h-4 w-4" />} label={t('royalty')} value={`${f.royaltyPct}%`} sub={t('ofSales')} />
              <Stat icon={<Megaphone className="h-4 w-4" />} label={t('marketingFee')} value={`${f.marketingPct}%`} sub={t('ofSales')} />
              <Stat icon={<Hourglass className="h-4 w-4" />} label={t('payback')} value={`${f.paybackMonths[0]}–${f.paybackMonths[1]} ${t('months')}`} />
              <Stat icon={<Ruler className="h-4 w-4" />} label={t('unitSize')} value={`${f.unitSizeSqm[0]}–${f.unitSizeSqm[1]} ${t('sqm')}`} />
            </div>
          </Section>

          <Section title={t('whatProvided')} icon={<Store className="h-5 w-5" />}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {f.provides.map((p) => {
                const Icon = provisionIcon[p];
                return (
                  <li key={p} className="flex gap-3 rounded-xl border border-border p-4">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-ink">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="font-medium">{tr(provisions[p])}</div>
                      <div className="mt-0.5 text-sm text-muted">{tr(provisions[p].desc)}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Section>

          <Section title={t('expansionCities')} icon={<MapPin className="h-5 w-5" />}>
            <ul className="flex flex-wrap gap-2">
              {f.targetCities.map((c) => (
                <li key={c} className="chip min-h-[40px] bg-surface-2">
                  <MapPin className="h-3.5 w-3.5 text-primary-ink" />
                  {tr(cities[c])}
                  <span className="text-muted">· {tr(countries[cities[c].country])}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <InterestCta
          sent={sent}
          onClick={() => setOpen(true)}
          summaryLabel={t('investment')}
          summary={formatSARRange(f.investmentMin, f.investmentMax, lang)}
          summarySub={formatUSDRange(f.investmentMin, f.investmentMax, lang)}
          note={t('noCommitment')}
        />
      </div>

      <InterestModal open={open} onClose={() => setOpen(false)} kind="franchise" targetId={f.id} targetName={f.name} />
    </div>
  );
}
