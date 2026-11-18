/**
 * FNV-1a 32-bit hash of a text, as 8 hex chars.
 * Used to tie each translation to the exact source text it was made from:
 * when the Spanish text changes, its hash changes and the translation is stale.
 * Line endings are normalised so the hash is the same on Windows and Linux.
 */
export function textHash(text: string): string {
  const s = text.replace(/\r\n/g, '\n');
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}
