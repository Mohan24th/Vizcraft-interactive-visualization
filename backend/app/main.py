from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload, visualize

app = FastAPI(title="VizCraft API")

origins = [
    "https://vizcraft-visualization.vercel.app",
    "https://vizcraft-visualization-1pwbg0t8j-mohans-projects-601c13a8.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/data")
app.include_router(visualize.router, prefix="/plot")

app.mount("/plot/image", StaticFiles(directory="outputs"), name="images")

@app.get("/")
def home():
    return {"message": "VizCraft API running"}