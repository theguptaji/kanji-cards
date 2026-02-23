const cache = {};

/**
 * Loads a JLPT level Kanji deck from public JSON files.
 * @param {string} level - "N5", "N4", etc.
 */
export async function fetchKanjiLevel(level) {
    if (cache[level]) return cache[level];
    
    try {
        const response = await fetch(`/data/${level}.json`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        cache[level] = data;
        return data;
    } catch (error) {
        console.error("Failed to load Kanji level data:", error);
        return [];
    }
}

/**
 * Loads the metadata to display total Kanji counts on the homepage
 */
export async function fetchMetadata() {
    if (cache['metadata']) return cache['metadata'];
    
    try {
        const response = await fetch('/data/metadata.json');
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        cache['metadata'] = data;
        return data;
    } catch (error) {
        console.error("Failed to load metadata:", error);
        return { N5: 0, N4: 0, N3: 0, N2: 0, N1: 0 };
    }
}
