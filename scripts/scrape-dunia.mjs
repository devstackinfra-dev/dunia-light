import fs from 'fs';
import path from 'path';

const htmlPath = 'F:/Bckup - PC/Documents/GitHub/dunia/docs/duniacityhall_home.html';
const html = fs.readFileSync(htmlPath, 'utf8');

// Title
const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
console.log('=== TITLE ===');
console.log(titleMatch ? titleMatch[1].trim() : 'No title');

// Meta description
const metaDesc = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
console.log('\n=== META DESCRIPTION ===');
console.log(metaDesc ? metaDesc[1] : 'No meta desc');

// Headings
console.log('\n=== HEADINGS ===');
const headings = [...html.matchAll(/<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => {
  const tag = m[1].toUpperCase();
  const text = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return `${tag}: ${text}`;
}).filter(h => h.length > 5);
console.log(headings.join('\n'));

// Paragraphs
console.log('\n=== SIGNIFICANT PARAGRAPHS ===');
const paragraphs = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(m => {
  return m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}).filter(p => p.length > 20);
console.log(paragraphs.slice(0, 15).join('\n---\n'));

// Images
console.log('\n=== IMAGES ===');
const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);
const bgMatches = [...html.matchAll(/background(?:-image)?:\s*url\(['"]?([^'"\)]+)['"]?\)/gi)].map(m => m[1]);
const allImgs = [...new Set([...imgMatches, ...bgMatches])];
console.log(`Total images found: ${allImgs.length}`);
console.log(allImgs.join('\n'));

// Links / Menu
console.log('\n=== NAVIGATION & LINKS ===');
const linkMatches = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map(m => {
  return { href: m[1], text: m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() };
}).filter(l => l.text.length > 2 && !l.href.startsWith('#'));
console.log(JSON.stringify(linkMatches, null, 2));
