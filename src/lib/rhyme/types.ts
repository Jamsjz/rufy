export type RhymeMode = 'strict' | 'loose' | 'very_loose';

export interface ISyllableSegmenter {
  getSyllables(word: string): string[];
}

export interface IVowelAnalyzer {
  getVowelFamily(rawVowel: string, mode: RhymeMode): string;
  getVowelSound(syl: string, mode: RhymeMode, ignoreNasal: boolean): string;
  isHeavySyllable(syl: string, vowelSound: string): boolean;
}

export interface IConsonantAnalyzer {
  getConsonantPattern(syl: string, ignoreNasal: boolean): string;
  consonantSimilarity(c1: string, c2: string): number;
  consonantBonus(cons1: string, cons2: string): number;
}

export interface IRhymeScorer {
  rhymeScore(
    w1: string,
    w2: string,
    mode?: RhymeMode,
    ignoreNasal?: boolean,
    strictAlignment?: boolean
  ): number;
  rhymes(
    w1: string,
    w2: string,
    mode?: RhymeMode,
    ignoreNasal?: boolean
  ): boolean;
}
