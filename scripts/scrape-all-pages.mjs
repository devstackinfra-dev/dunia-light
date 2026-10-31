import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const pages = [
  'sobre',
  'casamento',
  'corporativo',
  'debutante',
  'embaixadas',
  'festas',
  'buffet',
  'cerimonias-externas',
  'jardim',
  'contato'
];

const outDir = 'F:/Bckup - PC/Documents/GitHub/dunia/docs/scraped_pages';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const results = {};

for (const p of pages) {
  const url = `https://duniacityhall.com.br/${p}/`;
  const file = path.join(outDir, `${p}.html`);
  console.log(`Downloading ${url}...`);
  try {
    execSync(`curl.exe -s -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "${url}" -o "${file}"`, { timeout: 15000 });
    const html = fs.readFileSync(file, 'utf8');

    // Extract title
    const title = (html.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1] || '';
    
    // Extract paragraphs and headings
    const textPieces = [...html.matchAll(/<(?:p|h[1-4]|li)[^>]*>([\s\S]*?)<\/(?:p|h[1-4]|li)>/gi)]
      .map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
      .filter(t => t.length > 25 && !t.includes('Add comment') && !t.includes('Comments'));

    // Extract images
    const imgs = [...html.matchAll(/(?:src|data-src|href)=["'](https:\/\/[^"']+\.(?:jpg|jpeg|png|webp))["']/gi)]
      .map(m => m[1])
      .filter(img => !img.includes('avatar') && !img.includes('theme') && !img.includes('plugins'));

    results[p] = {
      title,
      textPieces,
      images: [...new Set(imgs)]
    };
  } catch (err) {
    console.error(`Failed ${p}:`, err.message);
  }
}

fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(results, null, 2), 'utf8');
console.log('Finished scraping all subpages! Saved summary to docs/scraped_pages/summary.json');
