from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.profiling_service import (
    profile_dataset
)

from app.services.ai_chart_recommendation_service import (
    generate_chart_recommendations
)

router = APIRouter()


class DatasetRequest(BaseModel):
    dataset_id: str


@router.post("/recommend")
def recommend(request: DatasetRequest):

    try:

        profile = profile_dataset(
            request.dataset_id
        )

        return generate_chart_recommendations(
            profile
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )