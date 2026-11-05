import { Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function InterestBadge({ className = '' }: { className?: string }) {
  const { t } = useApp();
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-night ${className}`}>
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
      {t('interestSent')}
    </span>
  );
}

export function NewBadge() {
  const { t } = useApp();
  return (
    <span className="inline-flex items-center rounded-full border border-secondary-ink/40 px-2 py-0.5 text-xs font-semibold text-secondary-ink">
      {t('newListing')}
    </span>
  );
}
