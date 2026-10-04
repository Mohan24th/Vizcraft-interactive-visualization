from typing import Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.plot_service import generate_plot
from app.services.recommendation_service import recommend_charts


router = APIRouter()


class PlotRequest(BaseModel):
    dataset_id: str
    chart_type: str
    x: Optional[str] = None
    y: Optional[str] = None
    hue: Optional[str] = None
    style: Optional[Dict] = None


class RecommendRequest(BaseModel):
    dataset_id: str
    columns: List[str]


@router.post("/generate")
def create_plot(request: PlotRequest):

    try:
        filename = generate_plot(request.model_dump())

        return {
            "success": True,
            "image_url": f"/plot/image/{filename}",
        }

    except FileNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Plot generation failed: {str(e)}",
        )


@router.post("/recommend")
def get_recommendations(request: RecommendRequest):

    try:
        recommendations = recommend_charts(
            request.dataset_id,
            request.columns,
        )

        return {
            "success": True,
            "recommendations": recommendations,
        }

    except FileNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Recommendation failed: {str(e)}",
        )
