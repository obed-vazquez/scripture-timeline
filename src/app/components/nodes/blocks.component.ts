import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { SceneNode } from '../../engine/scene';
import {
  ChronicleBlock, ChronicleEntry, CompareBlock, CompareMark, CompareRow, GroupBlock, LineageBlock, LineageNode, RelationNode,
  RelationsBlock, VideoBlock,
} from '../../models/custom.models';
import { I18nService } from '../../services/i18n.service';
import { NavigationService } from '../../services/navigation.service';
import { ThemeService } from '../../services/theme.service';
import { MediaService } from '../../services/media.service';
import { TimelineDataService } from '../../services/timeline-data.service';
import { themed } from '../../utils/color.util';

/**
 * YouTube video (A65). The block shows the thumbnail; the player itself lives in the player
 * dock, which lays it over this block while the block is big on screen and docks it in a
 * corner (still playing) when the visitor moves on.
 */
@Component({
  selector: 'tl-video-block',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="video" [style.--c]="color()">
      <div class="video-frame">
        <button type="button" class="video-poster" (click)="play($event)" [attr.aria-label]="i18n.t('playVideo')">
          <img [src]="'https://i.ytimg.com/vi/' + block().youtube + '/hqdefault.jpg'" alt="" loading="lazy" draggable="false" />
          <span class="video-play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg></span>
        </button>
      </div>
      <figcaption>
        <strong>{{ title() }}</strong>
        @if (caption()) { <span>{{ caption() }}</span> }
      </figcaption>
    </figure>
  `,
})
export class VideoBlockComponent {
  readonly node = input.required<SceneNode>();
  readonly i18n = inject(I18nService);
  private nav = inject(NavigationService);
  private theme = inject(ThemeService);
  private media = inject(MediaService);

  readonly block = computed(() => this.node().block as VideoBlock);
  readonly color = computed(() => themed(this.node().item!.color, this.theme.dark()));
  readonly title = computed(() => this.i18n.text(`custom.${this.block().id}.title`, this.block().title));
  readonly caption = computed(() => this.i18n.text(`custom.${this.block().id}.caption`, this.block().caption ?? ''));

  constructor() {
    // a presentation step on this video plays it
    effect(() => {
      if (this.nav.playRequest() !== this.node().id) return;
      untracked(() => {
        this.nav.playRequest.set(null);
        this.media.playVideo(this.node().id, this.block().youtube, this.title());
      });
    });
  }

  play(ev: Event): void {
    ev.stopPropagation();
    this.media.playVideo(this.node().id, this.block().youtube, this.title());
    this.nav.goTo(this.node().id);
  }
}

/**
 * A chart (A63). Two styles:
 *  - 'line': points joined by lines, each with its name and year (the line of the Textus Receptus);
 *  - 'pins': numbered pins over a picture (a map, a title page), with their list beside it.
 * Each point can be zoomed into to reveal its own detail, and can link to its event. Points can
 * start hidden and appear on a presentation step (A52). Its texts are text, so they translate (A77).
 */
@Component({
  selector: 'tl-lineage-block',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let b = block();
    @let pins = b.style === 'pins';
    <figure class="lineage" [class.is-pins]="pins" [style.--c]="color()">
      @if (b.image; as im) {
        <div class="lin-image" [style.left.px]="im.x" [style.top.px]="im.y" [style.width.px]="im.w" [style.height.px]="im.h">
          <img [src]="im.src" [alt]="alt()" draggable="false" loading="lazy" [style]="imageStyle()" />
        </div>
        @if (im.credit) {
          <div class="lin-credit" [style.left.px]="im.x" [style.top.px]="im.y + im.h + 10" [style.width.px]="im.w">{{ credit() }}</div>
        }
      }
      <figcaption class="lin-head">
        <h3>{{ title() }}</h3>
        @if (caption()) { <p>{{ caption() }}</p> }
      </figcaption>
      @if (pins) {
        <ol class="lin-legend">
          @for (p of b.nodes; track p.id; let i = $index) {
            <li>
              <button type="button" class="lg-item" [class.is-hidden]="isHidden(p)" [class.is-here]="isHere(p)" (click)="open($event, p)">
                <span class="lg-n">{{ i + 1 }}</span>
                <span class="lg-label">{{ label(p) }}</span>
                <span class="lg-year">{{ i18n.year(p.year) }}</span>
              </button>
            </li>
          }
        </ol>
      } @else {
        <svg class="lin-svg" viewBox="0 0 1400 820" aria-hidden="true">
          @for (e of edges(); track $index) {
            <path [attr.d]="e.d" class="lin-edge" [class.is-hidden]="e.hidden" />
          }
        </svg>
      }
      @for (p of b.nodes; track p.id; let i = $index) {
        <button type="button" class="lin-point" [class.is-pin]="pins" [class.is-hidden]="isHidden(p)" [class.is-here]="isHere(p)"
                [style.left.px]="p.x" [style.top.px]="p.y" (click)="open($event, p)" [attr.aria-label]="label(p)">
          @if (pins) {
            <span class="lin-pin">{{ i + 1 }}</span>
          } @else {
            <span class="lin-dot"></span>
            <span class="lin-label">{{ label(p) }}</span>
            <span class="lin-year">{{ i18n.year(p.year) }}</span>
          }
        </button>
      }
    </figure>
  `,
})
export class LineageBlockComponent {
  readonly node = input.required<SceneNode>();
  readonly i18n = inject(I18nService);
  private nav = inject(NavigationService);
  private theme = inject(ThemeService);

  readonly block = computed(() => this.node().block as LineageBlock);
  readonly color = computed(() => themed(this.node().item!.color, this.theme.dark()));
  readonly title = computed(() => this.i18n.text(`custom.${this.block().id}.title`, this.block().title));
  readonly caption = computed(() => this.i18n.text(`custom.${this.block().id}.caption`, this.block().caption ?? ''));
  readonly alt = computed(() => this.i18n.text(`custom.${this.block().id}.image.alt`, this.block().image?.alt ?? ''));
  readonly credit = computed(() => this.i18n.text(`custom.${this.block().id}.image.credit`, this.block().image?.credit ?? ''));
  /** A cropped picture is drawn larger than its box and shifted, so only the crop shows. */
  readonly imageStyle = computed(() => {
    const im = this.block().image!;
    const c = im.crop;
    if (!c) return { width: '100%', height: '100%', objectFit: 'contain' };
    const s = im.w / c.w;
    return { position: 'absolute', width: `${c.naturalW * s}px`, height: `${c.naturalH * s}px`, left: `${-c.x * s}px`, top: `${-c.y * s}px`, maxWidth: 'none' };
  });
  readonly edges = computed(() => {
    const b = this.block();
    const byId = new Map(b.nodes.map((n) => [n.id, n]));
    this.nav.hidden();
    return b.edges.map(([a, c]) => {
      const p = byId.get(a)!;
      const q = byId.get(c)!;
      const mx = (p.x + q.x) / 2;
      const d = p.y === q.y ? `M${p.x},${p.y} L${q.x},${q.y}` : `M${p.x},${p.y} C${mx},${p.y} ${mx},${q.y} ${q.x},${q.y}`;
      return { d, hidden: this.isHidden(p) || this.isHidden(q) };
    });
  });

  label(p: LineageNode): string {
    return this.i18n.text(`custom.${this.block().id}.${p.id}.label`, p.label);
  }

  isHidden(p: LineageNode): boolean {
    return this.nav.hidden().has(`${this.node().item!.id}:${p.id}`);
  }

  isHere(p: LineageNode): boolean {
    return this.nav.current()?.id === `${this.node().id}::${p.id}`;
  }

  open(ev: Event, p: LineageNode): void {
    ev.stopPropagation();
    if (this.isHidden(p)) return;
    if (p.detail) this.nav.goTo(`${this.node().id}::${p.id}`);
    else if (p.event) this.nav.jumpTo(p.event);
    else this.nav.goTo(this.node().id);
  }
}

/** Detail of a chart point, revealed when zooming into it. */
@Component({
  selector: 'tl-point-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="point" [class.is-pin]="block().style === 'pins'" [class.is-hidden]="hidden()" [style.--c]="color()">
      @if (block().style === 'pins') { <strong class="pt-label">{{ label() }} <i>{{ i18n.year(point().year) }}</i></strong> }
      <p class="pt-detail">{{ detail() }}</p>
      @if (point().event) {
        <button type="button" class="pt-go" (click)="go($event)">{{ i18n.t('goToEvent') }} →</button>
      }
    </div>
  `,
})
export class PointDetailComponent {
  readonly node = input.required<SceneNode>();
  readonly i18n = inject(I18nService);
  private nav = inject(NavigationService);
  private theme = inject(ThemeService);

  readonly block = computed(() => this.node().block as LineageBlock);
  readonly point = computed(() => this.block().nodes.find((n) => n.id === this.node().pointId)!);
  readonly color = computed(() => themed(this.node().item!.color, this.theme.dark()));
  readonly label = computed(() => this.i18n.text(`custom.${this.block().id}.${this.point().id}.label`, this.point().label));
  readonly detail = computed(() => this.i18n.text(`custom.${this.block().id}.${this.point().id}.detail`, this.point().detail ?? ''));
  readonly hidden = computed(() => this.nav.hidden().has(`${this.node().item!.id}:${this.point().id}`));

  go(ev: Event): void {
    ev.stopPropagation();
    if (this.point().event) this.nav.jumpTo(this.point().event!);
  }
}

const MARKS: Record<CompareMark, string> = { same: '✓', missing: '✕', partial: '−', changed: '≈', added: '+', lost: '?' };

/**
 * A comparison table: a few readings (rows) and what each witness — manuscripts, versions —
 * does with them (columns). A click on a row opens its note. Rows can start hidden and appear
 * on a presentation step.
 */
@Component({
  selector: 'tl-compare-block',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let b = block();
    <figure class="compare" [style.--c]="color()" [style.--cols]="b.witnesses.length">
      <figcaption class="lin-head">
        <h3>{{ t('title', b.title) }}</h3>
        @if (b.caption) { <p>{{ t('caption', b.caption) }}</p> }
      </figcaption>
      <div class="cmp-grid">
        <div class="cmp-row cmp-headrow">
          <span></span><span></span>
          @for (w of b.witnesses; track w.id) {
            <span class="cmp-w"><b>{{ t('w.' + w.id + '.label', w.label) }}</b><i>{{ t('w.' + w.id + '.detail', w.detail) }}</i></span>
          }
        </div>
        @for (r of b.rows; track r.id) {
          <button type="button" class="cmp-row" [class.is-hidden]="isHidden(r)" [class.is-open]="openRows().has(r.id)"
                  (click)="toggle($event, r.id)">
            <span class="cmp-ref">{{ r.ref }}</span>
            <span class="cmp-cell">
              <span class="cmp-text">{{ t(r.id + '.text', r.text) }}</span>
              @if (r.note) { <span class="cmp-note">{{ t(r.id + '.note', r.note) }}</span> }
            </span>
            @for (m of r.marks; track $index; let j = $index) {
              <span class="cmp-mark" [class]="'cmp-mark m-' + m"><span>{{ symbol(m) }}</span>@if (r.notes?.[j]) { <sup>{{ r.notes![j] }}</sup> }</span>
            }
          </button>
        }
      </div>
      <p class="cmp-legend">
        <span><b class="cmp-mark m-same"><span>✓</span></b>{{ i18n.t('cmpSame') }}</span>
        <span><b class="cmp-mark m-missing"><span>✕</span></b>{{ i18n.t('cmpMissing') }}</span>
        <span><b class="cmp-mark m-partial"><span>−</span></b>{{ i18n.t('cmpPartial') }}</span>
        <span><b class="cmp-mark m-changed"><span>≈</span></b>{{ i18n.t('cmpChanged') }}</span>
        <span><b class="cmp-mark m-added"><span>+</span></b>{{ i18n.t('cmpAdded') }}</span>
        <span><b class="cmp-mark m-lost"><span>?</span></b>{{ i18n.t('cmpLost') }}</span>
        @if (b.footnote) { <span class="cmp-foot">{{ t('footnote', b.footnote) }}</span> }
      </p>
    </figure>
  `,
})
export class CompareBlockComponent {
  readonly node = input.required<SceneNode>();
  readonly i18n = inject(I18nService);
  private nav = inject(NavigationService);
  private theme = inject(ThemeService);

  readonly block = computed(() => this.node().block as CompareBlock);
  readonly color = computed(() => themed(this.node().item!.color, this.theme.dark()));
  readonly openRows = signal<Set<string>>(new Set());

  t(key: string, source: string): string {
    return this.i18n.text(`custom.${this.block().id}.${key}`, source);
  }

  symbol(m: CompareMark): string {
    return MARKS[m];
  }

  isHidden(r: CompareRow): boolean {
    return this.nav.hidden().has(`${this.node().item!.id}:${r.id}`);
  }

  toggle(ev: Event, id: string): void {
    ev.stopPropagation();
    const next = new Set(this.openRows());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this.openRows.set(next);
    // the camera rests on the table so the note can be read
    if (this.nav.current()?.id !== this.node().id) this.nav.goTo(this.node().id);
  }
}

/**
 * A closed section: from afar, one picture and a title. As it fills the screen the picture
 * fades (the stage drives --open) and the blocks it holds — placed over it — appear.
 */
@Component({
  selector: 'tl-group-block',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let b = block();
    <div class="group" [style.--c]="color()">
      <div class="grp-teaser">
        <img [src]="b.cover.src" [alt]="t('cover.alt', b.cover.alt)" loading="lazy" draggable="false" />
        <div class="grp-text">
          <h3>{{ t('title', b.title) }}</h3>
          @if (b.caption) { <p>{{ t('caption', b.caption) }}</p> }
        </div>
      </div>
    </div>
  `,
})
export class GroupBlockComponent {
  readonly node = input.required<SceneNode>();
  private i18n = inject(I18nService);
  private theme = inject(ThemeService);

  readonly block = computed(() => this.node().block as GroupBlock);
  readonly color = computed(() => themed(this.node().item!.color, this.theme.dark()));

  t(key: string, source: string): string {
    return this.i18n.text(`custom.${this.block().id}.${key}`, source);
  }
}

/** A short chronology in columns; entries tied to an event open it. */
@Component({
  selector: 'tl-chronicle-block',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let b = block();
    <figure class="chronicle" [style.--c]="color()">
      <figcaption class="lin-head">
        <h3>{{ t('title', b.title) }}</h3>
        @if (b.caption) { <p>{{ t('caption', b.caption) }}</p> }
      </figcaption>
      <ol class="chr-list">
        @for (e of b.entries; track e.id) {
          <li>
            <button type="button" class="chr-item" [class.has-event]="!!e.event" (click)="open($event, e)">
              <span class="chr-year">{{ i18n.year(e.year) }}</span>
              <span class="chr-text">{{ t(e.id + '.text', e.text) }}
                @if (e.note) { <i class="chr-note">{{ t(e.id + '.note', e.note) }}</i> }
              </span>
            </button>
          </li>
        }
      </ol>
    </figure>
  `,
})
export class ChronicleBlockComponent {
  readonly node = input.required<SceneNode>();
  readonly i18n = inject(I18nService);
  private nav = inject(NavigationService);
  private theme = inject(ThemeService);

  readonly block = computed(() => this.node().block as ChronicleBlock);
  readonly color = computed(() => themed(this.node().item!.color, this.theme.dark()));

  t(key: string, source: string): string {
    return this.i18n.text(`custom.${this.block().id}.${key}`, source);
  }

  open(ev: Event, e: ChronicleEntry): void {
    if (!e.event) return;
    ev.stopPropagation();
    this.nav.jumpTo(e.event);
  }
}

/** Geometry of a relations map, in chart pixels (the chart is 1400 × 1100). Mirrors canvas.css. */
const REL = { nodeW: 250, nodeH: 190, gap: 12, pairsTop: 668, rowsTop: 722, rowH: 74, rowMid: 14, leftX: 548, rightX: 852 };
/** Colour of an answer that condemns (the category of the Roman Catholic Church). */
const AGAINST = '#d65d72';

/**
 * A map of how a few events relate: cards joined by labelled arrows (one led to the other, an
 * answer that condemns, a coincidence without descent), and optionally two facing lists joined
 * item by item. Every card and list title opens its event.
 */
@Component({
  selector: 'tl-relations-block',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let b = block();
    <figure class="relations" [style.--c]="color()" [style.--against]="against()">
      <figcaption class="lin-head">
        <h3>{{ t('title', b.title) }}</h3>
        @if (b.caption) { <p>{{ t('caption', b.caption) }}</p> }
      </figcaption>
      <svg class="rel-svg" viewBox="0 0 1400 1100" aria-hidden="true">
        @for (e of edges(); track e.id) {
          <path [attr.d]="e.d" [class]="'rel-edge k-' + e.kind" [style.stroke]="e.color" />
          @if (e.head) { <path [attr.d]="e.head" class="rel-arrow" [style.fill]="e.color" /> }
        }
        @for (l of links(); track l.id) {
          <path [attr.d]="l.d" class="rel-link" />
          <circle [attr.cx]="R.leftX" [attr.cy]="l.y0" r="6" class="rel-link-end" />
          <circle [attr.cx]="R.rightX" [attr.cy]="l.y1" r="6" class="rel-link-end" />
        }
      </svg>
      @for (e of edges(); track e.id) {
        @if (e.label) {
          <span [class]="'rel-elabel k-' + e.kind" [style.left.px]="e.lx" [style.top.px]="e.ly" [style.--ec]="e.color">{{ e.label }}</span>
        }
      }
      @for (n of b.nodes; track n.id) {
        <button type="button" class="rel-node" [class.is-special]="n.special" (click)="open($event, n.event)"
                [style.left.px]="n.x - R.nodeW / 2" [style.top.px]="n.y" [style.width.px]="R.nodeW" [style.min-height.px]="R.nodeH"
                [style.--nc]="nodeColor(n)">
          <span class="rel-year">{{ i18n.year(n.year) }}</span>
          <span class="rel-label">{{ t(n.id + '.label', n.label) }}</span>
          @for (p of n.points; track $index; let i = $index) { <span class="rel-pt">{{ t(n.id + '.p' + i, p) }}</span> }
          @if (n.note) { <span class="rel-note">{{ t(n.id + '.note', n.note) }}</span> }
        </button>
      }
      @if (b.legend; as lg) {
        <ul class="rel-legend" [style.left.px]="lg.x" [style.top.px]="lg.y">
          @for (it of lg.items; track it.kind) {
            <li>
              <svg viewBox="0 0 54 10" aria-hidden="true"><path d="M2,5 L46,5" [class]="'rel-edge k-' + it.kind" [style.stroke]="legendColor(it.kind)" /></svg>
              {{ t('legend.' + it.kind, it.label) }}
            </li>
          }
        </ul>
      }
      @if (b.pairs; as P) {
        <button type="button" class="rel-ph is-left" [style.top.px]="R.pairsTop" (click)="open($event, P.left.event)">{{ t('pairs.left', P.left.title) }}</button>
        <button type="button" class="rel-ph is-right" [style.top.px]="R.pairsTop" (click)="open($event, P.right.event)">{{ t('pairs.right', P.right.title) }}</button>
        @if (P.note) { <p class="rel-pnote" [style.top.px]="R.pairsTop">{{ t('pairs.note', P.note) }}</p> }
        @for (it of P.leftItems; track it.id; let i = $index) {
          <div class="rel-item is-left" [style.top.px]="R.rowsTop + i * R.rowH">
            <b>{{ t(it.id + '.label', it.label) }}</b><span>{{ t(it.id + '.sub', it.sub) }}</span>
          </div>
        }
        @for (it of P.rightItems; track it.id; let i = $index) {
          <div class="rel-item is-right" [style.top.px]="R.rowsTop + i * R.rowH">
            <b>{{ t(it.id + '.label', it.label) }}</b><span>{{ t(it.id + '.sub', it.sub) }}</span>
          </div>
        }
      }
    </figure>
  `,
})
export class RelationsBlockComponent {
  readonly node = input.required<SceneNode>();
  readonly i18n = inject(I18nService);
  private nav = inject(NavigationService);
  private theme = inject(ThemeService);
  private data = inject(TimelineDataService);
  readonly R = REL;

  readonly block = computed(() => this.node().block as RelationsBlock);
  readonly color = computed(() => themed(this.node().item!.color, this.theme.dark()));
  readonly against = computed(() => themed(AGAINST, this.theme.dark()));

  t(key: string, source: string): string {
    return this.i18n.text(`custom.${this.block().id}.${key}`, source);
  }

  nodeColor(n: RelationNode): string {
    return themed(n.color ?? this.data.get(n.event)?.color ?? this.node().item!.color, this.theme.dark());
  }

  legendColor(kind: string): string {
    return kind === 'against' ? this.against() : kind === 'coincides' ? 'var(--ink-3)' : this.color();
  }

  /** Arrows from card edge to card edge, with their arrowhead and the place of their label. */
  readonly edges = computed(() => {
    const b = this.block();
    const byId = new Map(b.nodes.map((n) => [n.id, n]));
    const centre = (n: RelationNode) => ({ x: n.x, y: n.y + REL.nodeH / 2 });
    // where the line from a card's centre towards (tx, ty) leaves the card (plus a small gap)
    const exit = (n: RelationNode, tx: number, ty: number) => {
      const c = centre(n);
      const dx = tx - c.x;
      const dy = ty - c.y;
      const s = Math.min((REL.nodeW / 2 + REL.gap) / Math.abs(dx || 1e-6), (REL.nodeH / 2 + REL.gap) / Math.abs(dy || 1e-6));
      return { x: c.x + dx * s, y: c.y + dy * s };
    };
    return b.edges.map((e) => {
      const p = byId.get(e.from)!;
      const q = byId.get(e.to)!;
      const kind = e.kind ?? 'leads';
      const a = exit(p, centre(q).x, centre(q).y);
      const z = exit(q, centre(p).x, centre(p).y);
      const len = Math.hypot(z.x - a.x, z.y - a.y) || 1;
      const ux = (z.x - a.x) / len;
      const uy = (z.y - a.y) / len;
      // the line stops at the base of the arrowhead
      const tip = z;
      const base = { x: tip.x - ux * 16, y: tip.y - uy * 16 };
      const head = kind === 'coincides' ? '' :
        `M${tip.x},${tip.y} L${base.x - uy * 8},${base.y + ux * 8} L${base.x + uy * 8},${base.y - ux * 8} Z`;
      const end = kind === 'coincides' ? tip : base;
      const color = kind === 'against' ? this.against() : kind === 'coincides' ? 'var(--ink-3)' : this.nodeColor(q);
      return {
        id: e.id, kind, color, head,
        d: `M${a.x},${a.y} L${end.x},${end.y}`,
        label: e.label ? this.t(e.id + '.label', e.label) : '',
        lx: (a.x + z.x) / 2,
        ly: (a.y + z.y) / 2,
      };
    });
  });

  /** Lines between the two facing lists. */
  readonly links = computed(() => {
    const P = this.block().pairs;
    if (!P) return [];
    const row = (i: number) => REL.rowsTop + i * REL.rowH + REL.rowMid;
    return P.links.map(([l, r]) => {
      const y0 = row(P.leftItems.findIndex((it) => it.id === l));
      const y1 = row(P.rightItems.findIndex((it) => it.id === r));
      const mx = (REL.leftX + REL.rightX) / 2;
      return { id: `${l}-${r}`, y0, y1, d: `M${REL.leftX},${y0} C${mx},${y0} ${mx},${y1} ${REL.rightX},${y1}` };
    });
  });

  open(ev: Event, event?: string): void {
    if (!event) return;
    ev.stopPropagation();
    this.nav.jumpTo(event);
  }
}
