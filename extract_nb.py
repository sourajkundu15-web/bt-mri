import json, sys

sys.stdout.reconfigure(encoding='utf-8')

with open('brain-tumor-classification-vgg19.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

cells = nb['cells']
for i, c in enumerate(cells):
    src = ''.join(c['source'])
    print(f"=== Cell {i} ({c['cell_type']}) ===")
    print(src[:800])
    print()
    
    # Print text outputs (skip binary/image)
    if 'outputs' in c:
        for o in c['outputs']:
            if o.get('output_type') == 'stream':
                text = ''.join(o.get('text', []))
                # Filter ANSI codes
                import re
                text = re.sub(r'\x1b\[[0-9;]*m', '', text)
                if text:
                    print(f"  OUTPUT: {text[:500]}")
            elif o.get('output_type') == 'execute_result':
                text = ''.join(o.get('data', {}).get('text/plain', []))
                if text:
                    print(f"  RESULT: {text[:500]}")
    print()
