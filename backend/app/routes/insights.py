from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.profiling_service import profile_dataset

router = APIRouter()


class ProfileRequest(BaseModel):
    dataset_id: str


@router.post("/profile")
def get_profile(req: ProfileRequest):

    try:

        profile = profile_dataset(req.dataset_id)

        return {
            "success": True,
            "profile": profile
        }

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )