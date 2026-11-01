import urllib.request
import sys
sys.stdout.reconfigure(encoding='utf-8')

headers = {'User-Agent': 'Mozilla/5.0'}

req = urllib.request.Request('https://duniacityhall.com.br/wp-sitemap-posts-portfolio-1.xml', headers=headers)
content = urllib.request.urlopen(req).read().decode('utf-8')
print(content)
