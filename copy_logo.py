import shutil
import os

src = 'image.png'
dest_logo = 'website/public/logo-icon.png'
dest_fav = 'website/public/favicon.png'

# Make sure public directory exists
os.makedirs(os.path.dirname(dest_logo), exist_ok=True)

shutil.copy(src, dest_logo)
shutil.copy(src, dest_fav)

print("Copied logo and favicon images successfully.")
