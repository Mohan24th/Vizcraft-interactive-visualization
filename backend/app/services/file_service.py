import uuid
from fastapi import UploadFile

from app.core.storage import DATASETS_DIR


def save_file(file: UploadFile):
    dataset_id = str(uuid.uuid4())

    extension = file.filename.rsplit(".", 1)[-1].lower()
    filename = f"{dataset_id}.{extension}"

    filepath = DATASETS_DIR / filename

    with filepath.open("wb") as buffer:
        buffer.write(file.file.read())

    return dataset_id, filepath