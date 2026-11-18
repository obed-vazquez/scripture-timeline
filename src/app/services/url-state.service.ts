import { Injectable, Injector, effect, inject, untracked } from '@angular/core';
import { Location } from '@angular/common';
import { FilterService } from './filter.service';
import { I18nService } from './i18n.service';
import { NavigationService } from './navigation.service';
import { LEGACY_IDS } from '../data/legacy-ids';
import { MediaService } from './media.service';

export interface InitialState {
  /** Scene node to open (already translated from legacy ids). */
  node: string | null;
  guide: string | null;
}

/**
 * Keeps the link in sync with the view: filters (tags, mode, highlight), language (lang),
 * active guide (guide) and the point of the diagram (event). A shared link restores all of it.
 */
@Injectable({ providedIn: 'root' })
export class UrlStateService {
  private location = inject(Location);
  private lastQuery = '';
  private filters = inject(FilterService);
  private i18n = inject(I18nService);
  private nav = inject(NavigationService);
  private media = inject(MediaService);
  private injector = inject(Injector);
  private started = false;

  /** Reads the link once at start-up. */
  restore(params: Record<string, string | undefined>): InitialState {
    this.filters.restore(params);
    if (params['revision'] === '1') this.nav.reviewMode.set(true);
    const raw = params['event'] ?? null;
    const node = raw ? (LEGACY_IDS[raw] ?? raw) : null;
    const guide = params['guide'] ?? null;
    if (guide) this.nav.activeGuide.set(guide);
    // background music, as in the tree of positions: ?musica=1 (or ?music=1)
    if (params['musica'] === '1' || params['music'] === '1') this.media.startMusic(true);
    return { node, guide };
  }

  /** Starts writing state changes back into the link. */
  start(): void {
    if (this.started) return;
    this.started = true;
    effect(() => {
      const tags = [...this.filters.activeTags()];
      const all = this.filters.allActive();
      const mode = this.filters.filterMode();
      const hl = [...this.filters.highlightedTags()];
      const lang = this.i18n.lang();
      const guide = this.nav.activeGuide();
      const cur = this.nav.current();
      const review = this.nav.reviewMode();
      const music = this.media.musicOn();
      untracked(() => {
        // A plain replaceState (no router navigation): this runs every time the camera stops.
        const params: Record<string, string | null> = {
          tags: all ? null : tags.join(',') || null,
          mode: mode === 'or' ? null : mode,
          highlight: hl.length ? hl.join(',') : null,
          lang,
          guide: guide ?? null,
          event: cur && cur.kind !== 'title' ? cur.id : null,
          revision: review ? '1' : null,
          musica: music ? '1' : null,
          music: null,
        };
        // ':' and ',' stay readable in shared links (event=lutero::leer, tags=biblia,roma)
        const enc = (v: string) => encodeURIComponent(v).replace(/%3A/gi, ':').replace(/%2C/gi, ',');
        const query = Object.entries(params)
          .filter(([, v]) => !!v)
          .map(([k, v]) => `${k}=${enc(v!)}`)
          .join('&');
        if (query !== this.lastQuery) {
          this.lastQuery = query;
          this.location.replaceState('/timeline', query);
        }
      });
    }, { injector: this.injector });
  }

  /** Absolute link to the current view (for sharing and the print QR). */
  currentUrl(): string {
    return location.href;
  }

  /** Absolute link that opens one node, keeping the language. */
  linkTo(nodeId: string): string {
    const base = `${location.origin}${location.pathname}#/timeline`;
    return `${base}?event=${encodeURIComponent(nodeId)}&lang=${this.i18n.lang()}`;
  }
}
