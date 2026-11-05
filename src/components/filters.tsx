import { ChevronDown, Search, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useApp } from '../context/AppContext';
import { cities, cityIds, regionIds, regions, type CityId, type L, type RegionId } from '../i18n/dictionary';

export function FilterSection({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <fieldset className="border-b border-border py-5 first:pt-0 last:border-b-0">
      <div className="mb-3 flex items-center justify-between gap-2">
        <legend className="text-sm font-semibold">{title}</legend>
        {aside}
      </div>
      {children}
    </fieldset>
  );
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const { t } = useApp();
  return (
    <label className="relative block w-full">
      <span className="sr-only">{placeholder}</span>
      <Search className="pointer-events-none absolute start-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field ps-11 pe-11 [&::-webkit-search-cancel-button]:hidden"
        enterKeyHint="search"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute end-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:text-text"
          aria-label={t('reset')}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </label>
  );
}

export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  icon,
}: {
  options: { id: T; label: L }[];
  value: T[];
  onChange: (v: T[]) => void;
  icon?: (id: T) => ReactNode;
}) {
  const { tr } = useApp();
  const toggle = (id: T) => onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(o.id)}
            className={`chip min-h-[44px] ${on ? 'chip-on' : 'hover:border-text/30'}`}
          >
            {icon?.(o.id)}
            {tr(o.label)}
          </button>
        );
      })}
    </div>
  );
}

/** Dual-thumb slider over a list of "stops" (non-linear so small and large tickets both fit). */
export function RangeSlider({
  stops,
  value,
  onChange,
  format,
  label,
}: {
  stops: number[];
  value: [number, number];
  onChange: (v: [number, number]) => void;
  format: (n: number, isTop: boolean) => string;
  label: string;
}) {
  const [lo, hi] = value;
  const last = stops.length - 1;
  const pct = (i: number) => (i / last) * 100;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2 text-sm font-medium tabular">
        <span>{format(stops[lo], false)}</span>
        <span className="text-muted">–</span>
        <span>{format(stops[hi], hi === last)}</span>
      </div>
      <div className="relative h-11">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-surface-2" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary"
          style={{ insetInlineStart: `${pct(lo)}%`, insetInlineEnd: `${100 - pct(hi)}%` }}
        />
        <input
          type="range"
          className="range-input"
          min={0}
          max={last}
          step={1}
          value={lo}
          aria-label={`${label} min`}
          aria-valuetext={format(stops[lo], false)}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi - 1), hi])}
          style={{ zIndex: lo > last - 2 ? 5 : 3 }}
        />
        <input
          type="range"
          className="range-input"
          min={0}
          max={last}
          step={1}
          value={hi}
          aria-label={`${label} max`}
          aria-valuetext={format(stops[hi], hi === last)}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo + 1)])}
          style={{ zIndex: 4 }}
        />
      </div>
    </div>
  );
}

/** "" | "region:western" | "city:riyadh" */
export type LocationValue = string;

export function matchesLocation(value: LocationValue, cityList: CityId[]) {
  if (!value) return true;
  const [kind, id] = value.split(':');
  if (kind === 'city') return cityList.includes(id as CityId);
  if (kind !== 'region') return true; // ignore filters saved before the Saudi-only change
  return cityList.some((c) => cities[c].region === (id as RegionId));
}

export function LocationSelect({ value, onChange, label }: { value: LocationValue; onChange: (v: LocationValue) => void; label: string }) {
  const { t, tr } = useApp();
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="field appearance-none pe-10">
        <option value="">{t('allLocations')}</option>
        {regionIds.map((r) => (
          <optgroup key={r} label={tr(regions[r])}>
            <option value={`region:${r}`}>
              {t('allRegion')} {tr(regions[r])}
            </option>
            {cityIds
              .filter((id) => cities[id].region === r)
              .map((id) => (
                <option key={id} value={`city:${id}`}>
                  {tr(cities[id])}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
    </label>
  );
}

export function SortSelect<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { id: T; label: string }[] }) {
  const { t } = useApp();
  return (
    <label className="relative block min-w-0">
      <span className="sr-only">{t('sortBy')}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className="field appearance-none bg-surface pe-10 text-sm sm:text-[15px] border-border">
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
    </label>
  );
}
