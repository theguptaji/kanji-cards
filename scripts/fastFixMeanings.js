import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { kanjiData } from '../src/data/kanjiData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.join(__dirname, '../src/data/kanjiData.js');

async function fixMeanings() {
  console.log('🔍 Identifying Kanji with missing example meanings...');
  
  const toFetch = [];
  
  // Find all kanjis that have "Unknown meaning"
  for (const level in kanjiData) {
    for (const kanjiObj of kanjiData[level]) {
      const hasUnknown = kanjiObj.examples.some(e => e.meaning === 'Unknown meaning');
      if (hasUnknown) {
        toFetch.push(kanjiObj);
      }
    }
  }

  console.log(`📡 Found ${toFetch.length} Kanji needing meaning fixes. Fetching concurrently...`);

  // Process in chunks of 50 to avoid completely overwhelming the kanjiapi.dev server
  const chunkSize = 50;
  let processed = 0;

  for (let i = 0; i < toFetch.length; i += chunkSize) {
    const chunk = toFetch.slice(i, i + chunkSize);
    
    // Concurrently fetch all in this chunk
    await Promise.all(chunk.map(async (kanjiObj) => {
      try {
        const wordsRes = await fetch(`https://kanjiapi.dev/v1/words/${kanjiObj.character}`);
        if (wordsRes.ok) {
          const wordsData = await wordsRes.json();
          // Re-map the examples
          kanjiObj.examples = wordsData.slice(0, 2).map(w => {
            const written = w.variants[0]?.written || kanjiObj.character;
            const pronounced = w.variants[0]?.pronounced || '';
            const meaning = w.meanings[0]?.glosses?.join(', ') || 'Unknown meaning';
            return {
              word: `${written} (${pronounced})`,
              meaning: meaning
            };
          });
        }
      } catch (err) {
        console.error(`Failed on ${kanjiObj.character}:`, err.message);
      }
    }));
    
    processed += chunk.length;
    console.log(`✅ Fixed ${processed} / ${toFetch.length}`);
  }

  // Write out the JS file
  let fileContent = 'export const kanjiData = {\n';
  for (const [level, kanjis] of Object.entries(kanjiData)) {
      fileContent += `  ${level}: ${JSON.stringify(kanjis, null, 4)},\n`;
  }
  fileContent += '};\n';

  fs.writeFileSync(OUTPUT_PATH, fileContent, 'utf-8');
  console.log(`💾 Saved completely fixed data to ${OUTPUT_PATH}!`);
}

fixMeanings().catch(console.error);
