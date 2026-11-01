import urllib.request
import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

headers = {'User-Agent': 'Mozilla/5.0'}

sitemaps = [
    'https://duniacityhall.com.br/wp-sitemap.xml',
    'https://duniacityhall.com.br/sitemap_index.xml',
    'https://duniacityhall.com.br/sitemap.xml',
    'https://duniacityhall.com.br/wp-sitemap-posts-page-1.xml',
    'https://duniacityhall.com.br/wp-sitemap-posts-post-1.xml',
    'https://duniacityhall.com.br/wp-sitemap-posts-portfolio-1.xml',
    'https://duniacityhall.com.br/wp-sitemap-posts-attachment-1.xml',
    'https://duniacityhall.com.br/wp-json/wp/v2/media?per_page=100',
    'https://duniacityhall.com.br/wp-json/wp/v2/posts?per_page=100',
    'https://duniacityhall.com.br/wp-json/wp/v2/pages?per_page=100',
]

for s in sitemaps:
    try:
        req = urllib.request.Request(s, headers=headers)
        resp = urllib.request.urlopen(req, timeout=8)
        content = resp.read().decode('utf-8', errors='ignore')
        print(f"SUCCESS: {s} (length: {len(content)})")
        if 'wp-json/wp/v2/media' in s:
            print("Found WP REST API media endpoint!")
    except Exception as e:
        print(f"Failed {s}: {e}")
