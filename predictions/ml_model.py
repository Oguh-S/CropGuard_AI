import os
import json
import tensorflow as tf

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(
    BASE_DIR, "ml_model", "CropGuard_Finetuned_Best.keras"
)

CLASS_PATH = os.path.join(
    BASE_DIR, "ml_model", "class_labels.json"
)

model = None
class_names = []

def load_model():
    global model, class_names

    if model is None:
        model = tf.keras.models.load_model(MODEL_PATH)

        with open(CLASS_PATH, "r") as file:
           data = json.load(file)
           class_names = data["class_names"]

    return model, class_names


import numpy as np
from PIL import Image

INVALID_IMAGE_MESSAGE = "Put a valid image"

def predict_disease(image_file):
    model, classes = load_model()

    try:
        image = Image.open(image_file).convert("RGB")
    except Exception as exc:
        raise ValueError(INVALID_IMAGE_MESSAGE) from exc

    # Reject tiny or visibly out-of-focus photos before asking the classifier.
    if min(image.size) < 128:
        raise ValueError(INVALID_IMAGE_MESSAGE)

    gray = np.asarray(image.convert("L"), dtype=np.float32)
    laplacian = (
        -4 * gray
        + np.roll(gray, 1, axis=0)
        + np.roll(gray, -1, axis=0)
        + np.roll(gray, 1, axis=1)
        + np.roll(gray, -1, axis=1)
    )
    if float(np.var(laplacian)) < 12:
        raise ValueError(INVALID_IMAGE_MESSAGE)

    image = image.resize((224, 224))

    image_array = np.array(image, dtype=np.float32)
    image_array = np.expand_dims(image_array, axis=0)

    predictions = model.predict(image_array, verbose=0)

    predicted_index = int(np.argmax(predictions[0]))
    confidence = float(predictions[0][predicted_index])

    # The model only knows crop leaf conditions; low confidence is treated as
    # an unsuitable/non-leaf image instead of presenting a misleading match.
    if confidence < 0.5:
        raise ValueError(INVALID_IMAGE_MESSAGE)

    return {
        "disease": classes[predicted_index],
        "confidence": round(confidence * 100, 2)
    }

