import { IConsonantAnalyzer } from './types';
import { VOWEL_MAP } from './vowels';

export const CONSONANT_GROUPS: Record<string, Set<string>> = {
  'velar': new Set('कखगघङ'.split('')),
  'palatal': new Set('चछजझञ'.split('')),
  'retroflex': new Set('टठडढण'.split('')),
  'dental': new Set('तथदधन'.split('')),
  'labial': new Set('पफबभम'.split('')),
  'semivowel': new Set('यरलव'.split('')),
  'fricative': new Set('शषसह'.split(''))
};

export class ConsonantAnalyzer implements IConsonantAnalyzer {
  getConsonantPattern(syl: string, ignoreNasal: boolean): string {
    let processedSyl = syl;
    if (ignoreNasal) {
      processedSyl = processedSyl.replace(/ं/g, '').replace(/ँ/g, '');
    }
    for (const v of Object.keys(VOWEL_MAP)) {
      processedSyl = processedSyl.split(v).join('');
    }
    return processedSyl;
  }

  consonantSimilarity(c1: string, c2: string): number {
    if (c1 === c2) {
      return 1.0;
    }
    if (c1.length === 1 && c2.length === 1) {
      for (const group of Object.values(CONSONANT_GROUPS)) {
        if (group.has(c1) && group.has(c2)) {
          return 0.5;
        }
      }
      return 0.0;
    }

    let common = 0;
    const minLen = Math.min(c1.length, c2.length);
    for (let i = 0; i < minLen; i++) {
      if (c1[i] === c2[i]) {
        common++;
      }
    }

    if (c1.length === c2.length) {
      return (common / c1.length) * 0.8;
    }
    return common > 0 ? 0.2 : 0.0;
  }

  consonantBonus(cons1: string, cons2: string): number {
    if (cons1 === cons2) {
      return 0.5;
    }
    const sonorants = new Set('यरलवह'.split(''));
    if ((cons1 === '' && cons2.length === 1 && sonorants.has(cons2)) ||
        (cons2 === '' && cons1.length === 1 && sonorants.has(cons1))) {
      return 0.25;
    }
    return this.consonantSimilarity(cons1, cons2) * 0.5;
  }
}
