/**
 * Parses human-readable year strings into numbers (negative = BC).
 *
 *   "~250 a.C."        → { start: -250, end: null }
 *   "~100 – 380 d.C."  → { start: 100,  end: 380 }
 *   "1454 / 1455"      → { start: 1454, end: 1455 }
 *   "300 a.C. – 313"   → { start: -300, end: 313 }
 *   "2020+"            → { start: 2020, end: null, ongoing: true }
 *   "1800 – presente"  → { start: 1800, end: <current year>, ongoing: true }
 */
export function parseYearString(year: string): { start: number; end: number | null; ongoing: boolean; approx: boolean } {
  const approx = year.includes('~');
  const ongoing = /\+\s*$/.test(year) || /presente|present|hoy/i.test(year);
  const parts = year.split(/[–\-\/]/).map((p) => p.trim());
  const currentYear = new Date().getFullYear();

  const num = (p: string): number | null => {
    const m = p.match(/(\d+)/);
    return m ? parseInt(m[1], 10) : null;
  };

  if (parts.length === 1) {
    const n = num(parts[0]) ?? 0;
    return { start: /a\.C\./i.test(parts[0]) ? -n : n, end: null, ongoing, approx };
  }

  const isStartBC = /a\.C\./i.test(parts[0]) || (!/d\.C\./i.test(parts[0]) && /a\.C\./i.test(parts[1]));
  const isEndBC = /a\.C\./i.test(parts[1]);
  const s = num(parts[0]) ?? 0;
  const e = num(parts[1]);
  return {
    start: isStartBC ? -s : s,
    end: e === null ? (ongoing ? currentYear : null) : isEndBC ? -e : e,
    ongoing,
    approx,
  };
}
