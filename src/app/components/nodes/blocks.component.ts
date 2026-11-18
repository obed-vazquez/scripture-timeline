import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SceneNode } from '../../engine/scene';
import { LineageBlock, LineageNode, VideoBlock } from '../../models/custom.models';
import { I18nService } from '../../services/i18n.service';
import { NavigationService } from '../../services/navigation.service';
import { ThemeService } from '../../services/theme.service';
import { themed } from '../../utils/color.util';

/**
 * YouTube video (A65). Thumbnail first; the player loads on click. While the camera is not
 * resting on the video a transparent shield covers the player, so dragging or zooming over
 * it never gets trapped inside YouTube (T5.6). Leaving the video pauses it.
 */
@Component({
  selector: 'tl-video-block',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="video" [style.--c]="color()">
      <div class="video-frame">
        @if (playing()) {
          <iframe [src]="src()" title="{{ title() }}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
          @if (!isCurrent()) {
            <button type="button" class="video-shield" [attr.aria-label]="title()" (click)="focus($event)"></button>
          }
        } @else {
          <button type="button" class="video-poster" (click)="play($event)" [attr.aria-label]="i18n.t('playVideo')">
            <img [src]="'https://i.ytimg.com/vi/' + block().youtube + '/hqdefault.jpg'" alt="" loading="lazy" draggable="false" />
            <span class="video-play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg></span>
          </button>
        }
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
  private sanitizer = inject(DomSanitizer);
  private host = inject(ElementRef<HTMLElement>);

  readonly block = computed(() => this.node().block as VideoBlock);
  readonly playing = signal(false);
  readonly color = computed(() => themed(this.node().item!.color, this.theme.dark()));
  readonly title = computed(() => this.i18n.text(`custom.${this.block().id}.title`, this.block().title));
  readonly caption = computed(() => this.i18n.text(`custom.${this.block().id}.caption`, this.block().caption ?? ''));
  readonly isCurrent = computed(() => this.nav.current()?.id === this.node().id);
  readonly src = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${this.block().youtube}?autoplay=1&enablejsapi=1&rel=0&playsinline=1&hl=${this.i18n.lang()}`,
    ),
  );

  constructor() {
    effect(() => {
      if (!this.isCurrent() && this.playing()) this.command('pauseVideo');
    });
  }

  play(ev: Event): void {
    ev.stopPropagation();
    this.playing.set(true);
    this.nav.goTo(this.node().id);
  }

  focus(ev: Event): void {
    ev.stopPropagation();
    this.nav.goTo(this.node().id);
  }

  private command(func: string): void {
    const frame = (this.host.nativeElement as HTMLElement).querySelector('iframe');
    frame?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*');
  }
}

/**
 * A chart with points joined by lines (A63). Each point can be zoomed into to reveal its
 * own detail, and can link to its event. Points can start hidden and appear on a
 * presentation step (A52). Its texts are text, so they translate (A77).
 */
@Component({
  selector: 'tl-lineage-block',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let b = block();
    <figure class="lineage" [style.--c]="color()">
      <figcaption class="lin-head">
        <h3>{{ title() }}</h3>
        @if (caption()) { <p>{{ caption() }}</p> }
      </figcaption>
      <svg class="lin-svg" viewBox="0 0 1400 820" aria-hidden="true">
        @for (e of edges(); track $index) {
          <path [attr.d]="e.d" class="lin-edge" [class.is-hidden]="e.hidden" />
        }
      </svg>
      @for (p of b.nodes; track p.id) {
        <button type="button" class="lin-point" [class.is-hidden]="isHidden(p)" [class.is-here]="isHere(p)"
                [style.left.px]="p.x" [style.top.px]="p.y" (click)="open($event, p)">
          <span class="lin-dot"></span>
          <span class="lin-label">{{ label(p) }}</span>
          <span class="lin-year">{{ i18n.year(p.year) }}</span>
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
    <div class="point" [class.is-hidden]="hidden()" [style.--c]="color()">
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
