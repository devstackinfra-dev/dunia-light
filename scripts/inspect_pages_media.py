import urllib.request
import json
import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

headers = {'User-Agent': 'Mozilla/5.0'}

req = urllib.request.Request('https://duniacityhall.com.br/wp-json/wp/v2/pages?per_page=100', headers=headers)
pages = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))

print(f"Total WP pages: {len(pages)}")

for p in pages:
    title = p.get('title', {}).get('rendered', '')
    slug = p.get('slug', '')
    content = p.get('content', {}).get('rendered', '')
    
    # Find all image urls in content
    imgs = re.findall(r'https?://[^\s\"\'\(\)]+wp-content/uploads/[^\s\"\'\(\)]+\.(?:jpg|jpeg|png|webp)', content, re.IGNORECASE)
    # Remove sizes like -300x200 or -1024x683 to get original
    originals = set()
    for img in imgs:
        orig = re.sub(r'-\d+x\d+(\.\w+)$', r'\1', img)
        originals.add(orig)
        
    print(f"\n[PAGE: {slug}] {title} -> {len(imgs)} tags img, {len(originals)} fotos originais")
    for o in list(originals)[:8]:
        print("   *", o)
