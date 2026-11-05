import { AnimatePresence, motion } from 'framer-motion';
import { Globe2, SearchX, SlidersHorizontal } from 'lucide-react';
import { forwardRef, useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Overlay } from './Overlay';
import { StatsStrip } from './StatsStrip';

interface Props<F> {
  tone: 'teal' | 'plum';
  icon: ReactNode;
  title: string;
  subtitle: string;
  /** route of the matching globe view */
  globeTo: string;
  search: ReactNode;
  sort: ReactNode;
  filters: F;
  setFilters: (f: F) => void;
  defaults: F;
  activeCount: (f: F) => number;
  /** number of results a given filter set would produce (for the sheet's Apply button) */
  countFor: (f: F) => number;
  renderFilters: (value: F, set: (f: F) => void) => ReactNode;
  resultCount: number;
  children: ReactNode;
}

export function DirectoryLayout<F>(p: Props<F>) {
  const { t } = useApp();
  const [sheetOpen, setSheetOpen] = useState(false);
  const active = p.activeCount(p.filters);
  const openSheet = () => setSheetOpen(true);

  return (
    <div className="container-x pt-4 sm:pt-6">
      {/* Header panel */}
      <section className={`glow-panel ${p.tone === 'plum' ? 'glow-plum' : ''} px-5 py-8 sm:px-10 sm:py-12`}>
        <div className="flex items-center gap-3 text-sm text-white/70">
          <span className="glass inline-flex h-9 w-9 items-center justify-center rounded-lg">{p.icon}</span>
          {t('brand')}
        </div>
        <h1 className="mt-4 text-3xl font-light tracking-tight sm:text-5xl">{p.title}</h1>
        <p className="mt-3 max-w-2xl text-[15px] text-white/70 sm:text-base">{p.subtitle}</p>
        <div className="mt-8">
          <StatsStrip variant="glass" />
        </div>
      </section>

      <div className="mt-8 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[300px_minmax(0,1fr)]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="card sticky top-24 p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <SlidersHorizontal className="h-4 w-4 text-muted" />
                {t('filters')}
              </h2>
              {active > 0 && (
                <button type="button" onClick={() => p.setFilters(p.defaults)} className="min-h-[36px] rounded-lg px-2 text-sm font-medium text-primary-ink hover:underline">
                  {t('clearAll')}
                </button>
              )}
            </div>
            {p.renderFilters(p.filters, p.setFilters)}
          </div>
        </aside>

        <section aria-live="polite" className="min-w-0">
          {/* Toolbar */}
          <div className="flex flex-col gap-3">
            {p.search}
            <div className="flex items-center gap-2 sm:gap-3">
              <button type="button" onClick={openSheet} className="btn-outline shrink-0 bg-surface px-4 lg:hidden">
                <SlidersHorizontal className="h-4 w-4" />
                {t('filters')}
                {active > 0 && (
                  <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-night">{active}</span>
                )}
              </button>
              <p className="hidden flex-1 text-sm text-muted sm:block">
                <span className="font-semibold text-text tabular">{p.resultCount}</span> {p.resultCount === 1 ? t('result') : t('results')}
              </p>
              <Link to={p.globeTo} className="btn-outline shrink-0 bg-surface px-3 sm:px-4" aria-label={t('globeView')} title={t('globeView')}>
                <Globe2 className="h-4 w-4" />
                <span className="hidden sm:inline">{t('globeView')}</span>
              </Link>
              <div className="ms-auto w-full min-w-0 max-w-[260px] flex-1 sm:flex-none">{p.sort}</div>
            </div>
            <p className="text-sm text-muted sm:hidden">
              <span className="font-semibold text-text tabular">{p.resultCount}</span> {p.resultCount === 1 ? t('result') : t('results')}
            </p>
          </div>

          <div className="mt-5">
            {p.resultCount === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card flex flex-col items-center px-6 py-16 text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-muted">
                  <SearchX className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{t('noResults')}</h3>
                <p className="mt-1 text-sm text-muted">{t('noResultsHint')}</p>
                <button type="button" className="btn-outline mt-6" onClick={() => p.setFilters(p.defaults)}>
                  {t('clearAll')}
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                <AnimatePresence mode="popLayout" initial={false}>
                  {p.children}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Mobile / tablet filter sheet */}
      <FilterSheet<F>
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        value={p.filters}
        defaults={p.defaults}
        countFor={p.countFor}
        renderFilters={p.renderFilters}
        onApply={p.setFilters}
      />
    </div>
  );
}

/** Slide-up filter panel with a draft state and an Apply button (also used by the globe). */
export function FilterSheet<F>({
  open,
  onClose,
  value,
  defaults,
  countFor,
  renderFilters,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  value: F;
  defaults: F;
  countFor: (f: F) => number;
  renderFilters: (value: F, set: (f: F) => void) => ReactNode;
  onApply: (f: F) => void;
}) {
  const { t } = useApp();
  const [draft, setDraft] = useState<F>(value);
  useEffect(() => {
    if (open) setDraft(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  const draftCount = countFor(draft);
  return (
    <Overlay
      open={open}
      onClose={onClose}
      title={t('filters')}
      variant="sheet"
      footer={
        <div className="flex gap-3">
          <button type="button" className="btn-outline flex-1" onClick={() => setDraft(defaults)}>
            {t('reset')}
          </button>
          <button
            type="button"
            className="btn-primary flex-[2]"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            {t('apply')} · <span className="tabular">{draftCount}</span> {draftCount === 1 ? t('result') : t('results')}
          </button>
        </div>
      }
    >
      {renderFilters(draft, setDraft)}
    </Overlay>
  );
}

/** Animated wrapper for each card in a directory grid. */
export const GridItem = forwardRef<HTMLDivElement, { children: ReactNode }>(function GridItem({ children }, ref) {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.97, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
});
