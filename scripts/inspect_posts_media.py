import urllib.request
import json
import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

headers = {'User-Agent': 'Mozilla/5.0'}

req = urllib.request.Request('https://duniacityhall.com.br/wp-json/wp/v2/posts?per_page=100', headers=headers)
posts = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))

print(f"Total WP posts: {len(posts)}")

for p in posts:
    title = p.get('title', {}).get('rendered', '')
    slug = p.get('slug', '')
    content = p.get('content', {}).get('rendered', '')
    
    imgs = re.findall(r'https?://[^\s\"\'\(\)]+wp-content/uploads/[^\s\"\'\(\)]+\.(?:jpg|jpeg|png|webp)', content, re.IGNORECASE)
    originals = set()
    for img in imgs:
        orig = re.sub(r'-\d+x\d+(\.\w+)$', r'\1', img)
        originals.add(orig)
        
    print(f"\n[POST: {slug}] {title} -> {len(imgs)} imgs, {len(originals)} originais")
    for o in list(originals)[:8]:
        print("   *", o)
