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

export interface LineageBlock {
  type: 'lineage';
  id: string;
  title: string;
  caption?: string;
  nodes: LineageNode[];
  edges: [string, string][];
}

export type BlockDef = VideoBlock | LineageBlock;

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
