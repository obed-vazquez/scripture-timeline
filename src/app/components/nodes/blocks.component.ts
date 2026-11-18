import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { SceneNode } from '../../engine/scene';
import {
  ChronicleBlock, ChronicleEntry, CompareBlock, CompareMark, CompareRow, GroupBlock, LineageBlock, LineageNode, VideoBlock,
} from '../../models/custom.models';
import { I18nService } from '../../services/i18n.service';
import { NavigationService } from '../../services/navigation.service';
import { ThemeService } from '../../services/theme.service';
import { MediaService } from '../../services/media.service';
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
    this.nav.goTo(p.detail ? `${this.node().id}::${p.id}` : (p.event ?? this.node().id));
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
    if (this.point().event) this.nav.goTo(this.point().event!);
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
    this.nav.goTo(e.event);
  }
}
