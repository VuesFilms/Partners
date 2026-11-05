import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp, LayoutGrid, Languages, SlidersHorizontal } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';
import countriesTopo from 'world-atlas/countries-110m.json';
import { FilterSheet } from '../components/DirectoryLayout';
import { GlobeEngine, type GlobePin, type HoverInfo } from '../components/globe/engine';
import { GlobePanel, type Opportunity, type PanelView } from '../components/globe/GlobePanel';
import { InterestModal } from '../components/InterestModal';
import { LogoMark } from '../components/Logo';
import { totalCapital } from '../components/StatsStrip';
import { useApp, type InterestKind } from '../context/AppContext';
import countryNames from '../data/globe-countries.json';
import dots from '../data/globe-dots.json';
import { franchises } from '../data/franchises';
import { investors } from '../data/investors';
import { cities, cityArea, countries, type CityId, type L } from '../i18n/dictionary';
import { compact, toUSD } from '../lib/currency';
import {
  FR_DEFAULTS,
  FranchiseFilterFields,
  INV_DEFAULTS,
  InvestorFilterFields,
  applyFranchiseFilters,
  applyInvestorFilters,
  frActiveCount,
  invActiveCount,
  useFranchiseFilterState,
  useInvestorFilterState,
  type FrFilters,
  type InvFilters,
} from '../lib/directoryFilters';
import { useMediaQuery } from '../lib/hooks';

type Path = 'franchises' | 'investors';
type CountryName = { code: string; en: string; ar: string };
const names = countryNames as Record<string, CountryName>;

// world-atlas TopoJSON → GeoJSON (computed once)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const topo = countriesTopo as any;
const worldCountries = feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry, { name: string }>;

/** The view the intro settles on: Saudi Arabia / the Gulf. */
const HOME: [number, number] = [45, 24];
const TOUR_MS = 5200;

/**
 * Cities closer than MIN_SEP degrees (e.g. Dammam and Al Khobar) would draw as
 * one pin; nudge them apart a little so each stays visible and clickable.
 */
const MIN_SEP = 3.2;
function spreadPins(pins: GlobePin[]): GlobePin[] {
  const out = pins.map((p) => ({ ...p }));
  for (let pass = 0; pass < 4; pass++) {
    for (let i = 0; i < out.length; i++)
      for (let j = i + 1; j < out.length; j++) {
        const a = out[i];
        const b = out[j];
        let dx = b.lon - a.lon;
        let dy = b.lat - a.lat;
        const d = Math.hypot(dx, dy);
        if (d >= MIN_SEP) continue;
        if (d < 1e-6) [dx, dy] = [0, 1];
        const push = (MIN_SEP - d) / 2 / (d || 1);
        a.lon -= dx * push;
        a.lat -= dy * push;
        b.lon += dx * push;
        b.lat += dy * push;
      }
  }
  return out;
}

const cityOf = (o: Opportunity): CityId => (o.kind === 'franchise' ? o.item.originCity : o.item.city);

export default function GlobeExplore() {
  const { kind } = useParams();
  if (kind !== 'franchises' && kind !== 'investors') return <Navigate to="/" replace />;
  return <GlobeScreen key={kind} path={kind} />;
}

function GlobeScreen({ path }: { path: Path }) {
  const { t, tr, lang, dir, toggleLang, interests } = useApp();
  const isFr = path === 'franchises';
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const lowPower = useMediaQuery('(max-width: 767px), (pointer: coarse)');

  // ---- shared filters (same state as the directory pages) ----
  const fr = useFranchiseFilterState();
  const inv = useInvestorFilterState();
  const opportunities: Opportunity[] = useMemo(
    () =>
      isFr
        ? applyFranchiseFilters(franchises, fr.q, fr.filters).map((item) => ({ kind: 'franchise' as const, item }))
        : applyInvestorFilters(investors, inv.q, inv.filters).map((item) => ({ kind: 'investor' as const, item })),
    [isFr, fr.q, fr.filters, inv.q, inv.filters],
  );
  const activeFilters = isFr ? frActiveCount(fr.filters) : invActiveCount(inv.filters);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // ---- pins: one per city, generated from the data ----
  const byCity = useMemo(() => {
    const m = new Map<CityId, Opportunity[]>();
    for (const o of opportunities) m.set(cityOf(o), [...(m.get(cityOf(o)) ?? []), o]);
    return m;
  }, [opportunities]);
  const interestKind: InterestKind = isFr ? 'franchise' : 'investor';
  const pins: GlobePin[] = useMemo(
    () =>
      spreadPins(
        [...byCity.entries()].map(([id, items]) => ({
          id,
          lat: cities[id].lat,
          lon: cities[id].lon,
          marked: items.some((o) => interests.some((r) => r.kind === interestKind && r.targetId === o.item.id)),
        })),
      ),
    [byCity, interests, interestKind],
  );
  /** tour order: start at home, then sweep eastwards around the world */
  const tourOrder = useMemo(() => {
    const ids = [...byCity.keys()];
    const key = (id: CityId) => ((cities[id].lon - HOME[0] + 540) % 360) + (cities[id].country === 'SA' ? -360 : 0);
    return ids.sort((a, b) => key(a) - key(b) || byCity.get(b)!.length - byCity.get(a)!.length);
  }, [byCity]);

  // ---- selection ----
  type Sel = { mode: 'city'; city: CityId } | { mode: 'country'; key: string } | { mode: 'hint' };
  const [sel, setSel] = useState<Sel>({ mode: 'hint' });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [touring, setTouring] = useState(true);
  const [introDone, setIntroDone] = useState(false);
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [modal, setModal] = useState<{ kind: InterestKind; id: string; name: L } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const countryLabel = useCallback(
    (key: string): L => {
      const n = names[key];
      if (!n) return { en: key, ar: key };
      const ours = n.code && (countries as Record<string, L>)[n.code];
      return ours || { en: n.en, ar: n.ar };
    },
    [],
  );

  const view: PanelView = useMemo(() => {
    if (sel.mode === 'city') {
      const items = byCity.get(sel.city) ?? [];
      return { mode: 'city', title: cities[sel.city], eyebrow: cityArea(sel.city), items };
    }
    if (sel.mode === 'country') {
      const code = names[sel.key]?.code;
      const items = code ? opportunities.filter((o) => cities[cityOf(o)].country === code) : [];
      return { mode: 'country', title: countryLabel(sel.key), items };
    }
    return { mode: 'hint' };
  }, [sel, byCity, opportunities, countryLabel]);

  // If a filter removes the selected city, fall back to the hint
  useEffect(() => {
    if (sel.mode === 'city' && !byCity.has(sel.city)) setSel({ mode: 'hint' });
  }, [byCity, sel]);

  // ---- engine ----
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GlobeEngine | null>(null);
  const touringRef = useRef(touring);
  touringRef.current = touring;

  const stopTour = useCallback(() => setTouring(false), []);

  const selectCity = useCallback((city: CityId, opts: { expand?: string | null; rotate?: boolean } = {}) => {
    setSel({ mode: 'city', city });
    setExpandedId(opts.expand ?? null);
    setSheetExpanded(false);
    const e = engineRef.current;
    if (!e) return;
    e.setSelected(city);
    e.setCountry(null);
    if (opts.rotate !== false) e.rotateTo(cities[city].lon, cities[city].lat, touringRef.current ? 1900 : 1100);
  }, []);

  // callbacks the engine calls; kept in a ref so the engine is created only once
  const handlers = useRef({
    onPinClick: (_id: string) => {},
    onCountryClick: (_key: string) => {},
    onOceanClick: () => {},
  });
  handlers.current.onPinClick = (id) => selectCity(id as CityId);
  handlers.current.onCountryClick = (key) => {
    setSel({ mode: 'country', key });
    setExpandedId(null);
    const e = engineRef.current;
    if (!e) return;
    e.setSelected(null);
    e.setCountry(key);
    const c = e.countryCenter(key);
    if (c) e.rotateTo(c[0], c[1]);
  };
  handlers.current.onOceanClick = () => {
    setSel({ mode: 'hint' });
    setExpandedId(null);
    engineRef.current?.setSelected(null);
    engineRef.current?.setCountry(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const engine = new GlobeEngine(
      canvas,
      dots as number[],
      worldCountries,
      {
        onPinClick: (id) => handlers.current.onPinClick(id),
        onCountryClick: (k) => handlers.current.onCountryClick(k),
        onOceanClick: () => handlers.current.onOceanClick(),
        onHover: setHover,
        onUserInteract: stopTour,
        onIntroDone: () => setIntroDone(true),
      },
      { reducedMotion, lowPower },
    );
    engineRef.current = engine;
    engine.startIntro(HOME[0], HOME[1]);
    // test hook for the automated browser checks (read-only helpers)
    (window as unknown as { __partnersGlobe?: unknown }).__partnersGlobe = {
      screenOf: (lon: number, lat: number) => engine.screenOf(lon, lat),
      countryCenter: (key: string) => engine.countryCenter(key),
      rotateTo: (lon: number, lat: number) => engine.rotateTo(lon, lat, 0),
      state: () => engine.getState(),
    };
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
    // the engine lives for the whole screen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // layout: globe position/size per breakpoint and direction
  const panelW = 360;
  useEffect(() => {
    const stage = stageRef.current!;
    const apply = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      let cx: number, cy: number, r: number;
      if (isDesktop) {
        const margin = Math.max(32, w * 0.04);
        const avail = w - panelW - margin * 2;
        cx = dir === 'rtl' ? w - (margin + avail / 2) : margin + avail / 2;
        cy = h * 0.49;
        r = Math.min(h * 0.34, avail * 0.4);
      } else {
        const top = 128;
        const sheet = Math.min(h * 0.4, 340);
        cx = w / 2;
        cy = (top + (h - sheet)) / 2;
        r = Math.max(90, Math.min(w * 0.42, ((h - sheet - top) / 2) * 0.86));
      }
      engineRef.current?.resize(w, h, { cx, cy, r });
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [isDesktop, dir]);

  // connector line anchor (desktop only)
  useEffect(() => {
    const e = engineRef.current;
    if (!e) return;
    e.setAnchor(
      isDesktop
        ? () => {
            const panel = panelRef.current;
            const stage = stageRef.current;
            if (!panel || !stage) return null;
            const pb = panel.getBoundingClientRect();
            const sb = stage.getBoundingClientRect();
            return { x: (dir === 'rtl' ? pb.right + 14 : pb.left - 14) - sb.left, y: pb.top - sb.top + 34 };
          }
        : null,
    );
  }, [isDesktop, dir]);

  useEffect(() => engineRef.current?.setPins(pins), [pins]);

  // ---- automatic tour ----
  useEffect(() => {
    if (!touring || !introDone || !tourOrder.length) return;
    let i = 0;
    if (sel.mode === 'city') i = Math.max(0, tourOrder.indexOf(sel.city) + 1) % tourOrder.length;
    if (sel.mode !== 'city') {
      selectCity(tourOrder[0], { rotate: true });
      i = 1 % tourOrder.length;
    }
    const id = window.setInterval(() => {
      selectCity(tourOrder[i]);
      i = (i + 1) % tourOrder.length;
    }, TOUR_MS);
    return () => window.clearInterval(id);
    // restart only when the tour is toggled or the pin set changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touring, introDone, tourOrder]);

  // any click on the screen stops the tour (except the resume button itself)
  const onStagePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-keep-tour]')) return;
    if (touring) stopTour();
  };

  // ---- panel actions ----
  const onInterest = (o: Opportunity) => {
    setModal({ kind: o.kind, id: o.item.id, name: o.item.name });
    setModalOpen(true);
  };
  const onRequestMarket = () => {
    if (sel.mode !== 'country') return;
    const n = names[sel.key];
    setModal({ kind: 'market', id: n?.code || sel.key, name: countryLabel(sel.key) });
    setModalOpen(true);
  };

  // ---- stats ----
  const cityCount = byCity.size;
  const capital = compact(totalCapital, lang);
  const capitalUsd = compact(toUSD(totalCapital), lang);

  const showSkip = !introDone;
  const tooltipLabel = hover ? (hover.kind === 'pin' ? tr(cities[hover.key as CityId]) : tr(countryLabel(hover.key))) : '';

  const panel = (
    <GlobePanel
      ref={panelRef}
      view={view}
      path={path}
      touring={touring}
      expandedId={expandedId}
      onToggle={(id) => setExpandedId((cur) => (cur === id ? null : id))}
      onOpenInCountry={(o) => selectCity(cityOf(o), { expand: o.item.id })}
      onInterest={onInterest}
      onRequestMarket={onRequestMarket}
      onResumeTour={() => setTouring(true)}
    />
  );

  return (
    // The globe screen is always dark: the `dark` class switches the design tokens for this subtree.
    <div className="dark">
      <div
        ref={stageRef}
        onPointerDownCapture={onStagePointerDown}
        className="relative h-[100dvh] w-full select-none overflow-hidden bg-night text-text"
      >
        {/* background glow (palette only) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(55% 60% at 50% 50%, rgb(42 68 94 / 0.35), transparent 70%), radial-gradient(40% 40% at 0% 100%, rgb(88 9 79 / 0.25), transparent 70%)',
          }}
        />

        <canvas ref={canvasRef} className="absolute inset-0 touch-none" aria-label={t('globeLabel')} role="img" />

        {/* top bar */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-2 px-4 pt-3 sm:px-8 sm:pt-5" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
          <Link to="/" className="flex min-h-[44px] items-center gap-2.5 rounded-xl" aria-label={t('navHome')}>
            <LogoMark className="h-7 w-7" />
            <span className="text-sm font-semibold uppercase tracking-[0.18em]">{t('brand')}</span>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button type="button" onClick={() => setFiltersOpen(true)} className="btn-ghost relative px-3 text-sm" aria-label={t('filters')}>
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">{t('filters')}</span>
              {activeFilters > 0 && (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-night">{activeFilters}</span>
              )}
            </button>
            <Link to={`/${path}`} className="btn-outline px-3 text-sm">
              <LayoutGrid className="h-4 w-4" />
              {t('browseAll')}
            </Link>
            <button
              type="button"
              onClick={toggleLang}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-border px-3 text-sm font-semibold transition-colors hover:bg-surface-2"
              aria-label={t('switchLangLabel')}
              data-keep-tour
            >
              <Languages className="h-4 w-4 text-muted" />
              <span className="hidden sm:inline">{t('switchLang')}</span>
              <span className="sm:hidden">{t('switchLangShort')}</span>
            </button>
          </div>
        </div>

        {/* headline + stats */}
        {isDesktop ? (
          <>
            <div className="pointer-events-none absolute bottom-10 start-8 z-10 max-w-[300px] xl:start-12">
              <h1 className="text-2xl font-semibold leading-tight xl:text-[28px]">{isFr ? t('globeHeadlineInv') : t('globeHeadlineFr')}</h1>
              <p className="mt-3 text-sm leading-relaxed text-muted">{isFr ? t('globeTextInv') : t('globeTextFr')}</p>
            </div>
            <div className="absolute bottom-10 end-8 z-10 w-[440px] max-w-[38vw] xl:end-12">
              <dl className="grid grid-cols-[1fr_1fr_1.7fr]">
                {[
                  [String(cityCount), t('statCities')],
                  [String(opportunities.length), isFr ? t('statBrandsShort') : t('statInvestorsShort')],
                  [lang === 'ar' ? `${capital} ر.س` : `SAR ${capital}`, t('statCapitalShort')],
                ].map(([v, k], i) => (
                  <div key={k} className="flex flex-col">
                    {/* top bracket row with the number */}
                    <dd className={`border-t border-border/80 px-3 pt-2 text-lg font-semibold tabular whitespace-nowrap xl:text-xl ${i === 0 ? 'border-s' : ''} ${i === 2 ? 'border-e' : ''}`}>
                      <span className={`${i ? 'border-s border-border/80 ps-3 -ms-3' : ''} inline-block`}>{v}</span>
                    </dd>
                    {/* bottom bracket row with the label */}
                    <dt className={`mt-5 border-b border-border/80 px-3 pb-2 text-end text-xs text-muted ${i === 0 ? 'border-s' : ''} ${i === 2 ? 'border-e' : ''}`}>
                      <span className={`${i ? 'border-s border-border/80 ps-3' : ''} inline-block`}>{k}</span>
                    </dt>
                  </div>
                ))}
              </dl>
              <p className="mt-1.5 text-end text-[11px] text-muted tabular">≈ {lang === 'ar' ? `${capitalUsd} دولار` : `USD ${capitalUsd}`}</p>
            </div>
          </>
        ) : (
          <div className="pointer-events-none absolute inset-x-0 top-[68px] z-10 px-4 text-center">
            <h1 className="text-lg font-semibold leading-tight">{isFr ? t('globeHeadlineInv') : t('globeHeadlineFr')}</h1>
            <p className="mt-1 text-xs text-muted tabular">
              {cityCount} {t('statCities')} · {opportunities.length} {isFr ? t('statBrandsShort') : t('statInvestorsShort')} · {lang === 'ar' ? `${capital} ر.س` : `SAR ${capital}`}
            </p>
          </div>
        )}

        {/* drag indicator / skip */}
        <div
          className="absolute start-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 rtl:translate-x-1/2"
          style={{ bottom: isDesktop ? 36 : `calc(min(40dvh, 340px) + 12px)` }}
        >
          {showSkip ? (
            <button type="button" onClick={() => engineRef.current?.skipIntro()} className="btn-outline min-h-[44px] bg-night/60 px-5 text-sm backdrop-blur" data-keep-tour>
              {t('skip')}
            </button>
          ) : (
            <div className="pointer-events-none flex flex-col items-center gap-1.5" aria-hidden="true">
              <svg width="76" height="20" viewBox="0 0 76 20" className="overflow-visible">
                <ellipse cx="38" cy="10" rx="36" ry="8" fill="none" stroke="rgb(238 242 245 / 0.45)" strokeDasharray="3 4" />
                <circle cx={reducedMotion ? 38 : 0} cy={reducedMotion ? 18 : 0} r="3.5" fill="#841E62">
                  {!reducedMotion && <animateMotion dur="4s" repeatCount="indefinite" path="M38,18 A36,8 0 1,0 37.99,18" />}
                </circle>
              </svg>
              <span className="text-xs text-muted">{t('dragToRotate')}</span>
            </div>
          )}
        </div>

        {/* tooltip */}
        <AnimatePresence>
          {hover && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="pointer-events-none absolute z-20 whitespace-nowrap rounded-lg border border-border bg-surface px-2.5 py-1.5 text-sm font-medium shadow-lift"
              style={{ left: hover.x + 14, top: hover.y - 40 }}
            >
              {tooltipLabel}
              {hover.kind === 'pin' && byCity.get(hover.key as CityId) && (
                <span className="ms-1.5 text-muted tabular">· {byCity.get(hover.key as CityId)!.length}</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* info panel: side panel on desktop, bottom sheet on phones/tablets */}
        {isDesktop ? (
          // centred in the space between the top bar and the stats bar
          <div className="pointer-events-none absolute end-8 top-24 bottom-[190px] z-10 flex items-center xl:end-12">
            <motion.aside
              initial={{ opacity: 0, x: dir === 'rtl' ? -16 : 16 }}
              animate={{ opacity: introDone ? 1 : 0, x: introDone ? 0 : dir === 'rtl' ? -16 : 16 }}
              transition={{ duration: 0.4 }}
              className="pointer-events-auto relative flex max-h-full flex-col border-s border-border/80 ps-6"
              style={{ width: panelW }}
              aria-live="polite"
            >
              <span aria-hidden="true" className="absolute -top-px start-0 h-px w-5 bg-border" />
              <span aria-hidden="true" className="absolute -bottom-px start-0 h-px w-5 bg-border" />
              {panel}
            </motion.aside>
          </div>
        ) : (
          <motion.section
            initial={{ y: '100%' }}
            animate={{ y: introDone ? 0 : '100%' }}
            transition={{ duration: reducedMotion ? 0.01 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="pb-safe absolute inset-x-0 bottom-0 z-20 mx-auto flex max-w-2xl flex-col rounded-t-3xl border-t border-border bg-surface/95 px-5 shadow-lift backdrop-blur-xl"
            style={{ height: sheetExpanded ? '80dvh' : 'min(40dvh, 340px)', transition: 'height 0.3s cubic-bezier(0.22,1,0.36,1)' }}
            aria-live="polite"
          >
            <button
              type="button"
              onClick={() => setSheetExpanded((v) => !v)}
              className="flex min-h-[32px] w-full items-center justify-center pt-2"
              aria-label={sheetExpanded ? t('hideDetails') : t('showDetails')}
              aria-expanded={sheetExpanded}
            >
              <span className="h-1.5 w-10 rounded-full bg-border" />
              <ChevronUp className={`absolute end-4 top-3 h-5 w-5 text-muted transition-transform ${sheetExpanded ? 'rotate-180' : ''}`} />
            </button>
            <div className="flex min-h-0 flex-1 flex-col pt-1">{panel}</div>
          </motion.section>
        )}
      </div>

      <FilterSheet<FrFilters>
        open={filtersOpen && isFr}
        onClose={() => setFiltersOpen(false)}
        value={fr.filters}
        defaults={FR_DEFAULTS}
        countFor={(f) => applyFranchiseFilters(franchises, fr.q, f).length}
        renderFilters={(v, s) => <FranchiseFilterFields value={v} set={s} />}
        onApply={fr.setFilters}
      />
      <FilterSheet<InvFilters>
        open={filtersOpen && !isFr}
        onClose={() => setFiltersOpen(false)}
        value={inv.filters}
        defaults={INV_DEFAULTS}
        countFor={(f) => applyInvestorFilters(investors, inv.q, f).length}
        renderFilters={(v, s) => <InvestorFilterFields value={v} set={s} />}
        onApply={inv.setFilters}
      />

      {modal && (
        <InterestModal open={modalOpen} onClose={() => setModalOpen(false)} kind={modal.kind} targetId={modal.id} targetName={modal.name} />
      )}
    </div>
  );
}
