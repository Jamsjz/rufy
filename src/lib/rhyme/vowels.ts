import { IVowelAnalyzer, RhymeMode } from './types';

export const VOWEL_MAP: Record<string, string> = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ii', 'उ': 'u', 'ऊ': 'uu',
  'ऋ': 'ri', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
  'ा': 'aa', 'ि': 'i', 'ी': 'ii', 'ु': 'u', 'ू': 'uu',
  'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au'
};

export class VowelAnalyzer implements IVowelAnalyzer {
  getVowelFamily(rawVowel: string, mode: RhymeMode): string {
    if (mode === 'strict') {
      return rawVowel;
    }
    
    let families: Record<string, string[]> = {};
    if (mode === 'loose') {
      families = { 'i': ['i', 'ii'], 'u': ['u', 'uu'] };
    } else if (mode === 'very_loose') {
      families = {
        'a': ['a', 'aa'],
        'i': ['i', 'ii'],
        'u': ['u', 'uu'],
        'e': ['e', 'ai'],
        'o': ['o', 'au']
      };
    } else {
      families = { 'i': ['i', 'ii'], 'u': ['u', 'uu'] };
    }

    for (const [fam, members] of Object.entries(families)) {
      if (members.includes(rawVowel)) {
        return fam;
      }
    }
    return rawVowel;
  }

  getVowelSound(syl: string, mode: RhymeMode, ignoreNasal: boolean): string {
    let processedSyl = syl;
    if (ignoreNasal) {
      processedSyl = processedSyl.replace(/ं/g, '').replace(/ँ/g, '');
    }

    let raw = 'a';
    if (processedSyl in VOWEL_MAP && processedSyl.length === 1) {
      raw = VOWEL_MAP[processedSyl];
    } else {
      for (const [matra, sound] of Object.entries(VOWEL_MAP)) {
        if (processedSyl.includes(matra) && matra.length === 1) {
          raw = sound;
          break;
        }
      }
    }
    return this.getVowelFamily(raw, mode);
  }

  isHeavySyllable(syl: string, vowelSound: string): boolean {
    const longVowels = new Set(['aa', 'ii', 'uu', 'ri', 'e', 'ai', 'o', 'au']);
    if (longVowels.has(vowelSound)) {
      return true;
    }
    if (syl.includes('्')) {
      return true;
    }
    return false;
  }
}
