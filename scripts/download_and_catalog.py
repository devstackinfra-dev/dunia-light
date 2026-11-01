import json
import urllib.request
import os
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/wp_media_catalog.json', 'r', encoding='utf-8') as f:
    images = json.load(f)

print(f"Total catalog images: {len(images)}")

# Filter out tiny thumbnails, logos, or generic unsplash if we have real Dúnia photos
# Prioritize real Dúnia photos
dunia_photos = []

for img in images:
    url = img['url']
    title = img['title'] or ''
    width = img.get('width', 0)
    height = img.get('height', 0)
    
    # skip tiny icons or logos
    if 'logo' in url.lower() and ('copy' in url.lower() or 'cropped' in url.lower()):
        continue
    if width > 0 and width < 300:
        continue
        
    # categorize
    url_lower = url.lower()
    title_lower = title.lower()
    combined = f"{url_lower} {title_lower}"
    
    cat = "salao"
    if any(k in combined for k in ['buffet', 'comida', 'prato', 'gastronom', 'mesa', 'bolo', 'doce', 'jantar', 'sobremesa']):
        cat = "buffet"
    elif any(k in combined for k in ['casamento', 'noiv', 'casal', 'alianca', 'buque', 'destaque-casamento']):
        cat = "casamento"
    elif any(k in combined for k in ['debut', '15-ano', '15ano', 'quince', 'valsa', 'laisa']):
        cat = "debutante"
    elif any(k in combined for k in ['corp', 'congresso', 'empresa', 'palestra', 'reuniao', 'evento-corp']):
        cat = "corporativo"
    elif any(k in combined for k in ['jardim', 'verde', 'ar-livre', 'extern', 'natureza', 'igreja']):
        cat = "jardim"
    elif any(k in combined for k in ['decor', 'arranjo', 'flor', 'lustre', 'iluminac']):
        cat = "decoracao"
    elif any(k in combined for k in ['maria-dione', 'festa', 'dj', 'balada', 'dunia-24']):
        cat = "festas"
        
    dunia_photos.append({
        'id': img['id'],
        'title': title if title and not title.isdigit() else f"Dúnia City Hall — {cat.title()}",
        'url': url,
        'category': cat,
        'width': width,
        'height': height
    })

print(f"Filtered high-quality photos: {len(dunia_photos)}")

# Download a solid set of top photos locally into public/images/galeria/
target_dir = os.path.join('public', 'images', 'galeria')
os.makedirs(target_dir, exist_ok=True)

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

saved_items = []
download_count = 0
max_downloads = 60 # Download 60 top photos locally for super fast zero-latency loading

for item in dunia_photos:
    filename = os.path.basename(item['url'].split('?')[0])
    # clean filename
    safe_name = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', filename)
    local_path = os.path.join(target_dir, safe_name)
    web_path = f"/images/galeria/{safe_name}"
    
    if os.path.exists(local_path):
        item['src'] = web_path
        saved_items.append(item)
    elif download_count < max_downloads:
        try:
            req = urllib.request.Request(item['url'], headers=headers)
            with urllib.request.urlopen(req, timeout=8) as resp, open(local_path, 'wb') as out:
                out.write(resp.read())
            download_count += 1
            item['src'] = web_path
            saved_items.append(item)
            if download_count % 10 == 0:
                print(f"Baixadas {download_count} fotos...")
        except Exception as e:
            # Fallback to direct url
            item['src'] = item['url']
            saved_items.append(item)
    else:
        # Use remote URL directly for remaining items
        item['src'] = item['url']
        saved_items.append(item)

print(f"Download concluído! {download_count} fotos salvas localmente em {target_dir}")
print(f"Total de fotos no catálogo completo: {len(saved_items)}")

# Save curated catalog
with open('src/config/gallery-catalog.json', 'w', encoding='utf-8') as f:
    json.dump(saved_items, f, ensure_ascii=False, indent=2)

print("Catálogo salvo em src/config/gallery-catalog.json!")
