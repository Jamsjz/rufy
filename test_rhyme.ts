import { rhymeDetector } from './src/lib/rhyme/index';

const testPairs: [string, string][] = [
  ["राम", "धाम"],
  ["जल", "फल"],
  ["रोपए", "खोपए"],
  ["प्रेम", "रेम"],
  ["पानी", "सानी"],
  ["रामायण", "राम"],
  ["रोपए", "खोए"],
  ["राम", "रामी"],
  ["गीत", "प्रीत"],
  ["कमला", "अमल"],
  ["एक", "मेक"],
  ["का", "बा"],
  ["सुख", "सूख"],
  ["कि", "की"],
  ["के", "कै"],
  ["को", "कौ"]
];

console.log("=== RHYME DETECTION TEST (mode='loose', ignore_nasal=true) ===");
for (const [w1, w2] of testPairs) {
  const score = rhymeDetector.rhymeScore(w1, w2);
  const result = rhymeDetector.rhymes(w1, w2);
  console.log(`'${w1}' vs '${w2}': ${result ? 'True' : 'False'} (score = ${score.toFixed(2)})`);
}
