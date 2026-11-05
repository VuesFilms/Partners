import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ui, type L, type Lang, type UiKey } from '../i18n/dictionary';
import { KEYS, readJSON, writeJSON } from '../lib/storage';

export type Theme = 'light' | 'dark';
export type InterestKind = 'franchise' | 'investor';

export interface InterestRequest {
  kind: InterestKind;
  targetId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

/** Believable starting point for the "interest requests sent" counter. */
export const SEEDED_REQUESTS = 1_284;

interface AppState {
  lang: Lang;
  dir: 'ltr' | 'rtl';
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (key: UiKey) => string;
  tr: (value: L) => string;
  interests: InterestRequest[];
  addInterest: (r: Omit<InterestRequest, 'createdAt'>) => void;
  hasInterest: (kind: InterestKind, id: string) => boolean;
  requestCount: number;
}

const AppContext = createContext<AppState | null>(null);

const initialLang = (): Lang => {
  const saved = readJSON<Lang | null>(KEYS.lang, null);
  if (saved === 'en' || saved === 'ar') return saved;
  // First visit always opens in Arabic; the visitor's choice is remembered after that.
  return 'ar';
};
const initialTheme = (): Theme => {
  const saved = readJSON<Theme | null>(KEYS.theme, null);
  return saved === 'light' || saved === 'dark' ? saved : 'dark';
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [interests, setInterests] = useState<InterestRequest[]>(() => readJSON(KEYS.interests, []));
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
    writeJSON(KEYS.lang, lang);
    document.title = lang === 'ar' ? 'شركاء · منصة الامتيازات التجارية' : 'Partners · Franchise matchmaking for the GCC';
  }, [lang, dir]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    writeJSON(KEYS.theme, theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0A1118' : '#F4F6F8');
  }, [theme]);

  // keep other tabs in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEYS.interests) setInterests(readJSON(KEYS.interests, []));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(() => setLangState((l) => (l === 'en' ? 'ar' : 'en')), []);
  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  const addInterest = useCallback((r: Omit<InterestRequest, 'createdAt'>) => {
    setInterests((prev) => {
      const next = [...prev, { ...r, createdAt: new Date().toISOString() }];
      writeJSON(KEYS.interests, next);
      return next;
    });
  }, []);

  const value = useMemo<AppState>(
    () => ({
      lang,
      dir,
      setLang,
      toggleLang,
      theme,
      toggleTheme,
      t: (key) => ui[key][lang],
      tr: (v) => v[lang],
      interests,
      addInterest,
      hasInterest: (kind, id) => interests.some((i) => i.kind === kind && i.targetId === id),
      requestCount: SEEDED_REQUESTS + interests.length,
    }),
    [lang, dir, setLang, toggleLang, theme, toggleTheme, interests, addInterest],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
