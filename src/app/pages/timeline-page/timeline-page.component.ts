import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StageComponent } from '../../components/stage/stage.component';
import { ContextBarComponent, NavControlsComponent, SearchComponent, TopBarComponent } from '../../components/chrome/chrome.components';
import { PlayerDockComponent } from '../../components/chrome/player-dock.component';
import { UrlStateService } from '../../services/url-state.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'tl-timeline-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StageComponent, TopBarComponent, NavControlsComponent, ContextBarComponent, PlayerDockComponent, SearchComponent],
  template: `
    <tl-stage [initialNode]="initialNode" />
    <tl-player-dock />
    <tl-top-bar />
    <tl-nav-controls />
    <tl-context-bar />
    <tl-search />
  `,
})
export class TimelinePageComponent {
  private url = inject(UrlStateService);
  private nav = inject(NavigationService);
  readonly initialNode: string | null;

  constructor() {
    const params = inject(ActivatedRoute).snapshot.queryParams as Record<string, string | undefined>;
    this.initialNode = this.url.restore(params).node;
    this.url.start();
    effect(() => document.body.classList.toggle('is-review', this.nav.reviewMode()));
  }
}
