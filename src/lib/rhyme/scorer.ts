import {
  IRhymeScorer,
  ISyllableSegmenter,
  IVowelAnalyzer,
  IConsonantAnalyzer,
  RhymeMode,
} from './types';

export class RhymeScorer implements IRhymeScorer {
  constructor(
    private segmenter: ISyllableSegmenter,
    private vowelAnalyzer: IVowelAnalyzer,
    private consonantAnalyzer: IConsonantAnalyzer
  ) { }

  private weightedMiddleMatch(middlePairs: [string, string][], mode: RhymeMode, ignoreNasal: boolean): number {
    if (middlePairs.length === 0) return 0.0;

    let totalWeight = 0.0;
    let matchWeight = 0.0;

    middlePairs.forEach((pair, i) => {
      const weight = Math.pow(0.8, i);
      totalWeight += weight;
      const v1 = this.vowelAnalyzer.getVowelSound(pair[0], mode, ignoreNasal);
      const v2 = this.vowelAnalyzer.getVowelSound(pair[1], mode, ignoreNasal);
      if (v1 === v2) {
        matchWeight += weight;
      }
    });

    return totalWeight > 0 ? (matchWeight / totalWeight) * 2.0 : 0.0;
  }

  rhymeScore(
    w1: string,
    w2: string,
    mode: RhymeMode = 'loose',
    ignoreNasal: boolean = true,
    strictAlignment?: boolean
  ): number {
    const w1s = this.segmenter.getSyllables(w1);
    const w2s = this.segmenter.getSyllables(w2);
    if (!w1s.length || !w2s.length) return 0.0;

    const actualStrictAlignment = strictAlignment !== undefined ? strictAlignment : (mode !== 'very_loose');

    const sylDiff = Math.abs(w1s.length - w2s.length);
    let sylPenalty = 0.0;
    if (sylDiff >= 2) {
      sylPenalty = -0.5;
    } else if (sylDiff === 1) {
      sylPenalty = -0.2;
    }

    const minLen = Math.min(w1s.length, w2s.length);
    const aligned: [string, string][] = [];
    for (let i = 0; i < minLen; i++) {
      aligned.push([w1s[w1s.length - 1 - i], w2s[w2s.length - 1 - i]]);
    }

    if (!aligned.length) return 0.0;

    const lastPair = aligned[0];
    const firstPair = aligned[aligned.length - 1];
    const middlePairs = aligned.slice(1, aligned.length - 1);

    const lastV1 = this.vowelAnalyzer.getVowelSound(lastPair[0], mode, ignoreNasal);
    const lastV2 = this.vowelAnalyzer.getVowelSound(lastPair[1], mode, ignoreNasal);
    const firstV1 = this.vowelAnalyzer.getVowelSound(firstPair[0], mode, ignoreNasal);
    const firstV2 = this.vowelAnalyzer.getVowelSound(firstPair[1], mode, ignoreNasal);

    const lastMatch = lastV1 === lastV2;
    const firstMatch = firstV1 === firstV2;

    let baseScore = 0.0;
    let middleBonus = 0.0;

    if (firstMatch && lastMatch) {
      baseScore = 3.0;
      middleBonus = this.weightedMiddleMatch(middlePairs, mode, ignoreNasal);
    } else if (!firstMatch && lastMatch) {
      if (actualStrictAlignment) {
        return 0.0;
      } else {
        baseScore = 1.5;
        middleBonus = this.weightedMiddleMatch(middlePairs, mode, ignoreNasal);
      }
    } else {
      baseScore = -2.0;
      middleBonus = 0.0;
    }

    let score = baseScore + middleBonus + sylPenalty;

    if (!actualStrictAlignment || (firstMatch && lastMatch)) {
      const cons1 = this.consonantAnalyzer.getConsonantPattern(lastPair[0], ignoreNasal);
      const cons2 = this.consonantAnalyzer.getConsonantPattern(lastPair[1], ignoreNasal);
      score += this.consonantAnalyzer.consonantBonus(cons1, cons2);
    }

    const heavy1 = this.vowelAnalyzer.isHeavySyllable(lastPair[0], lastV1);
    const heavy2 = this.vowelAnalyzer.isHeavySyllable(lastPair[1], lastV2);
    if (heavy1 === heavy2) {
      score += 0.3;
    }

    if (score >= 1.0) {
      const lenDiff = Math.abs(w1.length - w2.length);
      if (lenDiff === 0) {
        score += 0.5;
      } else if (lenDiff === 1) {
        score += 0.25;
      } else if (lenDiff === 2) {
        score += 0.1;
      }
    }

    return Math.max(0.0, score);
  }

  rhymes(w1: string, w2: string, mode: RhymeMode = 'loose', ignoreNasal: boolean = true): boolean {
    return this.rhymeScore(w1, w2, mode, ignoreNasal) >= 3.5;
  }
}
