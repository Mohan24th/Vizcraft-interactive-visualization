from pathlib import Path
import os

from dotenv import load_dotenv


load_dotenv()


BASE_DIR = Path(__file__).resolve().parent.parent


STORAGE_DIR = BASE_DIR / "storage"
DATASETS_DIR = STORAGE_DIR / "datasets"
OUTPUTS_DIR = STORAGE_DIR / "outputs"


DATASETS_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

OUTPUTS_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


APP_NAME = "VizCraft API"

API_HOST = os.getenv(
    "API_HOST",
    "127.0.0.1",
)

API_PORT = int(
    os.getenv(
        "API_PORT",
        "8000",
    )
)


GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY"
)
