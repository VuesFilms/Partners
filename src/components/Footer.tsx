import { Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LogoMark } from './Logo';

export function Footer() {
  const { t } = useApp();
  return (
    <footer className="mt-20 border-t border-border/70">
      <div className="container-x flex flex-col gap-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <LogoMark className="h-6 w-6" />
          <span>
            {t('brand')} · {t('brandAlt')}
          </span>
        </div>
        <p className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          {t('footerNote')}
        </p>
      </div>
    </footer>
  );
}
