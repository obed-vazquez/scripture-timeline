import { ChangeDetectionStrategy, Component, computed, forwardRef, inject, output, signal } from '@angular/core';
import { IconComponent } from './icon.component';
import { NavigationService } from '../../services/navigation.service';
import { I18nService } from '../../services/i18n.service';
import { ThemeService } from '../../services/theme.service';
import { FilterService } from '../../services/filter.service';
import { TimelineDataService } from '../../services/timeline-data.service';
import { PrintService } from '../../services/print.service';
import { UrlStateService } from '../../services/url-state.service';
import { themed } from '../../utils/color.util';
import { TimelineTag } from '../../models/timeline.models';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

/** Top bar: brand (home), current era (A49), and the tools. */
@Component({
  selector: 'tl-top-bar',
  standalone: true,
  imports: [IconComponent, forwardRef(() => FilterPanelComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="topbar">
      <button type="button" class="brand" (click)="nav.home()" [attr.aria-label]="i18n.t('home')">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M12 2.5v19 M6.5 8h11" /></svg>
        </span>
        <span class="brand-name">{{ i18n.t('appTitle') }}</span>
      </button>

      <div class="era-pill-slot">
        @if (era(); as e) {
          <button type="button" class="era-pill" [style.--c]="eraColor()" (click)="nav.goTo(e.id)">
            <span class="ep-num">{{ i18n.t('era') }} {{ roman() }}</span>
            <span class="ep-name">{{ i18n.text(e.id + '.title', e.title) }}</span>
          </button>
        }
      </div>

      <div class="tools">
        <div class="tool-wrap">
          <button type="button" class="tool" [class.is-on]="filtersOpen() || !filters.allActive() || filters.hasHighlights()"
                  (click)="filtersOpen.set(!filtersOpen())" [attr.aria-expanded]="filtersOpen()" [title]="i18n.t('filters')">
            <tl-icon name="filter" /><span class="tool-label">{{ i18n.t('filters') }}</span>
            @if (!filters.allActive()) { <span class="tool-badge">{{ filters.activeTags().size }}</span> }
          </button>
          @if (filtersOpen()) { <tl-filter-panel (closed)="filtersOpen.set(false)" /> }
        </div>
        <button type="button" class="tool lang" (click)="i18n.toggle()" [title]="i18n.t('switchLangLabel')">
          <span [class.on]="i18n.lang() === 'es'">ES</span><span class="sep">/</span><span [class.on]="i18n.lang() === 'en'">EN</span>
        </button>
        <button type="button" class="tool" (click)="theme.toggle()" [title]="theme.dark() ? i18n.t('themeLight') : i18n.t('themeDark')">
          <tl-icon [name]="theme.dark() ? 'sun' : 'moon'" />
        </button>
        <button type="button" class="tool hide-sm" (click)="printer.print()" [disabled]="printer.busy()" [title]="i18n.t('print')">
          <tl-icon name="print" />
        </button>
        <button type="button" class="tool" (click)="copy()" [title]="copied() ? i18n.t('copied') : i18n.t('share')">
          <tl-icon [name]="copied() ? 'check' : 'link'" />
        </button>
        <button type="button" class="tool hide-sm" (click)="fullscreen()" [title]="isFull() ? i18n.t('exitFullscreen') : i18n.t('fullscreen')">
          <tl-icon [name]="isFull() ? 'shrink' : 'expand'" />
        </button>
      </div>
    </header>
    @if (copied()) { <div class="toast" role="status">{{ i18n.t('copied') }}</div> }
  `,
})
export class TopBarComponent {
  readonly nav = inject(NavigationService);
  readonly i18n = inject(I18nService);
  readonly theme = inject(ThemeService);
  readonly filters = inject(FilterService);
  readonly printer = inject(PrintService);
  private url = inject(UrlStateService);

  readonly filtersOpen = signal(false);
  readonly copied = signal(false);
  readonly isFull = signal(false);
  readonly era = computed(() => (this.nav.atHome() ? null : this.nav.currentEra()));
  readonly roman = computed(() => ROMAN[(this.era()?.eraIndex ?? 1) - 1]);
  readonly eraColor = computed(() => themed(this.era()?.color ?? '#999999', this.theme.dark()));

  constructor() {
    document.addEventListener('fullscreenchange', () => this.isFull.set(!!document.fullscreenElement));
  }

  copy(): void {
    const text = this.url.currentUrl();
    const done = () => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2200);
    };
    navigator.clipboard?.writeText(text).then(done, () => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      done();
    });
  }

  fullscreen(): void {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  }
}

/** Category filters, OR/AND logic and highlighting (A68, A69). */
@Component({
  selector: 'tl-filter-panel',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="popover filter-panel" role="dialog" [attr.aria-label]="i18n.t('filters')">
      <div class="fp-head">
        <span class="fp-title">{{ i18n.t('filtersTitle') }}</span>
        <span class="fp-quick">
          <button type="button" (click)="filters.setAll(true)">{{ i18n.t('all') }}</button>
          <button type="button" (click)="filters.setAll(false)">{{ i18n.t('none') }}</button>
        </span>
        <button type="button" class="fp-close" (click)="closed.emit()" aria-label="×"><tl-icon name="close" /></button>
      </div>
      <ul class="fp-tags">
        @for (t of filters.tags; track t.id) {
          <li>
            <button type="button" class="fp-tag" [class.is-on]="filters.activeTags().has(t.id)"
                    [class.is-hl]="filters.highlightedTags().has(t.id)" [style.--c]="color(t)"
                    (click)="tap(t)" (contextmenu)="highlight($event, t)" [attr.aria-pressed]="filters.activeTags().has(t.id)">
              <span class="fp-dot"></span>
              <span class="fp-label">{{ i18n.text('tag.' + t.id + '.label', t.label) }}</span>
              @if (filters.highlightedTags().has(t.id)) { <span class="fp-star">★</span> }
            </button>
          </li>
        }
      </ul>
      <div class="fp-row">
        <span class="fp-k">{{ i18n.t('filterAction') }}</span>
        <div class="seg">
          <button type="button" [class.on]="action() === 'filter'" (click)="action.set('filter')">{{ i18n.t('actionFilter') }}</button>
          <button type="button" [class.on]="action() === 'highlight'" (click)="action.set('highlight')">{{ i18n.t('actionHighlight') }}</button>
        </div>
      </div>
      <div class="fp-row">
        <span class="fp-k">{{ i18n.t('logic') }}</span>
        <div class="seg">
          <button type="button" [class.on]="filters.filterMode() === 'or'" (click)="filters.setMode('or')">{{ i18n.t('logicOr') }}</button>
          <button type="button" [class.on]="filters.filterMode() === 'and'" (click)="filters.setMode('and')">{{ i18n.t('logicAnd') }}</button>
        </div>
      </div>
      <div class="fp-foot">
        <span class="fp-hint">{{ i18n.t('highlightHint') }}</span>
        @if (filters.hasHighlights()) {
          <button type="button" class="fp-clear" (click)="filters.clearHighlights()">{{ i18n.t('clearHighlights') }}</button>
        }
      </div>
    </div>
  `,
})
export class FilterPanelComponent {
  readonly closed = output<void>();
  readonly filters = inject(FilterService);
  readonly i18n = inject(I18nService);
  private theme = inject(ThemeService);
  readonly action = signal<'filter' | 'highlight'>('filter');

  color(t: TimelineTag): string {
    return themed(t.color, this.theme.dark());
  }

  tap(t: TimelineTag): void {
    if (this.action() === 'filter') this.filters.toggleTag(t.id);
    else this.filters.toggleHighlight(t.id);
  }

  highlight(ev: Event, t: TimelineTag): void {
    ev.preventDefault();
    this.filters.toggleHighlight(t.id);
  }
}

/** Zoom, up one level and overview buttons (A43). */
@Component({
  selector: 'tl-nav-controls',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="navctl" [attr.aria-label]="i18n.t('home')">
      <button type="button" (click)="nav.zoomIn()" [title]="i18n.t('zoomIn')"><tl-icon name="plus" /></button>
      <button type="button" (click)="nav.zoomOut()" [title]="i18n.t('zoomOut')"><tl-icon name="minus" /></button>
      <span class="navctl-sep"></span>
      <button type="button" (click)="nav.up()" [disabled]="nav.atHome()" [title]="i18n.t('up')"><tl-icon name="up" /></button>
      <button type="button" (click)="nav.home()" [disabled]="nav.atHome()" [title]="i18n.t('home')"><tl-icon name="home" /></button>
    </nav>
  `,
})
export class NavControlsComponent {
  readonly nav = inject(NavigationService);
  readonly i18n = inject(I18nService);
}

/**
 * Bottom bar (A46–A48, A50): where the visitor is (breadcrumb + a small real-scale timeline
 * with the position marked) and the previous / next controls of the path.
 */
@Component({
  selector: 'tl-context-bar',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let g = nav.guide();
    @if (g) {
      <div class="guide-chip" [style.--c]="guideColor()">
        <span class="gc-k">{{ i18n.t('inGuide') }}</span>
        <span class="gc-name">{{ i18n.text('guide.' + g.id + '.title', g.title) }}</span>
        <button type="button" class="gc-back" (click)="nav.backToGuide()"><tl-icon name="back" />{{ i18n.t('guideBack') }}</button>
        <button type="button" class="gc-x" (click)="nav.exitGuide()" [title]="i18n.t('guideExit')"><tl-icon name="close" /></button>
      </div>
    }
    <footer class="ctxbar" [class.is-empty]="nav.atHome()">
      <div class="crumbs">
        @if (!nav.atHome()) {
          <button type="button" class="crumb crumb-home" (click)="nav.home()">{{ i18n.t('overview') }}</button>
          @for (p of crumbs(); track p.id; let last = $last) {
            <span class="crumb-sep">›</span>
            <button type="button" class="crumb" [class.is-last]="last" (click)="nav.goTo(p.id)">{{ p.label }}</button>
          }
        }
      </div>

      <div class="mini" (click)="jump($event)" [title]="i18n.t('overview')">
        <div class="mini-track">
          @for (e of eras(); track e.id) {
            <span class="mini-era" [class.is-here]="e.here" [style.left.%]="e.left" [style.width.%]="e.width" [style.--c]="e.color"></span>
          }
          @if (marker(); as m) {
            <span class="mini-mark" [class.is-range]="m.width > 0.6" [style.left.%]="m.left" [style.width.%]="m.width"></span>
          }
        </div>
        <div class="mini-ticks">
          @for (tk of ticks; track tk.y) { <span [style.left.%]="tk.left">{{ tk.label }}</span> }
        </div>
        @if (here(); as h) { <div class="mini-here">{{ h }}</div> }
      </div>

      <div class="pager">
        <button type="button" class="pg" (click)="nav.prev()" [disabled]="nav.tourIndex() < 0" [title]="i18n.t('prev')"><tl-icon name="prev" /></button>
        <span class="pg-count">
          @if (nav.tourIndex() >= 0) { {{ nav.tourIndex() + 1 }}<i>/</i>{{ nav.steps().length }} }
          @else { {{ i18n.t('tour') }} }
        </span>
        <button type="button" class="pg pg-next" (click)="nav.next()" [disabled]="nav.tourIndex() >= nav.steps().length - 1"
                [title]="i18n.t('next')"><tl-icon name="next" /></button>
      </div>
    </footer>
  `,
})
export class ContextBarComponent {
  readonly nav = inject(NavigationService);
  readonly i18n = inject(I18nService);
  private data = inject(TimelineDataService);
  private theme = inject(ThemeService);

  private readonly t0 = Math.min(...this.data.eras.map((e) => e.start));
  private readonly t1 = Math.max(...this.data.eras.map((e) => e.end));
  private pct = (y: number) => ((y - this.t0) / (this.t1 - this.t0)) * 100;

  readonly ticks = [-200, 200, 600, 1000, 1400, 1800].filter((y) => y > this.t0 && y < this.t1).map((y) => ({
    y, left: this.pct(y), label: y < 0 ? `${-y}` : `${y}`,
  }));

  readonly guideColor = computed(() => themed(this.nav.guide()?.color ?? '#999999', this.theme.dark()));

  readonly eras = computed(() => {
    const cur = this.nav.atHome() ? null : this.nav.currentEra();
    return this.data.eras.map((e) => ({
      id: e.id, left: this.pct(e.start), width: this.pct(e.end) - this.pct(e.start),
      color: themed(e.color, this.theme.dark()), here: cur?.id === e.id,
    }));
  });

  readonly marker = computed(() => {
    if (this.nav.atHome()) return null;
    const it = this.nav.currentEvent() ?? this.nav.currentEra();
    if (!it) return null;
    return { left: this.pct(it.start), width: Math.max(0, this.pct(it.end) - this.pct(it.start)) };
  });

  readonly here = computed(() => {
    if (this.nav.atHome()) return '';
    const it = this.nav.currentEvent() ?? this.nav.currentEra();
    return it ? this.i18n.year(it.yearLabel) : '';
  });

  readonly crumbs = computed(() =>
    this.nav.path().map((p) => {
      let label = '';
      if (p.kind === 'read') label = this.i18n.t('read');
      else if (p.kind === 'guide') {
        const g = this.data.guides.find((x) => x.id === p.guideId);
        label = g ? this.i18n.text(`guide.${g.id}.title`, g.title) : '';
      } else if (p.kind === 'block' || p.kind === 'point') {
        label = this.blockLabel(p.id);
      } else if (p.item) label = this.i18n.text(`${p.item.id}.title`, p.item.title);
      return { id: p.id, label };
    }),
  );

  private blockLabel(nodeId: string): string {
    const [ev, blockId, pointId] = nodeId.split('::');
    const b = this.data.custom.events[ev]?.blocks?.find((x) => x.id === blockId);
    if (!b) return '';
    if (pointId && b.type === 'lineage') {
      const p = b.nodes.find((n) => n.id === pointId);
      return p ? this.i18n.text(`custom.${b.id}.${p.id}.label`, p.label) : '';
    }
    return this.i18n.text(`custom.${b.id}.title`, b.title);
  }

  /** Click on the small timeline: fly to the era of that year (A47). */
  jump(ev: MouseEvent): void {
    const track = (ev.currentTarget as HTMLElement).querySelector('.mini-track') as HTMLElement;
    const box = track.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (ev.clientX - box.left) / box.width));
    const year = this.t0 + f * (this.t1 - this.t0);
    const era = this.data.eras.find((e) => year >= e.start && year <= e.end) ?? this.data.eras[this.data.eras.length - 1];
    this.nav.goTo(era.id);
  }
}
