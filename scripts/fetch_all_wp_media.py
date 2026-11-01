import urllib.request
import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

headers = {'User-Agent': 'Mozilla/5.0'}
page = 1
all_media = []

while True:
    url = f"https://duniacityhall.com.br/wp-json/wp/v2/media?per_page=100&page={page}"
    try:
        req = urllib.request.Request(url, headers=headers)
        res = urllib.request.urlopen(req, timeout=12)
        items = json.loads(res.read().decode('utf-8'))
        if not items:
            break
        all_media.extend(items)
        print(f"Page {page}: {len(items)} media items (Total: {len(all_media)})")
        page += 1
    except Exception as e:
        print(f"Finished at page {page}: {e}")
        break

print(f"\nTOTAL MEDIA ITEMS IN DUNIA CITY HALL: {len(all_media)}")

# Filter images
image_items = []
for m in all_media:
    source_url = m.get('source_url', '')
    title = m.get('title', {}).get('rendered', '')
    alt = m.get('alt_text', '')
    media_details = m.get('media_details', {})
    width = media_details.get('width', 0)
    height = media_details.get('height', 0)
    sizes = media_details.get('sizes', {})
    
    if any(ext in source_url.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
        image_items.append({
            'id': m.get('id'),
            'title': title,
            'alt': alt,
            'url': source_url,
            'width': width,
            'height': height,
            'sizes': {k: v.get('source_url') for k, v in sizes.items()}
        })

print(f"TOTAL IMAGES: {len(image_items)}")

with open('scripts/wp_media_catalog.json', 'w', encoding='utf-8') as f:
    json.dump(image_items, f, ensure_ascii=False, indent=2)

print("Saved catalog to scripts/wp_media_catalog.json!")
