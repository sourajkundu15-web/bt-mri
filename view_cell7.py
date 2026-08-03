import json
with open('brain-tumor-classification-vgg19.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

cell7 = nb['cells'][7]
print("".join(cell7['source']))
