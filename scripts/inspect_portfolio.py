import urllib.request
import json
import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

headers = {'User-Agent': 'Mozilla/5.0'}

req = urllib.request.Request('https://duniacityhall.com.br/wp-json/wp/v2/portfolio?per_page=100', headers=headers)
try:
    portfolios = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
    print(f"Total WP portfolios: {len(portfolios)}")
    for p in portfolios:
        title = p.get('title', {}).get('rendered', '')
        slug = p.get('slug', '')
        content = p.get('content', {}).get('rendered', '')
        imgs = re.findall(r'https?://[^\s\"\'\(\)]+wp-content/uploads/[^\s\"\'\(\)]+\.(?:jpg|jpeg|png|webp)', content, re.IGNORECASE)
        print(f"\n[PORTFOLIO: {slug}] {title} -> {len(imgs)} imgs")
        for o in list(set(imgs))[:10]:
            print("   *", o)
except Exception as e:
    print("Error:", e)
