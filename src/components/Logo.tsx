import { useApp } from '../context/AppContext';

/** Two overlapping rounded shapes = two partners meeting. */
export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lm-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#346B6D" />
          <stop offset="1" stopColor="#2A445E" />
        </linearGradient>
        <linearGradient id="lm-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#841E62" />
          <stop offset="1" stopColor="#58094F" />
        </linearGradient>
      </defs>
      <rect x="4" y="12" width="34" height="40" rx="17" fill="url(#lm-a)" />
      <rect x="26" y="12" width="34" height="40" rx="17" fill="url(#lm-b)" opacity="0.92" />
      <circle cx="32" cy="32" r="5" fill="#F3AA20" />
    </svg>
  );
}

export function Logo() {
  const { t } = useApp();
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="text-lg font-semibold tracking-tight">{t('brand')}</span>
    </span>
  );
}
