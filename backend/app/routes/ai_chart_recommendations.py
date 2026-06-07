from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.profiling_service import profile_dataset
from app.services.ai_chart_recommendation_service import (
    generate_chart_recommendations
)

router = APIRouter()


class ChartRecommendationRequest(BaseModel):
    dataset_id: str


@router.post("/recommend")
def recommend_charts(req: ChartRecommendationRequest):

    try:

        profile = profile_dataset(req.dataset_id)

        recommendations = generate_chart_recommendations(
            profile
        )

        return {
            "success": True,
            "recommendations": recommendations
        }

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )