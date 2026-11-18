import { Injectable, signal } from '@angular/core';
import { Orientation } from '../engine/scene';

export interface ReadSize {
  w: number;
  h: number;
  cols: number;
}

/** Authored geometry of the reading panels (the full text of each event). */
export const READ_GEOMETRY: Record<Orientation, { col: number; gap: number; padX: number; padY: number; head: number }> = {
  h: { col: 860, gap: 90, padX: 70, padY: 60, head: 150 },
  v: { col: 760, gap: 0, padX: 60, padY: 60, head: 170 },
};

/** Measured sizes of the reading panels, per event id. Filled by the stage. */
@Injectable({ providedIn: 'root' })
export class ReadingLayoutService {
  readonly sizes = signal<Map<string, ReadSize>>(new Map());
}
