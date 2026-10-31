import fs from 'fs';

const data = JSON.parse(fs.readFileSync('F:/Bckup - PC/Documents/GitHub/dunia/docs/dunia_content_extracted.json', 'utf8'));

for (const [key, val] of Object.entries(data)) {
  console.log(`\n================= SEÇÃO: ${key.toUpperCase()} (${val.images.length} fotos) =================`);
  console.log('TEXTOS:');
  val.texts.slice(0, 6).forEach(t => console.log(' -> ' + t));
  console.log('FOTOS (amostra):');
  val.images.slice(0, 4).forEach(img => console.log(' -> ' + img));
}
