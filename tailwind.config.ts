import type { Config } from 'tailwindcss';

/**
 * Design tokens.
 * Raw palette comes from design-references/palette-plum-amber-teal.png.
 * Semantic tokens (background, surface, text, …) are CSS variables defined
 * in src/index.css so light and dark mode share the same names.
 */
export const palette = {
  plum: '#58094F',
  magenta: '#841E62',
  amber: '#F3AA20',
  navy: '#2A445E',
  teal: '#346B6D',
} as const;

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ...palette,
        primary: { DEFAULT: palette.teal, ink: token('primary-ink') },
        secondary: { DEFAULT: palette.magenta, deep: palette.plum, ink: token('secondary-ink') },
        accent: { DEFAULT: palette.amber },
        background: token('background'),
        surface: { DEFAULT: token('surface'), 2: token('surface-2') },
        text: token('text'),
        muted: token('muted'),
        border: token('border'),
        success: token('success'),
        night: '#0A1118',
      },
      fontFamily: {
        sans: ['"DG Heaven"', 'Inter', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        arabic: ['"DG Heaven"', '"IBM Plex Sans Arabic"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { xl: '0.875rem', '2xl': '1.125rem', '3xl': '1.5rem' },
      boxShadow: {
        card: '0 1px 2px rgb(10 17 24 / 0.06), 0 8px 24px -12px rgb(10 17 24 / 0.18)',
        lift: '0 2px 4px rgb(10 17 24 / 0.08), 0 20px 40px -16px rgb(10 17 24 / 0.35)',
      },
      keyframes: {
        'glow-drift': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(-3%,2%,0) scale(1.06)' },
        },
      },
      animation: { 'glow-drift': 'glow-drift 18s ease-in-out infinite' },
    },
  },
  plugins: [],
} satisfies Config;
