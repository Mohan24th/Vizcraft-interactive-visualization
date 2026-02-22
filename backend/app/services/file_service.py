import os
import uuid
from fastapi import UploadFile

STORAGE_PATH = "storage"

def save_file(file: UploadFile):
    # generate unique id
    dataset_id = str(uuid.uuid4())

    # extension
    ext = file.filename.split(".")[-1]
    filename = f"{dataset_id}.{ext}"

    filepath = os.path.join(STORAGE_PATH, filename)

    # save file
    with open(filepath, "wb") as buffer:
        buffer.write(file.file.read())

    return dataset_id, filepath
