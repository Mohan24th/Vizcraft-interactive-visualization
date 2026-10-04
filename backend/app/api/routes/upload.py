from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.file_service import save_file
from app.services.schema_service import read_dataset, detect_schema


router = APIRouter()


ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls"}


@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file provided",
        )

    extension = "." + file.filename.rsplit(".", 1)[-1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only CSV, XLS, and XLSX files are supported",
        )

    try:
        dataset_id, filepath = save_file(file)

        df = read_dataset(filepath)
        schema = detect_schema(df)

        columns = [
            {
                "name": column,
                "type": column_type,
            }
            for column, column_type in schema.items()
        ]

        return {
            "success": True,
            "dataset_id": dataset_id,
            "filename": file.filename,
            "rows": len(df),
            "columns": columns,
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Dataset upload failed: {str(e)}",
        )