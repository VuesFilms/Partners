/** Safe localStorage / sessionStorage wrappers (private mode can throw). */
export function readJSON<T>(key: string, fallback: T, store: 'local' | 'session' = 'local'): T {
  try {
    const raw = (store === 'local' ? localStorage : sessionStorage).getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown, store: 'local' | 'session' = 'local') {
  try {
    (store === 'local' ? localStorage : sessionStorage).setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export const KEYS = {
  lang: 'partners.lang',
  theme: 'partners.theme',
  interests: 'partners.interests',
} as const;
