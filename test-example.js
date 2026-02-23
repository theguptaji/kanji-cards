import fs from 'fs';
async function test() {
  const wordsRes = await fetch("https://kanjiapi.dev/v1/words/一");
  const wordsData = await wordsRes.json();
  const w = wordsData[0];
  const written = w.variants[0]?.written;
  const pronounced = w.variants[0]?.pronounced;
  const meaning = w.meanings[0]?.glosses?.join(', ') || 'Unknown meaning';
  console.log({written, pronounced, meaning});
}
test();
