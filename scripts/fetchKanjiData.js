import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KANJI_DATA_URL = 'https://raw.githubusercontent.com/davidluzgouveia/kanji-data/master/kanji.json';
const PUBLIC_DATA_DIR = path.join(__dirname, '../public/data');

if (!fs.existsSync(PUBLIC_DATA_DIR)) fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });

// Helper to wait to avoid rate limits if reaching external APIs
const delay = ms => new Promise(res => setTimeout(res, ms));

async function fetchFullDataset(includeExamples = false) {
  console.log(`📡 Fetching base Kanji dataset from ${KANJI_DATA_URL}...`);
  try {
    const response = await fetch(KANJI_DATA_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const rawData = await response.json();

    const formattedData = {
      N5: [],
      N4: [],
      N3: [],
      N2: [],
      N1: []
    };

    console.log('🔄 Processing and formatting Kanji data...');
    
    // Group by JLPT level
    let count = 0;
    for (const [character, details] of Object.entries(rawData)) {
      if (details.jlpt_new) {
        const level = `N${details.jlpt_new}`;
        
        let mnemonic = `A component mapping to: ${details.wk_meanings?.join(', ') || details.meanings[0]}`;
        if (details.wk_radicals && details.wk_radicals.length > 0) {
            mnemonic += `. Formed by radicals: ${details.wk_radicals.join(', ')}.`;
        }

        // Base Kanji object matching our App.jsx schema
        const kanjiObj = {
          id: `kanji-${kanjiHash(character)}`,
          character: character,
          meanings: details.meanings || [],
          onyomi: details.readings_on || [],
          kunyomi: details.readings_kun || [],
          level: level,
          mnemonic: mnemonic,
          examples: [], // Can optionally fetch examples from kanjiapi.dev
          radicals: details.wk_radicals || []
        };

        formattedData[level].push(kanjiObj);
        count++;

        // --- OPTIONAL: Fetch examples from kanjiapi.dev ---
        // Warning: This hits the API 2000+ times. Use with caution.
        if (includeExamples) {
          try {
            console.log(`Fetching examples for ${character} (${count}/2000+)`);
            const wordsRes = await fetch(`https://kanjiapi.dev/v1/words/${character}`);
            if (wordsRes.ok) {
                const wordsData = await wordsRes.json();
                // Take top 2 words as examples
                kanjiObj.examples = wordsData.slice(0, 2).map(w => {
                    const written = w.variants[0]?.written || character;
                    const pronounced = w.variants[0]?.pronounced || '';
                    const meaning = w.meanings[0]?.glosses?.join(', ') || 'Unknown meaning';
                    return {
                        word: `${written} (${pronounced})`,
                        meaning: meaning
                    };
                });
            }
            await delay(200); // 5 requests a second max
          } catch (e) {
            console.error(`Failed to fetch examples for ${character}:`, e.message);
          }
        }
      }
    }

    // Sort each level so easiest/most frequent are first
    for (const lvl in formattedData) {
        // Sort by frequency if available, or just leave as is.
        // We can sort by stroke count to show simpler ones first.
        formattedData[lvl].sort((a, b) => {
           const aStrokes = rawData[a.character].strokes || 99;
           const bStrokes = rawData[b.character].strokes || 99;
           return aStrokes - bStrokes;
        });
    }

    console.log(`✅ Processed ${count} JLPT Kanji.`);
    
    const metadata = {};
    for (const [level, kanjis] of Object.entries(formattedData)) {
        metadata[level] = kanjis.length;
        fs.writeFileSync(path.join(PUBLIC_DATA_DIR, `${level}.json`), JSON.stringify(kanjis, null, 2), 'utf-8');
    }
    fs.writeFileSync(path.join(PUBLIC_DATA_DIR, 'metadata.json'), JSON.stringify(metadata, null, 2), 'utf-8');

    console.log(`💾 Saved formatted chunked data to ${PUBLIC_DATA_DIR}`);

  } catch (error) {
    console.error('❌ Error fetching dataset:', error);
  }
}

// Simple hash function to generate stable IDs
function kanjiHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

// Check arguments for --fetch-examples flag
const args = process.argv.slice(2);
const fetchExamples = args.includes('--fetch-examples');

if (fetchExamples) {
    console.warn('⚠️ WARNING: You are running with --fetch-examples.');
    console.warn('This will make over 2000 requests to kanjiapi.dev. It may take 10+ minutes.');
}

fetchFullDataset(fetchExamples);
