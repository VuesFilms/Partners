import { AnimatePresence, motion } from 'framer-motion';
import { Languages, Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';

export function Header() {
  const { t, toggleLang, theme, toggleTheme } = useApp();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  const navCls = ({ isActive }: { isActive: boolean }) =>
    `inline-flex min-h-[44px] items-center rounded-xl px-4 text-[15px] font-medium transition-colors ${
      isActive ? 'bg-surface-2 text-text' : 'text-muted hover:text-text'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
      <div className="container-x flex h-16 items-center justify-between gap-3">
        <Link to="/" className="-mx-1 flex min-h-[44px] items-center rounded-xl px-1" aria-label={t('navHome')}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          <NavLink to="/franchises" className={navCls}>{t('navFranchises')}</NavLink>
          <NavLink to="/investors" className={navCls}>{t('navInvestors')}</NavLink>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleLang}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-border px-3 text-sm font-semibold transition-colors hover:bg-surface-2"
            aria-label={t('switchLangLabel')}
          >
            <Languages className="h-4 w-4 text-muted" />
            <span className="hidden sm:inline">{t('switchLang')}</span>
            <span className="sm:hidden">{t('switchLangShort')}</span>
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="btn-icon hidden md:inline-flex"
            aria-label={theme === 'dark' ? t('themeLight') : t('themeDark')}
            title={theme === 'dark' ? t('themeLight') : t('themeDark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            type="button"
            className="btn-icon md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t('close') : t('menu')}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border/70 md:hidden"
          >
            <nav className="container-x flex flex-col gap-1 py-3" aria-label="Mobile">
              <NavLink to="/" end className={navCls}>{t('navHome')}</NavLink>
              <NavLink to="/franchises" className={navCls}>{t('navFranchises')}</NavLink>
              <NavLink to="/investors" className={navCls}>{t('navInvestors')}</NavLink>
              <button type="button" onClick={toggleTheme} className="inline-flex min-h-[44px] items-center gap-3 rounded-xl px-4 text-[15px] font-medium text-muted hover:text-text">
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                {theme === 'dark' ? t('themeLight') : t('themeDark')}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
