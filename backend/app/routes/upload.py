from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.file_service import save_file
from app.services.schema_service import read_dataset, detect_schema

router = APIRouter()

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):

    # -------- Validate file extension --------
    allowed_extensions = [".csv", ".xlsx", ".xls"]

    filename = file.filename.lower()

    if not any(filename.endswith(ext) for ext in allowed_extensions):
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. Only CSV and Excel files are allowed."
        )

    try:
        # -------- Save file --------
        dataset_id, filepath = save_file(file)

        # -------- Read dataset --------
        df = read_dataset(filepath)

        # -------- Detect schema --------
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

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to process file: {str(e)}"
        )