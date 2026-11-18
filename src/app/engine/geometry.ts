export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** 0 below lo, 1 above hi, smooth in between. */
export function smoothstep(lo: number, hi: number, v: number): number {
  if (hi === lo) return v >= hi ? 1 : 0;
  const t = clamp((v - lo) / (hi - lo), 0, 1);
  return t * t * (3 - 2 * t);
}

export function rectUnion(rects: Rect[]): Rect {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const r of rects) {
    x0 = Math.min(x0, r.x);
    y0 = Math.min(y0, r.y);
    x1 = Math.max(x1, r.x + r.w);
    y1 = Math.max(y1, r.y + r.h);
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

export function inflate(r: Rect, fx: number, fy = fx): Rect {
  return { x: r.x - r.w * fx, y: r.y - r.h * fy, w: r.w * (1 + 2 * fx), h: r.h * (1 + 2 * fy) };
}

export function containsPoint(r: Rect, x: number, y: number): boolean {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

/** Places a box of aspect authW:authH inside region (contain), anchored top-left or centred. */
export function fitInto(region: Rect, authW: number, authH: number, align: 'start' | 'center' = 'start'): Rect {
  const s = Math.min(region.w / authW, region.h / authH);
  const w = authW * s;
  const h = authH * s;
  if (align === 'center') return { x: region.x + (region.w - w) / 2, y: region.y + (region.h - h) / 2, w, h };
  return { x: region.x, y: region.y, w, h };
}

/** Maps a rect given in a box's authored pixels into world space. */
export function sub(box: Rect, authW: number, r: Rect): Rect {
  const s = box.w / authW;
  return { x: box.x + r.x * s, y: box.y + r.y * s, w: r.w * s, h: r.h * s };
}

/**
 * Isotonic placement on a line (pool-adjacent-violators).
 * Centres as close as possible to `anchors` while keeping consecutive items at least
 * (size_i + size_{i+1}) / 2 + gap apart, inside [lo, hi].
 */
export function placeOnLine(anchors: number[], sizes: number[], gap: number, lo: number, hi: number): number[] {
  const n = anchors.length;
  if (!n) return [];
  const off: number[] = [0];
  for (let i = 1; i < n; i++) off[i] = off[i - 1] + (sizes[i - 1] + sizes[i]) / 2 + gap;
  const target = anchors.map((a, i) => a - off[i]);
  // PAV for a non-decreasing fit
  const blocks: { sum: number; count: number }[] = [];
  for (const t of target) {
    blocks.push({ sum: t, count: 1 });
    while (blocks.length > 1) {
      const b = blocks[blocks.length - 1];
      const a = blocks[blocks.length - 2];
      if (a.sum / a.count <= b.sum / b.count) break;
      blocks.pop();
      a.sum += b.sum;
      a.count += b.count;
    }
  }
  const d: number[] = [];
  for (const b of blocks) for (let i = 0; i < b.count; i++) d.push(b.sum / b.count);
  const minD = lo + sizes[0] / 2;
  const maxD = hi - sizes[n - 1] / 2 - off[n - 1];
  return d.map((v, i) => clamp(v, minD, Math.max(minD, maxD)) + off[i]);
}

/** First-free-lane assignment for intervals (sorted by start internally). */
export function assignLanes(intervals: { s: number; e: number }[], pad: number): number[] {
  const order = intervals.map((_, i) => i).sort((a, b) => intervals[a].s - intervals[b].s);
  const laneEnds: number[] = [];
  const lanes = new Array<number>(intervals.length);
  for (const i of order) {
    const { s, e } = intervals[i];
    let lane = laneEnds.findIndex((end) => end + pad <= s);
    if (lane < 0) {
      lane = laneEnds.length;
      laneEnds.push(e);
    } else laneEnds[lane] = e;
    lanes[i] = lane;
  }
  return lanes;
}
