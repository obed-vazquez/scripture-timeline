// ─────────────────────────────────────────────────────────────
// Data as written in timeline.data.ts (user-editable, Spanish)
// ─────────────────────────────────────────────────────────────

export interface TimelineTagData {
  id: string;
  label: string;
  color: string;
}

export interface TimelineItemData {
  id: string;
  /** Marks a root era. */
  era?: boolean;
  /** Explicit container (another item id). Without it, the era is deduced from the year. */
  parent?: string;
  year: string;
  title: string;
  color?: string;
  tags?: string[];
  shortDesc?: string;
  fullDesc?: string;
  image?: string;
  pendingReview?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Resolved runtime model
// ─────────────────────────────────────────────────────────────

export type ItemKind = 'era' | 'event';

export interface TimelineItem {
  id: string;
  kind: ItemKind;
  /** Year label exactly as written in the data (Spanish). */
  yearLabel: string;
  start: number;
  /** Equal to start for single-year events. */
  end: number;
  isRange: boolean;
  ongoing: boolean;
  title: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  tags: string[];
  color: string;
  pendingReview: boolean;
  parent: TimelineItem | null;
  children: TimelineItem[];
  /** Root era this item belongs to (itself for eras). */
  era: TimelineItem;
  depth: number;
  /** 1-based era number (eras only). */
  eraIndex: number;
}

export interface TimelineTag {
  id: string;
  label: string;
  color: string;
}
