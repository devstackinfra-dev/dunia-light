import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/config/gallery-catalog.json', 'r', encoding='utf-8') as f:
    catalog = json.load(f)

counts = {}
local_counts = {}
for item in catalog:
    c = item['category']
    counts[c] = counts.get(c, 0) + 1
    if item['src'].startswith('/images/galeria/'):
        local_counts[c] = local_counts.get(c, 0) + 1

print("=== DISTRIBUIÇÃO DAS FOTOS ===")
for c, total in sorted(counts.items(), key=lambda x: -x[1]):
    local = local_counts.get(c, 0)
    print(f"- {c.upper():12}: {total} fotos no total ({local} locais)")
