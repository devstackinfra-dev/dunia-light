import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/dunia-gallery-viewer.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("--- LINES 35 to 110 ---")
for i in range(35, min(110, len(lines))):
    print(f"{i+1}: {lines[i]}", end="")

print("\n--- LINES 205 to 270 ---")
for i in range(205, min(270, len(lines))):
    print(f"{i+1}: {lines[i]}", end="")
