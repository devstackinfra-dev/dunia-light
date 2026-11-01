import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/wp_media_catalog.json', 'r', encoding='utf-8') as f:
    images = json.load(f)

# Group by upload month/year in URL
dates = {}
for img in images:
    url = img['url']
    # extract /uploads/YYYY/MM/
    import re
    m = re.search(r'/uploads/(\d{4}/\d{2})/', url)
    folder = m.group(1) if m else 'other'
    dates[folder] = dates.get(folder, 0) + 1

print("=== UPLOADS BY FOLDER ===")
for folder, count in sorted(dates.items()):
    print(f"- {folder}: {count} imagens")

# Check posts/pages to see which images are used where!
