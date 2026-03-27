import os
from huggingface_hub import HfApi

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "..", "backend/predictor", "model")

print("MODEL PATH:", MODEL_PATH)  # debug

api = HfApi()
api.upload_folder(
    folder_path=MODEL_PATH,
    repo_id="jetrxx/rd",
    repo_type="model"
)