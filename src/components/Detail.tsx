import { ArrowLeft, Send } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { InterestBadge } from './Badges';

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="-ms-2 inline-flex min-h-[44px] items-center gap-2 rounded-xl px-2 text-sm font-medium text-muted transition-colors hover:text-text">
      <ArrowLeft className="rtl-flip h-4 w-4" />
      {label}
    </Link>
  );
}

export function Section({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <section className="card p-5 sm:p-7">
      <h2 className="flex items-center gap-2.5 text-lg font-semibold">
        {icon && <span className="text-muted">{icon}</span>}
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function KeyFigure({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) {
  return (
    <div className="glass min-w-0 rounded-2xl p-4">
      <div className="text-xs font-medium uppercase tracking-wider text-white/60">{label}</div>
      <div className="mt-1.5 text-lg font-semibold tabular sm:text-xl">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-white/60 tabular">{sub}</div>}
    </div>
  );
}

export function Stat({ icon, label, value, sub }: { icon: ReactNode; label: string; value: ReactNode; sub?: ReactNode }) {
  return (
    <div className="flex min-w-0 gap-3 rounded-xl bg-surface-2 p-4">
      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-primary-ink">{icon}</span>
      <div className="min-w-0">
        <div className="text-sm text-muted">{label}</div>
        <div className="mt-0.5 break-words font-semibold tabular">{value}</div>
        {sub && <div className="mt-0.5 break-words text-xs text-muted tabular">{sub}</div>}
      </div>
    </div>
  );
}

/** Sticky aside on desktop + fixed bottom bar on phones/tablets. */
export function InterestCta({
  sent,
  onClick,
  summaryLabel,
  summary,
  summarySub,
  note,
}: {
  sent: boolean;
  onClick: () => void;
  summaryLabel: string;
  summary: ReactNode;
  summarySub: ReactNode;
  note: string;
}) {
  const { t } = useApp();
  return (
    <>
      <aside className="hidden lg:block">
        <div className="card sticky top-24 p-6">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-muted">{t('atAGlance')}</span>
            {sent && <InterestBadge />}
          </div>
          <div className="mt-4 text-sm text-muted">{summaryLabel}</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight tabular">{summary}</div>
          <div className="mt-0.5 text-sm text-muted tabular">{summarySub}</div>
          <button type="button" onClick={onClick} className={`${sent ? 'btn-outline' : 'btn-primary'} mt-6 w-full`}>
            <Send className="rtl-flip h-4 w-4" />
            {sent ? t('interestAlready') : t('expressInterest')}
          </button>
          <p className="mt-3 text-center text-xs text-muted">{note}</p>
        </div>
      </aside>

      <div className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 px-4 pt-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs text-muted">{summaryLabel}</div>
            <div className="truncate text-[15px] font-semibold tabular">{summary}</div>
          </div>
          <button type="button" onClick={onClick} className={`${sent ? 'btn-outline' : 'btn-primary'} shrink-0`}>
            <Send className="rtl-flip h-4 w-4" />
            {sent ? t('interestSent') : t('expressInterest')}
          </button>
        </div>
      </div>
    </>
  );
}
