import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SceneNode, Orientation } from '../../engine/scene';
import { I18nService } from '../../services/i18n.service';
import { ThemeService } from '../../services/theme.service';
import { Guide, TimelineDataService } from '../../services/timeline-data.service';
import { NavigationService } from '../../services/navigation.service';
import { FilterService } from '../../services/filter.service';
import { themed } from '../../utils/color.util';
import { TimelineItem } from '../../models/timeline.models';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

/** Header of an era: number, name, years, one-line description and a faded image. */
@Component({
  selector: 'tl-era-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let it = node().item!;
    <div class="era" [class.is-portrait]="orient() === 'v'" [class.is-narrow]="orient() === 'h' && node().authW < 760" [style.--c]="color()">
      @if (it.image) {
        <div class="era-bg" [style.background-image]="'url(' + it.image + ')'"></div>
      }
      <div class="era-head" [style.height.px]="headH()">
        <div class="era-num">{{ i18n.t('era') }} {{ roman() }}</div>
        <h2 class="era-title" [style.font-size.px]="titleSize()">{{ title() }}</h2>
        <div class="era-years">{{ year() }}</div>
        <p class="era-desc">{{ desc() }}</p>
      </div>
      @if (nav.reviewMode() && it.pendingReview) {
        <div class="review-badge">{{ i18n.t('pending') }}</div>
      }
    </div>
  `,
})
export class EraHeaderComponent {
  readonly node = input.required<SceneNode>();
  readonly orient = input.required<Orientation>();
  readonly i18n = inject(I18nService);
  readonly nav = inject(NavigationService);
  private theme = inject(ThemeService);

  readonly color = computed(() => themed(this.node().item!.color, this.theme.dark()));
  readonly roman = computed(() => ROMAN[this.node().item!.eraIndex - 1] ?? '');
  readonly title = computed(() => this.i18n.text(`${this.node().item!.id}.title`, this.node().item!.title));
  readonly desc = computed(() => this.i18n.text(`${this.node().item!.id}.shortDesc`, this.node().item!.shortDesc));
  readonly year = computed(() => this.i18n.year(this.node().item!.yearLabel));
  readonly headH = computed(() => (this.orient() === 'h' ? 430 : 470));
  /** Fits the longest word of the title in the era's width. */
  readonly titleSize = computed(() => {
    const w = this.node().authW - (this.orient() === 'h' ? 120 : 140);
    const words = this.title().split(/\s+/);
    const longest = Math.max(...words.map((x) => x.length));
    const max = this.orient() === 'h' ? 118 : 92;
    const byWord = w / (longest * 0.5);
    const byLines = Math.sqrt((w * 210) / Math.max(1, this.title().length * 0.5));
    return Math.round(Math.max(40, Math.min(max, byWord, byLines)));
  });
}

/**
 * The big title of the overview. The hints fade away as soon as the visitor moves (they stay
 * in the ⓘ button of the top bar).
 */
@Component({
  selector: 'tl-title-block',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="title-block" [class.is-portrait]="orient() === 'v'">
      <div class="t-kicker">{{ i18n.t('kicker') }}</div>
      <h1 class="t-title">{{ i18n.t('appTitle') }}</h1>
      <p class="t-sub">{{ i18n.t('subtitle') }}</p>
      <ul class="t-hints">
        <li><span class="t-key">⇲</span>{{ i18n.t('hintDrag') }}</li>
        <li><span class="t-key">⊕</span>{{ i18n.t('hintZoom') }}</li>
        <li><span class="t-key">◎</span>{{ i18n.t('hintClick') }}</li>
        @if (orient() === 'h') {
          <li><span class="t-key">→</span>{{ i18n.t('hintKeys') }}</li>
        }
      </ul>
    </div>
  `,
})
export class TitleBlockComponent {
  readonly orient = input.required<Orientation>();
  readonly i18n = inject(I18nService);
}

/**
 * The hub: one small menu of the guides at the overview. On wide screens, zooming into it
 * sends each line towards a corner, where it becomes the title of its guide (the stage drives
 * that movement); on a phone each line flies to its guide.
 */
@Component({
  selector: 'tl-guide-hub',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="hub" [class.is-portrait]="orient() === 'v'">
      <div class="hub-list">
        <div class="hub-kicker">{{ i18n.t('guidesHeading') }}</div>
        <div class="hub-sub">{{ i18n.t('guidesSub') }}</div>
        @for (g of guides; track g.id; let i = $index) {
          <button type="button" class="hub-row" [attr.data-hubrow]="i" [style.--c]="color(g)" (click)="open($event, g)">
            <span class="hr-dot"></span>
            <span class="hr-title">{{ title(g) }}</span>
            <span class="hr-count">{{ g.entries.length }}</span>
          </button>
        }
      </div>
    </div>
  `,
})
export class GuideHubComponent {
  readonly node = input.required<SceneNode>();
  readonly orient = input.required<Orientation>();
  readonly i18n = inject(I18nService);
  private nav = inject(NavigationService);
  private theme = inject(ThemeService);
  readonly guides = inject(TimelineDataService).guides;

  color(g: Guide): string {
    return themed(g.color, this.theme.dark());
  }

  title(g: Guide): string {
    return this.i18n.text(`guide.${g.id}.title`, g.title);
  }

  open(ev: Event, g: Guide): void {
    ev.stopPropagation();
    this.nav.goTo(`guia:${g.id}`);
  }
}

/** A thematic guide: a menu whose points fly to their events (A55–A61). */
@Component({
  selector: 'tl-guide-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let g = guide();
    @if (g) {
      <div class="guide" [class.is-portrait]="orient() === 'v'" [class.is-active]="nav.activeGuide() === g.id" [style.--c]="color()">
        <div class="g-kicker">{{ i18n.t('guidesHeading') }} · {{ g.entries.length }} {{ i18n.t('guideItems') }}</div>
        <h3 class="g-title">{{ title() }}</h3>
        <p class="g-desc">{{ desc() }}</p>
        <ol class="g-list" [class.three-col]="orient() === 'h'">
          @for (e of g.entries; track e.id; let i = $index) {
            <li>
              <button type="button" class="g-item" [class.is-out]="!visible(e)" [class.is-here]="nav.currentEvent()?.id === e.id"
                      (click)="open($event, e)">
                <span class="g-n">{{ i + 1 }}</span>
                <span class="g-year">{{ i18n.year(e.yearLabel) }}</span>
                <span class="g-name">{{ i18n.text(e.id + '.title', e.title) }}</span>
              </button>
            </li>
          }
        </ol>
      </div>
    }
  `,
})
export class GuideMenuComponent {
  readonly node = input.required<SceneNode>();
  readonly orient = input.required<Orientation>();
  readonly i18n = inject(I18nService);
  readonly nav = inject(NavigationService);
  private data = inject(TimelineDataService);
  private theme = inject(ThemeService);
  private filters = inject(FilterService);

  readonly guide = computed(() => this.data.guides.find((g) => g.id === this.node().guideId) ?? null);
  readonly color = computed(() => themed(this.guide()?.color ?? '#999999', this.theme.dark()));
  readonly title = computed(() => this.i18n.text(`guide.${this.guide()?.id}.title`, this.guide()?.title ?? ''));
  readonly desc = computed(() => this.i18n.text(`guide.${this.guide()?.id}.description`, this.guide()?.description ?? ''));

  visible(e: TimelineItem): boolean {
    this.filters.version();
    return this.filters.isVisible(e);
  }

  open(ev: Event, e: TimelineItem): void {
    ev.stopPropagation();
    if (!this.visible(e)) return;
    this.nav.openGuideItem(this.guide()!.id, e.id);
  }
}
