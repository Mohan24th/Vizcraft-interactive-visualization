from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.profiling_service import profile_dataset


router = APIRouter()


class ProfileRequest(BaseModel):
    dataset_id: str


@router.post("/profile")
def get_profile(request: ProfileRequest):

    try:

        profile = profile_dataset(
            request.dataset_id
        )

        return {
            "success": True,
            "dataset_id": request.dataset_id,
            "profile": profile,
        }

    except FileNotFoundError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Profiling failed: {str(e)}",
        )
