/**
 * Canvas globe renderer.
 *
 * - Land is drawn as ~11k precomputed dots (src/data/globe-dots.json), projected
 *   with an orthographic projection each frame and batched into a few brightness
 *   buckets, so a frame is only a handful of canvas draw calls.
 * - Countries (world-atlas 110m) are used for click/hover hit-testing and the
 *   highlight outline, drawn with d3-geo.
 * - Pins are ring markers; the selected pin is larger with pulsing rings.
 *
 * All colours come from the project palette (tailwind.config.ts):
 *   magenta #841E62 → dots, rim glow, selected pin, country highlight
 *   night #0A1118 / navy #2A445E → globe body
 *   teal #346B6D → pins
 *   text (dark) #EEF2F5 → outlines, connector line
 *   amber #F3AA20 → "interest sent" marker on a pin (same colour as the Interest sent badge)
 */
import { geoBounds, geoCentroid, geoContains, geoOrthographic, geoPath, type GeoPermissibleObjects } from 'd3-geo';
import type { Feature, FeatureCollection, Geometry } from 'geojson';

/** main globe colour: magenta-plum #841E62 */
const GLOW = '132, 30, 98';
const AMBER = '#F3AA20';
const NAVY = '42, 68, 94';
const NIGHT = '10, 17, 24';
const LIGHT = '238, 242, 245';
/** pin colour: teal #346B6D from the palette */
const TEAL = '52, 107, 109';

export interface GlobePin {
  id: string;
  lat: number;
  lon: number;
  marked: boolean;
}

export interface GlobeLayout {
  cx: number;
  cy: number;
  r: number;
}

export interface HoverInfo {
  kind: 'pin' | 'country';
  key: string;
  x: number;
  y: number;
}

export interface GlobeCallbacks {
  onPinClick: (id: string) => void;
  onCountryClick: (key: string) => void;
  onOceanClick: () => void;
  onHover: (info: HoverInfo | null) => void;
  /** first drag/click by the user (used to stop the tour) */
  onUserInteract: () => void;
  onIntroDone: () => void;
}

type CountryFeature = Feature<Geometry, { name: string }> & { key: string; bounds: [[number, number], [number, number]] };

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const DEG = Math.PI / 180;
const INTRO_MS = 1500;
const PIN_STAGGER_MS = 90;
const PIN_POP_MS = 320;
const DRAG_THRESHOLD = 6;

export class GlobeEngine {
  private ctx: CanvasRenderingContext2D;
  private dpr = 1;
  private w = 0;
  private h = 0;
  private layout: GlobeLayout = { cx: 0, cy: 0, r: 1 };

  // dots as unit-sphere trig terms
  private cosLat: Float32Array;
  private sinLat: Float32Array;
  private cosLon: Float32Array;
  private sinLon: Float32Array;
  private n: number;

  private countries: CountryFeature[];
  private projection = geoOrthographic().clipAngle(90).precision(0.6);

  // view state (degrees, d3 rotate convention: [-lon, -lat])
  private lambda = 0;
  private phi = 0;
  private scaleK = 1;
  private alpha = 1;

  private pins: GlobePin[] = [];
  private pinAppear = new Map<string, number>();
  private selected: string | null = null;
  private hoverPin: string | null = null;
  private country: string | null = null;
  private hoverCountry: string | null = null;
  private anchor: (() => { x: number; y: number } | null) | null = null;

  private intro: { start: number; target: [number, number] } | null = null;
  private introDone = false;
  private tween: { start: number; dur: number; from: [number, number]; to: [number, number] } | null = null;
  private velocity: [number, number] = [0, 0];

  private pointer: { id: number; x: number; y: number; l: number; p: number; dragging: boolean; lastX: number; lastY: number; lastT: number; type: string } | null = null;
  private raf = 0;
  private hoverQueued: { x: number; y: number } | null = null;
  private destroyed = false;

  constructor(
    private canvas: HTMLCanvasElement,
    dots: number[],
    countries: FeatureCollection<Geometry, { name: string }>,
    private cb: GlobeCallbacks,
    private opts: { reducedMotion: boolean; lowPower: boolean },
  ) {
    this.ctx = canvas.getContext('2d')!;
    // phones: every other dot keeps the texture but halves the work
    const stride = opts.lowPower ? 2 : 1;
    this.n = Math.floor(dots.length / 2 / stride);
    this.cosLat = new Float32Array(this.n);
    this.sinLat = new Float32Array(this.n);
    this.cosLon = new Float32Array(this.n);
    this.sinLon = new Float32Array(this.n);
    for (let i = 0; i < this.n; i++) {
      const lon = dots[i * 2 * stride] * DEG;
      const lat = dots[i * 2 * stride + 1] * DEG;
      this.cosLat[i] = Math.cos(lat);
      this.sinLat[i] = Math.sin(lat);
      this.cosLon[i] = Math.cos(lon);
      this.sinLon[i] = Math.sin(lon);
    }
    this.countries = countries.features.map((f) => {
      const ff = f as CountryFeature;
      ff.key = String(f.id ?? f.properties.name);
      ff.bounds = geoBounds(f as GeoPermissibleObjects) as [[number, number], [number, number]];
      return ff;
    });

    canvas.addEventListener('pointerdown', this.onDown);
    canvas.addEventListener('pointermove', this.onMove);
    canvas.addEventListener('pointerup', this.onUp);
    canvas.addEventListener('pointercancel', this.onCancel);
    canvas.addEventListener('pointerleave', this.onLeave);
    this.raf = requestAnimationFrame(this.frame);
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    this.canvas.removeEventListener('pointerdown', this.onDown);
    this.canvas.removeEventListener('pointermove', this.onMove);
    this.canvas.removeEventListener('pointerup', this.onUp);
    this.canvas.removeEventListener('pointercancel', this.onCancel);
    this.canvas.removeEventListener('pointerleave', this.onLeave);
  }

  // ---------- public API ----------

  resize(w: number, h: number, layout: GlobeLayout) {
    this.dpr = Math.min(window.devicePixelRatio || 1, this.opts.lowPower ? 1.75 : 2);
    this.w = w;
    this.h = h;
    this.canvas.width = Math.round(w * this.dpr);
    this.canvas.height = Math.round(h * this.dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.layout = layout;
  }

  /** Spin in from small and settle on [lon, lat]. */
  startIntro(lon: number, lat: number) {
    this.intro = { start: performance.now(), target: [-lon, -lat] };
    this.introDone = false;
    this.pinAppear.clear();
  }

  skipIntro() {
    if (!this.intro) return;
    this.intro.start = performance.now() - INTRO_MS - this.pins.length * PIN_STAGGER_MS - PIN_POP_MS;
  }

  isIntroDone() {
    return this.introDone;
  }

  setPins(pins: GlobePin[]) {
    this.pins = pins;
    if (this.introDone) {
      // newly visible pins (after a filter change) fade in
      const now = performance.now();
      for (const p of pins) if (!this.pinAppear.has(p.id)) this.pinAppear.set(p.id, now);
    }
    if (this.selected && !pins.some((p) => p.id === this.selected)) this.selected = null;
  }

  setSelected(id: string | null) {
    this.selected = id;
  }

  setCountry(key: string | null) {
    this.country = key;
  }

  setAnchor(fn: (() => { x: number; y: number } | null) | null) {
    this.anchor = fn;
  }

  rotateTo(lon: number, lat: number, dur = 1100) {
    const to: [number, number] = [-lon, clamp(-lat, -80, 80)];
    // shortest way round
    let dl = to[0] - this.lambda;
    dl = ((((dl + 180) % 360) + 360) % 360) - 180;
    to[0] = this.lambda + dl;
    this.velocity = [0, 0];
    if (this.opts.reducedMotion || dur <= 0) {
      this.lambda = to[0];
      this.phi = to[1];
      this.tween = null;
      return;
    }
    this.tween = { start: performance.now(), dur, from: [this.lambda, this.phi], to };
  }

  countryCenter(key: string): [number, number] | null {
    const f = this.countries.find((c) => c.key === key);
    return f ? (geoCentroid(f as GeoPermissibleObjects) as [number, number]) : null;
  }

  /** Screen position of a lon/lat (CSS px in the canvas). Used by the automated tests. */
  screenOf(lon: number, lat: number) {
    return this.project(lon, lat);
  }

  getState() {
    return { lambda: this.lambda, phi: this.phi, selected: this.selected, country: this.country, pins: this.pins.map((p) => ({ ...p })) };
  }

  // ---------- projection helpers ----------

  /** Project lon/lat → screen; depth > 0 means facing the viewer. */
  private project(lon: number, lat: number) {
    const { cx, cy } = this.layout;
    const r = this.layout.r * this.scaleK;
    const l = (lon + this.lambda) * DEG;
    const p = this.phi * DEG;
    const cl = Math.cos(lat * DEG);
    const x0 = Math.cos(l) * cl;
    const y0 = Math.sin(l) * cl;
    const z0 = Math.sin(lat * DEG);
    const depth = x0 * Math.cos(p) - z0 * Math.sin(p);
    const Z = z0 * Math.cos(p) + x0 * Math.sin(p);
    return { x: cx + r * y0, y: cy - r * Z, depth };
  }

  private syncProjection() {
    this.projection
      .translate([this.layout.cx, this.layout.cy])
      .scale(this.layout.r * this.scaleK)
      .rotate([this.lambda, this.phi]);
  }

  private pinRadius() {
    return clamp(this.layout.r / 42, 5, 8.5);
  }

  private hitPin(x: number, y: number, touch: boolean) {
    const R = this.pinRadius();
    let best: string | null = null;
    let bestD = (R * 1.6 + (touch ? 8 : 5)) ** 2;
    for (const pin of this.pins) {
      const s = this.project(pin.lon, pin.lat);
      if (s.depth < 0.12 || this.pinScale(pin.id, performance.now()) < 0.5) continue;
      const d = (s.x - x) ** 2 + (s.y - y) ** 2;
      if (d < bestD) {
        bestD = d;
        best = pin.id;
      }
    }
    return best;
  }

  private hitCountry(x: number, y: number): string | null {
    const { cx, cy } = this.layout;
    const r = this.layout.r * this.scaleK;
    if ((x - cx) ** 2 + (y - cy) ** 2 > r * r) return null;
    this.syncProjection();
    const ll = this.projection.invert?.([x, y]);
    if (!ll) return null;
    const [lon, lat] = ll;
    for (const f of this.countries) {
      const [[x0, y0], [x1, y1]] = f.bounds;
      if (lat < y0 || lat > y1) continue;
      if (x0 <= x1 ? lon < x0 || lon > x1 : lon < x0 && lon > x1) continue;
      if (geoContains(f as GeoPermissibleObjects, ll)) return f.key;
    }
    return null;
  }

  private insideGlobe(x: number, y: number) {
    const { cx, cy } = this.layout;
    const r = this.layout.r * this.scaleK;
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
  }

  // ---------- pointer handling ----------

  private local(e: PointerEvent) {
    const b = this.canvas.getBoundingClientRect();
    return { x: e.clientX - b.left, y: e.clientY - b.top };
  }

  private onDown = (e: PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const { x, y } = this.local(e);
    this.pointer = { id: e.pointerId, x, y, l: this.lambda, p: this.phi, dragging: false, lastX: x, lastY: y, lastT: performance.now(), type: e.pointerType };
    this.velocity = [0, 0];
    this.cb.onUserInteract();
  };

  private onMove = (e: PointerEvent) => {
    const { x, y } = this.local(e);
    const pt = this.pointer;
    if (pt && pt.id === e.pointerId) {
      const dx = x - pt.x;
      const dy = y - pt.y;
      if (!pt.dragging && dx * dx + dy * dy > DRAG_THRESHOLD * DRAG_THRESHOLD) {
        pt.dragging = true;
        this.tween = null;
        this.skipIntro();
        try {
          this.canvas.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
        this.canvas.style.cursor = 'grabbing';
        this.cb.onHover(null);
      }
      if (pt.dragging) {
        const sens = 180 / (Math.PI * this.layout.r * this.scaleK);
        this.lambda = pt.l + dx * sens;
        this.phi = clamp(pt.p - dy * sens, -80, 80);
        const now = performance.now();
        const dt = Math.max(1, now - pt.lastT);
        this.velocity = [((x - pt.lastX) * sens) / dt, (-(y - pt.lastY) * sens) / dt];
        pt.lastX = x;
        pt.lastY = y;
        pt.lastT = now;
      }
      return;
    }
    if (e.pointerType === 'mouse') this.hoverQueued = { x, y };
  };

  private onUp = (e: PointerEvent) => {
    const pt = this.pointer;
    if (!pt || pt.id !== e.pointerId) return;
    this.pointer = null;
    this.canvas.style.cursor = '';
    if (pt.dragging) {
      if (this.opts.reducedMotion) this.velocity = [0, 0];
      return;
    }
    const { x, y } = this.local(e);
    const pin = this.hitPin(x, y, pt.type !== 'mouse');
    if (pin) return this.cb.onPinClick(pin);
    const c = this.hitCountry(x, y);
    if (c) return this.cb.onCountryClick(c);
    this.cb.onOceanClick();
  };

  private onCancel = () => {
    this.pointer = null;
    this.canvas.style.cursor = '';
  };

  private onLeave = () => {
    if (this.pointer?.dragging) return;
    this.hoverQueued = null;
    this.hoverPin = null;
    this.hoverCountry = null;
    this.canvas.style.cursor = '';
    this.cb.onHover(null);
  };

  private processHover() {
    const q = this.hoverQueued;
    if (!q || this.pointer) return;
    this.hoverQueued = null;
    const pin = this.hitPin(q.x, q.y, false);
    if (pin) {
      this.hoverPin = pin;
      this.hoverCountry = null;
      this.canvas.style.cursor = 'pointer';
      this.cb.onHover({ kind: 'pin', key: pin, x: q.x, y: q.y });
      return;
    }
    this.hoverPin = null;
    const c = this.hitCountry(q.x, q.y);
    this.hoverCountry = c;
    this.canvas.style.cursor = c ? 'pointer' : this.insideGlobe(q.x, q.y) ? 'grab' : '';
    this.cb.onHover(c ? { kind: 'country', key: c, x: q.x, y: q.y } : null);
  }

  // ---------- animation ----------

  private pinScale(id: string, now: number) {
    const t0 = this.pinAppear.get(id);
    if (t0 === undefined) return 0;
    const t = clamp((now - t0) / PIN_POP_MS, 0, 1);
    if (this.opts.reducedMotion) return t; // used as opacity only
    // small overshoot "pop"
    const c = 1.7;
    return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
  }

  private step(now: number) {
    if (this.intro) {
      const t = clamp((now - this.intro.start) / INTRO_MS, 0, 1);
      const [tl, tp] = this.intro.target;
      if (this.opts.reducedMotion) {
        this.lambda = tl;
        this.phi = tp;
        this.scaleK = 1;
        this.alpha = easeOutCubic(clamp((now - this.intro.start) / 500, 0, 1));
      } else {
        this.scaleK = 0.18 + 0.82 * easeOutCubic(t);
        this.lambda = tl - 600 * (1 - easeOutQuart(t));
        this.phi = tp * easeOutCubic(t);
        this.alpha = clamp(t * 3, 0, 1);
      }
      if (t >= 1 || this.opts.reducedMotion) {
        // schedule pins
        const base = this.intro.start + (this.opts.reducedMotion ? 300 : INTRO_MS);
        this.pins.forEach((p, i) => {
          if (!this.pinAppear.has(p.id)) this.pinAppear.set(p.id, base + (this.opts.reducedMotion ? 0 : i * PIN_STAGGER_MS));
        });
        const end = base + (this.opts.reducedMotion ? 0 : this.pins.length * PIN_STAGGER_MS) + PIN_POP_MS;
        if (now >= end) {
          this.intro = null;
          this.scaleK = 1;
          this.alpha = 1;
          this.lambda = tl;
          this.phi = tp;
          this.introDone = true;
          this.cb.onIntroDone();
        } else if (t >= 1) {
          this.scaleK = 1;
          this.lambda = tl;
          this.phi = tp;
        }
      }
      return;
    }
    if (this.tween) {
      const t = clamp((now - this.tween.start) / this.tween.dur, 0, 1);
      const e = easeInOutCubic(t);
      this.lambda = this.tween.from[0] + (this.tween.to[0] - this.tween.from[0]) * e;
      this.phi = this.tween.from[1] + (this.tween.to[1] - this.tween.from[1]) * e;
      if (t >= 1) this.tween = null;
      return;
    }
    if (!this.pointer && (Math.abs(this.velocity[0]) > 0.0005 || Math.abs(this.velocity[1]) > 0.0005)) {
      this.lambda += this.velocity[0] * 16;
      this.phi = clamp(this.phi + -this.velocity[1] * 16, -80, 80);
      this.velocity = [this.velocity[0] * 0.92, this.velocity[1] * 0.92];
    }
  }

  // ---------- drawing ----------

  private frame = (now: number) => {
    if (this.destroyed) return;
    this.raf = requestAnimationFrame(this.frame);
    if (document.hidden || !this.w) return;
    this.step(now);
    this.processHover();
    this.draw(now);
  };

  private draw(now: number) {
    const ctx = this.ctx;
    const { cx, cy } = this.layout;
    const r = this.layout.r * this.scaleK;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.globalAlpha = this.alpha;

    // outer glow
    const halo = ctx.createRadialGradient(cx, cy, r * 0.92, cx, cy, r * 1.22);
    halo.addColorStop(0, `rgba(${GLOW}, 0.45)`);
    halo.addColorStop(0.35, `rgba(${GLOW}, 0.14)`);
    halo.addColorStop(1, `rgba(${GLOW}, 0)`);
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.22, 0, Math.PI * 2);
    ctx.fill();

    // globe body
    const body = ctx.createRadialGradient(cx + r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r);
    body.addColorStop(0, `rgba(${NAVY}, 0.32)`);
    body.addColorStop(0.65, `rgba(${NIGHT}, 0.98)`);
    body.addColorStop(1, `rgba(${NIGHT}, 1)`);
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // highlighted / hovered country
    if (this.country || this.hoverCountry) {
      this.syncProjection();
      const pathCtx = geoPath(this.projection, ctx);
      for (const key of [this.hoverCountry, this.country]) {
        if (!key) continue;
        const f = this.countries.find((c) => c.key === key);
        if (!f) continue;
        ctx.beginPath();
        pathCtx(f as GeoPermissibleObjects);
        if (key === this.country) {
          ctx.fillStyle = `rgba(${GLOW}, 0.3)`;
          ctx.fill();
          ctx.strokeStyle = `rgba(${LIGHT}, 0.9)`;
          ctx.lineWidth = 1.3;
        } else {
          ctx.strokeStyle = `rgba(${LIGHT}, 0.4)`;
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      }
    }

    // dots, batched by depth
    this.drawDots(r);

    // rim + highlight arc
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(${GLOW}, 0.6)`;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.save();
    ctx.shadowColor = `rgba(${GLOW}, 0.9)`;
    ctx.shadowBlur = 16;
    ctx.lineCap = 'round';
    const arcGrad = ctx.createLinearGradient(cx, cy - r, cx + r, cy);
    arcGrad.addColorStop(0, `rgba(${GLOW}, 0)`);
    arcGrad.addColorStop(0.45, `rgba(${GLOW}, 0.95)`);
    arcGrad.addColorStop(1, `rgba(${GLOW}, 0.1)`);
    ctx.strokeStyle = arcGrad;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 0.5, -Math.PI * 0.58, -Math.PI * 0.02);
    ctx.stroke();
    ctx.restore();

    this.drawPins(now);
    ctx.globalAlpha = 1;
  }

  private drawDots(r: number) {
    const ctx = this.ctx;
    const { cx, cy } = this.layout;
    const l = this.lambda * DEG;
    const p = this.phi * DEG;
    const cl = Math.cos(l);
    const sl = Math.sin(l);
    const cp = Math.cos(p);
    const sp = Math.sin(p);
    const BUCKETS = 6;
    const base = clamp(r / 165, 1.1, 2.6);
    const paths: Path2D[] = Array.from({ length: BUCKETS }, () => new Path2D());
    const sizes = Array.from({ length: BUCKETS }, (_, b) => base * (0.5 + 0.5 * ((b + 0.5) / BUCKETS)));
    for (let i = 0; i < this.n; i++) {
      const cL = this.cosLon[i] * cl - this.sinLon[i] * sl;
      const sL = this.sinLon[i] * cl + this.cosLon[i] * sl;
      const x0 = cL * this.cosLat[i];
      const z0 = this.sinLat[i];
      const depth = x0 * cp - z0 * sp;
      if (depth <= 0.02) continue;
      const y0 = sL * this.cosLat[i];
      const Z = z0 * cp + x0 * sp;
      const b = Math.min(BUCKETS - 1, (depth * BUCKETS) | 0);
      const s = sizes[b];
      paths[b].rect(cx + r * y0 - s / 2, cy - r * Z - s / 2, s, s);
    }
    for (let b = 0; b < BUCKETS; b++) {
      const d = (b + 0.5) / BUCKETS;
      ctx.fillStyle = `rgba(${GLOW}, ${(0.25 + 0.75 * Math.pow(d, 0.6)).toFixed(3)})`;
      ctx.fill(paths[b]);
    }
  }

  private drawPins(now: number) {
    const ctx = this.ctx;
    const R = this.pinRadius();
    const reduce = this.opts.reducedMotion;
    let selectedScreen: { x: number; y: number; a: number } | null = null;

    // selected pin drawn last so it sits on top
    const order = [...this.pins].sort((a, b) => (a.id === this.selected ? 1 : 0) - (b.id === this.selected ? 1 : 0));
    for (const pin of order) {
      const s = this.project(pin.lon, pin.lat);
      if (s.depth <= 0.05) continue;
      const k = this.pinScale(pin.id, now);
      if (k <= 0) continue;
      const fade = clamp((s.depth - 0.05) / 0.2, 0, 1);
      const a = (reduce ? k : 1) * fade;
      const scale = reduce ? 1 : k;
      const isSel = pin.id === this.selected;
      const isHover = pin.id === this.hoverPin;
      ctx.globalAlpha = this.alpha * a;

      if (isSel) {
        const rr = R * 1.6 * scale;
        // pulsing rings
        if (!reduce) {
          for (let i = 0; i < 2; i++) {
            const t = ((now / 1800 + i * 0.5) % 1 + 1) % 1;
            ctx.strokeStyle = `rgba(${GLOW}, ${(0.95 * (1 - t)).toFixed(3)})`;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(s.x, s.y, rr + t * R * 2.6, 0, Math.PI * 2);
            ctx.stroke();
          }
        } else {
          ctx.strokeStyle = `rgba(${GLOW}, 0.35)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(s.x, s.y, rr + R * 1.1, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.save();
        ctx.shadowColor = `rgba(${GLOW}, 1)`;
        ctx.shadowBlur = 18;
        ctx.fillStyle = `rgb(${GLOW})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, rr, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        // light outline keeps the dark magenta pin visible on the dark globe
        ctx.strokeStyle = `rgba(${LIGHT}, 0.95)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(s.x, s.y, rr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgb(${NIGHT})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, rr * 0.48, 0, Math.PI * 2);
        ctx.fill();
        selectedScreen = { x: s.x, y: s.y, a };
      } else {
        const rr = R * (isHover ? 1.25 : 1) * scale;
        ctx.fillStyle = `rgba(${NIGHT}, 0.6)`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, rr + 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgb(${TEAL})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, rr, 0, Math.PI * 2);
        ctx.fill();
        // faint light edge so the teal ring reads on the dark globe
        ctx.strokeStyle = `rgba(${LIGHT}, ${isHover ? 0.85 : 0.45})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = `rgb(${NIGHT})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, rr * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }

      if (pin.marked) {
        const mr = R * 0.5 * scale;
        const off = (isSel ? R * 1.6 : R) * scale * 0.8;
        ctx.fillStyle = AMBER;
        ctx.strokeStyle = `rgb(${NIGHT})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(s.x + off, s.y - off, mr, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    // connector line from selected pin to the info panel
    const anchor = this.anchor?.();
    if (selectedScreen && anchor) {
      ctx.globalAlpha = this.alpha * selectedScreen.a;
      ctx.strokeStyle = `rgba(${LIGHT}, 0.4)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(selectedScreen.x, selectedScreen.y);
      ctx.lineTo(anchor.x, anchor.y);
      ctx.stroke();
      ctx.fillStyle = `rgba(${LIGHT}, 0.7)`;
      ctx.beginPath();
      ctx.arc(anchor.x, anchor.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}
