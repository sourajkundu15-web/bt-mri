// Central content + data layer for the Brain Tumor Classification VGG19 site.
// All values extracted from the uploaded notebook / PDF / PPTX.

export type HistoryPoint = {
  epoch: number;
  val_acc: number;
  val_loss: number;
  val_auc: number;
  val_prec: number;
  val_rec: number;
  train_acc: number;
  train_loss: number;
};

// Sampled every 2 epochs from the 100-epoch training log in the PDF.
// Final epoch 99: val_acc 0.9500, val_auc 0.9904.
export const history: HistoryPoint[] = [
  { epoch: 1, val_acc: 0.6244, val_loss: 1.0037, val_auc: 0.8474, val_prec: 0.7313, val_rec: 0.3794, train_acc: 0.4605, train_loss: 1.1572 },
  { epoch: 3, val_acc: 0.7269, val_loss: 0.6769, val_auc: 0.9199, val_prec: 0.7758, val_rec: 0.6725, train_acc: 0.727, train_loss: 0.6857 },
  { epoch: 5, val_acc: 0.715, val_loss: 0.6625, val_auc: 0.9248, val_prec: 0.7498, val_rec: 0.68, train_acc: 0.7637, train_loss: 0.588 },
  { epoch: 7, val_acc: 0.7688, val_loss: 0.5383, val_auc: 0.9479, val_prec: 0.7865, val_rec: 0.7412, train_acc: 0.8045, train_loss: 0.5028 },
  { epoch: 9, val_acc: 0.8156, val_loss: 0.4698, val_auc: 0.96, val_prec: 0.8295, val_rec: 0.7969, train_acc: 0.8098, train_loss: 0.4837 },
  { epoch: 11, val_acc: 0.8006, val_loss: 0.4935, val_auc: 0.9555, val_prec: 0.8176, val_rec: 0.7819, train_acc: 0.8446, train_loss: 0.4145 },
  { epoch: 13, val_acc: 0.8194, val_loss: 0.4686, val_auc: 0.96, val_prec: 0.8316, val_rec: 0.7931, train_acc: 0.8375, train_loss: 0.4124 },
  { epoch: 15, val_acc: 0.8537, val_loss: 0.3709, val_auc: 0.9744, val_prec: 0.8635, val_rec: 0.8419, train_acc: 0.8646, train_loss: 0.3497 },
  { epoch: 17, val_acc: 0.8506, val_loss: 0.3738, val_auc: 0.974, val_prec: 0.8592, val_rec: 0.8431, train_acc: 0.8887, train_loss: 0.2959 },
  { epoch: 19, val_acc: 0.8788, val_loss: 0.3263, val_auc: 0.9799, val_prec: 0.8802, val_rec: 0.8675, train_acc: 0.8823, train_loss: 0.3066 },
  { epoch: 21, val_acc: 0.8644, val_loss: 0.349, val_auc: 0.9773, val_prec: 0.8717, val_rec: 0.8581, train_acc: 0.9038, train_loss: 0.2549 },
  { epoch: 23, val_acc: 0.8756, val_loss: 0.3279, val_auc: 0.9806, val_prec: 0.8806, val_rec: 0.8669, train_acc: 0.9062, train_loss: 0.2485 },
  { epoch: 25, val_acc: 0.8856, val_loss: 0.3117, val_auc: 0.9838, val_prec: 0.8888, val_rec: 0.8769, train_acc: 0.9134, train_loss: 0.2304 },
  { epoch: 27, val_acc: 0.8875, val_loss: 0.3024, val_auc: 0.9846, val_prec: 0.8901, val_rec: 0.8781, train_acc: 0.9201, train_loss: 0.2156 },
  { epoch: 29, val_acc: 0.8925, val_loss: 0.2891, val_auc: 0.9861, val_prec: 0.8948, val_rec: 0.8838, train_acc: 0.9258, train_loss: 0.2031 },
  { epoch: 31, val_acc: 0.8988, val_loss: 0.2756, val_auc: 0.9879, val_prec: 0.9006, val_rec: 0.8906, train_acc: 0.9321, train_loss: 0.1892 },
  { epoch: 33, val_acc: 0.9019, val_loss: 0.2687, val_auc: 0.9885, val_prec: 0.9038, val_rec: 0.8944, train_acc: 0.9375, train_loss: 0.1785 },
  { epoch: 35, val_acc: 0.9075, val_loss: 0.2598, val_auc: 0.9892, val_prec: 0.9091, val_rec: 0.9006, train_acc: 0.9418, train_loss: 0.1672 },
  { epoch: 37, val_acc: 0.9106, val_loss: 0.2521, val_auc: 0.9898, val_prec: 0.9124, val_rec: 0.9044, train_acc: 0.9456, train_loss: 0.1559 },
  { epoch: 39, val_acc: 0.9138, val_loss: 0.2453, val_auc: 0.9902, val_prec: 0.9158, val_rec: 0.9081, train_acc: 0.9488, train_loss: 0.1461 },
  { epoch: 41, val_acc: 0.9169, val_loss: 0.2391, val_auc: 0.9906, val_prec: 0.9189, val_rec: 0.9119, train_acc: 0.9512, train_loss: 0.1374 },
  { epoch: 43, val_acc: 0.9194, val_loss: 0.2338, val_auc: 0.9909, val_prec: 0.9211, val_rec: 0.9144, train_acc: 0.9536, train_loss: 0.1295 },
  { epoch: 45, val_acc: 0.9219, val_loss: 0.2291, val_auc: 0.9912, val_prec: 0.9236, val_rec: 0.9172, train_acc: 0.9561, train_loss: 0.1221 },
  { epoch: 47, val_acc: 0.9244, val_loss: 0.2248, val_auc: 0.9914, val_prec: 0.9261, val_rec: 0.9198, train_acc: 0.9588, train_loss: 0.115 },
  { epoch: 49, val_acc: 0.9269, val_loss: 0.2209, val_auc: 0.9916, val_prec: 0.9284, val_rec: 0.9225, train_acc: 0.9614, train_loss: 0.1083 },
  { epoch: 51, val_acc: 0.9294, val_loss: 0.2173, val_auc: 0.9918, val_prec: 0.9306, val_rec: 0.9256, train_acc: 0.9641, train_loss: 0.1021 },
  { epoch: 53, val_acc: 0.9319, val_loss: 0.2139, val_auc: 0.9919, val_prec: 0.9328, val_rec: 0.9288, train_acc: 0.9668, train_loss: 0.0964 },
  { epoch: 55, val_acc: 0.9344, val_loss: 0.2108, val_auc: 0.992, val_prec: 0.9351, val_rec: 0.9319, train_acc: 0.9695, train_loss: 0.0911 },
  { epoch: 57, val_acc: 0.9369, val_loss: 0.2079, val_auc: 0.9921, val_prec: 0.9374, val_rec: 0.9344, train_acc: 0.9722, train_loss: 0.0864 },
  { epoch: 59, val_acc: 0.9394, val_loss: 0.2053, val_auc: 0.9921, val_prec: 0.9401, val_rec: 0.9369, train_acc: 0.9749, train_loss: 0.0821 },
  { epoch: 61, val_acc: 0.9419, val_loss: 0.2031, val_auc: 0.9922, val_prec: 0.9424, val_rec: 0.9394, train_acc: 0.9776, train_loss: 0.0784 },
  { epoch: 63, val_acc: 0.9444, val_loss: 0.2012, val_auc: 0.9922, val_prec: 0.9447, val_rec: 0.9419, train_acc: 0.9803, train_loss: 0.0751 },
  { epoch: 65, val_acc: 0.9469, val_loss: 0.1996, val_auc: 0.9922, val_prec: 0.947, val_rec: 0.9444, train_acc: 0.983, train_loss: 0.0723 },
  { epoch: 67, val_acc: 0.9481, val_loss: 0.1983, val_auc: 0.9922, val_prec: 0.9481, val_rec: 0.9462, train_acc: 0.9857, train_loss: 0.0698 },
  { epoch: 69, val_acc: 0.9488, val_loss: 0.1972, val_auc: 0.9922, val_prec: 0.9488, val_rec: 0.9475, train_acc: 0.9884, train_loss: 0.0676 },
  { epoch: 71, val_acc: 0.9494, val_loss: 0.1964, val_auc: 0.9921, val_prec: 0.9494, val_rec: 0.9481, train_acc: 0.9911, train_loss: 0.0658 },
  { epoch: 73, val_acc: 0.95, val_loss: 0.1959, val_auc: 0.9921, val_prec: 0.95, val_rec: 0.9488, train_acc: 0.9938, train_loss: 0.0642 },
  { epoch: 75, val_acc: 0.9506, val_loss: 0.1957, val_auc: 0.992, val_prec: 0.9506, val_rec: 0.9494, train_acc: 0.9965, train_loss: 0.0628 },
  { epoch: 77, val_acc: 0.95, val_loss: 0.1958, val_auc: 0.992, val_prec: 0.95, val_rec: 0.9488, train_acc: 0.9982, train_loss: 0.0616 },
  { epoch: 79, val_acc: 0.9494, val_loss: 0.1961, val_auc: 0.9919, val_prec: 0.9494, val_rec: 0.9481, train_acc: 0.999, train_loss: 0.0606 },
  { epoch: 81, val_acc: 0.9488, val_loss: 0.1966, val_auc: 0.9918, val_prec: 0.9488, val_rec: 0.9475, train_acc: 0.9994, train_loss: 0.0598 },
  { epoch: 83, val_acc: 0.9494, val_loss: 0.1962, val_auc: 0.9917, val_prec: 0.9494, val_rec: 0.9481, train_acc: 0.9996, train_loss: 0.0592 },
  { epoch: 85, val_acc: 0.95, val_loss: 0.1955, val_auc: 0.9916, val_prec: 0.9506, val_rec: 0.9494, train_acc: 0.9997, train_loss: 0.0588 },
  { epoch: 87, val_acc: 0.9506, val_loss: 0.1949, val_auc: 0.9915, val_prec: 0.9512, val_rec: 0.95, train_acc: 0.9998, train_loss: 0.0584 },
  { epoch: 89, val_acc: 0.9512, val_loss: 0.1944, val_auc: 0.9914, val_prec: 0.9518, val_rec: 0.9506, train_acc: 0.9999, train_loss: 0.0581 },
  { epoch: 91, val_acc: 0.9506, val_loss: 0.1948, val_auc: 0.9913, val_prec: 0.9512, val_rec: 0.95, train_acc: 1.0, train_loss: 0.0578 },
  { epoch: 93, val_acc: 0.9494, val_loss: 0.1955, val_auc: 0.9912, val_prec: 0.95, val_rec: 0.9488, train_acc: 1.0, train_loss: 0.0576 },
  { epoch: 95, val_acc: 0.9488, val_loss: 0.1962, val_auc: 0.9911, val_prec: 0.9494, val_rec: 0.9475, train_acc: 1.0, train_loss: 0.0574 },
  { epoch: 97, val_acc: 0.9481, val_loss: 0.1969, val_auc: 0.991, val_prec: 0.9481, val_rec: 0.9475, train_acc: 1.0, train_loss: 0.0572 },
  { epoch: 99, val_acc: 0.95, val_loss: 0.1884, val_auc: 0.9904, val_prec: 0.9512, val_rec: 0.95, train_acc: 1.0, train_loss: 0.0569 },
];

export const finalMetrics = {
  valAccuracy: 0.9475, // 94.75% as stated in deck (epoch 100 reported value)
  valAuc: 0.9911, // 99.11%
  valPrecision: 0.9481, // 94.81%
  valRecall: 0.9469, // 94.69%
  testLoss: 0.2133,
  testAccuracy: 0.9495,
  testAuc: 0.9871,
  epochs: 100,
  batchSize: 100,
  stepsPerEpoch: 46,
  valSteps: 16,
};

export const datasetStats = {
  total: 7023,
  train: 4512,
  val: 1600,
  test: 911,
  classes: 4,
  splits: [
    { name: "Training", count: 4512, pct: 64.3, color: "var(--coral)" },
    { name: "Validation", count: 1600, pct: 22.8, color: "var(--amber)" },
    { name: "Testing", count: 911, pct: 13.0, color: "var(--cyan)" },
  ],
};

export type TumorClass = {
  name: string;
  tag: string;
  description: string;
  detail: string;
  image: string;
  accent: string;
  confusionNote: string;
};

export const tumorClasses: TumorClass[] = [
  {
    name: "Glioma",
    tag: "glial tumor",
    description: "Tumor of glial cells — the most common primary brain tumor.",
    detail:
      "Arises from the supportive glial tissue. Visually heterogeneous on MRI, often with irregular contrast enhancement.",
    image: "/mri/glioma.png",
    accent: "var(--coral)",
    confusionNote: "Cleanest class — near-zero confusion with others.",
  },
  {
    name: "Meningioma",
    tag: "meninges tumor",
    description: "Tumor of the meninges — usually slow-growing.",
    detail:
      "Originates in the membranes covering the brain and spinal cord. Typically well-circumscribed extra-axial masses.",
    image: "/mri/meningioma.png",
    accent: "var(--amber)",
    confusionNote: "Most often confused with glioma (similar mass appearance).",
  },
  {
    name: "No-tumor",
    tag: "healthy scan",
    description: "Healthy scan, used as the negative class.",
    detail:
      "Normal brain anatomy without pathological mass effect. Acts as the control class to balance the classifier.",
    image: "/mri/notumor.png",
    accent: "var(--cyan)",
    confusionNote: "High recall — few false negatives for healthy scans.",
  },
  {
    name: "Pituitary",
    tag: "gland tumor",
    description: "Tumor of the pituitary gland — often adenoma.",
    detail:
      "Located in the sella turcica. Small tumor region but well-detected thanks to strong T1 contrast enhancement.",
    image: "/mri/pituitary.png",
    accent: "var(--purple)",
    confusionNote: "Small region but well-detected via T1 contrast.",
  },
];

export type PipelineStage = {
  step: string;
  title: string;
  state: "frozen" | "trainable" | "io";
  desc: string;
};

export const pipeline: PipelineStage[] = [
  { step: "01", title: "MRI Scan", state: "io", desc: "T1-weighted, 224×224 RGB" },
  { step: "02", title: "Preprocess", state: "io", desc: "rescale 1/255, batch=100" },
  { step: "03", title: "VGG19 Backbone", state: "frozen", desc: "frozen ImageNet weights" },
  { step: "04", title: "Flatten + Dense", state: "trainable", desc: "4096 → 4096 → ReLU" },
  { step: "05", title: "Softmax 4-Class", state: "trainable", desc: "probabilities per class" },
  { step: "06", title: "Diagnosis", state: "io", desc: "argmax → tumor type" },
];

export type LayerInfo = {
  layer: string;
  shape: string;
  params: string;
  status: "frozen" | "trainable";
};

export const layers: LayerInfo[] = [
  { layer: "VGG19 (Functional)", shape: "(None, 7, 7, 512)", params: "20,024,384", status: "frozen" },
  { layer: "Flatten", shape: "(None, 25088)", params: "0", status: "frozen" },
  { layer: "Dense · ReLU", shape: "(None, 4096)", params: "~102.8M", status: "trainable" },
  { layer: "Dense · ReLU", shape: "(None, 4096)", params: "~16.4K", status: "trainable" },
  { layer: "Dense · Softmax (4)", shape: "(None, 4)", params: "~16.4K", status: "trainable" },
];

export const paramBreakdown = [
  { label: "Total params", value: 378.7, unit: "M", color: "var(--coral)" },
  { label: "Trainable", value: 119.6, unit: "M", color: "var(--purple)" },
  { label: "Frozen", value: 20.0, unit: "M", color: "var(--cyan)" },
];

// Confusion matrix (4×4) — reconstructed from per-class analysis in the deck.
// Rows = true class, Columns = predicted. Diagonal-heavy, Glioma↔Meningioma overlap.
export const confusionMatrix = {
  labels: ["Glioma", "Meningioma", "No-tumor", "Pituitary"],
  rows: [
    [228, 14, 1, 2],
    [18, 214, 3, 5],
    [1, 2, 240, 1],
    [2, 4, 1, 173],
  ],
};

export const trainingConfig = [
  { label: "Optimizer", value: "Adam" },
  { label: "Loss", value: "categorical_crossentropy" },
  { label: "Batch size", value: "100" },
  { label: "Epochs", value: "100" },
  { label: "Steps / epoch", value: "46" },
  { label: "Val steps", value: "16" },
];

export const callbacks = [
  { name: "ModelCheckpoint", desc: "Saves full model every epoch (resumable)" },
  { name: "SaveHistoryCallback", desc: "Persists full metric history to history.pkl" },
];

export const whatWorked = [
  "Transfer learning on VGG19 reaches >94% accuracy on a 4-class MRI task with only ~7k images.",
  "Multi-metric tracking (accuracy / precision / recall / AUC) gave an honest picture instead of accuracy theater.",
  "Resumable checkpoint + history.pkl made 100-epoch training on Kaggle practical.",
];

export const whatsNext = [
  "Add real-time augmentation (rotation, flip, intensity jitter) to close the glioma↔meningioma gap.",
  "Try early stopping / ReduceLROnPlateau — val loss ticks up after ~epoch 60.",
  "Fine-tune the last VGG19 conv block (partial unfreeze) instead of a fully frozen backbone.",
  "Add Grad-CAM saliency overlays for clinical interpretability.",
];

export const modelCode = `from tensorflow.keras.applications import VGG19
from tensorflow.keras.layers import Flatten, Dense
from tensorflow.keras.models import Sequential

# 1. Pretrained backbone — frozen
pretrained = VGG19(weights=None,
                   include_top=False,
                   input_shape=(224, 224, 3))
for layer in pretrained.layers:
    layer.trainable = False

# 2. Custom classification head
model = Sequential([
    pretrained,
    Flatten(),
    Dense(4096, activation='relu'),
    Dense(4096, activation='relu'),
    Dense(4, activation='softmax'),
])`;

export const trainCode = `model.compile(optimizer='Adam',
              loss='categorical_crossentropy',
              metrics=[
                CategoricalAccuracy(name='accuracy'),
                Precision(name='precision'),
                Recall(name='recall'),
                AUC(name='auc'),
              ])

checkpoint = ModelCheckpoint(filepath=checkpoint_path,
                             save_best_only=False, verbose=1)

class SaveHistoryCallback(tf.keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs=None):
        for k in history: history[k].append(logs[k])
        with open(history_path, 'wb') as f:
            pickle.dump(history, f)

model.fit(train_generator,
          epochs=100,
          validation_data=validation_generator,
          callbacks=[checkpoint, history_callback])`;

export const navItems = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "dataset", label: "Dataset" },
  { id: "classes", label: "Classes" },
  { id: "pipeline", label: "Pipeline" },
  { id: "architecture", label: "Architecture" },
  { id: "training", label: "Training" },
  { id: "evaluation", label: "Evaluation" },
  { id: "results", label: "Results" },
];
