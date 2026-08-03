from PIL import Image
import os

img_path = 'website/public/mri/cell7_output1.png'
if os.path.exists(img_path):
    img = Image.open(img_path)
    print(f"Image format: {img.format}, Size: {img.size}, Mode: {img.mode}")
else:
    print("File not found")
