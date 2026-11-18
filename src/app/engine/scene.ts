import { TimelineItem } from '../models/timeline.models';
import { BlockDef, EventCustom, LineageBlock } from '../models/custom.models';
import { Rect, assignLanes, fitInto, placeOnLine, rectUnion, sub } from './geometry';

export type Orientation = 'h' | 'v';
export type SceneKind = 'title' | 'era' | 'event' | 'read' | 'block' | 'point' | 'guide' | 'hub';

export interface Marker {
  nodeId: string;
  item: TimelineItem;
  m0: number;
  m1: number;
  isRange: boolean;
  ongoing: boolean;
  approxStart: boolean;
  approxEnd: boolean;
  clippedStart: boolean;
  clippedEnd: boolean;
  side: -1 | 1;
  lane: number;
  anchor: number;
}

export interface TimelineFrame {
  ownerId: string;
  orient: Orientation;
  depth: number;
  axisCross: number;
  mainLo: number;
  mainHi: number;
  t0: number;
  t1: number;
  /** The owner's start / end year is approximate. */
  approxStart: boolean;
  approxEnd: boolean;
  timePad: number;
  color: string;
  region: Rect;
  /** World size of a card in this frame: drives when markers become visible. */
  cardSize: number;
  markers: Marker[];
  isRoot: boolean;
}

export interface SceneNode {
  id: string;
  kind: SceneKind;
  item?: TimelineItem;
  block?: BlockDef;
  guideId?: string;
  pointId?: string;
  parent: SceneNode | null;
  children: SceneNode[];
  rect: Rect;
  authW: number;
  authH: number;
  focus: Rect;
  focusMode: 'fit' | 'top';
  /** Screen width (px) range over which the node fades in. */
  reveal: [number, number];
  side?: -1 | 1;
  depth: number;
  frame?: TimelineFrame;
  cover?: CoverLayout;
  /** The detail view of a wide-screen card (no DOM of its own: the card turns into it). */
  tight?: boolean;
}

export interface Scene {
  orient: Orientation;
  nodes: SceneNode[];
  byId: Map<string, SceneNode>;
  frames: TimelineFrame[];
  bounds: Rect;
  home: Rect;
  homeMode: 'fit' | 'top';
  minFocusWidth: number;
  /** The menu of guides shown at the overview. */
  hub: SceneNode;
  /** The guides open out of the hub when zooming into it (wide screens only). */
  hubMorph: boolean;
}

export interface ResolvedGuide {
  id: string;
  items: TimelineItem[];
}

// ─────────────────────────────────────────────────────────────
// Authored geometry of the cover (the page of an event). The cover
// component positions its parts with these same numbers.
// ─────────────────────────────────────────────────────────────

export interface CoverLayout {
  w: number;
  h: number;
  image: Rect;
  text: Rect;
  read: Rect;
  subtl?: Rect;
  blocks: Rect[];
  /**
   * Wide screens: where the first block sits inside the card, as a figure of its detail view
   * (bottom right). The full text leaves that corner free.
   */
  figure?: Rect;
}

const COVER_H = { w: 1600, h: 1000 };
const COVER_V = { w: 1000, h: 1400 };

export function coverLayout(item: TimelineItem, orient: Orientation, custom?: EventCustom): CoverLayout {
  const blocks = custom?.blocks ?? [];
  if (orient === 'h') {
    const L: CoverLayout = {
      w: COVER_H.w,
      h: COVER_H.h,
      image: { x: 0, y: 0, w: 720, h: 1000 },
      text: { x: 790, y: 60, w: 760, h: 560 },
      read: { x: 790, y: 650, w: 760, h: 300 },
      blocks: [],
    };
    if (!item.image) {
      L.text = { x: 140, y: 60, w: 1320, h: 560 };
      L.read = { x: 140, y: 650, w: 1320, h: 300 };
    }
    if (item.children.length) {
      L.subtl = { x: 40, y: L.h + 20, w: 1520, h: 640 };
      L.h += 680;
    }
    if (blocks.length) {
      // the first block is a figure of the detail view: bottom right of the card
      const size = blockSize(blocks[0]);
      const f = Math.min(FIGURE.w / size.w, FIGURE.h / size.h);
      const fw = size.w * f;
      const fh = size.h * f;
      L.figure = { x: FIGURE.right - fw, y: FIGURE.bottom - fh, w: fw, h: fh };
      L.blocks.push(L.figure);
    }
    if (blocks.length > 1) {
      // any further blocks go under the card
      const rest = blocks.length - 1;
      const gap = 60;
      const bw = (1520 - gap * (rest - 1)) / rest;
      for (let i = 0; i < rest; i++) L.blocks.push({ x: 40 + i * (bw + gap), y: L.h + 20, w: bw, h: 760 });
      L.h += 800;
    }
    return L;
  }
  const L: CoverLayout = {
    w: COVER_V.w,
    h: COVER_V.h,
    image: { x: 0, y: 0, w: 1000, h: 560 },
    text: { x: 70, y: 600, w: 860, h: 500 },
    read: { x: 70, y: 1120, w: 860, h: 250 },
    blocks: [],
  };
  if (!item.image) {
    L.text = { x: 70, y: 120, w: 860, h: 700 };
    L.read = { x: 70, y: 900, w: 860, h: 460 };
  }
  if (item.children.length) {
    L.subtl = { x: 30, y: L.h + 20, w: 940, h: 1300 };
    L.h += 1340;
  }
  for (const b of blocks) {
    const h = b.type === 'group' ? (920 * b.h) / b.w : 640;
    L.blocks.push({ x: 40, y: L.h + 20, w: 920, h });
    L.h += h + 40;
  }
  return L;
}

/** The card itself (image, title and texts), without the nested timeline or the blocks below it. */
export const CARD_H = { w: 1600, h: 1000 };

/** Authored size of a block. */
export function blockSize(b: BlockDef): { w: number; h: number } {
  return b.type === 'group' ? { w: b.w, h: b.h } : BLOCK_SIZE[b.type];
}

/**
 * Wide screens: share of the screen the card takes in its "header view" (image, title and
 * summary) and in its "detail view" (full text). The detail view leaves room around the card,
 * so there is still room to zoom in.
 */
export const HEADER_VIEW = 0.5;
export const DETAIL_VIEW = 0.78;

/** Largest figure of a detail view, and its bottom-right corner, in card pixels (mirrors .cd-body). */
export const FIGURE = { w: 702, h: 400, right: 1530, bottom: 954 };

/** Scene id of the hub (the menu of guides). */
export const HUB_ID = '::guias';

/**
 * Font size (authored px) of an event's title on its cover; long titles get smaller. The
 * screen label of the event uses the same size, so one turns into the other seamlessly.
 */
export function coverTitleSize(title: string, hasImage: boolean, orient: Orientation): number {
  const len = title.length;
  const base = orient === 'h' ? (hasImage ? 92 : 108) : 86;
  return Math.round(Math.max(base * 0.68, Math.min(base, base - (len - 26) * 1.1)));
}

/** Authored typography of the cover text (year above the title). Mirrors canvas.css. */
export const COVER_TYPE: Record<Orientation, { year: number; gap: number }> = {
  h: { year: 132, gap: 22 },
  v: { year: 120, gap: 16 },
};

export const BLOCK_SIZE: Record<Exclude<BlockDef['type'], 'group'>, { w: number; h: number }> = {
  video: { w: 1280, h: 880 },
  lineage: { w: 1400, h: 820 },
  compare: { w: 1400, h: 900 },
  chronicle: { w: 1520, h: 700 },
};

/** Authored size of a lineage point's detail, and where it sits relative to the point. */
export const POINT_DETAIL = { w: 520, h: 300, scale: 0.4, dy: 112 };

/** Authored size of the overview title on wide screens. */
const TITLE_AUTH_H = { w: 1800, h: 400 };

// Sizes in world units.
const H = {
  baseLength: 10000,
  cardW: 420,
  headerH: 860,
  axisGap: 130,
  eraScale: 2, // world units per authored px in era headers
  titleW: 6400,
};
const V = {
  width: 1000,
  cardW: 400,
  headerH: 470,
  axisGap: 40,
  eraScale: 1,
  titleH: 820,
  guideGap: 120,
};

export interface SceneInput {
  orient: Orientation;
  eras: TimelineItem[];
  custom: Record<string, EventCustom>;
  guides: ResolvedGuide[];
  /** Measured authored size of each reading panel, by event id. */
  readSizes: Map<string, { w: number; h: number }>;
}

/** Guide menu authored size for a given number of items. */
export function guideAuthSize(n: number, orient: Orientation): { w: number; h: number } {
  if (orient === 'h') return { w: 1600, h: 300 + Math.ceil(n / 3) * 92 + 60 };
  return { w: 1000, h: 320 + n * 98 + 70 };
}

/** Authored size of the hub (the menu of guides) for a given number of guides. */
export function hubAuthSize(n: number, orient: Orientation, aspect: number): { w: number; h: number } {
  if (orient === 'h') return { w: 1000, h: Math.round(1000 / aspect) };
  return { w: 1000, h: 200 + n * 112 + 60 };
}

export function buildScene(input: SceneInput): Scene {
  const { orient } = input;
  const nodes: SceneNode[] = [];
  const frames: TimelineFrame[] = [];
  const add = (n: SceneNode) => {
    nodes.push(n);
    n.parent?.children.push(n);
    return n;
  };

  // ── Cards (events), recursively ───────────────────────────
  const addCard = (item: TimelineItem, rect: Rect, parent: SceneNode, side: -1 | 1, depth: number) => {
    const L = coverLayout(item, orient, input.custom[item.id]);
    const cardArea = orient === 'h' ? sub(rect, L.w, { x: 0, y: 0, ...CARD_H }) : rect;
    // wide screens: the event's own view is the "header view", the card at a share of the screen
    const headerFocus = orient === 'h' ? scaleAround(cardArea, 1 / HEADER_VIEW) : rect;
    const card = add({
      id: item.id, kind: 'event', item, parent, children: [], rect, authW: L.w, authH: L.h,
      focus: headerFocus, focusMode: 'fit', reveal: [70, 130], side, depth, cover: L,
    });
    if (orient === 'h') {
      // "detail view": the card, larger on screen, turns into its full text
      add({
        id: `${item.id}::leer`, kind: 'read', item, parent: card, children: [], rect: cardArea, authW: CARD_H.w, authH: CARD_H.h,
        focus: scaleAround(cardArea, 1 / DETAIL_VIEW), focusMode: 'fit', reveal: [0, 0], depth: depth + 1, tight: true,
      });
    } else {
      // phone: the full text is a panel under the summary, read by zooming into it
      const rs = input.readSizes.get(item.id) ?? estimateReadSize(item, orient);
      const readRect = fitInto(sub(rect, L.w, L.read), rs.w, rs.h, 'start');
      add({
        id: `${item.id}::leer`, kind: 'read', item, parent: card, children: [], rect: readRect, authW: rs.w, authH: rs.h,
        focus: readRect, focusMode: rs.h / rs.w > 1.15 ? 'top' : 'fit', reveal: [30, 56], depth: depth + 1,
      });
    }
    // nested timeline of children
    if (L.subtl && item.children.length) {
      const region = sub(rect, L.w, L.subtl);
      layoutFrame(card, region, item, item.children, depth + 1, false);
    }
    // blocks
    const blocks = input.custom[item.id]?.blocks ?? [];
    blocks.forEach((b, i) => {
      const size = blockSize(b);
      const r = fitInto(sub(rect, L.w, L.blocks[i]), size.w, size.h, 'center');
      const bn = add({
        id: `${item.id}::${b.id}`, kind: 'block', item, block: b, parent: card, children: [], rect: r,
        authW: size.w, authH: size.h, focus: r, focusMode: 'fit', reveal: [90, 150], depth: depth + 1,
      });
      if (b.type === 'lineage') addLineagePoints(bn, b, depth + 2);
      if (b.type === 'group') {
        // the blocks of a section, laid out in the section's own pixels
        for (const it of b.items) {
          const cs = blockSize(it.block);
          const cr = fitInto(sub(r, b.w, it), cs.w, cs.h, 'center');
          const cn = add({
            id: `${item.id}::${it.block.id}`, kind: 'block', item, block: it.block, parent: bn, children: [], rect: cr,
            authW: cs.w, authH: cs.h, focus: cr, focusMode: 'fit', reveal: [0, 0], depth: depth + 2,
          });
          if (it.block.type === 'lineage') addLineagePoints(cn, it.block, depth + 3);
        }
      }
    });
    return card;
  };

  const addLineagePoints = (bn: SceneNode, b: LineageBlock, depth: number) => {
    const s = bn.rect.w / bn.authW;
    for (const p of b.nodes) {
      if (!p.detail) continue;
      const w = POINT_DETAIL.w * POINT_DETAIL.scale;
      const h = POINT_DETAIL.h * POINT_DETAIL.scale;
      // a numbered pin sits on its spot (centred); a line point has its name and year underneath
      const dy = b.style === 'pins' ? 26 : POINT_DETAIL.dy;
      const r: Rect = { x: bn.rect.x + (p.x - w / 2) * s, y: bn.rect.y + (p.y + dy) * s, w: w * s, h: h * s };
      const focus: Rect = { x: r.x - r.w * 0.6, y: r.y - r.h * 0.9, w: r.w * 2.2, h: r.h * 2.1 };
      add({
        id: `${bn.id}::${p.id}`, kind: 'point', item: bn.item, block: b, pointId: p.id, parent: bn, children: [], rect: r,
        authW: POINT_DETAIL.w, authH: POINT_DETAIL.h, focus, focusMode: 'fit', reveal: [230, 330], depth,
      });
    }
  };

  /**
   * Lays out a nested timeline (used inside covers of events that contain other events).
   * Root eras use their own code below because they share one continuous axis.
   */
  const layoutFrame = (owner: SceneNode, region: Rect, ownerItem: TimelineItem, items: TimelineItem[], depth: number, isRoot: boolean) => {
    const sides = splitSides(items);
    const maxAspect = Math.max(...items.map((it) => coverAspect(it)));
    let frame: TimelineFrame;
    let cardW: number;
    if (orient === 'h') {
      const axisCross = region.y + region.h / 2;
      const axisGap = region.h * 0.07;
      const nSide = Math.max(sides[0].length, sides[1].length, 1);
      cardW = Math.min((region.w * 0.94) / nSide - region.w * 0.02, (region.h / 2 - axisGap) / maxAspect);
      frame = mkFrame(owner.id, depth, axisCross, region.x, region.x + region.w, ownerItem, region, cardW, isRoot);
      placeSide(frame, sides[0], -1, cardW, axisGap, owner, depth);
      placeSide(frame, sides[1], 1, cardW, axisGap, owner, depth);
    } else {
      const axisCross = region.x + region.w / 2;
      const axisGap = region.w * 0.04;
      const sumMain = Math.max(...sides.map((s) => s.reduce((acc, it) => acc + coverAspect(it), 0)), 1);
      const n = Math.max(sides[0].length, sides[1].length, 1);
      cardW = Math.min(region.w / 2 - axisGap * 1.5, (region.h * 0.94 - n * region.h * 0.02) / sumMain);
      frame = mkFrame(owner.id, depth, axisCross, region.y, region.y + region.h, ownerItem, region, cardW, isRoot);
      placeSide(frame, sides[0], -1, cardW, axisGap, owner, depth);
      placeSide(frame, sides[1], 1, cardW, axisGap, owner, depth);
    }
    frames.push(frame);
    owner.frame = frame;
  };

  const coverAspect = (it: TimelineItem) => {
    const L = coverLayout(it, orient, input.custom[it.id]);
    return L.h / L.w;
  };

  const mkFrame = (ownerId: string, depth: number, axisCross: number, mainLo: number, mainHi: number,
    owner: TimelineItem, region: Rect, cardSize: number, isRoot: boolean): TimelineFrame => ({
    ownerId, orient, depth, axisCross, mainLo, mainHi, t0: owner.start, t1: Math.max(owner.end, owner.start + 1),
    approxStart: owner.approxStart, approxEnd: owner.approxEnd, timePad: (mainHi - mainLo) * 0.04, color: owner.color, region, cardSize, markers: [], isRoot,
  });

  const timeToMain = (f: TimelineFrame, t: number) =>
    f.mainLo + f.timePad + ((t - f.t0) / (f.t1 - f.t0)) * (f.mainHi - f.mainLo - 2 * f.timePad);

  /** Places one side of cards along the axis and records their markers. */
  const placeSide = (f: TimelineFrame, items: TimelineItem[], side: -1 | 1, cardW: number, axisGap: number,
    owner: SceneNode, depth: number) => {
    if (!items.length) return;
    const ms = items.map((it) => {
      const s = Math.max(it.start, f.t0);
      const e = Math.min(it.end, f.t1);
      const m0 = timeToMain(f, s);
      const m1 = timeToMain(f, Math.max(s, e));
      return { it, m0, m1, isRange: it.isRange && m1 - m0 > 1e-9, clippedStart: it.start < f.t0, clippedEnd: it.end > f.t1 };
    });
    const lanes = assignLanes(ms.map((m) => ({ s: m.m0, e: m.isRange ? m.m1 : m.m0 })), (f.mainHi - f.mainLo) * 0.006);
    const anchors = ms.map((m) => (m.isRange ? (m.m0 + m.m1) / 2 : m.m0));
    const sizes = items.map((it) => (orient === 'h' ? cardW : cardW * coverAspect(it)));
    const gap = orient === 'h' ? cardW * 0.1 : cardW * 0.08;
    const centres = placeOnLine(anchors, sizes, gap, f.mainLo, f.mainHi);
    items.forEach((it, i) => {
      const hgt = cardW * coverAspect(it);
      let rect: Rect;
      if (orient === 'h') {
        rect = { x: centres[i] - cardW / 2, y: side < 0 ? f.axisCross - axisGap - hgt : f.axisCross + axisGap, w: cardW, h: hgt };
      } else {
        rect = { x: side < 0 ? f.axisCross - axisGap - cardW : f.axisCross + axisGap, y: centres[i] - hgt / 2, w: cardW, h: hgt };
      }
      addCard(it, rect, owner, side, depth);
      f.markers.push({
        nodeId: it.id, item: it, m0: ms[i].m0, m1: ms[i].m1, isRange: ms[i].isRange, ongoing: it.ongoing,
        approxStart: it.approxStart, approxEnd: it.approxEnd,
        clippedStart: ms[i].clippedStart, clippedEnd: ms[i].clippedEnd, side, lane: lanes[i], anchor: anchors[i],
      });
    });
  };

  // ── Root ──────────────────────────────────────────────────
  const root: SceneNode | null = null;
  const eras = input.eras;
  const eraNodes: SceneNode[] = [];
  let titleRect: Rect;
  let hub!: SceneNode;
  let home!: Rect;
  const nGuides = input.guides.length;

  if (orient === 'h') {
    const sqrt = eras.map((e) => Math.sqrt(Math.max(1, e.end - e.start)));
    const sqrtSum = sqrt.reduce((a, b) => a + b, 0);
    const sides = eras.map((e) => splitSides(e.children));
    const widths = eras.map((e, i) => {
      const nSide = Math.max(sides[i][0].length, sides[i][1].length, 1);
      return Math.max(nSide * H.cardW * 1.14 + 200, (H.baseLength * sqrt[i]) / sqrtSum);
    });
    const maxH = (side: 0 | 1) =>
      Math.max(H.cardW * 0.625, ...eras.flatMap((_, i) => sides[i][side].map((it) => H.cardW * coverAspect(it))));
    const maxA = maxH(0);
    const maxB = maxH(1);
    const axisY = H.headerH + 60 + maxA + H.axisGap;
    const stripH = axisY + H.axisGap + maxB + 160;
    let x = 0;
    eras.forEach((era, i) => {
      const w = widths[i];
      const rect: Rect = { x, y: 0, w, h: stripH };
      const en = add({
        id: era.id, kind: 'era', item: era, parent: root, children: [], rect, authW: w / H.eraScale, authH: stripH / H.eraScale,
        focus: rect, focusMode: 'fit', reveal: [0, 0], depth: 0,
      });
      eraNodes.push(en);
      const f = mkFrame(era.id, 1, axisY, x, x + w, era, rect, H.cardW, true);
      f.timePad = Math.min(w * 0.05, 260);
      placeSide(f, sides[i][0], -1, H.cardW, H.axisGap, en, 1);
      placeSide(f, sides[i][1], 1, H.cardW, H.axisGap, en, 1);
      frames.push(f);
      en.frame = f;
      x += w;
    });
    const total = x;
    titleRect = { x: total * 0.04, y: -1900, w: H.titleW, h: H.titleW * (TITLE_AUTH_H.h / TITLE_AUTH_H.w) };
    // The hub sits beside the title. Its guides are laid out 2 × 2 inside it and open out of it
    // (towards the four corners) when zooming in.
    const cell = { w: 1600, h: Math.max(...input.guides.map((g) => guideAuthSize(g.items.length, 'h').h)) };
    const cols = 2;
    const rows = Math.ceil(nGuides / cols);
    const gapX = cell.w * 0.1;
    const gapY = cell.h * 0.16;
    const gridW = cols * cell.w + (cols - 1) * gapX;
    const gridH = rows * cell.h + (rows - 1) * gapY;
    const areaX = titleRect.x + titleRect.w + 700;
    const areaW = total * 0.985 - areaX;
    const areaY = -2050;
    const areaH = -380 - areaY;
    const s = Math.min(areaW / gridW, areaH / gridH);
    const hubRect: Rect = { x: areaX + (areaW - gridW * s) / 2, y: areaY + (areaH - gridH * s) / 2, w: gridW * s, h: gridH * s };
    const hs = hubAuthSize(nGuides, 'h', hubRect.w / hubRect.h);
    hub = add({
      id: HUB_ID, kind: 'hub', parent: root, children: [], rect: hubRect, authW: hs.w, authH: hs.h,
      focus: hubRect, focusMode: 'fit', reveal: [0, 0], depth: 0,
    });
    input.guides.forEach((g, i) => {
      const sz = guideAuthSize(g.items.length, 'h');
      const cx = hubRect.x + (i % cols) * (cell.w + gapX) * s;
      const cy = hubRect.y + Math.floor(i / cols) * (cell.h + gapY) * s;
      const r: Rect = { x: cx, y: cy, w: sz.w * s, h: sz.h * s };
      add({
        id: `guia:${g.id}`, kind: 'guide', guideId: g.id, parent: hub, children: [], rect: r, authW: sz.w, authH: sz.h,
        focus: r, focusMode: 'fit', reveal: [0, 0], depth: 1,
      });
    });
    home = rectUnion([titleRect, hubRect, ...eraNodes.map((e) => e.rect)]);
  } else {
    // Phone: the hub sits under the title; the guides themselves stay after the last era.
    const hs = hubAuthSize(nGuides, 'v', 1);
    const hubRect: Rect = { x: 0, y: V.titleH - 40, w: V.width, h: (V.width * hs.h) / hs.w };
    hub = add({
      id: HUB_ID, kind: 'hub', parent: root, children: [], rect: hubRect, authW: hs.w, authH: hs.h,
      focus: hubRect, focusMode: 'top', reveal: [0, 0], depth: 0,
    });
    let y = hubRect.y + hubRect.h + 120;
    home = { x: 0, y: 0, w: V.width, h: y + 420 };
    eras.forEach((era) => {
      const sides = splitSides(era.children);
      const sideLen = (s: TimelineItem[]) => s.reduce((acc, it) => acc + V.cardW * coverAspect(it) * 1.1, 0);
      const contentLen = Math.max(sideLen(sides[0]), sideLen(sides[1]), 600) + 200;
      const h = V.headerH + contentLen + 120;
      const rect: Rect = { x: 0, y, w: V.width, h };
      const en = add({
        id: era.id, kind: 'era', item: era, parent: root, children: [], rect, authW: V.width / V.eraScale, authH: h / V.eraScale,
        focus: rect, focusMode: 'top', reveal: [0, 0], depth: 0,
      });
      eraNodes.push(en);
      const lo = y + V.headerH;
      const f = mkFrame(era.id, 1, V.width / 2, lo, lo + contentLen, era, rect, V.cardW, true);
      f.timePad = 100;
      placeSide(f, sides[0], -1, V.cardW, V.axisGap, en, 1);
      placeSide(f, sides[1], 1, V.cardW, V.axisGap, en, 1);
      frames.push(f);
      en.frame = f;
      y += h;
    });
    titleRect = { x: 0, y: 0, w: V.width, h: V.titleH - 80 };
    let gy = y + 200;
    input.guides.forEach((g) => {
      const sz = guideAuthSize(g.items.length, 'v');
      const r: Rect = { x: 0, y: gy, w: V.width, h: (V.width * sz.h) / sz.w };
      add({
        id: `guia:${g.id}`, kind: 'guide', guideId: g.id, parent: root, children: [], rect: r, authW: sz.w, authH: sz.h,
        focus: r, focusMode: 'top', reveal: [0, 0], depth: 0,
      });
      gy += r.h + V.guideGap;
    });
  }

  const titleAuth = orient === 'h' ? TITLE_AUTH_H : { w: 1000, h: (V.titleH - 80) };
  add({
    id: '::titulo', kind: 'title', parent: root, children: [], rect: titleRect, authW: titleAuth.w, authH: titleAuth.h,
    focus: titleRect, focusMode: 'fit', reveal: [0, 0], depth: 0,
  });

  // Render order: eras, title, guides first; then everything else by depth (parents before children).
  const order: Record<SceneKind, number> = { era: 0, title: 1, hub: 1, guide: 1, event: 2, read: 3, block: 3, point: 4 };
  nodes.sort((a, b) => order[a.kind] - order[b.kind] || a.depth - b.depth);

  const bounds = rectUnion(nodes.filter((n) => n.depth === 0).map((n) => n.rect));
  const minFocusWidth = Math.min(...nodes.map((n) => n.focus.w));
  return {
    orient, nodes, byId: new Map(nodes.map((n) => [n.id, n])), frames, bounds, home,
    homeMode: orient === 'h' ? 'fit' : 'top', minFocusWidth, hub, hubMorph: orient === 'h',
  };
}

/** A rectangle grown (or shrunk) around its centre. */
function scaleAround(r: Rect, f: number): Rect {
  const w = r.w * f;
  const h = r.h * f;
  return { x: r.x + (r.w - w) / 2, y: r.y + (r.h - h) / 2, w, h };
}

/** Alternates children between the two sides of the axis, chronologically. */
function splitSides(items: TimelineItem[]): [TimelineItem[], TimelineItem[]] {
  const a: TimelineItem[] = [];
  const b: TimelineItem[] = [];
  items.forEach((it, i) => (i % 2 === 0 ? a : b).push(it));
  return [a, b];
}

/** Rough authored size of a reading panel before it can be measured. */
function estimateReadSize(item: TimelineItem, orient: Orientation): { w: number; h: number } {
  const chars = item.fullDesc.replace(/<[^>]+>/g, '').length;
  if (orient === 'h') {
    const lines = chars / 62;
    const h1 = lines * 40 + 200;
    const cols = Math.max(1, Math.min(3, Math.round(Math.sqrt((2.5 * h1) / 860))));
    return { w: cols * 860 + (cols - 1) * 80, h: h1 / cols + 120 };
  }
  return { w: 760, h: (chars / 42) * 48 + 200 };
}
