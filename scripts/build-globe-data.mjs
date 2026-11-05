// Generates the globe's static data from real country shapes (world-atlas):
//   src/data/globe-dots.json       → land dots for the halftone texture
//   src/data/globe-countries.json  → ISO numeric id → { code, en, ar } for country names
// Run once after changing the dot density:  node scripts/build-globe-data.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { geoBounds, geoContains } from 'd3-geo';
import { feature } from 'topojson-client';

const require = createRequire(import.meta.url);
const STEP = 0.8; // degrees between dots (smaller = more dots)

// ---- land dots ----
const land = JSON.parse(readFileSync(require.resolve('world-atlas/land-50m.json'), 'utf8'));
const landGeo = feature(land, land.objects.land);
const polys = landGeo.features.flatMap((f) =>
  f.geometry.type === 'MultiPolygon'
    ? f.geometry.coordinates.map((c) => ({ type: 'Polygon', coordinates: c }))
    : [f.geometry],
).map((g) => ({ g, b: geoBounds(g) }));

const inBounds = ([lon, lat], [[x0, y0], [x1, y1]]) =>
  lat >= y0 && lat <= y1 && (x0 <= x1 ? lon >= x0 && lon <= x1 : lon >= x0 || lon <= x1);

const dots = [];
for (let lat = -56; lat <= 82; lat += STEP) {
  const n = Math.max(1, Math.round((360 / STEP) * Math.cos((lat * Math.PI) / 180)));
  const offset = (Math.round(lat / STEP) % 2) * 0.5; // stagger rows for a halftone look
  for (let i = 0; i < n; i++) {
    const lon = -180 + ((i + offset) * 360) / n;
    const p = [lon, lat];
    if (polys.some(({ g, b }) => inBounds(p, b) && geoContains(g, p))) dots.push(+lon.toFixed(2), +lat.toFixed(2));
  }
}
writeFileSync('src/data/globe-dots.json', JSON.stringify(dots));
console.log('land dots:', dots.length / 2);

// ---- country names (EN + AR) ----
const countries = require('i18n-iso-countries');
const topo = JSON.parse(readFileSync(require.resolve('world-atlas/countries-110m.json'), 'utf8'));
const en = new Intl.DisplayNames(['en'], { type: 'region' });
const ar = new Intl.DisplayNames(['ar'], { type: 'region' });
const names = {};
for (const g of topo.objects.countries.geometries) {
  const code = g.id ? countries.numericToAlpha2(g.id) : undefined;
  names[g.id ?? g.properties.name] = code
    ? { code, en: en.of(code), ar: ar.of(code) }
    : { code: '', en: g.properties.name, ar: g.properties.name };
}
writeFileSync('src/data/globe-countries.json', JSON.stringify(names));
console.log('countries:', Object.keys(names).length);
