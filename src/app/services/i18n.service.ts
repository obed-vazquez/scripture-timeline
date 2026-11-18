import { Injectable, computed, effect, isDevMode, signal } from '@angular/core';
import { EN_TRANSLATIONS } from '../data/timeline.en';
import { Lang, Translation } from '../models/i18n.models';
import { UI_STRINGS, UiKey } from '../i18n/ui-strings';
import { textHash } from '../utils/hash.util';

export type TranslationStatus = 'source' | 'ok' | 'pending' | 'stale' | 'missing';

const STORAGE_KEY = 'timeline-lang';

/**
 * Two languages. The content is written in Spanish (timeline.data.ts); English comes from
 * timeline.en.ts. A text without translation is shown in Spanish, never empty.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>(this.initialLang());
  readonly ui = computed(() => UI_STRINGS[this.lang()]);
  private readonly table: Record<string, Translation> = EN_TRANSLATIONS;

  constructor() {
    effect(() => {
      const lang = this.lang();
      document.documentElement.lang = lang;
      document.title = UI_STRINGS[lang].appTitle;
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        /* storage unavailable */
      }
    });
  }

  set(lang: Lang): void {
    this.lang.set(lang);
  }

  toggle(): void {
    this.lang.update((l) => (l === 'es' ? 'en' : 'es'));
  }

  t(key: UiKey): string {
    return this.ui()[key];
  }

  /** Text of a content field in the active language (falls back to the Spanish source). */
  text(key: string, source: string): string {
    if (this.lang() === 'es' || !source) return source;
    const tr = this.table[key];
    if (!tr) {
      if (isDevMode()) this.warn(key, 'missing');
      return source;
    }
    return tr.text;
  }

  status(key: string, source: string): TranslationStatus {
    if (this.lang() === 'es' || !source) return 'source';
    const tr = this.table[key];
    if (!tr) return 'missing';
    if (tr.src !== textHash(source)) return 'stale';
    return tr.reviewed ? 'ok' : 'pending';
  }

  /** "~250 a.C." → "c. 250 BC" in English; unchanged in Spanish. */
  year(label: string): string {
    if (this.lang() === 'es') return label;
    return label
      .replace(/~\s*/g, 'c. ')
      .replace(/\s*a\.\s?C\./gi, ' BC')
      .replace(/\s*d\.\s?C\./gi, ' AD')
      .replace(/presente/gi, 'present');
  }

  /** Long date for print headers. */
  date(d: Date): string {
    return d.toLocaleDateString(this.lang() === 'es' ? 'es-MX' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  private warned = new Set<string>();
  private warn(key: string, what: string): void {
    if (this.warned.has(key)) return;
    this.warned.add(key);
    console.warn(`[i18n] ${what}: ${key}`);
  }

  private initialLang(): Lang {
    const fromUrl = new URLSearchParams(location.hash.split('?')[1] ?? '').get('lang');
    if (fromUrl === 'en' || fromUrl === 'es') return fromUrl;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'es') return saved;
    } catch {
      /* storage unavailable */
    }
    return 'es';
  }
}
