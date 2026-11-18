/*
 * Translation report and stamping (no external service: translations are written by the implementer).
 *
 *   npm run i18n           → lists missing, stale (Spanish changed) and pending-review translations
 *   npm run i18n -- stamp  → fills the `src` hash of new translations (entries written with src: '')
 *
 * Runs with Node's built-in TypeScript support (Node 22.18+).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { TIMELINE_ITEMS, TIMELINE_TAGS } from '../src/app/data/timeline.data.ts';
import { TIMELINE_CUSTOM } from '../src/app/data/timeline.custom.ts';
import { EN_TRANSLATIONS } from '../src/app/data/timeline.en.ts';
import { textHash } from '../src/app/utils/hash.util.ts';

const EN_FILE = fileURLToPath(new URL('../src/app/data/timeline.en.ts', import.meta.url));

/** Every translatable text: key → Spanish source. */
function sources(): Map<string, string> {
  const m = new Map<string, string>();
  const put = (k: string, v: string | undefined) => {
    if (v && v.trim()) m.set(k, v);
  };
  for (const it of TIMELINE_ITEMS) {
    put(`${it.id}.title`, it.title);
    put(`${it.id}.shortDesc`, it.shortDesc);
    put(`${it.id}.fullDesc`, it.fullDesc);
  }
  for (const t of TIMELINE_TAGS) put(`tag.${t.id}.label`, t.label);
  for (const g of TIMELINE_CUSTOM.guides) {
    put(`guide.${g.id}.title`, g.title);
    put(`guide.${g.id}.description`, g.description);
  }
  for (const ev of Object.values(TIMELINE_CUSTOM.events)) {
    for (const b of ev.blocks ?? []) {
      put(`custom.${b.id}.title`, b.title);
      if (b.type === 'video') put(`custom.${b.id}.caption`, b.caption);
      if (b.type === 'lineage') {
        put(`custom.${b.id}.caption`, b.caption);
        for (const n of b.nodes) {
          put(`custom.${b.id}.${n.id}.label`, n.label);
          put(`custom.${b.id}.${n.id}.detail`, n.detail);
        }
      }
    }
  }
  return m;
}

const src = sources();
const mode = process.argv[2] ?? 'report';

if (mode === 'stamp') {
  let file = readFileSync(EN_FILE, 'utf8');
  let n = 0;
  for (const [key, text] of src) {
    const tr = EN_TRANSLATIONS[key];
    if (!tr || tr.src) continue;
    const re = new RegExp(`('${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}':\\s*\\{\\s*src:\\s*)''`);
    if (re.test(file)) {
      file = file.replace(re, `$1'${textHash(text)}'`);
      n++;
    }
  }
  writeFileSync(EN_FILE, file);
  console.log(`stamped ${n} translation(s)`);
} else {
  const missing: string[] = [];
  const stale: string[] = [];
  const unstamped: string[] = [];
  let pending = 0;
  let ok = 0;
  for (const [key, text] of src) {
    const tr = EN_TRANSLATIONS[key];
    if (!tr) missing.push(key);
    else if (!tr.src) unstamped.push(key);
    else if (tr.src !== textHash(text)) stale.push(key);
    else if (tr.reviewed) ok++;
    else pending++;
  }
  const orphans = Object.keys(EN_TRANSLATIONS).filter((k) => !src.has(k));
  console.log(`texts: ${src.size} · reviewed: ${ok} · pending review: ${pending} · stale: ${stale.length} · missing: ${missing.length}`);
  if (unstamped.length) console.log(`\nnot stamped (run: npm run i18n -- stamp):\n  ${unstamped.join('\n  ')}`);
  if (stale.length) console.log(`\nSTALE — the Spanish changed, translate again:\n  ${stale.join('\n  ')}`);
  if (missing.length) console.log(`\nMISSING:\n  ${missing.join('\n  ')}`);
  if (orphans.length) console.log(`\nunused translations (source no longer exists):\n  ${orphans.join('\n  ')}`);
  process.exitCode = stale.length || missing.length ? 1 : 0;
}
