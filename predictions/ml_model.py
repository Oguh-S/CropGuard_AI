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

def predict_disease(image_file):
    model, classes = load_model()

    image = Image.open(image_file).convert("RGB")
    image = image.resize((224, 224))

    image_array = np.array(image, dtype=np.float32)
    image_array = np.expand_dims(image_array, axis=0)

    predictions = model.predict(image_array, verbose=0)

    predicted_index = int(np.argmax(predictions[0]))
    confidence = float(predictions[0][predicted_index])

    return {
        "disease": classes[predicted_index],
        "confidence": round(confidence * 100, 2)
    }

