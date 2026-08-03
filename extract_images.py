import json
import base64
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('brain-tumor-classification-vgg19.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

out_dir = 'website/public/mri'
os.makedirs(out_dir, exist_ok=True)

img_count = 0
for i, cell in enumerate(nb['cells']):
    if 'outputs' not in cell:
        continue
    for j, output in enumerate(cell['outputs']):
        if output.get('output_type') in ('display_data', 'execute_result'):
            data = output.get('data', {})
            if 'image/png' in data:
                img_data = data['image/png']
                # Remove any whitespace/newlines
                img_data = img_data.replace('\n', '').replace('\r', '').replace(' ', '')
                img_bytes = base64.b64decode(img_data)
                filename = f'cell{i}_output{j}.png'
                filepath = os.path.join(out_dir, filename)
                with open(filepath, 'wb') as imgf:
                    imgf.write(img_bytes)
                print(f'Saved: {filepath} ({len(img_bytes)} bytes)')
                img_count += 1

print(f'\nTotal images extracted: {img_count}')
