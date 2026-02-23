import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DATA_DIR = path.join(__dirname, '../public/data');

const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
const searchIndex = [];

for (const level of levels) {
    const filePath = path.join(PUBLIC_DATA_DIR, `${level}.json`);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        for (const kanji of data) {
            searchIndex.push({
                id: kanji.id,
                character: kanji.character,
                level: kanji.level
            });
        }
    }
}

fs.writeFileSync(path.join(PUBLIC_DATA_DIR, 'search.json'), JSON.stringify(searchIndex), 'utf-8');
console.log(`✅ Saved search.json with ${searchIndex.length} entries for the search bar.`);
