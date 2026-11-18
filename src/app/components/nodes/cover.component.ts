import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SceneNode, coverTitleSize } from '../../engine/scene';
import { I18nService } from '../../services/i18n.service';
import { TimelineDataService } from '../../services/timeline-data.service';
import { ThemeService } from '../../services/theme.service';
import { NavigationService } from '../../services/navigation.service';
import { READ_GEOMETRY, ReadingLayoutService } from '../../services/reading-layout.service';
import { themed } from '../../utils/color.util';
import { Rect } from '../../engine/geometry';

const box = (r: Rect) => ({ left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px` });

/**
 * The page of an event (default template, A62). Its states follow the zoom (the stage drives
 * --txt and --dt): the image with year and title; then categories and summary (the "header
 * view"); and, on wide screens, the "detail view": the image goes to the background, the title
 * moves up to one line, the summary spans the page and the full text fills it in columns.
 */
@Component({
  selector: 'tl-cover',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let it = item();
    @let L = layout();
    <div class="cover" [class.no-image]="!it.image" [class.is-portrait]="portrait()" [style.--c]="color()">
      <div class="cv-main">
        @if (it.image) {
          <div class="cv-image" [style]="boxOf(L.image)">
            <img [src]="it.image" [alt]="title()" loading="lazy" decoding="async" draggable="false" (error)="onImgError($event)" />
          </div>
        } @else {
          <div class="cv-watermark" aria-hidden="true">{{ yearNum() }}</div>
        }
        <div class="cv-text" [style]="boxOf(L.text)">
          <div class="cv-year">{{ year() }}</div>
          <h2 class="cv-title" [style.font-size.px]="titleSize()">{{ title() }}</h2>
          <div class="cv-tags rv">
            @for (t of tags(); track t.id) {
              <span class="cv-tag"><i [style.background]="t.color"></i>{{ t.label }}</span>
            }
          </div>
          <p class="cv-desc rv">{{ shortDesc() }}</p>
        </div>
      </div>
      @if (!portrait()) {
        <div class="cv-detail" [style.--fs.px]="fit().font" [style.--cols]="fit().cols">
          @if (it.image) { <div class="cd-bg" [style.background-image]="'url(' + it.image + ')'"></div> }
          <div class="cd-head">
            <span class="cd-year">{{ year() }}</span>
            <h2 class="cd-title">{{ title() }}</h2>
            <span class="cd-tags">
              @for (t of tags(); track t.id) { <i [style.background]="t.color" [title]="t.label"></i> }
            </span>
          </div>
          <p class="cd-sub">{{ shortDesc() }}</p>
          <div class="cd-body read-body" [style.height.px]="fit().h ?? null" [style.width.px]="fit().w ?? null">
            <div [innerHTML]="html()"></div>
            @if (L.figure && fit().cols > 1) { <div class="cd-spacer" [style.height.px]="L.figure.h + 34"></div> }
          </div>
        </div>
      }
      @if (L.subtl) {
        <div class="cv-subtl-label rv" [style.left.px]="L.subtl.x" [style.top.px]="L.subtl.y - 8">
          {{ i18n.t('contains') }} {{ it.children.length }} {{ i18n.t('eventsWord') }}
        </div>
      }
      @if (nav.reviewMode() && reviewNote()) {
        <div class="review-badge">{{ reviewNote() }}</div>
      }
    </div>
  `,
})
export class CoverComponent {
  readonly node = input.required<SceneNode>();
  readonly i18n = inject(I18nService);
  readonly nav = inject(NavigationService);
  private data = inject(TimelineDataService);
  private theme = inject(ThemeService);
  private sanitizer = inject(DomSanitizer);
  private reading = inject(ReadingLayoutService);

  readonly item = computed(() => this.node().item!);
  readonly layout = computed(() => this.node().cover!);
  readonly portrait = computed(() => this.layout().w === 1000);
  readonly orient = computed(() => (this.portrait() ? 'v' : 'h'));
  readonly color = computed(() => themed(this.item().color, this.theme.dark()));
  readonly title = computed(() => this.i18n.text(`${this.item().id}.title`, this.item().title));
  readonly shortDesc = computed(() => this.i18n.text(`${this.item().id}.shortDesc`, this.item().shortDesc));
  readonly year = computed(() => this.i18n.year(this.item().yearLabel));
  readonly yearNum = computed(() => {
    const y = this.item().start;
    return y < 0 ? `${-y}` : `${y}`;
  });
  readonly tags = computed(() =>
    this.item().tags.map((id) => {
      const t = this.data.tag(id)!;
      return { id, color: themed(t.color, this.theme.dark()), label: this.i18n.text(`tag.${id}.label`, t.label) };
    }),
  );
  readonly titleSize = computed(() => coverTitleSize(this.title(), !!this.item().image, this.orient()));
  /** Type size and columns that make the full text fit the detail view. */
  readonly fit = computed(() => this.reading.detail().get(this.item().id) ?? { font: 20, cols: 3 });
  readonly html = computed<SafeHtml>(() => {
    const it = this.item();
    return this.sanitizer.bypassSecurityTrustHtml(this.i18n.text(`${it.id}.fullDesc`, it.fullDesc));
  });
  readonly reviewNote = computed(() => {
    const it = this.item();
    if (this.i18n.lang() === 'es') return it.pendingReview ? this.i18n.t('pending') : '';
    const s = this.i18n.status(`${it.id}.title`, it.title);
    const d = this.i18n.status(`${it.id}.fullDesc`, it.fullDesc);
    if (s === 'missing' || d === 'missing') return this.i18n.t('missing');
    if (s === 'stale' || d === 'stale') return this.i18n.t('stale');
    if (s === 'pending' || d === 'pending' || it.pendingReview) return this.i18n.t('pending');
    return '';
  });

  boxOf = box;

  onImgError(ev: Event): void {
    const img = ev.target as HTMLImageElement;
    img.closest('.cv-image')?.classList.add('is-broken');
  }
}

/** Phones: the full text of an event, readable when the visitor zooms into it (A67: no scroll boxes). */
@Component({
  selector: 'tl-read-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="read" [class.is-portrait]="orient() === 'v'" [style.--c]="color()"
             [style.padding]="geo().padY + 'px ' + geo().padX + 'px'">
      <div class="read-body" [style.column-count]="cols()" [style.column-gap.px]="geo().gap" [innerHTML]="html()"></div>
      @if (nav.reviewMode() && note()) {
        <div class="review-badge">{{ note() }}</div>
      }
    </article>
  `,
})
export class ReadPanelComponent {
  readonly node = input.required<SceneNode>();
  readonly orient = input.required<'h' | 'v'>();
  readonly nav = inject(NavigationService);
  private i18n = inject(I18nService);
  private theme = inject(ThemeService);
  private sanitizer = inject(DomSanitizer);
  private reading = inject(ReadingLayoutService);

  readonly geo = computed(() => READ_GEOMETRY[this.orient()]);
  readonly color = computed(() => themed(this.node().item!.color, this.theme.dark()));
  readonly cols = computed(() => this.reading.sizes().get(this.node().item!.id)?.cols ?? 1);
  readonly html = computed<SafeHtml>(() => {
    const it = this.node().item!;
    return this.sanitizer.bypassSecurityTrustHtml(this.i18n.text(`${it.id}.fullDesc`, it.fullDesc));
  });
  readonly note = computed(() => {
    const it = this.node().item!;
    if (this.i18n.lang() === 'es') return it.pendingReview ? this.i18n.t('pending') : '';
    const s = this.i18n.status(`${it.id}.fullDesc`, it.fullDesc);
    return s === 'missing' ? this.i18n.t('missing') : s === 'stale' ? this.i18n.t('stale') : s === 'pending' ? this.i18n.t('pending') : '';
  });
}
