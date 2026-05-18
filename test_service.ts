import { getRhymes } from './src/lib/rhymeService';

async function test() {
  console.log("Testing getRhymes with 'राम'...");
  const results = await getRhymes('राम');
  console.log(results);
}

test();
