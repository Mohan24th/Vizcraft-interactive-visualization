from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import APP_NAME, OUTPUTS_DIR

from app.api.routes import (
    upload,
    visualization,
    analysis,
    insights,
    ai,
)

from app.api.routes import (
    ai_chart_recommendations,
    nl_visualization,
)


app = FastAPI(title=APP_NAME)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(upload.router, prefix="/data", tags=["Dataset"])
app.include_router(visualization.router, prefix="/plot", tags=["Visualization"])
app.include_router(analysis.router, prefix="/analysis", tags=["Analysis"])
app.include_router(insights.router, prefix="/insights", tags=["Insights"])
app.include_router(ai.router, prefix="/ai", tags=["AI"])

app.include_router(
    ai_chart_recommendations.router,
    prefix="/chart-recommendations",
    tags=["AI Chart Recommendations"],
)

app.include_router(
    nl_visualization.router,
    prefix="/nl-visualization",
    tags=["Natural Language Visualization"],
)


app.mount(
    "/plot/image",
    StaticFiles(directory=str(OUTPUTS_DIR)),
    name="images",
)


@app.get("/")
def home():
    return {
        "message": "VizCraft API running",
        "status": "ok",
    }
