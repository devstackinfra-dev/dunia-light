import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const imagesToDownload = [
  { url: 'https://duniacityhall.com.br/wp-content/uploads/2022/01/logo.png', name: 'logo-dunia.png' },
  { url: 'https://duniacityhall.com.br/wp-content/uploads/2022/01/logo-preta.png', name: 'logo-dunia-preta.png' },
  { url: 'https://duniacityhall.com.br/wp-content/uploads/2022/01/salao-versao-03.jpg', name: 'salao-principal.jpg' },
  { url: 'https://duniacityhall.com.br/wp-content/uploads/2021/01/capa-home-casamento.jpg', name: 'casamento-hero.jpg' },
  { url: 'https://duniacityhall.com.br/wp-content/uploads/2021/01/capa-home-debutante.jpg', name: 'debutante-hero.jpg' },
  { url: 'https://duniacityhall.com.br/wp-content/uploads/2021/01/capa-home-corporativo.jpg', name: 'corporativo-hero.jpg' },
  { url: 'https://duniacityhall.com.br/wp-content/uploads/2021/01/capa-home-festas.jpg', name: 'festas-hero.jpg' },
  { url: 'https://duniacityhall.com.br/wp-content/uploads/2021/01/capa-home-decoracao.jpg', name: 'decoracao-hero.jpg' },
  { url: 'https://duniacityhall.com.br/wp-content/uploads/2021/01/capa-home-buffet.jpg', name: 'buffet-hero.jpg' },
  { url: 'https://duniacityhall.com.br/wp-content/uploads/2023/10/capa-buffet.jpg', name: 'buffet-galeria.jpg' },
  { url: 'https://duniacityhall.com.br/wp-content/uploads/2023/10/capa-casamento.jpg', name: 'casamento-galeria.jpg' },
  { url: 'https://duniacityhall.com.br/wp-content/uploads/2023/10/capa-debutante.jpg', name: 'debutante-galeria.jpg' },
  { url: 'https://duniacityhall.com.br/wp-content/uploads/2023/10/capa-corporativo.jpg', name: 'corporativo-galeria.jpg' },
  { url: 'https://duniacityhall.com.br/wp-content/uploads/2023/10/capa-embaixadas.jpg', name: 'embaixadas-galeria.jpg' },
  { url: 'https://duniacityhall.com.br/wp-content/uploads/2023/10/capa-festas.jpg', name: 'festas-galeria.jpg' },
  { url: 'https://duniacityhall.com.br/wp-content/uploads/2023/10/capa-jardim.jpg', name: 'jardim-galeria.jpg' },
  { url: 'https://duniacityhall.com.br/wp-content/uploads/2023/10/capa-cerimonias-internas.jpg', name: 'cerimonias-galeria.jpg' }
];

const targetDir = 'F:/Bckup - PC/Documents/GitHub/dunia/public/images/dunia';
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

for (const item of imagesToDownload) {
  const dest = path.join(targetDir, item.name);
  console.log(`Downloading ${item.url} -> ${item.name}...`);
  try {
    execSync(`curl.exe -s -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "${item.url}" -o "${dest}"`, { timeout: 15000 });
  } catch (err) {
    console.error(`Error downloading ${item.name}:`, err.message);
  }
}

console.log('Finished downloading official Dúnia images!');
