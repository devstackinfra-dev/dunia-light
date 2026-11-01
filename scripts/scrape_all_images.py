import urllib.request
from bs4 import BeautifulSoup
import re
import os
import json
import sys
import hashlib
from urllib.parse import urljoin

sys.stdout.reconfigure(encoding='utf-8')

urls = [
    ('home', 'https://duniacityhall.com.br/'),
    ('buffet', 'https://duniacityhall.com.br/buffet/'),
    ('casamento', 'https://duniacityhall.com.br/casamento/'),
    ('debutante', 'https://duniacityhall.com.br/debutante/'),
    ('corporativo', 'https://duniacityhall.com.br/corporativo/'),
    ('embaixadas', 'https://duniacityhall.com.br/embaixadas/'),
    ('festas', 'https://duniacityhall.com.br/festas/'),
    ('cerimonias', 'https://duniacityhall.com.br/cerimonias-externas/'),
    ('jardim', 'https://duniacityhall.com.br/jardim/'),
    ('sobre', 'https://duniacityhall.com.br/sobre/'),
    ('portfolio_salao', 'https://duniacityhall.com.br/portfolio-item/salao/'),
    ('portfolio_debutante', 'https://duniacityhall.com.br/portfolio-item/debutante/'),
    ('portfolio_casamento', 'https://duniacityhall.com.br/portfolio-item/casamento/'),
    ('portfolio_festas', 'https://duniacityhall.com.br/portfolio-item/festas/'),
    ('portfolio_corporativo', 'https://duniacityhall.com.br/portfolio-item/corporativo/'),
    ('portfolio_decoracao', 'https://duniacityhall.com.br/portfolio-item/decoracao/'),
    ('portfolio_buffet', 'https://duniacityhall.com.br/portfolio-item/buffet/'),
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
results_by_page = {}
all_images = {}

print("Iniciando varredura de imagens em duniacityhall.com.br...")

for category, u in urls:
    try:
        req = urllib.request.Request(u, headers=headers)
        html = urllib.request.urlopen(req, timeout=12).read().decode('utf-8', errors='ignore')
        soup = BeautifulSoup(html, 'html.parser')
        page_imgs = []
        
        # 1. tags <img>
        for img in soup.find_all('img'):
            src = img.get('src') or img.get('data-src') or img.get('data-lazy-src') or img.get('srcset')
            if src:
                # if srcset, pick the largest url
                if ' ' in src and ',' in src:
                    src = src.split(',')[-1].strip().split(' ')[0]
                elif ' ' in src:
                    src = src.split(' ')[0]
                full_url = urljoin(u, src)
                if any(ext in full_url.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                    alt = img.get('alt', '').strip() or category
                    page_imgs.append({'url': full_url, 'alt': alt})
                    
        # 2. links <a> apontando para fotos (lightbox)
        for a in soup.find_all('a', href=True):
            href = a['href']
            full_url = urljoin(u, href)
            if any(ext in full_url.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                title = a.get('title') or a.get_text(strip=True) or category
                page_imgs.append({'url': full_url, 'alt': title})
                
        # 3. background-images em style
        for el in soup.find_all(style=True):
            s = el['style']
            if 'url(' in s:
                matches = re.findall(r'url\([\'\"]?(.*?)[\'\"]?\)', s)
                for m in matches:
                    full_url = urljoin(u, m)
                    if any(ext in full_url.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                        page_imgs.append({'url': full_url, 'alt': category})

        # Remove duplicados por página
        seen = set()
        unique_page_imgs = []
        for item in page_imgs:
            clean_url = item['url'].split('?')[0] # remove query params
            # Ignorar icones pequenos ou emojis
            if any(skip in clean_url.lower() for skip in ['logo', 'icon', 'favicon', 'wpeditor', 'avatar']):
                continue
            if clean_url not in seen:
                seen.add(clean_url)
                unique_page_imgs.append(item)
                if clean_url not in all_images:
                    all_images[clean_url] = {
                        'url': item['url'],
                        'category': category,
                        'alt': item['alt']
                    }
                    
        results_by_page[category] = unique_page_imgs
        print(f"[{category}] {u} -> {len(unique_page_imgs)} fotos únicas")
        
    except Exception as e:
        print(f"Erro em {u}: {e}")

print(f"\nTOTAL GERAL DE FOTOS ÚNICAS ENCONTRADAS NO SITE: {len(all_images)}")

# Salva o mapa em JSON
with open('scripts/all_site_images.json', 'w', encoding='utf-8') as f:
    json.dump(all_images, f, ensure_ascii=False, indent=2)

print("Mapa salvo em scripts/all_site_images.json!")
