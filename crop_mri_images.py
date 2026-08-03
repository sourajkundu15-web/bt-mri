from PIL import Image
import os

img_path = 'website/public/mri/cell7_output1.png'
img = Image.open(img_path)

# Let's crop one cell to inspect it
# Let's save the first one (row 0, col 0)
width, height = img.size
cell_width = width / 5
cell_height = height / 20

# Let's write a function to crop a specific cell
def crop_cell(row, col, name):
    left = col * cell_width
    top = row * cell_height
    right = (col + 1) * cell_width
    bottom = (row + 1) * cell_height
    
    # Crop the box
    cell = img.crop((left, top, right, bottom))
    # We want to crop just the inner image without the title (which is at the top)
    # Let's analyze the dimensions of the cell (288.8 x 299.5)
    # Typically the title text is at the top, so we can crop the bottom square part.
    # Let's crop a square from the center/bottom:
    w, h = cell.size
    # Let's crop from y = 40 to y = h-10, and x = 10 to x = w-10
    inner = cell.crop((15, 55, w - 15, h - 5))
    inner = inner.convert('RGB')
    out_path = f'website/public/mri/{name}.png'
    inner.save(out_path)
    print(f"Saved {out_path} with size {inner.size}")

# Glioma is row 0
crop_cell(0, 0, 'glioma')
# Meningioma is row 5
crop_cell(5, 0, 'meningioma')
# No-tumor is row 10
crop_cell(10, 0, 'notumor')
# Pituitary is row 15
crop_cell(15, 0, 'pituitary')
