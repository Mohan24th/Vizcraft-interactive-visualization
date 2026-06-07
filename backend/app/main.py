from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload, visualize, insights ,ai_insights, ai_chart_recommendations

app = FastAPI(title="VizCraft API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/data")
app.include_router(visualize.router, prefix="/plot")
app.include_router(insights.router, prefix="/insights")
app.include_router(ai_insights.router, prefix="/ai-insights")
app.include_router(ai_chart_recommendations.router, prefix="/chart-recommendations")

app.mount("/plot/image", StaticFiles(directory="outputs"), name="images")

@app.get("/")
def home():
    return {"message": "VizCraft API running"}