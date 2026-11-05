import { initials } from '../lib/icons';

interface Props {
  name: string;
  gradient: string;
  size?: 'md' | 'lg';
  rounded?: 'xl' | 'full';
}

/** Generated logo placeholder: initials on a palette gradient. No real logos. */
export function Monogram({ name, gradient, size = 'md', rounded = 'xl' }: Props) {
  const dims = size === 'lg' ? 'h-16 w-16 text-xl sm:h-20 sm:w-20 sm:text-2xl' : 'h-12 w-12 text-base';
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden font-semibold tracking-wide text-white shadow-sm ${dims} ${rounded === 'full' ? 'rounded-full' : 'rounded-xl'}`}
      style={{ background: gradient }}
      aria-hidden="true"
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.28),transparent_60%)]" />
      <span className="relative" dir="ltr">{initials(name)}</span>
    </span>
  );
}
