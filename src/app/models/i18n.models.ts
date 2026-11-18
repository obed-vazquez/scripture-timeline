export type Lang = 'es' | 'en';

/**
 * One translated text.
 *  src       hash of the Spanish source it was translated from (see utils/hash.util.ts).
 *            If the Spanish text changes, the hash no longer matches: the translation is stale.
 *  text      the English text.
 *  reviewed  true once the user has reviewed it. Until then it is pending review.
 */
export interface Translation {
  src: string;
  text: string;
  reviewed?: boolean;
}

export type TranslationTable = Record<string, Translation>;
