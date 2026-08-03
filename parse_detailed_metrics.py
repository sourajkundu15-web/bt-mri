import re

with open('training_stdout.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Regular expression to match epoch block
# e.g.:
# Epoch 1/100
# ...
# 46/46 ━━━━━━━━━━━━━━━━━━━━ 51s 1s/step - accuracy: 0.4605 - auc: 0.7407 - loss: 1.1572 - precision: 0.8863 - recall: 0.1589 - val_accuracy: 0.6244 - val_auc: 0.8474 - val_loss: 1.0037 - val_precision: 0.7313 - val_recall: 0.3794

epochs_data = []
matches = list(re.finditer(r'Epoch (\d+)/100', text))

for i, match in enumerate(matches):
    epoch_num = int(match.group(1))
    # Get text between this match and next match
    start = match.end()
    end = matches[i+1].start() if i+1 < len(matches) else len(text)
    sub = text[start:end]
    
    # Extract training and validation metrics
    metrics = {}
    metrics['epoch'] = epoch_num
    
    # Try to find accuracy, loss, precision, recall, val_accuracy, val_loss, val_precision, val_recall
    acc_m = re.search(r'accuracy: ([\d\.]+)', sub)
    loss_m = re.search(r'loss: ([\d\.]+)', sub)
    prec_m = re.search(r'precision: ([\d\.]+)', sub)
    rec_m = re.search(r'recall: ([\d\.]+)', sub)
    
    val_acc_m = re.search(r'val_accuracy: ([\d\.]+)', sub)
    val_loss_m = re.search(r'val_loss: ([\d\.]+)', sub)
    val_prec_m = re.search(r'val_precision: ([\d\.]+)', sub)
    val_rec_m = re.search(r'val_recall: ([\d\.]+)', sub)
    
    if acc_m: metrics['accuracy'] = acc_m.group(1)
    if loss_m: metrics['loss'] = loss_m.group(1)
    if prec_m: metrics['precision'] = prec_m.group(1)
    if rec_m: metrics['recall'] = rec_m.group(1)
    
    if val_acc_m: metrics['val_accuracy'] = val_acc_m.group(1)
    if val_loss_m: metrics['val_loss'] = val_loss_m.group(1)
    if val_prec_m: metrics['val_precision'] = val_prec_m.group(1)
    if val_rec_m: metrics['val_recall'] = val_rec_m.group(1)
    
    epochs_data.append(metrics)

# Print first 5 and last 5
print("First 5 epochs:")
for e in epochs_data[:5]:
    print(e)
print("\nLast 5 epochs:")
for e in epochs_data[-5:]:
    print(e)
