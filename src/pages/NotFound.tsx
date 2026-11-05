import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function NotFound() {
  const { t } = useApp();
  return (
    <div className="container-x flex flex-col items-center py-24 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-muted">
        <Compass className="h-7 w-7" />
      </span>
      <h1 className="mt-5 text-2xl font-semibold">{t('notFound')}</h1>
      <Link to="/" className="btn-contrast mt-6">
        {t('goHome')}
      </Link>
    </div>
  );
}
