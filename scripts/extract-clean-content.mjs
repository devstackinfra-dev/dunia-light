import fs from 'fs';
import path from 'path';

const outDir = 'F:/Bckup - PC/Documents/GitHub/dunia/docs/scraped_pages';
const files = fs.readdirSync(outDir).filter(f => f.endsWith('.html'));

const structuredData = {};

for (const f of files) {
  const pageName = f.replace('.html', '');
  const html = fs.readFileSync(path.join(outDir, f), 'utf8');

  // Strip scripts and styles
  const cleanHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '');

  // Extract clean text paragraphs & headings
  const texts = [...cleanHtml.matchAll(/<(?:p|h[1-6]|li|blockquote|span\s+class="[^"]*(?:title|desc|text)[^"]*")[^>]*>([\s\S]*?)<\/(?:p|h[1-6]|li|blockquote|span)>/gi)]
    .map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(t => t.length > 20 && !t.includes('Add comment') && !t.includes('{') && !t.includes('var '));

  // Extract all wp-content uploads images
  const images = [...cleanHtml.matchAll(/https:\/\/duniacityhall\.com\.br\/wp-content\/uploads\/[^\s"'<>\)]+\.(?:jpg|jpeg|png|webp)/gi)]
    .map(m => m[0]);

  structuredData[pageName] = {
    texts: [...new Set(texts)],
    images: [...new Set(images)]
  };
}

fs.writeFileSync('F:/Bckup - PC/Documents/GitHub/dunia/docs/dunia_content_extracted.json', JSON.stringify(structuredData, null, 2), 'utf8');
console.log('Saved to docs/dunia_content_extracted.json');
