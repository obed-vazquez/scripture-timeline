import { Injectable, effect, signal } from '@angular/core';

const KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly dark = signal<boolean>(this.initial());

  constructor() {
    effect(() => {
      const dark = this.dark();
      const root = document.documentElement;
      root.setAttribute('data-theme', dark ? 'dark' : 'light');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#101216' : '#f2ece0');
      try {
        localStorage.setItem(KEY, dark ? 'dark' : 'light');
      } catch {
        /* storage unavailable */
      }
    });
  }

  toggle(): void {
    this.dark.update((d) => !d);
  }

  private initial(): boolean {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
    } catch {
      /* storage unavailable */
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
  }
}
