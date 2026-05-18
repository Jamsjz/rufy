import { ISyllableSegmenter } from './types';

export class SyllableSegmenter implements ISyllableSegmenter {
  private vowels: Set<string> = new Set('अआइईउऊऋएऐओऔ'.split(''));
  private vowelSigns: Set<string> = new Set('ािीुूृेैोौ'.split(''));
  private halant = '्';

  getSyllables(word: string): string[] {
    const syllables: string[] = [];
    let current: string[] = [];
    let i = 0;
    const n = word.length;

    while (i < n) {
      const ch = word[i];
      if (this.vowels.has(ch)) {
        if (current.length > 0) {
          syllables.push(current.join(''));
          current = [];
        }
        current.push(ch);
        syllables.push(current.join(''));
        current = [];
        i++;
      } else if (ch === this.halant) {
        if (current.length > 0) {
          current.push(ch);
        }
        i++;
      } else if (this.vowelSigns.has(ch)) {
        if (current.length > 0) {
          current.push(ch);
          syllables.push(current.join(''));
          current = [];
        } else {
          // Should not happen, but fallback
          syllables.push(ch);
        }
        i++;
      } else {
        // Consonant
        if (current.length > 0 && current[current.length - 1] !== this.halant) {
          syllables.push(current.join(''));
          current = [];
        }
        current.push(ch);
        i++;
      }
    }

    if (current.length > 0) {
      syllables.push(current.join(''));
    }
    return syllables;
  }
}
