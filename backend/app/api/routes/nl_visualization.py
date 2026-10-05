from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.nl_visualization_service import (
    query_to_chart
)

from app.services.plot_service import (
    generate_plot
)

from app.core.storage import OUTPUTS_DIR


router = APIRouter()


class NLVisualizationRequest(BaseModel):

    dataset_id: str
    query: str


@router.post("/")
def create_visualization(
    request: NLVisualizationRequest
):

    try:

        print(
            "NL API: request:",
            request.query
        )

        # --------------------------------
        # 1. Gemini decides chart config
        # --------------------------------

        chart_config = query_to_chart(
            request.dataset_id,
            request.query
        )

        # --------------------------------
        # 2. Backend generates chart
        # --------------------------------

        plot_config = {
            "dataset_id": request.dataset_id,
            "chart_type": chart_config["chart_type"],
            "x": chart_config.get("x"),
            "y": chart_config.get("y"),
            "hue": chart_config.get("hue"),
        }

        filename = generate_plot(
            plot_config
        )

        # --------------------------------
        # 3. Return result to frontend
        # --------------------------------

        return {
            "success": True,

            "chart_config": chart_config,

            "image_url": f"/plot/image/{filename}",
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:

        print(
            "NL API ERROR:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
