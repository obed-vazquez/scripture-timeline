// Types for timeline.custom.ts (maintained by the implementer, following the user's instructions).

export interface VideoBlock {
  type: 'video';
  id: string;
  /** YouTube video id (the part after youtu.be/ or ?v=). */
  youtube: string;
  title: string;
  caption?: string;
}

export interface LineageNode {
  id: string;
  label: string;
  year: string;
  /** Position inside the chart, in chart pixels (chart is 1400 × 800). */
  x: number;
  y: number;
  /** Short text revealed when zooming into the point. */
  detail?: string;
  /** Event the point links to. */
  event?: string;
  /** Hidden until a presentation step shows it (only while presenting). */
  startsHidden?: boolean;
}

/** A picture under a chart (a map, a title page…). Positions are in chart pixels. */
export interface ChartImage {
  src: string;
  alt: string;
  /** Box the picture fills inside the chart. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Part of the picture shown (in the picture's own pixels); omitted = the whole picture. */
  crop?: { x: number; y: number; w: number; h: number; naturalW: number; naturalH: number };
  /** Credit shown under the picture (licence). */
  credit?: string;
}

export interface LineageBlock {
  type: 'lineage';
  id: string;
  title: string;
  caption?: string;
  /**
   * 'line' (default): points joined by lines, with name and year under each point.
   * 'pins': numbered pins over the picture, with their list beside it.
   */
  style?: 'line' | 'pins';
  image?: ChartImage;
  nodes: LineageNode[];
  edges: [string, string][];
}

/** How a witness treats a reading: ✅ same · ❌ verse missing · ➖ part missing · ⚠️ changed · ➕ added · ❓ not preserved. */
export type CompareMark = 'same' | 'missing' | 'partial' | 'changed' | 'added' | 'lost';

export interface CompareRow {
  id: string;
  /** Reference, e.g. "1 Jn 5.7–8". */
  ref: string;
  /** The reading of the first witness (the Majority Text). */
  text: string;
  /** One mark per witness, in the order of `witnesses`. */
  marks: CompareMark[];
  /** Footnote mark per witness ('' = none), e.g. '†' = included with a footnote. */
  notes?: string[];
  /** Short explanation, readable when zooming into the row. */
  note?: string;
  /** Hidden until a presentation step shows it (only while presenting). */
  startsHidden?: boolean;
}

/** A table that compares several witnesses (manuscripts, versions) on a few readings. */
export interface CompareBlock {
  type: 'compare';
  id: string;
  title: string;
  caption?: string;
  witnesses: { id: string; label: string; detail: string }[];
  rows: CompareRow[];
  /** Meaning of the footnote marks used in the rows. */
  footnote?: string;
}

export interface ChronicleEntry {
  id: string;
  year: string;
  text: string;
  /** Doubt about the entry (shown in small type). */
  note?: string;
  /** Event the entry opens. */
  event?: string;
}

/** A short chronology in two columns (for example, the story told in a video). */
export interface ChronicleBlock {
  type: 'chronicle';
  id: string;
  title: string;
  caption?: string;
  entries: ChronicleEntry[];
}

/** A card of a relations map: an event and the one or two ideas it stands for. */
export interface RelationNode {
  id: string;
  /** Event the card opens. */
  event: string;
  label: string;
  year: string;
  /** One or two short lines: what the event stands for in this map. */
  points: string[];
  /** Short note in small type (a doubt, a nuance). */
  note?: string;
  /** Centre (x) and top (y) of the card, in chart pixels (chart is 1400 × 1100). */
  x: number;
  y: number;
  /** Drawn apart (dashed border): related by a coincidence, not by descent. */
  special?: boolean;
  /** Colour of the card; the event's colour by default. */
  color?: string;
}

/**
 * An arrow between two cards. 'leads' (default): one led to the other; 'against': an answer that
 * condemns; 'coincides': the same idea, without one coming from the other (dashed).
 */
export interface RelationEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  kind?: 'leads' | 'against' | 'coincides';
}

/** Two facing lists joined item by item (e.g. five articles and the five points that answer them). */
export interface RelationPairs {
  left: { title: string; event?: string };
  right: { title: string; event?: string };
  leftItems: { id: string; label: string; sub: string }[];
  rightItems: { id: string; label: string; sub: string }[];
  /** [left id, right id] */
  links: [string, string][];
  note?: string;
}

/** A map of how a few events relate (who answers whom), with an optional point-by-point pairing. */
export interface RelationsBlock {
  type: 'relations';
  id: string;
  title: string;
  caption?: string;
  nodes: RelationNode[];
  edges: RelationEdge[];
  /** What each kind of line means, at (x, y) in chart pixels. */
  legend?: { x: number; y: number; items: { kind: 'leads' | 'against' | 'coincides'; label: string }[] };
  pairs?: RelationPairs;
}

/** One block placed inside a group, in the group's own pixels. */
export interface GroupItem {
  block: VideoBlock | LineageBlock | CompareBlock | ChronicleBlock | RelationsBlock;
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * A closed section: from afar it shows one picture and a title; zooming into it, the picture
 * gives way to the blocks it holds.
 */
export interface GroupBlock {
  type: 'group';
  id: string;
  title: string;
  caption?: string;
  cover: { src: string; alt: string };
  /** Size of the open section, in its own pixels. */
  w: number;
  h: number;
  items: GroupItem[];
}

export type BlockDef = VideoBlock | LineageBlock | CompareBlock | ChronicleBlock | RelationsBlock | GroupBlock;

/** Extra presentation step run inside an event after arriving at it. */
export interface PresentationStep {
  /** Block id (or block-id/point-id) to focus. Omitted = stay on the event. */
  focus?: string;
  /** Hidden objects (block or point ids) that appear at this step. */
  show?: string[];
}

export interface EventCustom {
  blocks?: BlockDef[];
  steps?: PresentationStep[];
}

export interface GuideDef {
  id: string;
  title: string;
  description: string;
  /** Builds the guide from every event with this category, in chronological order… */
  tag?: string;
  /** …or from this explicit list of event ids, in this order. */
  items?: string[];
  color: string;
}

export interface Customization {
  guides: GuideDef[];
  /** Presentation order (event or era ids). null = chronological. */
  tour: string[] | null;
  events: Record<string, EventCustom>;
}
