from fastapi import APIRouter, HTTPException

from app.services.profiling_service import profile_dataset

router = APIRouter()


@router.get("/{dataset_id}")
def get_analysis(dataset_id: str):

    try:

        profile = profile_dataset(dataset_id)

        return {
            "success": True,
            "dataset_id": dataset_id,
            "analysis": profile
        }

    except FileNotFoundError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )