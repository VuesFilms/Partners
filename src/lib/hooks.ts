import { useEffect, useRef, useState } from 'react';
import { readJSON, writeJSON } from './storage';

/** State that survives navigating to a detail page and back (per tab). */
export function useSessionState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readJSON(key, initial, 'session'));
  useEffect(() => writeJSON(key, value, 'session'), [key, value]);
  return [value, setValue] as const;
}

export function useMediaQuery(query: string) {
  const get = () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false);
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/** Animated number that counts up when it scrolls into view. */
export function useCountUp(target: number, duration = 1400) {
  const ref = useRef<HTMLElement | null>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);
  const from = useRef(0);

  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const run = () => {
      const start = performance.now();
      const begin = from.current;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = Math.round(begin + (target - begin) * eased);
        setValue(v);
        from.current = v;
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if (reduce) {
      setValue(target);
      from.current = target;
      return;
    }
    if (started.current || !el || !('IntersectionObserver' in window)) {
      started.current = true;
      run();
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          started.current = true;
          io.disconnect();
          run();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);

  return { ref, value };
}

/** Lock page scroll while a modal or sheet is open. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}
