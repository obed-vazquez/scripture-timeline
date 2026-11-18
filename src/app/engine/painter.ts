import { ZoomTransform } from 'd3-zoom';
import { Scene, SceneNode, TimelineFrame } from './scene';
import { smoothstep } from './geometry';
import { TimelineItem } from '../models/timeline.models';

export interface PaintColors {
  ink: string;
  ink3: string;
  bg: string;
  accent: string;
  dark: boolean;
}

export interface PaintOptions {
  colors: PaintColors;
  dpr: number;
  width: number;
  height: number;
  visible: (item: TimelineItem) => boolean;
  highlighted: (item: TimelineItem) => boolean;
  anyHighlight: boolean;
  yearLabel: (y: number) => string;
  /** Opacity of the card of each node, computed by the stage this frame. */
  cardAlpha: Map<string, number>;
  /** Opacity of the text of each cover: what is nested inside a cover waits for it. */
  textAlpha: Map<string, number>;
  /** Adapts a data colour to the active theme. */
  themed: (hex: string) => string;
}

/**
 * Marker opacity of a frame: markers appear once its cards are big enough to matter,
 * relative to the screen, so the fully zoomed-out view shows only the eras (A26).
 */
export function frameAlpha(f: TimelineFrame, k: number, vw: number): number {
  return smoothstep(Math.max(55, vw * 0.05), Math.max(105, vw * 0.085), f.cardSize * k);
}

const TICK_STEPS = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];

/**
 * Draws, in screen space (always sharp): the axes, era colour bands, year ticks,
 * single-year marks, range bars in lanes and the curved leaders to each card.
 */
export function paint(ctx: CanvasRenderingContext2D, scene: Scene, t: ZoomTransform, o: PaintOptions): void {
  const { width: W, height: Hh, dpr, colors } = o;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, Hh);
  const k = t.k;
  const sx = (x: number) => x * k + t.x;
  const sy = (y: number) => y * k + t.y;
  const horiz = scene.orient === 'h';

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
      const c1 = withAlpha(color, colors.dark ? 0.2 : 0.16);
      g.addColorStop(0, c0);
      g.addColorStop(0.5, c1);
      g.addColorStop(1, c0);
      ctx.fillStyle = g;
      if (horiz) ctx.fillRect(a0, ac - reach, a1 - a0, reach * 2);
      else ctx.fillRect(ac - reach, a0, reach * 2, a1 - a0);
    }

    // Axis line
    ctx.globalAlpha = axisAlpha;
    ctx.strokeStyle = withAlpha(color, colors.dark ? 0.85 : 0.9);
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

    // Year ticks
    const ppy = ((f.mainHi - f.mainLo - 2 * f.timePad) / (f.t1 - f.t0)) * k;
    if (ppy > 0 && axisAlpha > 0.2) {
      const step = TICK_STEPS.find((s) => s * ppy >= 70) ?? 1000;
      const first = Math.ceil(f.t0 / step) * step;
      ctx.font = `500 10.5px Inter, system-ui, sans-serif`;
      ctx.textAlign = horiz ? 'center' : 'right';
      ctx.textBaseline = horiz ? 'top' : 'middle';
      for (let y = first; y <= f.t1; y += step) {
        const m = (horiz ? sx : sy)(f.mainLo + f.timePad) + (y - f.t0) * ppy;
        if (m < -40 || m > (horiz ? W : Hh) + 40) continue;
        if (Math.abs(m - a0) < 18 || Math.abs(m - a1) < 18 || y === 0) continue;
        ctx.globalAlpha = axisAlpha * 0.55;
        ctx.strokeStyle = colors.ink3;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(...P(m, ac - 3));
        ctx.lineTo(...P(m, ac + 3));
        ctx.stroke();
        if (ma > 0.3) {
          ctx.globalAlpha = axisAlpha * ma * 0.7;
          ctx.fillStyle = colors.ink3;
          const [tx, ty] = horiz ? [m, ac + 7] : [ac - 8, m];
          ctx.fillText(o.yearLabel(y), tx, ty);
        }
      }
    }

    if (ma < 0.01) continue;
    const toM = (v: number) => (horiz ? sx : sy)(v);

    // Leaders, then marks on top.
    for (const mk of f.markers) {
      const node = scene.byId.get(mk.nodeId);
      if (!node) continue;
      const vis = o.visible(mk.item);
      const fa = vis ? 1 : 0.14;
      const hl = o.anyHighlight ? (o.highlighted(mk.item) ? 1 : 0.4) : 1;
      const laneOff = mk.isRange ? mk.side * (9 + mk.lane * 7) : 0;
      const am = toM(mk.anchor);
      const [x0, y0] = P(am, ac + laneOff);
      const [x1, y1] = cardAnchor(node, horiz, sx, sy, k);
      const ca = o.cardAlpha.get(mk.nodeId) ?? 0;
      ctx.globalAlpha = ma * ownerAlpha * fa * hl * (0.28 + 0.32 * ca);
      ctx.strokeStyle = colors.ink3;
      ctx.lineWidth = 1;
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
      const fa = vis ? 1 : 0.16;
      const hl = o.anyHighlight ? (isHl ? 1 : 0.4) : 1;
      const c = mk.item.color ? o.themed(mk.item.color) : color;
      ctx.globalAlpha = ma * ownerAlpha * fa * hl;
      if (mk.isRange) {
        const off = mk.side * (9 + mk.lane * 7);
        const m0 = toM(mk.m0);
        const m1 = toM(mk.m1);
        const fade = mk.ongoing || mk.clippedEnd;
        const [bx0, by0] = P(m0, ac + off);
        const [bx1, by1] = P(m1, ac + off);
        if (fade) {
          const g = ctx.createLinearGradient(bx0, by0, bx1, by1);
          g.addColorStop(0, c);
          g.addColorStop(0.7, c);
          g.addColorStop(1, withAlpha(c, 0));
          ctx.strokeStyle = g;
        } else ctx.strokeStyle = c;
        ctx.lineWidth = isHl ? 5 : 3.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(bx0, by0);
        ctx.lineTo(bx1, by1);
        ctx.stroke();
        ctx.lineCap = 'butt';
        // start tick on the axis
        ctx.lineWidth = 1;
        ctx.strokeStyle = withAlpha(c, 0.7);
        ctx.beginPath();
        ctx.moveTo(...P(m0, ac));
        ctx.lineTo(bx0, by0);
        ctx.stroke();
      } else {
        const [px, py] = P(toM(mk.m0), ac);
        if (isHl) {
          ctx.fillStyle = withAlpha(colors.accent, 0.28);
          circle(ctx, px, py, 10);
        }
        ctx.fillStyle = colors.bg;
        circle(ctx, px, py, 6.2);
        ctx.fillStyle = c;
        circle(ctx, px, py, 4.2);
      }
    }
    ctx.globalAlpha = 1;
  }
  ctx.globalAlpha = 1;
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
  if (alphaCache.size > 500) alphaCache.clear();
  alphaCache.set(key, out);
  return out;
}
