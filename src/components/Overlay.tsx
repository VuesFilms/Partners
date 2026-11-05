import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { useMediaQuery, useScrollLock } from '../lib/hooks';

interface Props {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /**
   * dialog: centred dialog on ≥sm, full-screen sheet on phones.
   * sheet : slide-up bottom panel (used for mobile filters).
   */
  variant?: 'dialog' | 'sheet';
}

const ease = [0.22, 1, 0.36, 1] as const;

export function Overlay({ open, onClose, title, subtitle, children, footer, variant = 'dialog' }: Props) {
  const { t } = useApp();
  const panelRef = useRef<HTMLDivElement>(null);
  const isPhone = useMediaQuery('(max-width: 639px)');
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const id = window.setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panelRef.current;
      first?.focus({ preventScroll: true });
    }, 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panelRef.current) {
        const els = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener('keydown', onKey);
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  const asSheet = variant === 'sheet' || isPhone;
  const fullScreen = variant === 'dialog' && isPhone;

  const panelCls = asSheet
    ? `fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-2xl flex-col bg-surface shadow-lift ${
        fullScreen ? 'h-[100dvh]' : 'max-h-[88dvh] rounded-t-3xl'
      }`
    : 'relative flex max-h-[calc(100dvh-4rem)] w-full max-w-lg flex-col rounded-3xl border border-border bg-surface shadow-lift';

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={`fixed inset-0 z-50 ${asSheet ? '' : 'flex items-center justify-center p-6'}`}>
          <motion.div
            className="absolute inset-0 bg-night/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            className={`${panelCls} outline-none`}
            initial={asSheet ? { y: '100%' } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={asSheet ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
            exit={asSheet ? { y: '100%' } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.32, ease }}
          >
            {asSheet && !fullScreen && (
              <div className="flex justify-center pt-2.5" aria-hidden="true">
                <span className="h-1.5 w-10 rounded-full bg-border" />
              </div>
            )}
            <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-4 sm:px-6 sm:pt-6" style={fullScreen ? { paddingTop: 'max(1rem, env(safe-area-inset-top))' } : undefined}>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold leading-snug sm:text-xl">{title}</h2>
                {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
              </div>
              <button type="button" onClick={onClose} className="btn-icon -me-2 -mt-1 shrink-0" aria-label={t('close')}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-5 sm:px-6">{children}</div>
            {footer && <div className="pb-safe border-t border-border px-5 pt-4 sm:px-6">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
