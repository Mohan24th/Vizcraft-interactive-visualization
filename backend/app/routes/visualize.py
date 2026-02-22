from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict

from app.services.plot_service import generate_plot
from app.services.recommendation_service import recommend_charts

router = APIRouter()


# ---------------- PLOT REQUEST ----------------
class PlotRequest(BaseModel):
    dataset_id: str
    chart_type: str
    x: Optional[str] = None
    y: Optional[str] = None
    hue: Optional[str] = None
    style: Optional[Dict] = None


@router.post("/generate")
def create_plot(req: PlotRequest):

    try:
        filename = generate_plot(req.model_dump())   # <- Pydantic v2 safe
        return {"image_url": f"/plot/image/{filename}"}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ---------------- RECOMMEND REQUEST ----------------
class RecommendRequest(BaseModel):
    dataset_id: str
    columns: List[str]


@router.post("/recommend")
def get_recommendations(req: RecommendRequest):

    try:
        recs = recommend_charts(req.dataset_id, req.columns)
        return {"recommendations": recs}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))