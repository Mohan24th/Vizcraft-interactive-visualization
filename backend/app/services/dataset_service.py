import pandas as pd

from app.core.storage import get_dataset_path


def load_dataset(dataset_id: str):
    path = get_dataset_path(dataset_id)

    if path is None:
        raise FileNotFoundError(
            f"Dataset '{dataset_id}' not found"
        )

    try:
        if path.suffix.lower() == ".csv":
            return pd.read_csv(path)

        if path.suffix.lower() in {".xlsx", ".xls"}:
            return pd.read_excel(path)

        raise ValueError(
            f"Unsupported dataset format: {path.suffix}"
        )

    except Exception as e:
        raise Exception(
            f"Dataset loading failed: {str(e)}"
        ) from e