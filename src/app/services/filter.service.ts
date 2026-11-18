import { Injectable, computed, inject, signal } from '@angular/core';
import { TimelineDataService } from './timeline-data.service';
import { TimelineItem } from '../models/timeline.models';

export type FilterMode = 'or' | 'and';

/**
 * Category filters (OR / AND) and highlighting. State lives in the URL
 * (tags, mode, highlight) — the UrlStateService writes it.
 */
@Injectable({ providedIn: 'root' })
export class FilterService {
  private data = inject(TimelineDataService);
  readonly tags = this.data.tags;

  readonly activeTags = signal<Set<string>>(new Set(this.tags.map((t) => t.id)));
  readonly filterMode = signal<FilterMode>('or');
  readonly highlightedTags = signal<Set<string>>(new Set());

  /** Changes every time the filter changes; used to repaint. */
  readonly version = computed(() => {
    this.activeTags();
    this.filterMode();
    this.highlightedTags();
    return Symbol();
  });

  readonly allActive = computed(() => this.activeTags().size === this.tags.length);
  readonly hasHighlights = computed(() => this.highlightedTags().size > 0);

  restore(params: Record<string, string | undefined>): void {
    const valid = (s: string) => s.split(',').filter((t) => this.tags.some((tag) => tag.id === t));
    if (params['tags'] !== undefined) this.activeTags.set(new Set(valid(params['tags'] ?? '')));
    if (params['mode'] === 'and' || params['mode'] === 'or') this.filterMode.set(params['mode']);
    if (params['highlight']) this.highlightedTags.set(new Set(valid(params['highlight'])));
  }

  toggleTag(id: string): void {
    const s = new Set(this.activeTags());
    s.has(id) ? s.delete(id) : s.add(id);
    this.activeTags.set(s);
  }

  setAll(on: boolean): void {
    this.activeTags.set(new Set(on ? this.tags.map((t) => t.id) : []));
  }

  setMode(mode: FilterMode): void {
    this.filterMode.set(mode);
  }

  toggleHighlight(id: string): void {
    const s = new Set(this.highlightedTags());
    s.has(id) ? s.delete(id) : s.add(id);
    this.highlightedTags.set(s);
  }

  clearHighlights(): void {
    this.highlightedTags.set(new Set());
  }

  /** Events only; eras are always visible. An event is also hidden if its container is. */
  isVisible(item: TimelineItem): boolean {
    if (item.kind === 'era') return true;
    if (item.parent && item.parent.kind !== 'era' && !this.isVisible(item.parent)) return false;
    const active = this.activeTags();
    if (this.allActive()) return true;
    if (!active.size) return false;
    if (!item.tags.length) return true;
    return this.filterMode() === 'and'
      ? [...active].every((t) => item.tags.includes(t))
      : item.tags.some((t) => active.has(t));
  }

  isHighlighted(item: TimelineItem): boolean {
    const hl = this.highlightedTags();
    return hl.size > 0 && item.tags.some((t) => hl.has(t));
  }

  /** Visible events in chronological order (used by print). */
  visibleEvents(): TimelineItem[] {
    return this.data.events.filter((e) => this.isVisible(e)).sort((a, b) => a.start - b.start || a.end - b.end);
  }
}
