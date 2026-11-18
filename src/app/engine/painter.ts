import { ZoomTransform } from 'd3-zoom';
import { Scene, SceneNode, TimelineFrame, Marker } from './scene';
import { smoothstep } from './geometry';
import { TimelineItem } from '../models/timeline.models';

export interface PaintColors {
  ink: string;
  ink3: string;
  bg: string;
  accent: string;
  /** Colour of the year numbers on the axes. */
  year: string;
  dark: boolean;
}

/** Where a marker was drawn this frame, in screen pixels (for clicks and hover). */
export interface MarkerHit {
  id: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface PaintOptions {
  colors: PaintColors;
  dpr: number;
  width: number;
  height: number;
  visible: (item: TimelineItem) => boolean;
  highlighted: (item: TimelineItem) => boolean;
  anyHighlight: boolean;
  yearLabel: (y: number, approx?: boolean) => string;
  /** Opacity of the card of each node, computed by the stage this frame. */
  cardAlpha: Map<string, number>;
  /** Opacity of the text of each cover: what is nested inside a cover waits for it. */
  textAlpha: Map<string, number>;
  /** Adapts a data colour to the active theme. */
  themed: (hex: string) => string;
  /** Event under the pointer: its leader and mark are drawn stronger. */
  hoverId: string | null;
  /** Filled with the screen geometry of every marker drawn. */
  hits: MarkerHit[];
}

/**
 * Marker opacity of a frame: markers appear once its cards are big enough to matter,
 * relative to the screen, so the fully zoomed-out view shows only the eras (A26).
 */
export function frameAlpha(f: TimelineFrame, k: number, vw: number): number {
  return smoothstep(Math.max(55, vw * 0.05), Math.max(105, vw * 0.085), f.cardSize * k);
}

const TICK_STEPS = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];
const YEAR_FONT = `500 12.5px Inter, system-ui, sans-serif`;
const EDGE_FONT = `600 12.5px Inter, system-ui, sans-serif`;
/** Distance of the n-th lane of range bars from the axis. */
const laneOffset = (lane: number) => 9 + lane * 7;

/**
 * Draws, in screen space (always sharp): the axes, era colour bands, year ticks,
 * single-year marks, range bars in lanes and the curved leaders to each card.
 */
export function paint(ctx: CanvasRenderingContext2D, scene: Scene, t: ZoomTransform, o: PaintOptions): void {
  const { width: W, height: Hh, dpr, colors } = o;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, Hh);
  o.hits.length = 0;
  const k = t.k;
  const sx = (x: number) => x * k + t.x;
  const sy = (y: number) => y * k + t.y;
  const horiz = scene.orient === 'h';
  const roots = scene.frames.filter((f) => f.isRoot);
  const lastRootEnd = Math.max(...roots.map((f) => f.mainHi));
  const firstRootStart = Math.min(...roots.map((f) => f.mainLo));
  const rootYearGap = yearGapOf(roots, horiz);
  /** Right / bottom edge of the last era-boundary label drawn (they must not overlap). */
  let edgeLabelEnd = -Infinity;

  /** A range bar of frame `f` in its lane, with its start tick on the axis; `fade` is the frame's opacity. */
  const drawBar = (f: TimelineFrame, mk: Marker, fade: number): void => {
    const toM = (v: number) => (horiz ? sx : sy)(v);
    const ac = (horiz ? sy : sx)(f.axisCross);
    const P = (m: number, c: number): [number, number] => (horiz ? [m, c] : [c, m]);
    const vis = o.visible(mk.item);
    const isHl = o.anyHighlight && o.highlighted(mk.item);
    const hover = o.hoverId === mk.nodeId;
    const c = mk.item.color ? o.themed(mk.item.color) : f.color ? o.themed(f.color) : colors.accent;
    const alpha = fade * (vis ? 1 : 0.16) * (o.anyHighlight ? (isHl ? 1 : 0.4) : 1);
    ctx.globalAlpha = alpha;
    const off = mk.side * laneOffset(mk.lane);
    const [bx0, by0] = P(toM(mk.m0), ac + off);
    const [bx1, by1] = P(toM(mk.m1), ac + off);
    drawRange(ctx, mk, bx0, by0, bx1, by1, c, isHl || hover ? 5 : 3.6);
    if (mk.clippedEnd || mk.ongoing || mk.clippedStart) {
      // the year past the arrow: 'presente', or where a cut bar really ends
      const room = 2 * f.timePad * k;
      if (mk.clippedEnd || mk.ongoing) arrowYear(ctx, o.yearLabel(mk.item.end, mk.approxEnd && !mk.ongoing), bx0, by0, bx1, by1, room, c, colors.bg);
      if (mk.clippedStart) arrowYear(ctx, o.yearLabel(mk.item.start, mk.approxStart), bx1, by1, bx0, by0, room, c, colors.bg);
    }
    // start tick on the axis
    ctx.lineWidth = 1;
    ctx.strokeStyle = withAlpha(c, mk.approxStart ? 0.3 : 0.7);
    ctx.beginPath();
    ctx.moveTo(...P(toM(mk.m0), ac));
    ctx.lineTo(bx0, by0);
    ctx.stroke();
    if (alpha > 0.3 && vis) o.hits.push({ id: mk.nodeId, x0: bx0, y0: by0, x1: bx1, y1: by1 });
  };
  /** The bar leaves its frame: it continues over the next eras. */
  const spills = (f: TimelineFrame, mk: Marker) => f.isRoot && (mk.m1 > f.mainHi || mk.m0 < f.mainLo);

  for (const f of scene.frames) {
    const r = f.region;
    const rx = sx(r.x), ry = sy(r.y), rw = r.w * k, rh = r.h * k;
    if (rx > W || ry > Hh || rx + rw < 0 || ry + rh < 0) continue;
    const ma = frameAlpha(f, k, W);
    const ownerAlpha = f.isRoot ? 1 : (o.textAlpha.get(f.ownerId) ?? 0);
    const axisAlpha = f.isRoot ? 1 : ma * ownerAlpha;
    if (axisAlpha < 0.01) continue;

    const a0 = (horiz ? sx : sy)(f.mainLo);
    const a1 = (horiz ? sx : sy)(f.mainHi);
    const ac = (horiz ? sy : sx)(f.axisCross);
    const P = (m: number, c: number): [number, number] => (horiz ? [m, c] : [c, m]);
    const color = f.color ? o.themed(f.color) : colors.accent;

    // Era colour band (root frames): a soft glow along the axis.
    if (f.isRoot) {
      const reach = Math.max(26, Math.min(150, f.cardSize * k * 0.55));
      const g = horiz ? ctx.createLinearGradient(0, ac - reach, 0, ac + reach) : ctx.createLinearGradient(ac - reach, 0, ac + reach, 0);
      const c0 = withAlpha(color, 0);
      const c1 = withAlpha(color, colors.dark ? 0.2 : 0.24);
      g.addColorStop(0, c0);
      g.addColorStop(0.5, c1);
      g.addColorStop(1, c0);
      ctx.fillStyle = g;
      if (horiz) ctx.fillRect(a0, ac - reach, a1 - a0, reach * 2);
      else {
        // Stacked eras do not touch (their headers sit in between): the band fades at both ends.
        const fl = Math.min(90, (a1 - a0) * 0.2);
        const n = 14;
        ctx.fillRect(ac - reach, a0 + fl, reach * 2, a1 - a0 - 2 * fl);
        for (let i = 0; i < n; i++) {
          ctx.globalAlpha = (i + 0.5) / n;
          ctx.fillRect(ac - reach, a0 + (i * fl) / n, reach * 2, fl / n + 0.5);
          ctx.fillRect(ac - reach, a1 - ((i + 1) * fl) / n - 0.5, reach * 2, fl / n + 0.5);
        }
        ctx.globalAlpha = 1;
      }
    }

    // Axis line
    ctx.globalAlpha = axisAlpha;
    ctx.strokeStyle = withAlpha(color, colors.dark ? 0.85 : 0.95);
    ctx.lineWidth = f.isRoot ? 1.6 : 1.2;
    ctx.beginPath();
    ctx.moveTo(...P(a0, ac));
    ctx.lineTo(...P(a1, ac));
    ctx.stroke();

    // Era boundary ornament
    if (f.isRoot) {
      ctx.fillStyle = color;
      diamond(ctx, ...P(a0, ac), 4.5);
    }

    // Years go past the range bars on their side, so the bars never cover them (one common
    // line for the eras, so the years of neighbouring eras stay aligned).
    const yearGap = f.isRoot ? rootYearGap : yearGapOf([f], horiz);
    const yearPos = (m: number): [number, number] => (horiz ? [m, ac + yearGap] : [ac - yearGap, m]);
    ctx.textAlign = horiz ? 'center' : 'right';
    ctx.textBaseline = horiz ? 'top' : 'middle';

    // Years at the boundaries of the eras: always shown, even fully zoomed out. The first one
    // starts at its boundary and the last one ends at its boundary, so neither is cut off.
    if (f.isRoot) {
      const edges: [number, string, 'start' | 'center' | 'end'][] = [
        [a0, o.yearLabel(f.t0, f.approxStart), Math.abs(f.mainLo - firstRootStart) < 1e-6 ? 'start' : 'center'],
      ];
      if (Math.abs(f.mainHi - lastRootEnd) < 1e-6) edges.push([a1, o.yearLabel(f.t1, f.approxEnd), 'end']);
      ctx.font = EDGE_FONT;
      for (const [m, text, align] of edges) {
        const w = horiz ? ctx.measureText(text).width : 16;
        const lo = align === 'start' ? m - 2 : align === 'end' ? m - w : m - w / 2;
        if (lo < edgeLabelEnd + 10) continue;
        if (lo + w < -60 || lo > (horiz ? W : Hh) + 60) continue;
        edgeLabelEnd = lo + w;
        ctx.globalAlpha = 1;
        if (horiz) ctx.textAlign = align === 'start' ? 'left' : align === 'end' ? 'right' : 'center';
        haloText(ctx, text, ...yearPos(align === 'start' && horiz ? m - 2 : m), colors.year, colors.bg);
      }
      ctx.textAlign = horiz ? 'center' : 'right';
    }

    // Year ticks
    const ppy = ((f.mainHi - f.mainLo - 2 * f.timePad) / (f.t1 - f.t0)) * k;
    const tickAlpha = f.isRoot ? 1 : axisAlpha * ma;
    if (ppy > 0 && tickAlpha > 0.05) {
      const step = TICK_STEPS.find((s) => s * ppy >= 84) ?? 1000;
      const first = Math.ceil(f.t0 / step) * step;
      ctx.font = YEAR_FONT;
      for (let y = first; y <= f.t1; y += step) {
        const m = (horiz ? sx : sy)(f.mainLo + f.timePad) + (y - f.t0) * ppy;
        if (m < -40 || m > (horiz ? W : Hh) + 40) continue;
        const keep = f.isRoot ? 44 : 18;
        if (Math.abs(m - a0) < keep || Math.abs(m - a1) < keep || y === 0) continue;
        ctx.globalAlpha = tickAlpha * 0.55;
        ctx.strokeStyle = colors.ink3;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(...P(m, ac - 3));
        ctx.lineTo(...P(m, ac + 3));
        ctx.stroke();
        ctx.globalAlpha = tickAlpha * 0.9;
        haloText(ctx, o.yearLabel(y), ...yearPos(m), colors.year, colors.bg);
      }
    }

    if (ma < 0.01) continue;
    const toM = (v: number) => (horiz ? sx : sy)(v);

    // Leaders, tinted with the colour of their mark so each one can be followed.
    for (const mk of f.markers) {
      const node = scene.byId.get(mk.nodeId);
      if (!node) continue;
      const vis = o.visible(mk.item);
      const fa = vis ? 1 : 0.14;
      const hl = o.anyHighlight ? (o.highlighted(mk.item) ? 1 : 0.4) : 1;
      const hover = o.hoverId === mk.nodeId;
      const c = mk.item.color ? o.themed(mk.item.color) : color;
      const laneOff = mk.isRange ? mk.side * laneOffset(mk.lane) : 0;
      const am = toM(mk.anchor);
      const [x0, y0] = P(am, ac + laneOff);
      const [x1, y1] = cardAnchor(node, horiz, sx, sy, k);
      const ca = o.cardAlpha.get(mk.nodeId) ?? 0;
      const base = hover ? 0.95 : (colors.dark ? 0.34 : 0.42) + 0.3 * ca;
      ctx.globalAlpha = ma * ownerAlpha * fa * hl;
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, withAlpha(c, Math.min(1, base * 1.15)));
      g.addColorStop(1, withAlpha(c, base * 0.5));
      ctx.strokeStyle = g;
      ctx.lineWidth = hover ? 1.8 : 1.1;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      if (horiz) {
        const my = (y0 + y1) / 2;
        ctx.bezierCurveTo(x0, my, x1, my, x1, y1);
      } else {
        const mx = (x0 + x1) / 2;
        ctx.bezierCurveTo(mx, y0, mx, y1, x1, y1);
      }
      ctx.stroke();
    }

    for (const mk of f.markers) {
      const vis = o.visible(mk.item);
      const isHl = o.anyHighlight && o.highlighted(mk.item);
      const hover = o.hoverId === mk.nodeId;
      const fa = vis ? 1 : 0.16;
      const hl = o.anyHighlight ? (isHl ? 1 : 0.4) : 1;
      const c = mk.item.color ? o.themed(mk.item.color) : color;
      const alpha = ma * ownerAlpha * fa * hl;
      ctx.globalAlpha = alpha;
      if (mk.isRange) {
        // a bar that runs on over the next eras is drawn after all of them (see below)
        if (!spills(f, mk)) drawBar(f, mk, ma * ownerAlpha);
      } else {
        const [px, py] = P(toM(mk.m0), ac);
        if (isHl || hover) {
          ctx.fillStyle = withAlpha(isHl ? colors.accent : c, 0.28);
          circle(ctx, px, py, 10);
        }
        ctx.fillStyle = colors.bg;
        circle(ctx, px, py, 6.2);
        ctx.fillStyle = c;
        circle(ctx, px, py, 4.2);
        if (alpha > 0.3 && vis) o.hits.push({ id: mk.nodeId, x0: px, y0: py, x1: px, y1: py });
      }
    }
    ctx.globalAlpha = 1;
  }

  // Bars that run past their era, over the next ones: drawn last, so the next eras' bands do not
  // cover them, and even when their own era is off screen.
  for (const f of roots) {
    const ma = frameAlpha(f, k, W);
    if (ma < 0.01) continue;
    for (const mk of f.markers) if (mk.isRange && spills(f, mk)) drawBar(f, mk, ma);
  }
  ctx.globalAlpha = 1;
}

/**
 * A range bar. An approximate end ('~' in the data) dissolves. An end that is still going
 * ('presente'), or that a frame cuts (a container's sub-timeline; bars of the eras run on over
 * the next eras instead), finishes in an arrow with its real year beside it (see arrowYear).
 */
function drawRange(ctx: CanvasRenderingContext2D, mk: Marker, x0: number, y0: number, x1: number, y1: number, c: string, width: number): void {
  const len = Math.hypot(x1 - x0, y1 - y0);
  const fadeStart = mk.approxStart && !mk.clippedStart;
  const fadeEnd = mk.approxEnd && !mk.clippedEnd && !mk.ongoing;
  if ((fadeStart || fadeEnd) && len > 4) {
    const f = Math.min(0.42, 46 / len);
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, fadeStart ? withAlpha(c, 0) : c);
    if (fadeStart) g.addColorStop(f, c);
    if (fadeEnd) g.addColorStop(1 - f, c);
    g.addColorStop(1, fadeEnd ? withAlpha(c, 0) : c);
    ctx.strokeStyle = g;
  } else ctx.strokeStyle = c;
  ctx.lineWidth = width;
  ctx.lineCap = fadeStart || fadeEnd ? 'butt' : 'round';
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  ctx.lineCap = 'butt';
  if (len < 1) return;
  const ux = (x1 - x0) / len;
  const uy = (y1 - y0) / len;
  if (mk.clippedEnd || mk.ongoing) arrow(ctx, x1 + ux * 4, y1 + uy * 4, ux, uy, c);
  if (mk.clippedStart) arrow(ctx, x0 - ux * 4, y0 - uy * 4, -ux, -uy, c);
}

/**
 * The year written past the arrow at the (x1, y1) end of a bar coming from (x0, y0): along the
 * bar, in the free space between the eras (`room` px), and only when it fits there.
 */
function arrowYear(
  ctx: CanvasRenderingContext2D, text: string, x0: number, y0: number, x1: number, y1: number,
  room: number, c: string, bg: string,
): void {
  const len = Math.hypot(x1 - x0, y1 - y0);
  if (len < 1) return;
  const ux = (x1 - x0) / len;
  const uy = (y1 - y0) / len;
  const gap = 11;
  ctx.save();
  ctx.font = YEAR_FONT;
  const along = Math.abs(ux) >= Math.abs(uy);
  const need = gap + (along ? ctx.measureText(text).width : 14) + 4;
  if (need <= room) {
    if (along) {
      ctx.textAlign = ux > 0 ? 'left' : 'right';
      ctx.textBaseline = 'middle';
    } else {
      ctx.textAlign = 'center';
      ctx.textBaseline = uy > 0 ? 'top' : 'bottom';
    }
    haloText(ctx, text, x1 + ux * gap, y1 + uy * gap, c, bg);
  }
  ctx.restore();
}

function arrow(ctx: CanvasRenderingContext2D, x: number, y: number, ux: number, uy: number, c: string): void {
  const s = 6.5;
  ctx.strokeStyle = c;
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x - ux * s - uy * s * 0.75, y - uy * s + ux * s * 0.75);
  ctx.lineTo(x, y);
  ctx.lineTo(x - ux * s + uy * s * 0.75, y - uy * s - ux * s * 0.75);
  ctx.stroke();
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';
}

/** Distance from the axis to the year numbers: past the outermost lane of range bars on their side. */
function yearGapOf(frames: TimelineFrame[], horiz: boolean): number {
  const side = horiz ? 1 : -1;
  let lane = -1;
  for (const f of frames) for (const m of f.markers) if (m.isRange && m.side === side) lane = Math.max(lane, m.lane);
  return (lane >= 0 ? laneOffset(lane) + 2 : 0) + 8;
}

/** Text with a halo of the background colour: stays legible over leaders and bars. */
function haloText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fill: string, halo: string): void {
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = withAlpha(halo, 0.85);
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
  ctx.lineJoin = 'miter';
}

function cardAnchor(n: SceneNode, horiz: boolean, sx: (v: number) => number, sy: (v: number) => number, k: number): [number, number] {
  const r = n.rect;
  if (horiz) {
    const x = sx(r.x + r.w / 2);
    return n.side === 1 ? [x, sy(r.y)] : [x, sy(r.y) + r.h * k];
  }
  const y = sy(r.y + Math.min(r.h, r.w * 1.4) * 0.3);
  return n.side === 1 ? [sx(r.x), y] : [sx(r.x) + r.w * k, y];
}

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function diamond(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.lineTo(x + r, y);
  ctx.lineTo(x, y + r);
  ctx.lineTo(x - r, y);
  ctx.closePath();
  ctx.fill();
}

/** Distance from a point to a marker hit (a dot or a bar), in screen pixels. */
export function hitDistance(h: MarkerHit, x: number, y: number): number {
  const dx = h.x1 - h.x0;
  const dy = h.y1 - h.y0;
  const l2 = dx * dx + dy * dy;
  const u = l2 ? Math.max(0, Math.min(1, ((x - h.x0) * dx + (y - h.y0) * dy) / l2)) : 0;
  return Math.hypot(x - (h.x0 + u * dx), y - (h.y0 + u * dy));
}

const alphaCache = new Map<string, string>();
/** '#rrggbb' + alpha → 'rgba(...)'. */
export function withAlpha(hex: string, a: number): string {
  const key = hex + a;
  const hit = alphaCache.get(key);
  if (hit) return hit;
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  const out = `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  if (alphaCache.size > 800) alphaCache.clear();
  alphaCache.set(key, out);
  return out;
}
