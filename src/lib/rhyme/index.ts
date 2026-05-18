import { SyllableSegmenter } from './segmenter';
import { VowelAnalyzer } from './vowels';
import { ConsonantAnalyzer } from './consonants';
import { RhymeScorer } from './scorer';
import { IRhymeScorer } from './types';

// Default configured instance
const segmenter = new SyllableSegmenter();
const vowelAnalyzer = new VowelAnalyzer();
const consonantAnalyzer = new ConsonantAnalyzer();

export const rhymeDetector: IRhymeScorer = new RhymeScorer(
  segmenter,
  vowelAnalyzer,
  consonantAnalyzer
);

export * from './types';
export { SyllableSegmenter } from './segmenter';
export { VowelAnalyzer } from './vowels';
export { ConsonantAnalyzer } from './consonants';
export { RhymeScorer } from './scorer';
