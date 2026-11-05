# Partners · شركاء

A clickable pitch demo of a platform that connects **GCC investors** with **franchise brands**.
Bilingual (English / Arabic with full RTL), light and dark mode, mobile first, installable as a home-screen app.

> Demo platform. All brands, investors and figures are illustrative. There is no backend, no login and no emails are sent.

## Run locally

Requires Node.js 18+.

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:5173. To check the production build:

```bash
npm run build && npm run preview
```

## What's inside

| Page | Route |
|---|---|
| Landing ("Who are you?") | `/` |
| Franchise marketplace (investor view) | `/franchises` |
| Franchise detail | `/franchises/:id` |
| Investor directory (franchise view) | `/investors` |
| Investor detail | `/investors/:id` |

- **Express interest** opens a form (a full-screen sheet on phones). Submissions are saved to `localStorage` under `partners.interests`, the card gets an "Interest sent" badge, and the "Interest requests sent" counter goes up.
- **Language** and **theme** are remembered in `localStorage` (`partners.lang`, `partners.theme`). First-time visitors see Arabic and dark mode; change the default language in `initialLang` in `src/context/AppContext.tsx` and the `lang`/`dir` on `<html>` in `index.html`.
- **Filters** stay in place when you open a detail page and come back (kept in `sessionStorage`).
- To reset the demo, clear the site data in your browser or run `localStorage.clear()` in the console.

## Folder structure

```
design-references/      Visual references (palette + UI direction)
public/
  manifest.webmanifest  Web app manifest (add to home screen)
  icons/                App icons (SVG source + generated PNGs)
scripts/
  generate-icons.mjs    Re-renders the PNG icons from the SVGs
src/
  i18n/dictionary.ts    ALL interface text + taxonomy labels (EN/AR) in one file
  data/franchises.ts    14 sample franchise brands
  data/investors.ts     12 sample investors
  context/AppContext.tsx  Language, theme, saved interest requests
  lib/currency.ts       SAR / USD formatting (1 USD = 3.75 SAR)
  lib/icons.ts          Sector/type icons and palette gradients
  components/           Header, cards, filters, modal/sheet, stats, …
  pages/                One file per route
  index.css             Semantic colour tokens (light + dark) and component classes
tailwind.config.ts      Palette + token wiring
```

## Editing the sample data

- **Brands:** edit `src/data/franchises.ts`. Each brand is one object. Every visible text field uses `{ en: '…', ar: '…' }`. Amounts are plain SAR numbers (`1_500_000`); USD is calculated automatically. `id` is used in the URL. `listedAt` drives "Newest" sorting and the "New" badge (the three most recent listings).
- **Investors:** edit `src/data/investors.ts` in the same way.
- **Sectors, cities, countries, investor types, deal structures, franchisor services:** edit the matching lists in `src/i18n/dictionary.ts`. The TypeScript types update automatically, so `npm run build` will flag any data entry that uses an unknown sector or city.
- **Interface text:** edit `ui` in `src/i18n/dictionary.ts`.
- **Starting value of the "interest requests" counter:** `SEEDED_REQUESTS` in `src/context/AppContext.tsx`.
- **Exchange rate:** `SAR_PER_USD` in `src/lib/currency.ts`.

## Swapping the design references or colours

The five palette colours come from `design-references/palette-plum-amber-teal.png`:

| Colour | Hex | Role |
|---|---|---|
| Teal | `#346B6D` | `primary`: main buttons, links, active filters, investor side |
| Magenta | `#841E62` | `secondary`: franchise side, highlights |
| Plum | `#58094F` | `secondary-deep`: gradients |
| Amber | `#F3AA20` | `accent`: badges, counters, focus rings |
| Navy | `#2A445E` | base for all neutrals |

To change colours:

1. Update `palette` in `tailwind.config.ts`.
2. Update the semantic tokens (`--background`, `--surface`, `--text`, `--muted`, `--border`, `--success`, …) for light (`:root`) and dark (`.dark`) in `src/index.css`. They are stored as space-separated RGB values so Tailwind opacity modifiers keep working.
3. Update the glow panel gradients (`.glow-panel` in `src/index.css`) and the card gradients (`gradients` in `src/lib/icons.ts`).
4. Update the icon colours in `public/icons/icon.svg` and `icon-maskable.svg`, then regenerate the PNGs:
   ```bash
   npx -y -p playwright node scripts/generate-icons.mjs
   ```
5. Update `theme_color` / `background_color` in `public/manifest.webmanifest` and `index.html`.

To change direction completely, put new images in `design-references/` (name palette images with "palette" in the file name) and adjust the tokens above to match.

The brand typeface is **DG Heaven** (Thin, Light, Regular, Bold) for both Arabic and English, bundled from `src/assets/fonts/` and declared with `@font-face` at the top of `src/index.css`. Inter and IBM Plex Sans Arabic (Google Fonts, in `index.html`) are fallbacks for the few symbols DG Heaven lacks (– ≈ ² …). To swap fonts, replace the files and update the `@font-face` rules and `fontFamily` in `tailwind.config.ts`.

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, click **Add New → Project** and import the repository.
3. Vercel detects Vite automatically: build command `npm run build`, output directory `dist`. No environment variables are needed.
4. Click **Deploy**.

`vercel.json` rewrites all paths to `index.html`, so deep links such as `/franchises/hayl-roasters` work on refresh.

Alternatively, using the CLI:

```bash
npx vercel --prod
```

## Add to home screen

Open the deployed site on a phone. On iOS Safari tap **Share → Add to Home Screen**. On Android Chrome tap **⋮ → Add to Home screen / Install app**. It opens full screen with the Partners icon.

## Responsive and RTL checks

The layout was checked on every page in English and Arabic at 375px, 768px, 1280px and 1440px:

- no horizontal scrolling
- every tap target at least 44px high
- filters in a sidebar on desktop and in a slide-up sheet with Apply below 1024px
- the interest form is a full-screen sheet on phones
