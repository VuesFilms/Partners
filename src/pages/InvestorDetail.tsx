import { motion } from 'framer-motion';
import { Briefcase, Check, Crosshair, Layers, MapPin, PieChart, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { InterestBadge } from '../components/Badges';
import { BackLink, InterestCta, KeyFigure, Section } from '../components/Detail';
import { InterestModal } from '../components/InterestModal';
import { Monogram } from '../components/Monogram';
import { useApp } from '../context/AppContext';
import { getInvestor } from '../data/investors';
import { cities, dealStructures, investorTypes, cityArea, sectors, type DealStructureId } from '../i18n/dictionary';
import { formatMoneyRangeFull, formatSARRange, formatUSDRange } from '../lib/currency';
import { investorGradient, investorTypeIcon, sectorIcon } from '../lib/icons';
import NotFound from './NotFound';

const ALL_STRUCTURES: DealStructureId[] = ['single', 'multi', 'master'];

export default function InvestorDetail() {
  const { id = '' } = useParams();
  const inv = getInvestor(id);
  const { t, tr, lang, hasInterest } = useApp();
  const [open, setOpen] = useState(false);
  if (!inv) return <NotFound />;

  const TypeIcon = investorTypeIcon[inv.type];
  const sent = hasInterest('investor', inv.id);
  const ticket = formatMoneyRangeFull(inv.ticketMin, inv.ticketMax, lang);

  return (
    <div className="container-x pb-28 pt-2 lg:pb-0">
      <BackLink to="/investors" label={t('backToDirectory')} />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glow-panel glow-plum mt-2 px-5 py-8 sm:px-10 sm:py-10"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Monogram name={inv.name.en} gradient={investorGradient[inv.type]} size="lg" rounded="full" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                <TypeIcon className="h-3.5 w-3.5" /> {tr(investorTypes[inv.type])}
              </span>
              <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                <MapPin className="h-3.5 w-3.5" /> {tr(cities[inv.city])}, {tr(cityArea(inv.city))}
              </span>
              {sent && <InterestBadge />}
            </div>
            <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-5xl">{tr(inv.name)}</h1>
            <p className="mt-2 max-w-2xl text-[15px] text-white/75 sm:text-base">{tr(inv.focus)}</p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KeyFigure label={t('capitalRange')} value={formatSARRange(inv.capitalMin, inv.capitalMax, lang)} sub={formatUSDRange(inv.capitalMin, inv.capitalMax, lang)} />
          <KeyFigure label={t('ticketSize')} value={formatSARRange(inv.ticketMin, inv.ticketMax, lang)} sub={formatUSDRange(inv.ticketMin, inv.ticketMax, lang)} />
          <KeyFigure label={t('unitsOperated')} value={inv.unitsOperated} />
          <KeyFigure label={t('memberSince')} value={inv.since} />
        </div>
      </motion.section>

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
        <div className="grid min-w-0 gap-6">
          <Section title={t('profile')} icon={<UserRound className="h-5 w-5" />}>
            <p className="text-[15px] leading-relaxed text-text/90">{tr(inv.profile)}</p>
          </Section>

          <Section title={t('investmentFocus')} icon={<Crosshair className="h-5 w-5" />}>
            <p className="text-[15px] leading-relaxed text-text/90">{tr(inv.focus)}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {inv.sectors.map((s) => {
                const Icon = sectorIcon[s];
                return (
                  <span key={s} className="chip min-h-[40px] bg-surface-2">
                    <Icon className="h-4 w-4 text-secondary-ink" />
                    {tr(sectors[s])}
                  </span>
                );
              })}
            </div>
            <div className="mt-5 rounded-xl bg-surface-2 p-4">
              <div className="text-sm text-muted">{t('ticketSize')}</div>
              <div className="mt-0.5 break-words font-semibold tabular">{ticket.sar}</div>
              <div className="break-words text-xs text-muted tabular">{ticket.usd}</div>
            </div>
          </Section>

          <Section title={t('dealStructure')} icon={<Layers className="h-5 w-5" />}>
            <ul className="grid gap-3 sm:grid-cols-3">
              {ALL_STRUCTURES.map((s) => {
                const on = inv.structures.includes(s);
                return (
                  <li
                    key={s}
                    className={`flex min-h-[56px] items-center gap-3 rounded-xl border p-4 ${
                      on ? 'border-secondary/50 bg-secondary/[0.06]' : 'border-border text-muted opacity-60'
                    }`}
                  >
                    <span className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${on ? 'bg-secondary text-white' : 'bg-surface-2'}`}>
                      {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    </span>
                    <span className="font-medium">{tr(dealStructures[s])}</span>
                  </li>
                );
              })}
            </ul>
          </Section>

          <Section title={t('targetCities')} icon={<MapPin className="h-5 w-5" />}>
            <ul className="flex flex-wrap gap-2">
              {inv.targetCities.map((c) => (
                <li key={c} className="chip min-h-[40px] bg-surface-2">
                  <MapPin className="h-3.5 w-3.5 text-secondary-ink" />
                  {tr(cities[c])}
                  <span className="text-muted">· {tr(cityArea(c))}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title={t('portfolio')} icon={<PieChart className="h-5 w-5" />}>
            <div className="flex gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary-ink">
                <Briefcase className="h-5 w-5" />
              </span>
              <div>
                <div className="text-2xl font-semibold tabular">
                  {inv.unitsOperated} <span className="text-base font-normal text-muted">{t('units')}</span>
                </div>
                <p className="mt-1 text-[15px] leading-relaxed text-text/90">{tr(inv.portfolio)}</p>
              </div>
            </div>
          </Section>
        </div>

        <InterestCta
          sent={sent}
          onClick={() => setOpen(true)}
          summaryLabel={t('capitalRange')}
          summary={formatSARRange(inv.capitalMin, inv.capitalMax, lang)}
          summarySub={formatUSDRange(inv.capitalMin, inv.capitalMax, lang)}
          note={t('noCommitmentInvestor')}
        />
      </div>

      <InterestModal open={open} onClose={() => setOpen(false)} kind="investor" targetId={inv.id} targetName={inv.name} />
    </div>
  );
}
