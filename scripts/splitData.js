import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { kanjiData } from '../src/data/kanjiData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DATA_DIR = path.join(__dirname, '../public/data');

const metadata = {};

for (const level in kanjiData) {
    const data = kanjiData[level];
    metadata[level] = data.length;
    
    const outPath = path.join(PUBLIC_DATA_DIR, `${level}.json`);
    fs.writeFileSync(outPath, JSON.stringify(data), 'utf-8');
    console.log(`✅ Saved ${level}.json (${data.length} items)`);
}

// Write metadata
fs.writeFileSync(path.join(PUBLIC_DATA_DIR, 'metadata.json'), JSON.stringify(metadata, null, 2), 'utf-8');
console.log(`✅ Saved metadata.json`);

// Delete old gigantic JS file to save bundle size
fs.unlinkSync(path.join(__dirname, '../src/data/kanjiData.js'));
console.log(`🗑️ Deleted src/data/kanjiData.js to optimize bundle.`);
