import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const PATHS: Record<string, string> = {
  home: 'M3 7V3h4 M21 7V3h-4 M3 17v4h4 M21 17v4h-4 M8 12h8 M12 8v8',
  up: 'M9 14 4 9l5-5 M4 9h10.5a5.5 5.5 0 0 1 0 11H11',
  plus: 'M12 5v14 M5 12h14',
  minus: 'M5 12h14',
  prev: 'M15 18l-6-6 6-6',
  next: 'M9 18l6-6-6-6',
  filter: 'M4 6h16 M7 12h10 M10 18h4',
  print: 'M6 9V2h12v7 M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2 M6 14h12v8H6z',
  link: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  sun: 'M12 3v1 M12 20v1 M3 12h1 M20 12h1 M5.6 5.6l.7.7 M17.7 17.7l.7.7 M5.6 18.4l.7-.7 M17.7 6.3l.7-.7 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
  expand: 'M15 3h6v6 M9 21H3v-6 M21 3l-7 7 M3 21l7-7',
  shrink: 'M4 14h6v6 M20 10h-6V4 M14 10l7-7 M3 21l7-7',
  close: 'M18 6 6 18 M6 6l12 12',
  back: 'M19 12H5 M12 19l-7-7 7-7',
  list: 'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01',
  check: 'M20 6 9 17l-5-5',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M20.5 20.5 16 16',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 16.5v-5 M12 7.6v.01',
  music: 'M9 18.5V5.8l11-2.3v12.2 M9 18.5a2.6 2.6 0 1 1-5.2 0 2.6 2.6 0 0 1 5.2 0z M20 15.7a2.6 2.6 0 1 1-5.2 0 2.6 2.6 0 0 1 5.2 0z',
  musicOff: 'M9 18.5V9 M9 5.8l11-2.3v10 M9 18.5a2.6 2.6 0 1 1-5.2 0 2.6 2.6 0 0 1 5.2 0z M3 3l18 18',
  play: 'M7 4.5v15l12.5-7.5z',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M12 12h.01',
  more: 'M5 12h.01 M12 12h.01 M19 12h.01',
};

@Component({
  selector: 'tl-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"
                  stroke-linecap="round" stroke-linejoin="round"><path [attr.d]="d()" /></svg>`,
  host: { class: 'icon' },
})
export class IconComponent {
  readonly name = input.required<string>();
  readonly d = computed(() => PATHS[this.name()] ?? '');
}
