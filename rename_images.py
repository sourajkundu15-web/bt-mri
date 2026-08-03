import shutil
import os

shutil.copy('website/public/mri/cell4_output1.png', 'website/public/mri/acc_loss.png')
shutil.copy('website/public/mri/cell4_output2.png', 'website/public/mri/precision_recall.png')
shutil.copy('website/public/mri/cell6_output0.png', 'website/public/mri/confusion_matrix.png')

print("Copied metric images successfully.")
