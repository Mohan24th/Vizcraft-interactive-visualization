from fastapi import APIRouter
from fastapi import HTTPException

from pydantic import BaseModel

from app.services.nl_visualization_service import (
    query_to_chart
)

router = APIRouter()


class NLVisualizationRequest(
    BaseModel
):

    dataset_id: str
    query: str


@router.post("/")
def create_visualization(
    request: NLVisualizationRequest
):

    try:

        chart_config = query_to_chart(
            request.dataset_id,
            request.query
        )

        return {
            "success": True,
            "chart_config": chart_config
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )