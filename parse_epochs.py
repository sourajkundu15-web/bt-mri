import json
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('brain-tumor-classification-vgg19.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

cell = nb['cells'][1]
if 'outputs' in cell:
    for o in cell['outputs']:
        if o.get('output_type') == 'stream':
            text = ''.join(o.get('text', []))
            # Remove ANSI colors
            text = re.sub(r'\x1b\[[0-9;]*m', '', text)
            
            # Let's save this text to a file so we can analyze it
            with open('training_stdout.txt', 'w', encoding='utf-8') as tf:
                tf.write(text)
            
            # Print first 20 lines and last 20 lines to inspect
            lines = text.split('\n')
            print(f"Total lines of training output: {len(lines)}")
            print("\n--- First 20 lines ---")
            for line in lines[:20]:
                print(line)
            print("\n--- Last 20 lines ---")
            for line in lines[-20:]:
                print(line)
