import { Injectable, computed, inject, signal } from '@angular/core';
import { TimelineDataService } from './timeline-data.service';
import { FilterService } from './filter.service';
import { SceneKind } from '../engine/scene';
import { TimelineItem } from '../models/timeline.models';

export interface PathEntry {
  id: string;
  kind: SceneKind;
  item?: TimelineItem;
  guideId?: string;
}

export interface TourStep {
  /** Scene node to frame. */
  node: string;
  /** Event the step belongs to. */
  event?: string;
  /** Hidden objects shown from this step on (point ids of the event's charts). */
  show?: string[];
  /** The step's node is a video: it plays on arrival. */
  play?: boolean;
}

/** The scene node `id` is `root` or lies inside it ("root::leer", "root::block"…). */
const within = (id: string, root: string) => id === root || id.startsWith(`${root}::`);

/** What the canvas exposes to the rest of the app. Implemented by the stage component. */
export interface StageEngine {
  flyTo(nodeId: string, opts?: { instant?: boolean }): Promise<void>;
  home(opts?: { instant?: boolean }): Promise<void>;
  zoomBy(factor: number): void;
  hasNode(id: string): boolean;
}

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private data = inject(TimelineDataService);
  private filters = inject(FilterService);
  private engine: StageEngine | null = null;

  /** Where the visitor is: from the outermost frame to the innermost one on screen. */
  readonly path = signal<PathEntry[]>([]);
  readonly activeGuide = signal<string | null>(null);
  readonly tourIndex = signal(-1);
  /** Objects hidden by presentation steps (keys "<event>:<point>"). */
  readonly hidden = signal<Set<string>>(new Set());
  readonly reviewMode = signal(false);
  /** The search box (Ctrl+F) is open. */
  readonly searchOpen = signal(false);

  readonly current = computed(() => {
    const p = this.path();
    return p.length ? p[p.length - 1] : null;
  });
  readonly currentEra = computed(() => this.path().find((p) => p.kind === 'era')?.item ?? this.current()?.item?.era ?? null);
  readonly currentEvent = computed(() => {
    const p = this.path();
    for (let i = p.length - 1; i >= 0; i--) if (p[i].item && p[i].item!.kind === 'event') return p[i].item!;
    return null;
  });
  readonly atHome = computed(() => this.path().length === 0);

  readonly guide = computed(() => this.data.guides.find((g) => g.id === this.activeGuide()) ?? null);

  /** Steps of the active path: the guide's points, or the whole presentation. */
  readonly steps = computed<TourStep[]>(() => {
    this.filters.version();
    const g = this.guide();
    const steps: TourStep[] = [];
    // every event has two stops, its header view and its detail view, then its charts' steps
    const pushEvent = (e: TimelineItem) => {
      if (!this.filters.isVisible(e)) return;
      steps.push({ node: e.id, event: e.id });
      steps.push({ node: `${e.id}::leer`, event: e.id });
      for (const s of this.data.custom.events[e.id]?.steps ?? []) {
        steps.push({ node: s.focus ? `${e.id}::${s.focus}` : e.id, event: e.id, show: s.show, play: s.play });
      }
    };
    if (g) {
      g.entries.forEach(pushEvent);
      return steps;
    }
    const order = this.data.custom.tour;
    if (order) {
      for (const id of order) {
        const it = this.data.get(id);
        if (!it) continue;
        if (it.kind === 'era') steps.push({ node: it.id });
        else pushEvent(it);
      }
      return steps;
    }
    const walk = (it: TimelineItem) => {
      pushEvent(it);
      if (this.filters.isVisible(it)) it.children.forEach(walk);
    };
    for (const era of this.data.eras) {
      steps.push({ node: era.id });
      era.children.forEach(walk);
    }
    return steps;
  });

  register(engine: StageEngine | null): void {
    this.engine = engine;
  }

  // ── movement ──────────────────────────────────────────────

  goTo(nodeId: string, opts: { instant?: boolean; keepPresentation?: boolean } = {}): Promise<void> {
    if (!opts.keepPresentation) this.hidden.set(new Set());
    return this.engine?.flyTo(nodeId, opts) ?? Promise.resolve();
  }

  home(): void {
    this.hidden.set(new Set());
    this.engine?.home();
  }

  zoomIn(): void {
    this.engine?.zoomBy(1.8);
  }

  zoomOut(): void {
    this.engine?.zoomBy(1 / 1.8);
  }

  /** One level out: from a detail to its event, from an event to its era, from an era to the overview. */
  up(): void {
    const p = this.path();
    if (!p.length) return;
    const cur = p[p.length - 1];
    if (cur.kind === 'era' || cur.kind === 'title' || cur.kind === 'hub' || (cur.kind === 'guide' && p.length < 2)) {
      this.home();
      return;
    }
    if (p.length >= 2) this.goTo(p[p.length - 2].id);
    else this.home();
  }

  next(): void {
    this.step(1);
  }

  prev(): void {
    this.step(-1);
  }

  private step(dir: 1 | -1): void {
    const steps = this.steps();
    if (!steps.length) return;
    let i = this.tourIndex() + dir;
    if (i < 0) {
      this.tourIndex.set(-1);
      if (this.guide()) this.goTo(`guia:${this.guide()!.id}`);
      else this.home();
      return;
    }
    if (i >= steps.length) {
      // after the last point: back to the start, as if the page had just been opened
      this.tourIndex.set(-1);
      if (this.guide()) this.goTo(`guia:${this.guide()!.id}`);
      else this.home();
      return;
    }
    while (i >= 0 && i < steps.length && this.engine && !this.engine.hasNode(steps[i].node)) i += dir;
    if (i < 0 || i >= steps.length) return;
    this.tourIndex.set(i);
    this.hidden.set(this.hiddenAt(i, steps));
    this.tourFlight = true;
    const step = steps[i];
    this.engine?.flyTo(step.node).then(() => {
      // a video step plays once the camera is on it (if the visitor is still at that step)
      if (step.play && this.tourIndex() === i) this.playRequest.set(step.node);
    });
  }

  /** A video block (scene node id) the presentation asks to play; the block plays it and clears it. */
  readonly playRequest = signal<string | null>(null);

  /** Objects still hidden when the presentation is at step i. */
  private hiddenAt(i: number, steps: TourStep[]): Set<string> {
    const ev = steps[i].event;
    const out = new Set<string>();
    if (!ev) return out;
    const blocks = this.data.custom.events[ev]?.blocks ?? [];
    for (const b of blocks) {
      if (b.type === 'lineage') for (const n of b.nodes) if (n.startsHidden) out.add(`${ev}:${n.id}`);
      if (b.type === 'compare') for (const r of b.rows) if (r.startsHidden) out.add(`${ev}:${r.id}`);
    }
    for (let j = i; j >= 0 && steps[j].event === ev; j--) for (const s of steps[j].show ?? []) out.delete(`${ev}:${s}`);
    // arriving at the event itself (before its own steps) keeps everything hidden
    return out;
  }

  // ── links inside the content ──────────────────────────────

  /**
   * Where the visitor was before following a link inside the content (a chart, a text), so the
   * bottom bar can offer the way back. Cleared when the visitor leaves the event the link led to.
   */
  readonly returnTo = signal<{ origin: string; target: string; arrived: boolean } | null>(null);

  /** Follows a link inside the content to another event, remembering the way back. */
  jumpTo(target: string): void {
    const origin = this.current()?.id;
    if (origin && !within(origin, target)) this.returnTo.set({ origin, target, arrived: false });
    this.goTo(target);
  }

  goBack(): void {
    const back = this.returnTo();
    if (!back) return;
    this.returnTo.set(null);
    this.goTo(back.origin);
  }

  clearReturn(): void {
    this.returnTo.set(null);
  }

  // ── guides ────────────────────────────────────────────────

  openGuideItem(guideId: string, itemId: string): void {
    this.activeGuide.set(guideId);
    const idx = this.steps().findIndex((s) => s.node === itemId);
    this.tourIndex.set(idx);
    this.tourFlight = true;
    this.goTo(itemId);
  }

  backToGuide(): void {
    const g = this.activeGuide();
    if (g) this.goTo(`guia:${g}`);
  }

  exitGuide(): void {
    this.activeGuide.set(null);
    this.syncTourIndex();
  }

  // ── called by the stage when the camera stops ────────────

  setPath(path: PathEntry[]): void {
    this.path.set(path);
    // the way back after a link: offered while the visitor stays at the event the link led to
    const back = this.returnTo();
    if (back) {
      const inside = within(path[path.length - 1]?.id ?? '', back.target);
      if (inside && !back.arrived) this.returnTo.set({ ...back, arrived: true });
      else if (!inside && back.arrived) this.returnTo.set(null);
    }
    // arriving at a guide (or at the menu of guides) closes the guide in progress
    const last = path[path.length - 1];
    if (last && (last.kind === 'guide' || last.kind === 'hub') && this.activeGuide()) {
      this.activeGuide.set(null);
      this.tourIndex.set(-1);
    }
    const hidden = this.hidden();
    if (hidden.size) {
      const ev = [...hidden][0].split(':')[0];
      if (!path.some((p) => p.item?.id === ev)) this.hidden.set(new Set());
    }
    if (!this.tourFlight) this.syncTourIndex();
    this.tourFlight = false;
  }

  /** The visitor took the camera (drag, wheel, pinch). */
  userInteracted(): void {
    this.tourFlight = false;
  }

  private tourFlight = false;

  /** Keeps "next" continuing from the last point of the path the visitor reached (A54). */
  syncTourIndex(): void {
    const steps = this.steps();
    const p = this.path();
    for (let i = p.length - 1; i >= 0; i--) {
      const idx = steps.findIndex((s) => s.node === p[i].id);
      if (idx >= 0) {
        this.tourIndex.set(idx);
        return;
      }
    }
    if (!p.length) this.tourIndex.set(-1);
  }
}
