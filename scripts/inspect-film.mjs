import fs from 'fs';

const html = fs.readFileSync('F:/Bckup - PC/Documents/GitHub/dunia/docs/dunia-v7-prototype/index.html', 'utf8');
const filmMatch = html.match(/<section[^>]*id=["']film["'][^>]*>([\s\S]*?)<\/section>/i);
console.log('=== FILM HTML ===');
console.log(filmMatch ? filmMatch[0] : 'No film section');

const css = fs.readFileSync('F:/Bckup - PC/Documents/GitHub/dunia/docs/dunia-v7-prototype/styles.css', 'utf8');
const filmCss = [...css.matchAll(/\.film[^{]*\{[^}]*\}/g)].map(m => m[0]);
console.log('=== FILM CSS ===');
console.log(filmCss.join('\n'));
