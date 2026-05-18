import { rhymeDetector } from './rhyme';
import nepaliWords from '../data/nepaliWords.json';

export interface RhymeResult {
  word: string;
  wordNp?: string;
  score: number;
  language: 'en' | 'np';
}

const DUMMY_RHYMES: Record<string, RhymeResult[]> = {
  // English rhymes (kept as fallback for non-Nepali words if needed)
  love: [
    { word: 'above', score: 0.95, language: 'en' },
    { word: 'dove', score: 0.88, language: 'en' },
    { word: 'glove', score: 0.82, language: 'en' },
    { word: 'shove', score: 0.78, language: 'en' },
    { word: 'of', score: 0.65, language: 'en' },
  ],
  heart: [
    { word: 'start', score: 0.92, language: 'en' },
    { word: 'part', score: 0.85, language: 'en' },
    { word: 'art', score: 0.80, language: 'en' },
  ]
};

// Words to fall back to if no rhymes are found
const FALLBACK_RHYMES: RhymeResult[] = [
  { word: 'flow', score: 0.75, language: 'en' },
  { word: 'grow', score: 0.70, language: 'en' },
  { word: 'know', score: 0.65, language: 'en' }
];

export async function getRhymes(word: string): Promise<RhymeResult[]> {
  const normalizedWord = word.trim();

  // English fast path check
  const lowerEn = normalizedWord.toLowerCase();
  if (DUMMY_RHYMES[lowerEn]) {
    return [...DUMMY_RHYMES[lowerEn]].sort((a, b) => b.score - a.score);
  }

  // Nepali rhyme detection using the SOLID port of rhyming_detector.py
  // Only attempt Nepali rhyming if the word looks like Nepali (contains devanagari)
  const hasDevanagari = /[\u0900-\u097F]/.test(normalizedWord);

  if (hasDevanagari) {
    const results: RhymeResult[] = [];
    // nepaliWords is an array of strings loaded from JSON
    const dictionary = nepaliWords as string[];

    for (const dictWord of dictionary) {
      if (dictWord === normalizedWord) continue;

      const score = rhymeDetector.rhymeScore(normalizedWord, dictWord, 'loose', true);
      if (score >= 3.5) {
        results.push({
          word: dictWord,
          wordNp: dictWord,
          score: score,
          language: 'np'
        });
      }
    }

    if (results.length > 0) {
      // Sort by score descending and return top 10
      return results.sort((a, b) => b.score - a.score);//.slice(0, 10);
    }
  }

  // Return fallback with slight randomization if no rhymes found
  const shuffled = [...FALLBACK_RHYMES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5).sort((a, b) => b.score - a.score);
}

// Function to inject alternate rhyme service if needed (Dependency Injection support)
let rhymeServiceImplementation = getRhymes;

export function setRhymeService(newService: (word: string) => Promise<RhymeResult[]>) {
  rhymeServiceImplementation = newService;
}

export function executeRhymeService(word: string): Promise<RhymeResult[]> {
  return rhymeServiceImplementation(word);
}
