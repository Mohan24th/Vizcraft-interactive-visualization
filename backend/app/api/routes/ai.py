from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.profiling_service import profile_dataset
from app.services.ai_insight_service import generate_insights

router = APIRouter()


class AIInsightRequest(BaseModel):
    dataset_id: str


@router.post("/generate")
def generate_ai_insights(req: AIInsightRequest):

    try:

        profile = profile_dataset(req.dataset_id)

        insights = generate_insights(profile)

        return {
            "success": True,
            "insights": insights
        }

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )