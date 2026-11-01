import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/wp_media_catalog.json', 'r', encoding='utf-8') as f:
    images = json.load(f)

print(f"Total: {len(images)}")
# Group by title prefix or keywords
prefixes = {}
for img in images:
    title = img['title']
    url = img['url']
    # remove trailing numbers
    prefix = url.split('/')[-1].split('.')[0]
    import re
    base = re.sub(r'[-_]\d+$', '', prefix)
    base = re.sub(r'\d+$', '', base)
    prefixes[base] = prefixes.get(base, 0) + 1

print("\n=== PHOTO COLLECTIONS IN DUNIA CITY HALL ===")
for base, count in sorted(prefixes.items(), key=lambda x: -x[1])[:30]:
    print(f"- {base}: {count} fotos")
