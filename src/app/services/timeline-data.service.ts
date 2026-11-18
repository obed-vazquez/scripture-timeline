import { Injectable, isDevMode } from '@angular/core';
import { TIMELINE_ITEMS, TIMELINE_TAGS } from '../data/timeline.data';
import { TIMELINE_CUSTOM } from '../data/timeline.custom';
import { TimelineItem, TimelineTag } from '../models/timeline.models';
import { Customization, GuideDef } from '../models/custom.models';
import { parseYearString } from '../utils/parse-year.util';

export interface Guide extends GuideDef {
  entries: TimelineItem[];
}

/** Turns the flat list of timeline.data.ts into the tree used by the app. */
@Injectable({ providedIn: 'root' })
export class TimelineDataService {
  readonly tags: TimelineTag[] = TIMELINE_TAGS.map((t) => ({ ...t }));
  readonly tagMap = new Map(this.tags.map((t) => [t.id, t]));
  readonly custom: Customization = TIMELINE_CUSTOM;
  readonly eras: TimelineItem[];
  readonly byId = new Map<string, TimelineItem>();
  /** Every non-era item, depth-first in chronological order. */
  readonly events: TimelineItem[] = [];
  readonly guides: Guide[];

  constructor() {
    const problems: string[] = [];
    const items: TimelineItem[] = TIMELINE_ITEMS.map((d) => {
      const y = parseYearString(d.year);
      const end = y.end ?? (y.ongoing ? new Date().getFullYear() : y.start);
      const item: TimelineItem = {
        id: d.id,
        kind: d.era ? 'era' : 'event',
        yearLabel: d.yearText ?? d.year,
        start: Math.min(y.start, end),
        end: Math.max(y.start, end),
        isRange: y.end !== null || y.ongoing,
        ongoing: y.ongoing,
        approxStart: y.approxStart,
        approxEnd: y.approxEnd,
        title: d.title,
        shortDesc: d.shortDesc ?? '',
        fullDesc: d.fullDesc ?? '',
        image: d.image ?? '',
        tags: (d.tags ?? []).filter((t) => {
          if (!this.tagMap.has(t)) problems.push(`"${d.id}": categoría desconocida "${t}"`);
          return this.tagMap.has(t);
        }),
        color: d.color ?? '',
        pendingReview: !!d.pendingReview,
        parent: null,
        children: [],
        era: null as unknown as TimelineItem,
        depth: 0,
        eraIndex: 0,
      };
      if (this.byId.has(item.id)) problems.push(`id repetido: "${item.id}"`);
      this.byId.set(item.id, item);
      return item;
    });

    this.eras = items.filter((i) => i.kind === 'era').sort((a, b) => a.start - b.start);
    this.eras.forEach((e, i) => {
      e.era = e;
      e.eraIndex = i + 1;
    });

    for (const d of TIMELINE_ITEMS) {
      const item = this.byId.get(d.id)!;
      if (item.kind === 'era') continue;
      let parent: TimelineItem | undefined;
      if (d.parent) {
        parent = this.byId.get(d.parent);
        if (!parent) problems.push(`"${d.id}": parent "${d.parent}" no existe`);
      }
      parent ??= this.eraFor(item.start);
      item.parent = parent;
      parent.children.push(item);
    }

    const finish = (node: TimelineItem, depth: number, era: TimelineItem) => {
      node.children.sort((a, b) => a.start - b.start || a.end - b.end);
      for (const c of node.children) {
        c.depth = depth;
        c.era = era;
        if (!c.color) c.color = this.tagMap.get(c.tags[0])?.color ?? era.color;
        this.events.push(c);
        finish(c, depth + 1, era);
      }
    };
    for (const era of this.eras) finish(era, 1, era);

    this.guides = this.custom.guides.map((g) => ({
      ...g,
      entries: g.items
        ? g.items.map((id) => this.byId.get(id)).filter((x): x is TimelineItem => !!x)
        : this.events.filter((e) => g.tag && e.tags.includes(g.tag)).sort((a, b) => a.start - b.start || a.end - b.end),
    }));

    for (const id of Object.keys(this.custom.events)) {
      if (!this.byId.has(id)) problems.push(`timeline.custom.ts: evento "${id}" no existe`);
    }
    if (problems.length && isDevMode()) console.error('[timeline] Problemas en los datos:\n' + problems.join('\n'));
  }

  get(id: string): TimelineItem | undefined {
    return this.byId.get(id);
  }

  tag(id: string): TimelineTag | undefined {
    return this.tagMap.get(id);
  }

  private eraFor(year: number): TimelineItem {
    const eras = this.eras;
    for (let i = 0; i < eras.length; i++) {
      const next = eras[i + 1];
      if (!next || year < next.start) return eras[i];
    }
    return eras[eras.length - 1];
  }
}
