import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Injector, NgZone, OnDestroy, afterNextRender,
  computed, effect, inject, input, isDevMode, signal, untracked, viewChild,
} from '@angular/core';
import { ZoomTransform } from 'd3-zoom';
import { Camera, SettleReason } from '../../engine/camera';
import {
  CARD_H, COVER_TYPE, HUB_ID, Orientation, Scene, SceneNode, TimelineFrame, buildScene, coverLayout, coverTitleSize,
} from '../../engine/scene';
import { Insets, containsPoint, smoothstep } from '../../engine/geometry';
import { MarkerHit, frameAlpha, hitDistance, paint, PaintColors } from '../../engine/painter';
import { TimelineDataService } from '../../services/timeline-data.service';
import { I18nService } from '../../services/i18n.service';
import { FilterService } from '../../services/filter.service';
import { ThemeService } from '../../services/theme.service';
import { NavigationService, PathEntry } from '../../services/navigation.service';
import { MediaService } from '../../services/media.service';
import { DETAIL_BODY, DetailFit, READ_GEOMETRY, ReadSize, ReadingLayoutService } from '../../services/reading-layout.service';
import { CoverComponent, ReadPanelComponent } from '../nodes/cover.component';
import { EraHeaderComponent, GuideHubComponent, GuideMenuComponent, TitleBlockComponent } from '../nodes/frame-nodes.component';
import {
  ChronicleBlockComponent, CompareBlockComponent, GroupBlockComponent, LineageBlockComponent, PointDetailComponent, RelationsBlockComponent,
  VideoBlockComponent,
} from '../nodes/blocks.component';
import { themed } from '../../utils/color.util';

interface ElState {
  shown: boolean;
  tf: string;
  a: number;
  rv: number;
  self: number;
  faint: boolean;
}

/** Authored size of an event label and the font size of its title. */
interface LabelGeo {
  w: number;
  h: number;
  font: number;
}

/** Where a hub line goes: the title of its guide, in hub-authored px. */
interface HubMorph {
  el: HTMLElement;
  dx: number;
  dy: number;
  scale: number;
}

const BASE_KINDS = new Set(['era', 'title', 'guide', 'hub']);
const NO_SIZES = new Map<string, ReadSize>();
/** Space kept between the full text and the figure of a detail view. */
const FIGURE_GAP = 34;
/**
 * Phones: authored type sizes of an event's summary and full text (mirror canvas.css:
 * .cover.is-portrait .cv-desc, .read.is-portrait .read-body), and the on-screen sizes (px)
 * between which a text appears.
 */
const PORTRAIT_TYPE = { desc: 34, read: 30, minPx: 9.5, fullPx: 11 };
/** Vertical layout: height of the row the era pill takes under the top bar (mirrors chrome.css). */
const PORTRAIT_ERA_ROW = 42;
/** Phones: room (screen px) the labels leave beside an axis: the years on its left, the bars on its right. */
const PORTRAIT_LABEL_CLEAR = { years: 80, bars: 44 };
/** Phones: widest label (authored px), so a label fits between the screen edge and the years. */
const PORTRAIT_LABEL_W = 640;
/** Narrowest single column beside a figure in a detail view (narrower ones read as half a page). */
const DETAIL_BESIDE_MIN_W = 860;
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The full-screen canvas (A44). Positions every object of the scene for the current camera,
 * fades objects in and out with the zoom (Zoom Reveal, A31) and paints the axes.
 *
 * Reveal of an event, as its card grows on screen:
 *   1. label — year and title alone, over the place of the card;
 *   2. cover — the image fades in and the label glides to where the title will be, growing
 *      with the zoom so it is never replaced by a different size;
 *   3. the real title takes over (same place, same size), then the categories and summary;
 *   4. the full text, last.
 */
@Component({
  selector: 'tl-stage',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CoverComponent, ReadPanelComponent, EraHeaderComponent, TitleBlockComponent, GuideMenuComponent, GuideHubComponent,
    VideoBlockComponent, LineageBlockComponent, PointDetailComponent, CompareBlockComponent, ChronicleBlockComponent,
    GroupBlockComponent, RelationsBlockComponent,
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
              @case ('hub') { <tl-guide-hub [node]="n" [orient]="orient()" /> }
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
                @switch (n.block?.type) {
                  @case ('video') { <tl-video-block [node]="n" /> }
                  @case ('compare') { <tl-compare-block [node]="n" /> }
                  @case ('chronicle') { <tl-chronicle-block [node]="n" /> }
                  @case ('relations') { <tl-relations-block [node]="n" /> }
                  @case ('group') { <tl-group-block [node]="n" /> }
                  @default { <tl-lineage-block [node]="n" /> }
                }
              }
              @case ('point') { <tl-point-detail [node]="n" /> }
            }
          </div>
        }
      </div>
      <div class="layer layer-labels">
        @for (n of labelNodes(); track n.id) {
          <button type="button" class="label" tabindex="-1" [attr.data-label]="n.id" [style.--c]="labelColor(n)"
                  [style.width.px]="orient() === 'v' ? null : n.cover!.text.w" [style.max-width.px]="orient() === 'v' ? portraitLabelW : null">
            <span class="lb-year" [style.font-size.px]="type().year">{{ i18n.year(n.item!.yearLabel) }}</span>
            <span class="lb-title" [style.font-size.px]="labelTitleSize(n)" [style.margin-top.px]="type().gap">{{ i18n.text(n.item!.id + '.title', n.item!.title) }}</span>
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
  private media = inject(MediaService);
  private reading = inject(ReadingLayoutService);
  private zone = inject(NgZone);
  private injector = inject(Injector);

  private stageRef = viewChild.required<ElementRef<HTMLDivElement>>('stage');
  private canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private measureRef = viewChild.required<ElementRef<HTMLDivElement>>('measure');

  readonly orient = signal<Orientation>(this.pickOrientation());
  readonly type = computed(() => COVER_TYPE[this.orient()]);
  readonly scene = computed<Scene>(() =>
    buildScene({
      orient: this.orient(),
      eras: this.data.eras,
      custom: this.data.custom.events,
      guides: this.data.guides.map((g) => ({ id: g.id, items: g.entries })),
      // only phones lay the reading panels out from their measured size
      readSizes: this.orient() === 'v' ? this.reading.sizes() : NO_SIZES,
    }),
  );
  readonly baseNodes = computed(() => this.scene().nodes.filter((n) => BASE_KINDS.has(n.kind)));
  readonly contentNodes = computed(() =>
    this.scene().nodes.filter((n) => !BASE_KINDS.has(n.kind) && !(n.kind === 'read' && n.tight)),
  );
  readonly labelNodes = computed(() => this.scene().nodes.filter((n) => n.kind === 'event'));

  private camera!: Camera;
  private els = new Map<string, HTMLElement>();
  private labelEls = new Map<string, HTMLElement>();
  private labelGeo = new Map<string, LabelGeo>();
  readonly portraitLabelW = PORTRAIT_LABEL_W;
  private state = new WeakMap<HTMLElement, ElState>();
  private frameOf = new Map<string, TimelineFrame>();
  private cardAlpha = new Map<string, number>();
  private textAlpha = new Map<string, number>();
  /** Card width at which the summary of each event is fully shown: the full text comes after. */
  private summaryEnd = new Map<string, number>();
  private hits: MarkerHit[] = [];
  /** How open each section is (0 closed, 1 open), this frame. */
  private groupOpen = new Map<string, number>();
  /** How far each card has turned into its detail view (0 → 1), this frame. */
  private detailAlpha = new Map<string, number>();
  private alphaMap = new Map<string, number>();
  private vars = new WeakMap<HTMLElement, { txt: number; dt: number; open: number }>();
  private hoverId: string | null = null;
  private hubMorph: HubMorph[] = [];
  private lastHubP = -1;
  private homeT: ZoomTransform | null = null;
  private hintsGone = false;
  private attachedKeys = new Map<string, boolean>();
  private colors: PaintColors = { ink: '#eee', ink3: '#888', bg: '#111', accent: '#d4ae5c', year: '#aaa', dark: true };
  private raf = 0;
  private moving = false;
  private moveTimer: ReturnType<typeof setTimeout> | undefined;
  private vw = 0;
  private vh = 0;
  private dpr = 1;
  private ro?: ResizeObserver;
  private ready = false;
  private lastSceneOrient: Orientation | null = null;
  private measuredFor = '';

  constructor() {
    // The vertical layout also rearranges the floating bars (the era pill gets its own row).
    effect(() => document.body.classList.toggle('is-portrait', this.orient() === 'v'));
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
    // Language → re-measure the texts (their length changes) and the labels.
    effect(() => {
      const lang = this.i18n.lang();
      untracked(() => {
        if (!this.ready) return;
        this.measureSoon(lang);
        afterNextRender(() => {
          this.measureLabels();
          this.measureHub(this.scene());
          this.requestRender();
        }, { injector: this.injector });
      });
    });
    // Players added or removed, or the current node changed → place the players again.
    effect(() => {
      this.media.players();
      this.nav.current();
      untracked(() => setTimeout(() => this.requestRender()));
    });
  }

  ngAfterViewInit(): void {
    const stage = this.stageRef().nativeElement;
    this.zone.runOutsideAngular(() => {
      this.camera = new Camera(stage);
      this.camera.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.camera.onChange = () => {
        this.markMoving();
        this.requestRender();
      };
      this.camera.onSettle = (reason) => this.onSettle(reason);
      this.camera.onUserStart = () => this.zone.run(() => this.nav.userInteracted());
      this.ro = new ResizeObserver(() => this.onResize());
      this.ro.observe(stage);
      document.addEventListener('keydown', this.onKey);
      stage.addEventListener('pointermove', this.onPointerMove);
      stage.addEventListener('pointerleave', this.onPointerLeave);
      stage.addEventListener('contextmenu', this.onContextMenu);
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
    const stage = this.stageRef().nativeElement;
    this.camera?.destroy();
    this.ro?.disconnect();
    document.removeEventListener('keydown', this.onKey);
    stage.removeEventListener('pointermove', this.onPointerMove);
    stage.removeEventListener('pointerleave', this.onPointerLeave);
    stage.removeEventListener('contextmenu', this.onContextMenu);
    this.nav.register(null);
    cancelAnimationFrame(this.raf);
  }

  labelColor(n: SceneNode): string {
    return themed(n.item!.color, this.theme.dark());
  }

  labelTitleSize(n: SceneNode): number {
    return coverTitleSize(this.i18n.text(`${n.item!.id}.title`, n.item!.title), !!n.item!.image, this.orient());
  }

  // ── scene lifecycle ───────────────────────────────────────

  private onSceneRendered(scene: Scene): void {
    const stage = this.stageRef().nativeElement;
    this.els.clear();
    stage.querySelectorAll<HTMLElement>('[data-node]').forEach((el) => this.els.set(el.dataset['node']!, el));
    this.labelEls.clear();
    stage.querySelectorAll<HTMLElement>('[data-label]').forEach((el) => this.labelEls.set(el.dataset['label']!, el));
    this.measureLabels();
    this.measureHub(scene);
    this.applyFilterClasses();
    const insets = this.insets();
    const minK = this.camera.fitTransform(scene.bounds, insets).k * 0.55;
    const maxK = this.camera.fitTransform({ x: 0, y: 0, w: scene.minFocusWidth, h: scene.minFocusWidth * 0.6 }, insets).k * 4;
    this.camera.setLimits(scene.bounds, minK, maxK);
    this.homeT = this.camera.fitTransform(scene.home, insets, scene.homeMode);

    if (!this.ready) {
      this.ready = true;
      this.lastSceneOrient = scene.orient;
      const start = this.initialNode();
      if (start && scene.byId.has(start)) this.flyTo(start, true);
      else this.home(true);
      document.fonts?.ready.then(() => {
        this.measureSoon(this.i18n.lang());
        this.measureLabels();
        this.measureHub(this.scene());
        this.requestRender();
      });
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

  private measureReading(): void {
    if (this.orient() === 'h') this.measureDetail();
    else this.measurePanels();
  }

  /** Phones: lays out every reading panel off-screen to know its height. */
  private measurePanels(): void {
    const g = READ_GEOMETRY.v;
    const host = this.measureRef().nativeElement;
    host.innerHTML = '';
    const out = new Map<string, ReadSize>();
    for (const it of this.data.events) {
      // the same sheet the reading panel draws: year and title, then the text
      const art = document.createElement('article');
      art.className = 'read is-portrait';
      Object.assign(art.style, { width: `${g.col + 2 * g.padX}px`, height: 'auto', padding: `${g.padY}px ${g.padX}px`, boxSizing: 'border-box' });
      const head = document.createElement('header');
      head.className = 'read-head';
      const year = document.createElement('span');
      year.className = 'read-year';
      year.textContent = this.i18n.year(it.yearLabel);
      const title = document.createElement('h3');
      title.className = 'read-title';
      title.textContent = this.i18n.text(`${it.id}.title`, it.title);
      head.append(year, title);
      const body = document.createElement('div');
      body.className = 'read-body';
      body.innerHTML = this.i18n.text(`${it.id}.fullDesc`, it.fullDesc);
      art.append(head, body);
      host.appendChild(art);
      out.set(it.id, { w: g.col + 2 * g.padX, h: art.offsetHeight + 10, cols: 1 });
    }
    host.innerHTML = '';
    this.zone.run(() => this.reading.sizes.set(out));
  }

  /**
   * Wide screens: the largest type, in the fewest columns, that lets each full text fit in its
   * card's detail view (binary search over the type size; two columns first, then three).
   */
  private measureDetail(): void {
    const host = this.measureRef().nativeElement;
    host.innerHTML = '';
    const body = document.createElement('div');
    body.className = 'cd-body read-body';
    Object.assign(body.style, {
      position: 'static', width: `${DETAIL_BODY.w}px`, height: `${DETAIL_BODY.h}px`,
      columnGap: `${DETAIL_BODY.gap}px`, columnFill: 'balance', overflow: 'hidden',
    });
    const content = document.createElement('div');
    const spacer = document.createElement('div');
    spacer.className = 'cd-spacer';
    body.append(content, spacer);
    host.appendChild(body);
    const fits = (cols: number, font: number) => {
      body.style.columnCount = `${cols}`;
      body.style.fontSize = `${font}px`;
      return body.scrollWidth <= body.clientWidth + 1 && body.scrollHeight <= body.clientHeight + 1;
    };
    const largest = (cols: number, lo: number, hi: number) => {
      if (!fits(cols, lo)) return 0;
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        if (fits(cols, mid)) lo = mid;
        else hi = mid - 1;
      }
      return lo;
    };
    const out = new Map<string, DetailFit>();
    for (const it of this.data.events) {
      content.innerHTML = this.i18n.text(`${it.id}.fullDesc`, it.fullDesc);
      const fig = coverLayout(it, 'h', this.data.custom.events[it.id]).figure;
      // 1. a short text takes one column across the whole card (above the figure, if any):
      //    lists keep each point on one line instead of filling half the card
      const oneH = fig ? DETAIL_BODY.h - fig.h - FIGURE_GAP : DETAIL_BODY.h;
      body.style.height = `${oneH}px`;
      spacer.style.height = '0';
      const one = largest(1, 24, 28);
      if (one) {
        out.set(it.id, { cols: 1, font: one, h: fig ? oneH : undefined });
        continue;
      }
      body.style.height = `${DETAIL_BODY.h}px`;
      // 1b. beside a narrow figure, still one column (narrower, full height): a list keeps reading
      //     as one list instead of breaking into two columns
      const besideW = fig ? DETAIL_BODY.w - fig.w - DETAIL_BODY.gap : 0;
      if (besideW >= DETAIL_BESIDE_MIN_W) {
        body.style.width = `${besideW}px`;
        const beside = largest(1, 22, 28);
        body.style.width = `${DETAIL_BODY.w}px`;
        if (beside) {
          out.set(it.id, { cols: 1, font: beside, w: besideW });
          continue;
        }
      }
      // 2. two columns; a figure (the event's first block) keeps the bottom of the second one
      spacer.style.height = fig ? `${fig.h + FIGURE_GAP}px` : '0';
      const two = largest(2, fig ? 14 : 21, 27);
      if (two || fig) {
        if (!two && isDevMode()) console.warn(`[timeline] El texto de "${it.id}" no cabe junto a su figura.`);
        out.set(it.id, { cols: 2, font: two || 14 });
        continue;
      }
      const three = largest(3, 14, 24);
      if (!three && isDevMode()) console.warn(`[timeline] El texto de "${it.id}" no cabe en su tarjeta ni a 14 px.`);
      out.set(it.id, { cols: 3, font: three || 14 });
    }
    host.innerHTML = '';
    this.zone.run(() => this.reading.detail.set(out));
  }

  /** Authored size of every label (it is drawn at the cover's own type sizes, then scaled). */
  private measureLabels(): void {
    const els = [...this.labelEls.entries()];
    for (const [, el] of els) {
      el.style.display = 'block';
      el.style.opacity = '0';
      el.style.transform = 'none';
    }
    for (const [id, el] of els) {
      const title = el.querySelector<HTMLElement>('.lb-title');
      this.labelGeo.set(id, { w: el.offsetWidth, h: el.offsetHeight, font: title ? parseFloat(getComputedStyle(title).fontSize) : 80 });
    }
    for (const [, el] of els) el.style.display = 'none';
  }

  /** Where each line of the hub must travel to become the title of its guide. */
  private measureHub(scene: Scene): void {
    this.hubMorph = [];
    this.lastHubP = -1;
    if (!scene.hubMorph) return;
    const hubEl = this.els.get(HUB_ID);
    if (!hubEl) return;
    const shown: HTMLElement[] = [];
    const show = (el: HTMLElement) => {
      if (el.style.display !== 'block') {
        el.style.display = 'block';
        el.style.opacity = '0';
        shown.push(el);
      }
    };
    show(hubEl);
    const hub = scene.hub;
    const hs = hub.rect.w / hub.authW;
    this.data.guides.forEach((g, i) => {
      const gn = scene.byId.get(`guia:${g.id}`);
      const gEl = gn && this.els.get(gn.id);
      const row = hubEl.querySelector<HTMLElement>(`[data-hubrow="${i}"] .hr-title`);
      if (!gn || !gEl || !row) return;
      show(gEl);
      const gt = gEl.querySelector<HTMLElement>('.g-title');
      if (!gt) return;
      row.style.transform = 'none';
      const ro = offsetIn(row, hubEl);
      const go = offsetIn(gt, gEl);
      const gs = gn.rect.w / gn.authW;
      const tx = (gn.rect.x + go.x * gs - hub.rect.x) / hs;
      const ty = (gn.rect.y + go.y * gs - hub.rect.y) / hs;
      const scale = (parseFloat(getComputedStyle(gt).fontSize) * gs) / (parseFloat(getComputedStyle(row).fontSize) * hs);
      this.hubMorph.push({ el: row, dx: tx - ro.x, dy: ty - ro.y, scale });
    });
    for (const el of shown) {
      el.style.display = 'none';
      const s = this.state.get(el);
      if (s) s.shown = false;
    }
  }

  // ── camera ────────────────────────────────────────────────

  private insets(): Insets {
    const phone = this.vw < 700;
    // vertical layout: the era pill sits on its own row under the top bar
    const eraRow = this.orient() === 'v' ? PORTRAIT_ERA_ROW : 0;
    return phone
      ? { top: 62 + eraRow, right: 54, bottom: 128, left: 14 }
      : { top: 84 + eraRow, right: 84, bottom: 118, left: 48 };
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

  private atHomeTransform(t: ZoomTransform, tolPx = 60): boolean {
    const ht = this.homeT;
    if (!ht) return false;
    return Math.abs(Math.log(t.k / ht.k)) < 0.06 && Math.abs(t.x - ht.x) < tolPx && Math.abs(t.y - ht.y) < tolPx;
  }

  /** The chain of frames the visitor is inside, from the outermost to the innermost. */
  private computePath(): PathEntry[] {
    const scene = this.scene();
    const t = this.camera.t;
    const ins = this.insets();
    const aw = this.vw - ins.left - ins.right;
    const ah = this.vh - ins.top - ins.bottom;
    // At the overview there is no "current" frame (the bottom bar stays empty, A48).
    if (this.atHomeTransform(t)) return [];
    const [cx, cy] = t.invert([ins.left + aw / 2, ins.top + ah / 2]);
    // wide screens: an event counts from its header view on, its reading from its detail view on
    const cardFit = Math.min(aw, ah * (CARD_H.w / CARD_H.h));
    const big = (n: SceneNode) => {
      if (n.tight) return n.rect.w * t.k >= cardFit * 0.66;
      // phones: the reading sheet lies over its card; it counts once it turns on, a little
      // past the card's own view (see render)
      if (n.kind === 'read' && scene.orient === 'v') {
        const pr = n.parent!.rect;
        return n.rect.w * t.k >= Math.min(aw, ah * (pr.w / pr.h)) * 1.045;
      }
      if (n.kind === 'event' && scene.orient === 'h') return n.rect.w * t.k >= cardFit * 0.42;
      return n.rect.w * t.k >= aw * 0.42 || n.rect.h * t.k >= ah * 0.55;
    };
    const entered = (n: SceneNode) =>
      n.kind !== 'title' && containsPoint(n.rect, cx, cy) && big(n) && this.isNodeVisible(n);
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
    // a link to another event of the timeline (data-event in the text) flies to it
    const toEvent = target.closest<HTMLElement>('a[data-event]');
    if (toEvent) {
      ev.preventDefault();
      const id = toEvent.dataset['event']!;
      if (this.scene().byId.has(id)) this.nav.jumpTo(id);
      return;
    }
    if (target.closest('a[href]')) return;
    const label = target.closest<HTMLElement>('[data-label]');
    if (label) {
      this.nav.goTo(label.dataset['label']!);
      return;
    }
    const nodeEl = target.closest<HTMLElement>('[data-node]');
    const id = nodeEl?.dataset['node'] ?? '';
    const n = this.scene().byId.get(id);
    // a dot or a bar on an axis opens its event, like its card (the axes lie over the eras)
    if (!n || BASE_KINDS.has(n.kind)) {
      const mark = this.markerAt(ev.clientX, ev.clientY);
      if (mark) {
        this.nav.goTo(mark);
        return;
      }
    }
    if (!nodeEl) {
      this.nav.up();
      return;
    }
    if (!n || n.kind === 'title') return;
    if (this.nav.current()?.id === id) {
      // a second click on an event goes from its header view to its detail view
      if (n.kind === 'event') this.nav.goTo(`${id}::leer`);
      return;
    }
    this.nav.goTo(id);
  }

  /** Event whose dot or bar is under the pointer (or very near it). */
  private markerAt(clientX: number, clientY: number): string | null {
    const box = this.stageRef().nativeElement.getBoundingClientRect();
    const x = clientX - box.left;
    const y = clientY - box.top;
    let best: string | null = null;
    let bestD = 11;
    for (const h of this.hits) {
      const d = hitDistance(h, x, y);
      if (d < bestD) {
        bestD = d;
        best = h.id;
      }
    }
    return best;
  }

  private onPointerMove = (e: PointerEvent) => {
    if (e.buttons) return;
    const target = e.target as HTMLElement;
    let id: string | null = null;
    let onMark = false;
    const label = target.closest<HTMLElement>('[data-label]');
    if (label) id = label.dataset['label']!;
    else {
      const nodeEl = target.closest<HTMLElement>('[data-node]');
      const n = nodeEl ? this.scene().byId.get(nodeEl.dataset['node']!) : null;
      if (n?.kind === 'event') id = n.id;
      else if (!n || BASE_KINDS.has(n.kind)) {
        id = this.markerAt(e.clientX, e.clientY);
        onMark = !!id;
      }
    }
    this.stageRef().nativeElement.classList.toggle('on-mark', onMark);
    if (id !== this.hoverId) {
      this.hoverId = id;
      this.requestRender();
    }
  };

  private onPointerLeave = () => {
    if (this.hoverId === null) return;
    this.hoverId = null;
    this.requestRender();
  };

  /** Right click: one level out, the opposite of a click. Links and selected text keep the browser menu. */
  private onContextMenu = (e: MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest('a[href], input, textarea') || (window.getSelection()?.toString() ?? '').trim()) return;
    e.preventDefault();
    this.zone.run(() => this.nav.up());
  };

  private onKey = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      this.zone.run(() => this.nav.searchOpen.set(true));
      return;
    }
    const t = e.target as HTMLElement | null;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (this.nav.searchOpen()) return;
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
      const s = this.scene();
      this.homeT = this.camera.fitTransform(s.home, this.insets(), s.homeMode);
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
      year: v('--axis-year', '#a9a194'),
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

  /**
   * While the camera moves, every object is composited as an already drawn layer (scaled by the
   * GPU) instead of being redrawn at each new size; once it stops, it is redrawn sharp.
   */
  private markMoving(): void {
    const stage = this.stageRef().nativeElement;
    if (!this.moving) {
      this.moving = true;
      stage.classList.add('is-moving');
    }
    clearTimeout(this.moveTimer);
    this.moveTimer = setTimeout(() => {
      this.moving = false;
      stage.classList.remove('is-moving');
    }, 180);
  }

  private requestRender(): void {
    if (this.raf || !this.camera) return;
    this.raf = requestAnimationFrame(this.render);
  }

  private minLabelFont(): number {
    return this.vw < 700 ? 15 : 15.5;
  }

  private render = () => {
    this.raf = 0;
    if (!this.ready) return;
    const scene = this.scene();
    const t = this.camera.t;
    const k = t.k;
    const vw = this.vw;
    const vh = this.vh;
    const portrait = scene.orient === 'v';
    const alpha = this.alphaMap;
    alpha.clear();
    this.cardAlpha.clear();
    this.groupOpen.clear();
    this.detailAlpha.clear();
    const any = this.filters.hasHighlights();
    const homeK = this.homeT?.k ?? k;
    // Size (screen px) of a card fitted to the screen, with the usual and with tight margins.
    const ins = this.insets();
    const fitW = vw - ins.left - ins.right;
    const fitH = vh - ins.top - ins.bottom;
    const cardFit = Math.min(fitW, fitH * (CARD_H.w / CARD_H.h));
    // centre of the free area of the screen (between the bars): the focus of the visitor
    const cx0 = ins.left + fitW / 2;
    const cy0 = ins.top + fitH / 2;
    // Opening of the hub into its guides (wide screens): 0 at the overview, 1 a little closer.
    const hubP = scene.hubMorph ? smoothstep(1.25, 2.4, k / homeK) : 0;

    if (!this.hintsGone && this.ready && !this.atHomeTransform(t, 30)) {
      this.hintsGone = true;
      this.els.get('::titulo')?.classList.add('hints-off');
    }

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
      let rv = 1;
      let self = 1;
      if (n.kind === 'event') {
        const L = n.cover!;
        const minS = this.minLabelFont() / (this.labelGeo.get(n.id)?.font ?? 80);
        // 2. the image, once the title fits beside it at a readable size (so the label never
        //    spills over the neighbouring cards)
        const fit = minS * L.w;
        const img1 = Math.max(portrait ? 140 : Math.max(165, vw * 0.16), fit);
        const img0 = Math.max(portrait ? 90 : Math.max(110, vw * 0.11), img1 * 0.7);
        a = smoothstep(img0, img1, sw) * Math.min(1, parentA * 1.6);
        if (n.parent?.kind === 'event') a *= this.textAlpha.get(n.parent.id) ?? 1;
        // 3. the title takes over from the label once both are the same size; then the summary
        //    ("header view": complete before the card reaches its header-view size)
        const t0 = Math.max(minS * 1.03 * L.w, img1 * 0.98);
        const t1 = t0 * 1.16;
        const txt = smoothstep(t0, t1, sw);
        // phones: the summary shows only while its letters are readable on screen, so it never
        // appears (or leaves) as a grey smudge
        const descPx = (min: number) => (min * L.w) / PORTRAIT_TYPE.desc;
        const rv0 = portrait ? Math.max(t1 * 1.08, descPx(PORTRAIT_TYPE.minPx)) : Math.max(t1 * 1.05, cardFit * 0.3);
        const rv1 = portrait ? Math.max(rv0 * 1.1, descPx(PORTRAIT_TYPE.fullPx)) : Math.max(rv0 * 1.12, cardFit * 0.42);
        rv = Math.min(txt, smoothstep(rv0, rv1, sw));
        this.textAlpha.set(n.id, txt);
        this.summaryEnd.set(n.id, rv1);
        this.cardAlpha.set(n.id, a);
        // 4. wide screens: the card turns into its full text as it fills the screen ("detail view")
        //    (between the header view, at HEADER_VIEW of the screen, and the detail view, at DETAIL_VIEW)
        //    Only the card the visitor is centred on turns: the others stay in their header view
        //    until they take the centre (as the guide menus do).
        const topH = sw * (CARD_H.h / CARD_H.w);
        const off = Math.max(Math.abs(x + sw / 2 - cx0) - sw / 2, Math.abs(y + topH / 2 - cy0) - topH / 2, 0);
        const focus = 1 - smoothstep(0, vw * 0.05, off);
        const dt = portrait ? 0 : smoothstep(cardFit * 0.58, cardFit * 0.72, sw) * focus;
        this.detailAlpha.set(n.id, dt);
        self = portrait ? 1 - smoothstep(vw * 1.1, vw * 1.5, sw) : 1;
        this.setVars(el, txt, dt, -1);
      } else if (n.kind === 'read') {
        // 4. the full text, after the summary
        const psw = n.parent!.rect.w * k;
        if (portrait) {
          // phones: the full text waits until the visitor zooms past the event's own view, and
          // shows only while its letters are readable
          // (the sheet lies over the card; only the sheet the visitor is on turns on)
          const pr = n.parent!.rect;
          const ownView = Math.min(fitW, fitH * (pr.w / pr.h));
          const px = (PORTRAIT_TYPE.read * sw) / n.authW;
          const off = Math.max(Math.abs(x + sw / 2 - cx0) - sw / 2, Math.abs(y + sh / 2 - cy0) - sh / 2, 0);
          a = smoothstep(PORTRAIT_TYPE.minPx, PORTRAIT_TYPE.fullPx, px) * smoothstep(ownView * 1.02, ownView * 1.07, psw)
            * (1 - smoothstep(0, vw * 0.08, off)) * Math.min(1, parentA * 1.6);
        } else {
          const end = this.summaryEnd.get(n.parent!.id) ?? vw * 0.4;
          const r0 = Math.max(vw * 0.5, end * 1.2);
          const r1 = Math.max(vw * 0.7, r0 * 1.3);
          a = smoothstep(r0, r1, psw) * Math.min(1, parentA * 1.6);
        }
        rv = smoothstep(150, 420, sw);
      } else if (n.kind === 'block' || n.kind === 'point') {
        a = (n.reveal[1] > 0 ? smoothstep(n.reveal[0], n.reveal[1], sw) : 1) * Math.min(1, parentA * 1.6);
        // phones: a chart (not a closed section, whose picture reads from afar) waits until it is
        // large enough to read
        if (portrait && n.kind === 'block' && n.block?.type !== 'group') a *= smoothstep(vw * 0.4, vw * 0.65, sw);
        if (n.kind === 'block' && n.parent) {
          // a block belongs to the detail of its event: it appears with the detail view
          // (phones: with the summary); inside a section, as the section opens
          a *= (portrait ? this.textAlpha : this.detailAlpha).get(n.parent.id) ?? 1;
          a *= this.groupOpen.get(n.parent.id) ?? 1;
        }
        if (n.block?.type === 'group') {
          // a closed section opens (its picture gives way to its blocks) as it fills the screen
          const g = n.block;
          const gFit = Math.min(fitW, fitH * (g.w / g.h));
          const open = smoothstep(gFit * 0.42, gFit * 0.75, sw);
          this.groupOpen.set(n.id, open);
          this.setVars(el, -1, -1, open);
        }
      } else if (n.kind === 'era') {
        self = 1 - smoothstep(vw * 1.5, vw * 2.5, sw);
      } else if (n.kind === 'title') {
        self = 1 - smoothstep(vw * 2.2, vw * 4, sw);
      } else if (n.kind === 'hub') {
        self = scene.hubMorph ? 1 : 1 - smoothstep(vw * 2.2, vw * 4, sw);
        if (Math.abs(hubP - this.lastHubP) > 0.001) this.applyHubMorph(el, hubP);
      } else if (n.kind === 'guide') {
        self = 1 - smoothstep(vw * 2.2, vw * 4, sw);
        if (scene.hubMorph) {
          a = smoothstep(0.55, 0.75, hubP);
          this.setGuideVars(el, smoothstep(0.86, 0.97, hubP), smoothstep(0.75, 1, hubP));
          // only the guide the visitor is centred on, once it is large, unfolds its list
          const gx = x + sw / 2 - vw / 2;
          const gy = y + sh / 2 - vh / 2;
          const off = Math.max(Math.abs(gx) - sw / 2, Math.abs(gy) - sh / 2, 0);
          rv = smoothstep(vw * 0.36, vw * 0.5, sw) * (1 - smoothstep(0, vw * 0.06, off));
        } else {
          // phones: a guide is nested at the end of its line of the menu; it appears as the
          // visitor zooms into that line, and unfolds its list once it is large
          // (only the guide the visitor is on: the next one sits just below it)
          const off = Math.max(Math.abs(x + sw / 2 - cx0) - sw / 2, Math.abs(y + sh / 2 - cy0) - sh / 2, 0);
          a = smoothstep(vw * 0.2, vw * 0.45, sw) * (1 - smoothstep(0, vw * 0.08, off));
          rv = smoothstep(vw * 0.6, vw * 0.85, sw);
        }
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
    this.lastHubP = hubP;

    this.renderLabels(k);
    this.placePlayers(scene, t);

    const ctx = this.canvasRef().nativeElement.getContext('2d');
    if (ctx) {
      const es = this.i18n.lang() === 'es';
      const lastEra = this.data.eras[this.data.eras.length - 1];
      paint(ctx, scene, t, {
        colors: this.colors, dpr: this.dpr, width: vw, height: vh,
        visible: (it) => this.filters.isVisible(it),
        highlighted: (it) => this.filters.isHighlighted(it),
        anyHighlight: any,
        yearLabel: (yy, approx) => {
          if (lastEra.ongoing && yy === lastEra.end) return es ? 'presente' : 'present';
          const n = yy < 0 ? `${-yy} ${es ? 'a.C.' : 'BC'}` : `${yy}`;
          return approx ? `${es ? '~' : 'c. '}${n}` : n;
        },
        cardAlpha: this.cardAlpha,
        textAlpha: this.textAlpha,
        themed: (c) => themed(c, this.colors.dark),
        hoverId: this.hoverId,
        hits: this.hits,
      });
    }
  };

  /**
   * Custom properties driven by the zoom: only written when they change (writing a custom
   * property restyles the element's whole subtree). -1 = not used by this node.
   */
  private setVars(el: HTMLElement, txt: number, dt: number, open: number): void {
    let v = this.vars.get(el);
    if (!v) {
      v = { txt: -2, dt: -2, open: -2 };
      this.vars.set(el, v);
    }
    if (txt >= 0) {
      const q = Math.round(txt * 50) / 50;
      if (q !== v.txt) {
        el.style.setProperty('--txt', `${q}`);
        v.txt = q;
      }
    }
    if (dt >= 0) {
      const q = Math.round(dt * 50) / 50;
      if (q !== v.dt) {
        el.style.setProperty('--dt', `${q}`);
        el.classList.toggle('dt-on', q > 0);
        v.dt = q;
      }
    }
    if (open >= 0) {
      const q = Math.round(open * 50) / 50;
      if (q !== v.open) {
        el.style.setProperty('--open', `${q}`);
        el.classList.toggle('is-open', q > 0.5);
        v.open = q;
      }
    }
  }

  private setGuideVars(el: HTMLElement, gt: number, gc: number): void {
    const key = `${Math.round(gt * 50)}|${Math.round(gc * 50)}`;
    if (el.dataset['gv'] === key) return;
    el.dataset['gv'] = key;
    el.style.setProperty('--gt', `${Math.round(gt * 50) / 50}`);
    el.style.setProperty('--gc', `${Math.round(gc * 50) / 50}`);
  }

  /** Moves each line of the hub towards its corner (p = 0 → in the list, 1 → title of its guide). */
  private applyHubMorph(hubEl: HTMLElement, p: number): void {
    const e = ease(p);
    hubEl.style.setProperty('--hp', `${Math.round(p * 1000) / 1000}`);
    const fade = 1 - smoothstep(0.93, 1, p);
    for (const m of this.hubMorph) {
      const s = 1 + (m.scale - 1) * e;
      m.el.style.transform = `translate(${(m.dx * e).toFixed(2)}px, ${(m.dy * e).toFixed(2)}px) scale(${s.toFixed(4)})`;
      m.el.style.opacity = `${Math.round(fade * 100) / 100}`;
    }
  }

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

  /**
   * Year and title of each event, drawn at the cover's own type sizes. While the card is small
   * the label floats over it at a readable minimum size; as the image arrives it glides to the
   * place of the cover's title and grows with the zoom, until the cover's own title (identical)
   * takes over. Overlapping labels are dropped.
   */
  private renderLabels(k: number): void {
    const t = this.camera.t;
    const minFont = this.minLabelFont();
    const cands: { id: string; x: number; y: number; w: number; h: number; sc: number; a: number; pr: number }[] = [];
    for (const n of this.labelNodes()) {
      const el = this.labelEls.get(n.id);
      if (!el) continue;
      const f = this.frameOf.get(n.id);
      const vis = this.filters.isVisible(n.item!);
      let a = 0;
      if (f && vis) {
        const owner = f.isRoot ? 1 : (this.textAlpha.get(f.ownerId) ?? 0);
        a = frameAlpha(f, k, this.vw) * owner * (1 - smoothstep(0.7, 1, this.textAlpha.get(n.id) ?? 0));
      }
      if (a < 0.03) {
        this.hideLabel(el);
        continue;
      }
      const geo = this.labelGeo.get(n.id) ?? { w: 160, h: 60, font: 80 };
      const L = n.cover!;
      const s = (n.rect.w * k) / L.w;
      const sc = Math.max(s, minFont / geo.font);
      const w = geo.w * sc;
      const h = geo.h * sc;
      const e = ease(smoothstep(0.05, 0.9, this.cardAlpha.get(n.id) ?? 0));
      let cx = (n.rect.x + n.rect.w / 2) * k + t.x - w / 2;
      // phones: a label keeps clear of its axis (the years on the left, the bars on the right)
      if (this.orient() === 'v' && f) {
        const ax = f.axisCross * k + t.x;
        cx = n.side === 1 ? Math.max(cx, ax + PORTRAIT_LABEL_CLEAR.bars) : Math.min(cx, ax - PORTRAIT_LABEL_CLEAR.years - w);
      }
      let cy = (n.rect.y + n.rect.h / 2) * k + t.y - h / 2;
      // a label taller than its card stays off the axis (the years live there)
      if (this.orient() === 'h') {
        const top = n.rect.y * k + t.y;
        const bottom = top + n.rect.h * k;
        cy = n.side === 1 ? Math.max(cy, top + 4) : Math.min(cy, bottom - h - 4);
      }
      const tx = n.rect.x * k + t.x + L.text.x * s;
      const ty = n.rect.y * k + t.y + L.text.y * s;
      const x = lerp(cx, tx, e);
      const y = lerp(cy, ty, e);
      if (x > this.vw + 40 || x + w < -40 || y > this.vh + 40 || y + h < -40) {
        this.hideLabel(el);
        continue;
      }
      const anyHl = this.filters.hasHighlights();
      const hl = anyHl && this.filters.isHighlighted(n.item!);
      el.classList.toggle('is-hl', hl);
      if (anyHl && !hl) a *= 0.5;
      cands.push({ id: n.id, x, y, w, h, sc, a, pr: (hl ? 10 : 0) + a - n.depth * 0.5 });
    }
    cands.sort((p, q) => q.pr - p.pr);
    const taken: { x: number; y: number; w: number; h: number }[] = [];
    for (const c of cands) {
      const el = this.labelEls.get(c.id)!;
      const clash = taken.some((o) => c.x < o.x + o.w + 6 && c.x + c.w + 6 > o.x && c.y < o.y + o.h + 3 && c.y + c.h + 3 > o.y);
      if (clash) {
        this.hideLabel(el);
        continue;
      }
      taken.push(c);
      el.style.display = 'block';
      el.style.transform = `translate(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px) scale(${c.sc.toFixed(4)})`;
      el.style.opacity = `${Math.round(c.a * 100) / 100}`;
    }
  }

  private hideLabel(el: HTMLElement): void {
    if (el.style.display !== 'none') el.style.display = 'none';
  }

  /**
   * Video players: over their block while it is big on screen; otherwise docked in a corner
   * (side by side), still playing. The music player is always docked.
   */
  private placePlayers(scene: Scene, t: ZoomTransform): void {
    const players = this.media.players();
    if (!players.length) return;
    const vw = this.vw;
    const vh = this.vh;
    const phone = vw < 700;
    const W = Math.min(356, vw - 24);
    const H = Math.round((W * 9) / 16);
    const bar = 34;
    const current = this.nav.current()?.id ?? null;
    let slot = 0;
    const changed: Record<string, { current: boolean }> = {};
    let dirty = false;
    for (const p of players) {
      const el = document.querySelector<HTMLElement>(`[data-player="${CSS.escape(p.key)}"]`);
      if (!el) continue;
      let rect: { x: number; y: number; w: number; h: number } | null = null;
      const n = p.nodeId ? scene.byId.get(p.nodeId) : undefined;
      const nodeEl = n && this.els.get(n.id);
      if (n && nodeEl && nodeEl.style.display !== 'none' && parseFloat(nodeEl.style.opacity || '0') > 0.6) {
        const s = (n.rect.w * t.k) / n.authW;
        const fr = { x: n.rect.x * t.k + t.x, y: n.rect.y * t.k + t.y, w: 1280 * s, h: 720 * s };
        const visW = Math.min(fr.x + fr.w, vw) - Math.max(fr.x, 0);
        const visH = Math.min(fr.y + fr.h, vh) - Math.max(fr.y, 0);
        if (fr.w >= vw * 0.42 && visW > fr.w * 0.6 && visH > fr.h * 0.6) rect = fr;
      }
      const attached = !!rect;
      if (!rect) {
        const x = phone ? (vw - W) / 2 : vw - 16 - (slot + 1) * W - slot * 14;
        const y = phone ? vh - 128 - (slot + 1) * (H + bar + 10) + bar : vh - 92 - H;
        rect = { x, y, w: W, h: H };
        slot++;
      }
      el.style.transform = `translate(${rect.x.toFixed(1)}px, ${rect.y.toFixed(1)}px)`;
      el.style.width = `${rect.w.toFixed(1)}px`;
      el.style.height = `${rect.h.toFixed(1)}px`;
      if (attached) changed[p.key] = { current: current === p.nodeId };
      const was = this.attachedKeys.get(p.key);
      if (was !== undefined && was !== attached) {
        el.classList.add('is-anim');
        setTimeout(() => el.classList.remove('is-anim'), 520);
      }
      if (was !== attached) dirty = true;
      this.attachedKeys.set(p.key, attached);
    }
    const prev = this.media.attached();
    const sameKeys = Object.keys(prev).length === Object.keys(changed).length &&
      Object.entries(changed).every(([key, v]) => prev[key]?.current === v.current);
    if (dirty || !sameKeys) this.zone.run(() => this.media.attached.set(changed));
  }
}

/** Offset of an element inside an ancestor, in the ancestor's own (untransformed) px. */
function offsetIn(el: HTMLElement, ancestor: HTMLElement): { x: number; y: number } {
  let x = 0;
  let y = 0;
  let cur: HTMLElement | null = el;
  while (cur && cur !== ancestor) {
    x += cur.offsetLeft;
    y += cur.offsetTop;
    cur = cur.offsetParent as HTMLElement | null;
  }
  return { x, y };
}
