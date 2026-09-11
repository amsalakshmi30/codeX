"""
utils.py  -  shared helpers used by train / evaluate / predict / app
=====================================================================
Keeps all the "single source of truth" configuration in one place so the
whole project stays consistent and easy to explain in a viva.
"""
import os, json

# --------------------------------------------------------------------------- #
# 1. Global configuration
# --------------------------------------------------------------------------- #
IMG_SIZE   = 160          # images are resized to 160 x 160
BATCH_SIZE = 16
CHANNELS   = 3
SEED       = 42

ROOT        = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(ROOT, "dataset")
MODELS_DIR  = os.path.join(ROOT, "models")
OUTPUTS_DIR = os.path.join(ROOT, "outputs")

MODEL_PATH   = os.path.join(MODELS_DIR, "plant_disease_cnn.keras")
LABELS_PATH  = os.path.join(MODELS_DIR, "class_names.json")

NO_LEAF_CLASS = "no_leaf"

# --------------------------------------------------------------------------- #
# 2. Human-readable meaning of every class folder name
#    Folder naming convention:  Plant___Condition
# --------------------------------------------------------------------------- #
DISEASE_PRETTY = {
    "Healthy":            "None",
    "Yellow_Vein_Mosaic": "Yellow Vein Mosaic Virus",
    "Early_Blight":       "Early Blight",
    "Late_Blight":        "Late Blight",
    "Bacterial_Spot":     "Bacterial Leaf Spot",
    "Black_Rot":          "Black Rot",
    "Common_Rust":        "Common Rust",
    "Leaf_Blight":        "Leaf Blight",
}
PLANT_PRETTY = {
    "Okra":        "Ladies Finger (Okra)",
    "Tomato":      "Tomato",
    "Potato":      "Potato",
    "Bell_Pepper": "Bell Pepper (Capsicum)",
    "Grape":       "Grape",
    "Corn":        "Corn (Maize)",
}


def parse_class(class_name):
    """
    Turn a raw class-folder name into a friendly {plant, status, disease} dict.

    'Okra___Yellow_Vein_Mosaic' ->
        {'plant': 'Ladies Finger (Okra)', 'status': 'Diseased',
         'disease': 'Yellow Vein Mosaic Virus'}
    'no_leaf' -> a special No-Leaf marker.
    """
    if class_name == NO_LEAF_CLASS:
        return {"plant": None, "status": "No Leaf", "disease": None, "is_leaf": False}

    plant_key, _, cond_key = class_name.partition("___")
    plant   = PLANT_PRETTY.get(plant_key, plant_key.replace("_", " "))
    disease = DISEASE_PRETTY.get(cond_key, cond_key.replace("_", " "))
    status  = "Healthy" if cond_key == "Healthy" else "Diseased"
    return {"plant": plant, "status": status,
            "disease": (None if status == "Healthy" else disease), "is_leaf": True}


# --------------------------------------------------------------------------- #
# 3. Load / save the list of class names
# --------------------------------------------------------------------------- #
def save_class_names(class_names):
    os.makedirs(MODELS_DIR, exist_ok=True)
    with open(LABELS_PATH, "w") as f:
        json.dump(list(class_names), f, indent=2)


def load_class_names():
    with open(LABELS_PATH) as f:
        return json.load(f)


# --------------------------------------------------------------------------- #
#    Optional: fetch the model from Google Cloud Storage on first use
# --------------------------------------------------------------------------- #
def ensure_local_model():
    """
    Make sure models/plant_disease_cnn.keras exists locally.

    Model storage options (see README → 'Model storage on Google Cloud'):
      * Option 1 (default): the .keras file is shipped in the repo/container.
      * Option 2: set env var MODEL_GCS_URI=gs://bucket/path/model.keras and the
        model is downloaded from Google Cloud Storage on first use.

    Returns the local model path, or None if no model is available.
    """
    if os.path.exists(MODEL_PATH):
        return MODEL_PATH
    gcs_uri = os.environ.get("MODEL_GCS_URI", "").strip()
    if gcs_uri.startswith("gs://"):
        try:
            from google.cloud import storage
            os.makedirs(MODELS_DIR, exist_ok=True)
            bucket_name, _, blob_path = gcs_uri[len("gs://"):].partition("/")
            storage.Client().bucket(bucket_name).blob(blob_path).download_to_filename(MODEL_PATH)
            # class names may sit next to the model
            if not os.path.exists(LABELS_PATH):
                try:
                    lbl = blob_path.rsplit("/", 1)[0] + "/class_names.json"
                    storage.Client().bucket(bucket_name).blob(lbl).download_to_filename(LABELS_PATH)
                except Exception:
                    pass
            return MODEL_PATH if os.path.exists(MODEL_PATH) else None
        except Exception as e:
            print("Could not download model from GCS:", e)
            return None
    return None


# --------------------------------------------------------------------------- #
# 4. The CNN  -  BUILT FROM SCRATCH (no pretrained / transfer learning)
# --------------------------------------------------------------------------- #
def build_cnn(num_classes, img_size=IMG_SIZE):
    """
    A small, easy-to-explain Convolutional Neural Network.

        Input (160x160x3)
          -> Conv2D(32) -> ReLU -> MaxPool
          -> Conv2D(64) -> ReLU -> MaxPool
          -> Conv2D(128) -> ReLU -> MaxPool
          -> GlobalAveragePooling
          -> Dense(128) -> ReLU -> Dropout(0.4)
          -> Dense(num_classes) -> Softmax

    Every weight is learned from our own images. Nothing is imported from
    ImageNet, MobileNet, ResNet, VGG, EfficientNet, Inception or YOLO.
    """
    from tensorflow import keras
    from tensorflow.keras import layers

    inputs = keras.Input(shape=(img_size, img_size, CHANNELS))
    # Pixels come in as 0-255; scale them to 0-1 inside the model so that
    # prediction code never has to remember to do it.
    x = layers.Rescaling(1.0 / 255)(inputs)

    x = layers.Conv2D(32, 3, padding="same")(x)
    x = layers.ReLU()(x)
    x = layers.MaxPooling2D()(x)

    x = layers.Conv2D(64, 3, padding="same")(x)
    x = layers.ReLU()(x)
    x = layers.MaxPooling2D()(x)

    x = layers.Conv2D(128, 3, padding="same")(x)
    x = layers.ReLU()(x)
    x = layers.MaxPooling2D()(x)

    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(128)(x)
    x = layers.ReLU()(x)
    x = layers.Dropout(0.4)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    model = keras.Model(inputs, outputs, name="plant_disease_cnn")
    model.compile(optimizer=keras.optimizers.Adam(1e-3),
                  loss="categorical_crossentropy",
                  metrics=["accuracy"])
    return model


# --------------------------------------------------------------------------- #
# 5. Load & preprocess a single image for prediction
# --------------------------------------------------------------------------- #
def load_image_for_model(path_or_pil, img_size=IMG_SIZE):
    """Return a (1, H, W, 3) float32 array in 0-255 (model rescales internally)."""
    import numpy as np
    from PIL import Image
    im = path_or_pil if hasattr(path_or_pil, "convert") else Image.open(path_or_pil)
    im = im.convert("RGB").resize((img_size, img_size))
    arr = np.asarray(im, dtype="float32")
    return arr[None, ...]
