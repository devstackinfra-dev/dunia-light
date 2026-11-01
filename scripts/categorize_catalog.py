import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/wp_media_catalog.json', 'r', encoding='utf-8') as f:
    images = json.load(f)

print(f"Total images in catalog: {len(images)}")

# Sample first 20 images
for img in images[:25]:
    print(f"- ID {img['id']}: {img['title']} -> {img['url']}")

# Categorize images by keywords in URL or title
categories = {
    'buffet': [],
    'casamento': [],
    'debutante': [],
    'corporativo': [],
    'salao': [],
    'jardim': [],
    'decoracao': [],
    'outros': []
}

for img in images:
    url_lower = img['url'].lower()
    title_lower = img['title'].lower()
    alt_lower = img['alt'].lower()
    combined = f"{url_lower} {title_lower} {alt_lower}"
    
    if any(k in combined for k in ['buffet', 'comida', 'prato', 'gastronom', 'mesa', 'bolo', 'doce', 'jantar', 'sobremesa']):
        categories['buffet'].append(img)
    elif any(k in combined for k in ['casamento', 'noiv', 'casal', 'alianca', 'buque']):
        categories['casamento'].append(img)
    elif any(k in combined for k in ['debut', '15-ano', '15ano', 'quince', 'valsa']):
        categories['debutante'].append(img)
    elif any(k in combined for k in ['corp', 'congresso', 'empresa', 'palestra', 'reuniao', 'evento-corp']):
        categories['corporativo'].append(img)
    elif any(k in combined for k in ['jardim', 'verde', 'ar-livre', 'extern', 'natureza', 'igreja']):
        categories['jardim'].append(img)
    elif any(k in combined for k in ['salao', 'hall', 'espaco', 'imperial', 'cristal', 'fachada']):
        categories['salao'].append(img)
    elif any(k in combined for k in ['decor', 'arranjo', 'flor', 'lustre', 'iluminac']):
        categories['decoracao'].append(img)
    else:
        categories['outros'].append(img)

print("\n=== DISTRIBUTION BY CATEGORY ===")
for cat, items in categories.items():
    print(f"{cat.upper()}: {len(items)} fotos")
