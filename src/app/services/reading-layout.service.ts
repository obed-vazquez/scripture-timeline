import { Injectable, signal } from '@angular/core';
import { Orientation } from '../engine/scene';

export interface ReadSize {
  w: number;
  h: number;
  cols: number;
}

/** Type size and columns of the full text in an event's detail view (wide screens). */
export interface DetailFit {
  font: number;
  cols: number;
}

/** Authored geometry of the reading panels of phones (the full text under the summary). */
export const READ_GEOMETRY: Record<Orientation, { col: number; gap: number; padX: number; padY: number; head: number }> = {
  h: { col: 860, gap: 90, padX: 70, padY: 60, head: 0 },
  v: { col: 760, gap: 0, padX: 60, padY: 50, head: 0 },
};

/**
 * Box of the full text inside the card (1600 × 1000) in the detail view of wide screens.
 * Mirrors canvas.css (.cd-body).
 */
export const DETAIL_BODY = { w: 1460, h: 676, gap: 56 };

/** Measured sizes of the reading texts, per event id. Filled by the stage. */
@Injectable({ providedIn: 'root' })
export class ReadingLayoutService {
  /** Phones: size of each reading panel. */
  readonly sizes = signal<Map<string, ReadSize>>(new Map());
  /** Wide screens: type size and columns that make each full text fit its card. */
  readonly detail = signal<Map<string, DetailFit>>(new Map());
}
