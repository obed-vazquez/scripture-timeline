/** Mixes a '#rrggbb' colour with another one. t = 0 keeps a, t = 1 gives b. */
export function mix(a: string, b: string, t: number): string {
  const pa = parse(a);
  const pb = parse(b);
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
}

/**
 * Category and era colours are written once in the data. On the light (parchment)
 * theme they are deepened so they keep their contrast.
 */
export function themed(hex: string, dark: boolean): string {
  if (!hex) return hex;
  return dark ? hex : mix(hex, '#2b2016', 0.3);
}

function parse(hex: string): number[] {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
