import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Injector, NgZone, OnDestroy, afterNextRender,
  computed, effect, inject, input, signal, untracked, viewChild,
} from '@angular/core';
import { Camera, SettleReason } from '../../engine/camera';
import { Scene, SceneNode, Orientation, buildScene, coverLayout, TimelineFrame } from '../../engine/scene';
import { Insets, containsPoint, smoothstep } from '../../engine/geometry';
import { frameAlpha, paint, PaintColors } from '../../engine/painter';
import { TimelineDataService } from '../../services/timeline-data.service';
import { I18nService } from '../../services/i18n.service';
import { FilterService } from '../../services/filter.service';
import { ThemeService } from '../../services/theme.service';
import { NavigationService, PathEntry } from '../../services/navigation.service';
import { READ_GEOMETRY, ReadSize, ReadingLayoutService } from '../../services/reading-layout.service';
import { CoverComponent, ReadPanelComponent } from '../nodes/cover.component';
import { EraHeaderComponent, GuideMenuComponent, TitleBlockComponent } from '../nodes/frame-nodes.component';
import { LineageBlockComponent, PointDetailComponent, VideoBlockComponent } from '../nodes/blocks.component';
import { themed } from '../../utils/color.util';

interface ElState {
  shown: boolean;
  tf: string;
  a: number;
  rv: number;
  self: number;
  faint: boolean;
}

const BASE_KINDS = new Set(['era', 'title', 'guide']);

/**
 * The full-screen canvas (A44). Positions every object of the scene for the current camera,
 * fades objects in and out with the zoom (Zoom Reveal, A31) and paints the axes.
 */
@Component({
  selector: 'tl-stage',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CoverComponent, ReadPanelComponent, EraHeaderComponent, TitleBlockComponent, GuideMenuComponent,
    VideoBlockComponent, LineageBlockComponent, PointDetailComponent,
  ],
  template: `
    <div class="stage" #stage (click)="onClick($event)" [class.is-portrait]="orient() === 'v'">
      <div class="layer layer-base">
        @for (n of baseNodes(); track n.id) {
          <div class="node" [class]="'node k-' + n.kind" [attr.data-node]="n.id"
               [style.width.px]="n.authW" [style.height.px]="n.authH">
            @switch (n.kind) {
              @case ('era') { <tl-era-header [node]="n" [orient]="orient()" /> }
              @case ('title') { <tl-title-block [orient]="orient()" /> }
              @case ('guide') { <tl-guide-menu [node]="n" [orient]="orient()" /> }
            }
          </div>
        }
      </div>
      <canvas #canvas class="layer layer-canvas"></canvas>
      <div class="layer layer-nodes">
        @for (n of contentNodes(); track n.id) {
          <div class="node" [class]="'node k-' + n.kind" [attr.data-node]="n.id"
               [style.width.px]="n.authW" [style.height.px]="n.authH">
            @switch (n.kind) {
              @case ('event') { <tl-cover [node]="n" /> }
              @case ('read') { <tl-read-panel [node]="n" [orient]="orient()" /> }
              @case ('block') {
                @if (n.block?.type === 'video') { <tl-video-block [node]="n" /> }
                @else { <tl-lineage-block [node]="n" /> }
              }
              @case ('point') { <tl-point-detail [node]="n" /> }
            }
          </div>
        }
      </div>
      <div class="layer layer-labels">
        @for (n of labelNodes(); track n.id) {
          <button type="button" class="label" tabindex="-1" [attr.data-label]="n.id" [style.--c]="labelColor(n)">
            <span class="lb-year">{{ i18n.year(n.item!.yearLabel) }}</span>
            <span class="lb-title">{{ i18n.text(n.item!.id + '.title', n.item!.title) }}</span>
          </button>
        }
      </div>
    </div>
    <div class="measure" #measure aria-hidden="true"></div>
  `,
})
export class StageComponent implements AfterViewInit, OnDestroy {
  /** Node to open at start (from the link). */
  readonly initialNode = input<string | null>(null);

  readonly i18n = inject(I18nService);
  private data = inject(TimelineDataService);
  private filters = inject(FilterService);
  private theme = inject(ThemeService);
  private nav = inject(NavigationService);
  private reading = inject(ReadingLayoutService);
  private zone = inject(NgZone);
  private injector = inject(Injector);

  private stageRef = viewChild.required<ElementRef<HTMLDivElement>>('stage');
  private canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private measureRef = viewChild.required<ElementRef<HTMLDivElement>>('measure');

  readonly orient = signal<Orientation>(this.pickOrientation());
  readonly scene = computed<Scene>(() =>
    buildScene({
      orient: this.orient(),
      eras: this.data.eras,
      custom: this.data.custom.events,
      guides: this.data.guides.map((g) => ({ id: g.id, items: g.entries })),
      readSizes: this.reading.sizes(),
    }),
  );
  readonly baseNodes = computed(() => this.scene().nodes.filter((n) => BASE_KINDS.has(n.kind)));
  readonly contentNodes = computed(() => this.scene().nodes.filter((n) => !BASE_KINDS.has(n.kind)));
  readonly labelNodes = computed(() => this.scene().nodes.filter((n) => n.kind === 'event'));

  private camera!: Camera;
  private els = new Map<string, HTMLElement>();
  private labelEls = new Map<string, HTMLElement>();
  private labelSize = new Map<string, { w: number; h: number }>();
  private state = new WeakMap<HTMLElement, ElState>();
  private frameOf = new Map<string, TimelineFrame>();
  private cardAlpha = new Map<string, number>();
  private textAlpha = new Map<string, number>();
  private colors: PaintColors = { ink: '#eee', ink3: '#888', bg: '#111', accent: '#d4ae5c', dark: true };
  private raf = 0;
  private vw = 0;
  private vh = 0;
  private dpr = 1;
  private ro?: ResizeObserver;
  private ready = false;
  private lastSceneOrient: Orientation | null = null;
  private measuredFor = '';

  constructor() {
    // Scene rebuilt (new orientation, measured text, language) → re-collect elements and keep the view.
    effect(() => {
      const scene = this.scene();
      untracked(() => {
        this.frameOf.clear();
        for (const f of scene.frames) for (const m of f.markers) this.frameOf.set(m.nodeId, f);
        afterNextRender(() => this.onSceneRendered(scene), { injector: this.injector });
      });
    });
    // Theme → canvas colours.
    effect(() => {
      this.theme.dark();
      untracked(() => setTimeout(() => {
        this.readColors();
        this.requestRender();
      }));
    });
    // Filters / highlight / presentation-hidden objects → repaint and states.
    effect(() => {
      this.filters.version();
      this.nav.hidden();
      untracked(() => {
        this.applyFilterClasses();
        this.requestRender();
        this.afterFilterChange();
      });
    });
    // Language → re-measure the reading panels (text length changes).
    effect(() => {
      const lang = this.i18n.lang();
      untracked(() => {
        if (this.ready) this.measureSoon(lang);
      });
    });
  }

  ngAfterViewInit(): void {
    const stage = this.stageRef().nativeElement;
    this.zone.runOutsideAngular(() => {
      this.camera = new Camera(stage);
      this.camera.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.camera.onChange = () => this.requestRender();
      this.camera.onSettle = (reason) => this.onSettle(reason);
      this.camera.onUserStart = () => this.zone.run(() => this.nav.userInteracted());
      this.ro = new ResizeObserver(() => this.onResize());
      this.ro.observe(stage);
      document.addEventListener('keydown', this.onKey);
    });
    this.nav.register({
      flyTo: (id, o) => this.flyTo(id, o?.instant),
      home: (o) => this.home(o?.instant),
      zoomBy: (f) => this.camera.zoomBy(f),
      hasNode: (id) => this.scene().byId.has(id) && this.isNodeVisible(this.scene().byId.get(id)!),
    });
    this.readColors();
    this.measureVp();
  }

  ngOnDestroy(): void {
    this.camera?.destroy();
    this.ro?.disconnect();
    document.removeEventListener('keydown', this.onKey);
    this.nav.register(null);
    cancelAnimationFrame(this.raf);
  }

  labelColor(n: SceneNode): string {
    return themed(n.item!.color, this.theme.dark());
  }

  // ── scene lifecycle ───────────────────────────────────────

  private onSceneRendered(scene: Scene): void {
    const stage = this.stageRef().nativeElement;
    this.els.clear();
    stage.querySelectorAll<HTMLElement>('[data-node]').forEach((el) => this.els.set(el.dataset['node']!, el));
    this.labelEls.clear();
    stage.querySelectorAll<HTMLElement>('[data-label]').forEach((el) => this.labelEls.set(el.dataset['label']!, el));
    this.measureLabels();
    this.applyFilterClasses();
    const insets = this.insets();
    const minK = this.camera.fitTransform(scene.bounds, insets).k * 0.55;
    const maxK = this.camera.fitTransform({ x: 0, y: 0, w: scene.minFocusWidth, h: scene.minFocusWidth * 0.6 }, insets).k * 4;
    this.camera.setLimits(scene.bounds, minK, maxK);

    if (!this.ready) {
      this.ready = true;
      this.lastSceneOrient = scene.orient;
      const start = this.initialNode();
      if (start && scene.byId.has(start)) this.flyTo(start, true);
      else this.home(true);
      document.fonts?.ready.then(() => this.measureSoon(this.i18n.lang()));
      return;
    }
    // Keep the visitor where they were. Only a new orientation, or a change in the reading
    // panel being read, moves the camera; other re-layouts leave it alone.
    const target = this.lastTarget;
    if (scene.orient !== this.lastSceneOrient) {
      this.lastSceneOrient = scene.orient;
      this.restoreTarget(target);
    } else if (target !== 'home' && scene.byId.get(target)?.kind === 'read') {
      this.flyTo(target, true);
    }
    this.requestRender();
  }

  /** The last place the camera was sent to, or the deepest frame the visitor settled in. */
  private lastTarget: string = 'home';

  private restoreTarget(target: string): void {
    if (target !== 'home' && this.scene().byId.has(target)) this.flyTo(target, true);
    else this.home(true);
  }

  private measureTimer: ReturnType<typeof setTimeout> | undefined;
  private measureSoon(lang: string): void {
    clearTimeout(this.measureTimer);
    this.measureTimer = setTimeout(() => {
      const key = `${lang}|${this.orient()}`;
      if (key === this.measuredFor) return;
      this.measuredFor = key;
      this.measureReading();
    }, 30);
  }

  /** Lays out every reading panel off-screen to know its height (and its columns). */
  private measureReading(): void {
    const orient = this.orient();
    const g = READ_GEOMETRY[orient];
    const host = this.measureRef().nativeElement;
    host.innerHTML = '';
    const rows: { id: string; body: HTMLElement; aspect: number }[] = [];
    for (const it of this.data.events) {
      const art = document.createElement('article');
      art.className = 'read' + (orient === 'v' ? ' is-portrait' : '');
      const body = document.createElement('div');
      body.className = 'read-body';
      body.innerHTML = this.i18n.text(`${it.id}.fullDesc`, it.fullDesc);
      body.style.width = `${g.col}px`;
      art.appendChild(body);
      host.appendChild(art);
      const L = coverLayout(it, orient, this.data.custom.events[it.id]);
      rows.push({ id: it.id, body, aspect: L.read.w / L.read.h });
    }
    const out = new Map<string, ReadSize>();
    const h1 = rows.map((r) => r.body.offsetHeight);
    const cols = rows.map((r, i) =>
      orient === 'h' ? Math.max(1, Math.min(3, Math.round(Math.sqrt((r.aspect * (h1[i] + g.head)) / (g.col + g.padX))))) : 1,
    );
    rows.forEach((r, i) => {
      if (cols[i] > 1) {
        r.body.style.width = `${cols[i] * g.col + (cols[i] - 1) * g.gap}px`;
        r.body.style.columnCount = `${cols[i]}`;
        r.body.style.columnGap = `${g.gap}px`;
      }
    });
    rows.forEach((r, i) => {
      const bw = cols[i] * g.col + (cols[i] - 1) * g.gap;
      out.set(r.id, { w: bw + 2 * g.padX, h: g.head + r.body.offsetHeight + 2 * g.padY + 10, cols: cols[i] });
    });
    host.innerHTML = '';
    this.zone.run(() => this.reading.sizes.set(out));
  }

  private measureLabels(): void {
    const els = [...this.labelEls.entries()];
    for (const [, el] of els) {
      el.style.display = 'block';
      el.style.opacity = '0';
    }
    for (const [id, el] of els) this.labelSize.set(id, { w: el.offsetWidth, h: el.offsetHeight });
    for (const [, el] of els) el.style.display = 'none';
  }

  // ── camera ────────────────────────────────────────────────

  private insets(): Insets {
    const phone = this.vw < 700;
    return phone ? { top: 62, right: 54, bottom: 128, left: 14 } : { top: 84, right: 84, bottom: 118, left: 48 };
  }

  private flyTo(id: string, instant = false): Promise<void> {
    const n = this.scene().byId.get(id);
    if (!n || !this.camera) return Promise.resolve();
    this.lastTarget = id;
    return this.camera.flyTo(n.focus, this.insets(), n.focusMode, { instant });
  }

  private home(instant = false): Promise<void> {
    const s = this.scene();
    this.lastTarget = 'home';
    return this.camera.flyTo(s.home, this.insets(), s.homeMode, { instant });
  }

  private onSettle(reason: SettleReason): void {
    const path = this.computePath();
    if (reason === 'user') this.lastTarget = path.length ? path[path.length - 1].id : 'home';
    this.zone.run(() => this.nav.setPath(path));
  }

  /** The chain of frames the visitor is inside, from the outermost to the innermost. */
  private computePath(): PathEntry[] {
    const scene = this.scene();
    const t = this.camera.t;
    const ins = this.insets();
    const aw = this.vw - ins.left - ins.right;
    const ah = this.vh - ins.top - ins.bottom;
    // At the overview there is no "current" frame (the bottom bar stays empty, A48).
    const ht = this.camera.fitTransform(scene.home, ins, scene.homeMode);
    if (Math.abs(Math.log(t.k / ht.k)) < 0.06 && Math.abs(t.x - ht.x) < 60 && Math.abs(t.y - ht.y) < 60) return [];
    const [cx, cy] = t.invert([ins.left + aw / 2, ins.top + ah / 2]);
    const entered = (n: SceneNode) =>
      n.kind !== 'title' &&
      containsPoint(n.rect, cx, cy) &&
      (n.rect.w * t.k >= aw * 0.42 || n.rect.h * t.k >= ah * 0.55) &&
      this.isNodeVisible(n);
    let level = scene.nodes.filter((n) => n.parent === null);
    const path: PathEntry[] = [];
    for (;;) {
      const hit = level.filter(entered).sort((a, b) => a.rect.w - b.rect.w)[0];
      if (!hit) break;
      path.push({ id: hit.id, kind: hit.kind, item: hit.item, guideId: hit.guideId });
      level = hit.children;
    }
    return path;
  }

  private isNodeVisible(n: SceneNode): boolean {
    if (n.kind === 'point' && this.nav.hidden().has(`${n.item!.id}:${n.pointId}`)) return false;
    return !n.item || n.item.kind === 'era' || this.filters.isVisible(n.item);
  }

  /** If the event on screen was just filtered out, step back to its era (A74). */
  private afterFilterChange(): void {
    if (!this.ready) return;
    const cur = this.nav.currentEvent();
    if (cur && !this.filters.isVisible(cur)) this.flyTo(cur.era.id);
  }

  // ── input ─────────────────────────────────────────────────

  onClick(ev: MouseEvent): void {
    const target = ev.target as HTMLElement;
    if (target.closest('a[href]')) return;
    const label = target.closest<HTMLElement>('[data-label]');
    if (label) {
      this.nav.goTo(label.dataset['label']!);
      return;
    }
    const nodeEl = target.closest<HTMLElement>('[data-node]');
    if (!nodeEl) {
      this.nav.up();
      return;
    }
    const id = nodeEl.dataset['node']!;
    const n = this.scene().byId.get(id);
    if (!n || n.kind === 'title') return;
    if (this.nav.current()?.id === id) return;
    this.nav.goTo(id);
  }

  private onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const run = (f: () => void) => {
      e.preventDefault();
      this.zone.run(f);
    };
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
        return run(() => this.nav.next());
      case ' ':
        if (t && t.tagName === 'BUTTON') return;
        return run(() => this.nav.next());
      case 'ArrowLeft':
      case 'PageUp':
        return run(() => this.nav.prev());
      case 'Escape':
      case 'Backspace':
        return run(() => this.nav.up());
      case 'Home':
        return run(() => this.nav.home());
      case '+':
      case '=':
        return run(() => this.nav.zoomIn());
      case '-':
      case '_':
        return run(() => this.nav.zoomOut());
    }
  };

  private onResize(): void {
    this.measureVp();
    const o = this.pickOrientation();
    if (o !== this.orient()) {
      this.zone.run(() => this.orient.set(o));
      this.measureSoon(this.i18n.lang());
    } else if (this.ready) {
      this.restoreTarget(this.lastTarget);
    }
    this.requestRender();
  }

  private measureVp(): void {
    const stage = this.stageRef().nativeElement;
    this.vw = stage.clientWidth;
    this.vh = stage.clientHeight;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    const c = this.canvasRef().nativeElement;
    c.width = Math.round(this.vw * this.dpr);
    c.height = Math.round(this.vh * this.dpr);
    c.style.width = `${this.vw}px`;
    c.style.height = `${this.vh}px`;
  }

  private pickOrientation(): Orientation {
    return window.innerWidth / Math.max(1, window.innerHeight) < 0.8 ? 'v' : 'h';
  }

  private readColors(): void {
    const cs = getComputedStyle(document.documentElement);
    const v = (name: string, fb: string) => cs.getPropertyValue(name).trim() || fb;
    this.colors = {
      ink: v('--ink', '#ece5d8'),
      ink3: v('--ink-3', '#8a8274'),
      bg: v('--bg', '#101216'),
      accent: v('--accent', '#d4ae5c'),
      dark: this.theme.dark(),
    };
  }

  private applyFilterClasses(): void {
    const any = this.filters.hasHighlights();
    for (const n of this.scene().nodes) {
      const el = this.els.get(n.id);
      if (!el || !n.item || n.item.kind === 'era') continue;
      const out = !this.filters.isVisible(n.item);
      const hl = any && this.filters.isHighlighted(n.item);
      el.classList.toggle('is-out', out);
      el.classList.toggle('is-hl', hl);
      el.classList.toggle('is-dim', any && !hl && !out);
    }
  }

  // ── rendering ─────────────────────────────────────────────

  private requestRender(): void {
    if (this.raf || !this.camera) return;
    this.raf = requestAnimationFrame(this.render);
  }

  private render = () => {
    this.raf = 0;
    if (!this.ready) return;
    const scene = this.scene();
    const t = this.camera.t;
    const k = t.k;
    const vw = this.vw;
    const vh = this.vh;
    const alpha = new Map<string, number>();
    this.cardAlpha.clear();
    const any = this.filters.hasHighlights();

    for (const n of scene.nodes) {
      const el = this.els.get(n.id);
      if (!el) continue;
      const r = n.rect;
      const sw = r.w * k;
      const sh = r.h * k;
      const x = r.x * k + t.x;
      const y = r.y * k + t.y;
      const parentA = n.parent ? (alpha.get(n.parent.id) ?? 0) : 1;
      let a = 1;
      if (n.kind === 'event') a = smoothstep(Math.max(n.reveal[0], vw * 0.055), Math.max(n.reveal[1], vw * 0.095), sw);
      else if (n.reveal[1] > 0) a = smoothstep(n.reveal[0], n.reveal[1], sw);
      a *= n.kind === 'event' || n.kind === 'read' || n.kind === 'block' || n.kind === 'point' ? Math.min(1, parentA * 1.6) : 1;
      // what lives inside a cover waits until the cover's own text is showing
      if ((n.kind === 'read' || n.kind === 'block' || (n.kind === 'event' && n.parent?.kind === 'event')) && n.parent) {
        a *= this.textAlpha.get(n.parent.id) ?? 1;
      }
      if (n.kind === 'event') this.cardAlpha.set(n.id, a);
      let rv = 1;
      let self = 1;
      if (n.kind === 'event') {
        // the image arrives first; the title takes over from the label once it is readable
        const txt = smoothstep(Math.min(Math.max(300, vw * 0.16), vw * 0.55), Math.min(Math.max(400, vw * 0.2), vw * 0.8), sw);
        this.textAlpha.set(n.id, txt);
        rv = Math.min(txt, smoothstep(Math.min(Math.max(420, vw * 0.21), vw * 0.6), Math.min(Math.max(560, vw * 0.27), vw * 0.85), sw));
        self = 1 - smoothstep(vw * 1.1, vw * 1.5, sw);
        el.style.setProperty('--txt', `${Math.round(txt * 100) / 100}`);
      } else if (n.kind === 'era') {
        self = 1 - smoothstep(vw * 1.5, vw * 2.5, sw);
      } else if (n.kind === 'title' || n.kind === 'guide') {
        self = 1 - smoothstep(vw * 2.2, vw * 4, sw);
      } else if (n.kind === 'read') {
        rv = smoothstep(150, 420, sw);
      }
      if (n.kind === 'point' && this.nav.hidden().has(`${n.item!.id}:${n.pointId}`)) a = 0;
      alpha.set(n.id, a);
      const vis = !n.item || n.item.kind === 'era' || this.filters.isVisible(n.item);
      let shownA = a * (vis ? 1 : 0.12) * (any && n.item && n.item.kind !== 'era' && !this.filters.isHighlighted(n.item) ? 0.5 : 1);
      if (n.kind !== 'event' && n.kind !== 'era') shownA *= self;
      const onScreen = x < vw && y < vh && x + sw > 0 && y + sh > 0;
      const show = onScreen && shownA > 0.004 && sw > 2;
      this.apply(el, show, `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${(sw / n.authW).toFixed(6)})`, shownA, rv, self, a < 0.55 || !vis);
    }

    this.renderLabels(scene, k);

    const ctx = this.canvasRef().nativeElement.getContext('2d');
    if (ctx) {
      paint(ctx, scene, t, {
        colors: this.colors, dpr: this.dpr, width: vw, height: vh,
        visible: (it) => this.filters.isVisible(it),
        highlighted: (it) => this.filters.isHighlighted(it),
        anyHighlight: any,
        yearLabel: (yy) => (yy < 0 ? `${-yy} ${this.i18n.lang() === 'es' ? 'a.C.' : 'BC'}` : `${yy}`),
        cardAlpha: this.cardAlpha,
        textAlpha: this.textAlpha,
        themed: (c) => themed(c, this.colors.dark),
      });
    }
  };

  private apply(el: HTMLElement, show: boolean, tf: string, a: number, rv: number, self: number, faint: boolean): void {
    let s = this.state.get(el);
    if (!s) {
      s = { shown: false, tf: '', a: -1, rv: -1, self: -1, faint: false };
      this.state.set(el, s);
    }
    if (!show) {
      if (s.shown) {
        el.style.display = 'none';
        s.shown = false;
      }
      return;
    }
    if (!s.shown) {
      el.style.display = 'block';
      s.shown = true;
    }
    if (s.tf !== tf) {
      el.style.transform = tf;
      s.tf = tf;
    }
    const ar = Math.round(a * 100) / 100;
    if (s.a !== ar) {
      el.style.opacity = `${ar}`;
      s.a = ar;
    }
    const rvr = Math.round(rv * 100) / 100;
    if (s.rv !== rvr) {
      el.style.setProperty('--rv', `${rvr}`);
      s.rv = rvr;
    }
    const sr = Math.round(self * 100) / 100;
    if (s.self !== sr) {
      el.style.setProperty('--self', `${sr}`);
      s.self = sr;
    }
    if (s.faint !== faint) {
      el.classList.toggle('is-faint', faint);
      s.faint = faint;
    }
  }

  /** Titles of events whose cards are still too small to read; overlapping labels are dropped. */
  private renderLabels(scene: Scene, k: number): void {
    const t = this.camera.t;
    const cands: { id: string; x: number; y: number; w: number; h: number; a: number; pr: number }[] = [];
    for (const n of this.labelNodes()) {
      const el = this.labelEls.get(n.id);
      if (!el) continue;
      const f = this.frameOf.get(n.id);
      const vis = this.filters.isVisible(n.item!);
      let a = 0;
      if (f && vis) {
        const owner = f.isRoot ? 1 : (this.textAlpha.get(f.ownerId) ?? 0);
        a = frameAlpha(f, k, this.vw) * owner * (1 - (this.textAlpha.get(n.id) ?? 0));
      }
      const size = this.labelSize.get(n.id) ?? { w: 160, h: 40 };
      // The label sits where the cover's title will appear, so one turns into the other.
      const L = n.cover!;
      const s = (n.rect.w * k) / L.w;
      const coverShown = (this.cardAlpha.get(n.id) ?? 0) > 0.3;
      let x: number;
      let y: number;
      if (coverShown) {
        x = n.rect.x * k + t.x + L.text.x * s;
        y = n.rect.y * k + t.y + (L.text.y + 10) * s;
      } else {
        x = (n.rect.x + n.rect.w / 2) * k + t.x - size.w / 2;
        y = (n.rect.y + n.rect.h / 2) * k + t.y - size.h / 2;
      }
      if (a < 0.03 || x < -260 || x > this.vw + 60 || y < -100 || y > this.vh + 100) {
        this.hideLabel(el);
        continue;
      }
      el.classList.toggle('is-left', coverShown);
      const hl = this.filters.hasHighlights() && this.filters.isHighlighted(n.item!);
      cands.push({ id: n.id, x, y, w: size.w, h: size.h, a, pr: (hl ? 10 : 0) + a - n.depth * 0.5 });
    }
    cands.sort((p, q) => q.pr - p.pr);
    const taken: { x: number; y: number; w: number; h: number }[] = [];
    for (const c of cands) {
      const el = this.labelEls.get(c.id)!;
      const clash = taken.some((o) => c.x < o.x + o.w + 8 && c.x + c.w + 8 > o.x && c.y < o.y + o.h + 4 && c.y + c.h + 4 > o.y);
      if (clash) {
        this.hideLabel(el);
        continue;
      }
      taken.push(c);
      el.style.display = 'block';
      el.style.transform = `translate(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px)`;
      el.style.opacity = `${Math.round(c.a * 100) / 100}`;
    }
  }

  private hideLabel(el: HTMLElement): void {
    if (el.style.display !== 'none') el.style.display = 'none';
  }
}
