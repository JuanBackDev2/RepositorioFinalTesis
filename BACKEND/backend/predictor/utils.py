import requests
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch
import os
from openai import OpenAI

os.environ["TRANSFORMERS_CACHE"] = "/app/cache"
# Path relative to the Django project
MODEL_PATH = "jetrxx/rd"

# Load model + processor once
processor = AutoImageProcessor.from_pretrained(MODEL_PATH)
model = AutoModelForImageClassification.from_pretrained(MODEL_PATH)

def predict_image(image_path):
    image = Image.open(image_path).convert("RGB")

    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class = logits.argmax(-1).item()

    return {
        "predicted_class": int(predicted_class),
        "scores": logits.softmax(-1).tolist()
    }

OPENAI_APIs = os.getenv("OPENAI")
print(OPENAI_APIs)

#client = OpenAI(api_key=OPENAI_APIs)
client = OpenAI(api_key=OPENAI_APIs)

def generate_feedback(label, confidence):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # cheap + fast + perfect for this
            messages=[
                {
                    "role": "system",
                    "content": "Responde únicamente en español. No incluyas inglés."
                },
                {
                    "role": "user",
                    "content": f"El modelo predijo '{label}' con {confidence:.2f}% de confianza a partir de una imagen de retina. Explica esto de forma clara y natural para un paciente, detalla que representa este estado en esta condición."
                }
            ],
            max_tokens=400,
            temperature=0.3,
        )

        return response.choices[0].message.content

    except Exception as e:
        print("OpenAI Error:", e)
        return "AI feedback unavailable."
