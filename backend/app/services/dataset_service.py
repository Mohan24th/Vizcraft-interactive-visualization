import os
import pandas as pd

STORAGE_PATH = "storage"


def load_dataset(dataset_id: str):
    """
    Load dataset using dataset_id.
    """

    try:
        for file in os.listdir(STORAGE_PATH):

            if file.startswith(dataset_id):

                path = os.path.join(STORAGE_PATH, file)

                if file.endswith(".csv"):
                    return pd.read_csv(path)

                elif file.endswith((".xlsx", ".xls")):
                    return pd.read_excel(path)

        raise FileNotFoundError(
            f"Dataset {dataset_id} not found"
        )

    except Exception as e:
        raise Exception(
            f"Dataset loading failed: {str(e)}"
        )