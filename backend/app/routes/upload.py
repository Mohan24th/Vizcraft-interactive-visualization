from fastapi import APIRouter, UploadFile, File
from app.services.file_service import save_file
from app.services.schema_service import read_dataset, detect_schema

router = APIRouter()

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):

    dataset_id, filepath = save_file(file)

    df = read_dataset(filepath)
    schema = detect_schema(df)

    # convert dict → list for frontend
    columns = [
        {"name": col, "type": dtype}
        for col, dtype in schema.items()
    ]

    return {
        "dataset_id": dataset_id,
        "columns": columns,
        "rows": len(df)
    }