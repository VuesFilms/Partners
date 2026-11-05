import { motion } from 'framer-motion';
import { ArrowRight, Handshake, Search, SlidersHorizontal, Store, TrendingUp, type LucideIcon } from 'lucide-react';
import { useState, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StatsStrip } from '../components/StatsStrip';
import { useApp } from '../context/AppContext';
import { franchises } from '../data/franchises';
import { investors } from '../data/investors';

const ease = [0.22, 1, 0.36, 1] as const;

function ChoiceCard({
  to,
  step,
  icon: Icon,
  title,
  desc,
  cta,
  meta,
  delay,
  onOpen,
}: {
  to: string;
  step: number;
  icon: LucideIcon;
  title: string;
  desc: string;
  cta: string;
  meta: string;
  delay: number;
  onOpen: (e: MouseEvent, to: string) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay }}>
      <Link
        to={to}
        onClick={(e) => onOpen(e, to)}
        className="glass group flex h-full min-h-[240px] flex-col rounded-2xl p-6 text-white transition-[background-color,color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:bg-white hover:text-night hover:shadow-lift focus-visible:bg-white focus-visible:text-night sm:min-h-[280px] sm:p-8"
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-xs font-semibold transition-colors group-hover:bg-night group-hover:text-white group-focus-visible:bg-night group-focus-visible:text-white">
            {step}
          </span>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 transition-colors group-hover:bg-night/5 group-focus-visible:bg-night/5">
            <Icon className="h-6 w-6" strokeWidth={1.6} />
          </span>
        </div>
        <h3 className="mt-8 text-2xl font-normal tracking-tight sm:text-[28px]">{title}</h3>
        <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-white/70 transition-colors group-hover:text-night/70 group-focus-visible:text-night/70">{desc}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-8">
          <span className="inline-flex items-center gap-2 text-[15px] font-semibold">
            {cta}
            <ArrowRight className="rtl-flip h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </span>
          <span className="text-sm text-white/60 transition-colors group-hover:text-night/60 group-focus-visible:text-night/60">{meta}</span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Landing() {
  const { t, lang } = useApp();
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);
  /** Choice cards fade and scale down, then the globe screen opens. */
  const open = (e: MouseEvent, to: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(() => navigate(to), 500);
  };
  const steps: { icon: LucideIcon; title: string }[] = [
    { icon: Search, title: t('step1') },
    { icon: SlidersHorizontal, title: t('step2') },
    { icon: Handshake, title: t('step3') },
  ];

  return (
    <div className="container-x pt-4 sm:pt-6">
      <section className="glow-panel glow-mixed px-5 pb-6 pt-10 sm:px-10 sm:pb-10 sm:pt-14 lg:px-14 lg:pt-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {t('heroEyebrow')}
          </span>
          <h1 className="mt-6 text-5xl font-light tracking-tight sm:text-6xl lg:text-7xl">
            {t('brand')}
            <span className="ms-3 text-white/40 sm:ms-4" lang={lang === 'ar' ? 'en' : 'ar'}>
              {t('brandAlt')}
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">{t('valueStatement')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.08 }}
          className="mt-14 flex flex-col gap-3 sm:mt-20 lg:flex-row lg:items-end lg:justify-between"
        >
          <h2 className="text-4xl font-light tracking-tight sm:text-5xl lg:text-6xl">{t('whoAreYou')}</h2>
          <p className="text-[15px] text-white/65 lg:max-w-xs lg:text-end">{t('chooseSide')}</p>
        </motion.div>

        <motion.div
          className="mt-6 grid gap-4 sm:mt-8 md:grid-cols-2"
          animate={leaving ? { opacity: 0, scale: 0.94 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease }}
        >
          <ChoiceCard
            to="/explore/franchises"
            onOpen={open}
            step={1}
            icon={TrendingUp}
            title={t('imInvestor')}
            desc={t('imInvestorDesc')}
            cta={t('imInvestorCta')}
            meta={`${franchises.length} ${t('brandsListed')}`}
            delay={0.14}
          />
          <ChoiceCard
            to="/explore/investors"
            onOpen={open}
            step={2}
            icon={Store}
            title={t('imFranchise')}
            desc={t('imFranchiseDesc')}
            cta={t('imFranchiseCta')}
            meta={`${investors.length} ${t('investorsActive')}`}
            delay={0.2}
          />
        </motion.div>
      </section>

      <section className="mt-6 sm:mt-8" aria-label="Stats">
        <StatsStrip />
      </section>

      <section className="mt-16">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">{t('howItWorks')}</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {steps.map((s, i) => (
            <li key={i} className="card flex items-center gap-4 p-5">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-2">
                <s.icon className="h-5 w-5 text-primary-ink" />
              </span>
              <div>
                <div className="text-xs font-semibold text-muted tabular">0{i + 1}</div>
                <div className="text-[15px] font-medium">{s.title}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
