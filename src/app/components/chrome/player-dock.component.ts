import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MediaService, Player } from '../../services/media.service';
import { NavigationService } from '../../services/navigation.service';
import { I18nService } from '../../services/i18n.service';
import { IconComponent } from './icon.component';

/**
 * The YouTube players (videos and music). Each one either sits over its video block on the
 * canvas (the stage moves it every frame) or is docked in a corner, small, still playing.
 * The iframes never move in the DOM, so playback is never interrupted.
 */
@Component({
  selector: 'tl-player-dock',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (p of media.players(); track p.key) {
      @let att = media.attached()[p.key];
      <!-- over its block the player takes clicks only while the camera rests on it; otherwise they reach the canvas -->
      <div class="player" [attr.data-player]="p.key" [class.is-docked]="!att" [class.is-live]="!att || att.current"
           [class.is-music]="p.kind === 'music'">
        <div class="pl-bar">
          <span class="pl-kind"><tl-icon [name]="p.kind === 'music' ? 'music' : 'play'" /></span>
          <span class="pl-title">{{ p.kind === 'music' ? i18n.t('music') : p.title }}</span>
          @if (p.kind === 'video') {
            <button type="button" class="pl-btn" (click)="goTo(p)" [title]="i18n.t('goToVideo')"><tl-icon name="target" /></button>
          } @else {
            <input type="range" class="pl-vol" min="0" max="100" [value]="media.volume()" (input)="volume($event)"
                   [attr.aria-label]="i18n.t('volume')" [title]="i18n.t('volume')" />
          }
          <button type="button" class="pl-btn" (click)="media.close(p)" [title]="i18n.t('closePlayer')"><tl-icon name="close" /></button>
        </div>
        <iframe [src]="src(p)" [title]="p.title" (load)="loaded(p, $event)"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen
                referrerpolicy="strict-origin-when-cross-origin"></iframe>
      </div>
    }
  `,
})
export class PlayerDockComponent {
  readonly media = inject(MediaService);
  readonly i18n = inject(I18nService);
  private nav = inject(NavigationService);
  private sanitizer = inject(DomSanitizer);
  /** One SafeResourceUrl per player: a new object would make Angular reload the iframe. */
  private urls = new Map<string, SafeResourceUrl>();

  src(p: Player): SafeResourceUrl {
    const key = `${p.pid}`;
    let u = this.urls.get(key);
    if (!u) {
      u = this.sanitizer.bypassSecurityTrustResourceUrl(this.media.src(p));
      this.urls.set(key, u);
    }
    return u;
  }

  loaded(p: Player, ev: Event): void {
    this.media.registerFrame(p, ev.target as HTMLIFrameElement);
  }

  volume(ev: Event): void {
    this.media.setVolume(Number((ev.target as HTMLInputElement).value));
  }

  goTo(p: Player): void {
    if (p.nodeId) this.nav.goTo(p.nodeId);
  }
}
