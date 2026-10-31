import fs from 'fs';

const summary = JSON.parse(fs.readFileSync('F:/Bckup - PC/Documents/GitHub/dunia/docs/scraped_pages/summary.json', 'utf8'));

for (const [page, data] of Object.entries(summary)) {
  console.log(`\n=================== PAGE: ${page.toUpperCase()} ===================`);
  console.log('Title:', data.title.trim());
  console.log('Images:', data.images.length);
  console.log('Sample images:', data.images.slice(0, 3));
  console.log('Texts:');
  data.textPieces.slice(0, 4).forEach(t => console.log(' • ' + t));
}
