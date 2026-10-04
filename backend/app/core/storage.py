from pathlib import Path

from app.core.config import DATASETS_DIR, OUTPUTS_DIR


def get_dataset_path(dataset_id: str) -> Path | None:
    for path in DATASETS_DIR.glob(f"{dataset_id}.*"):
        if path.is_file():
            return path

    return None


def get_output_path(filename: str) -> Path:
    return OUTPUTS_DIR / filename
