import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import auth, vehicles, prediction, charging, risk, trip, facilities, sos
from .ml.predict import get_xgb_model
from .ml.isolation_forest import get_isolation_forest_model

app = FastAPI(
    title="ZepGO API",
    description="AI-Powered EV Navigation & Charging Intelligence Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend Vite client and mobile view
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Sub-routers
app.include_router(auth.router)
app.include_router(vehicles.router)
app.include_router(prediction.router)
app.include_router(charging.router)
app.include_router(risk.router)
app.include_router(trip.router)
app.include_router(facilities.router)
app.include_router(sos.router)

from pathlib import Path
from fastapi import Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Static frontend mount if dist exists
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DIST_DIR = BASE_DIR / "dist"

if DIST_DIR.exists() and (DIST_DIR / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(DIST_DIR / "assets")), name="assets")

@app.get("/")
def root(request: Request):
    accept = request.headers.get("accept", "")
    if "text/html" in accept and DIST_DIR.exists() and (DIST_DIR / "index.html").exists():
        return FileResponse(str(DIST_DIR / "index.html"))
    xgb_loaded = get_xgb_model() is not None
    iso_loaded = get_isolation_forest_model() is not None
    return {
        "platform": "ZepGO – AI-Powered EV Navigation & Charging Intelligence Platform",
        "version": "1.0.0",
        "status": "operational",
        "ml_engine": {
            "xgboost_energy_predictor": "online" if xgb_loaded else "standby",
            "isolation_forest_anomaly_detector": "online" if iso_loaded else "standby"
        },
        "endpoints_documentation": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "zepgo-backend",
        "database": "sample-data-layer-active"
    }

@app.get("/{full_path:path}")
def serve_spa(full_path: str):
    if DIST_DIR.exists():
        target = DIST_DIR / full_path
        if target.exists() and target.is_file():
            return FileResponse(str(target))
        index_file = DIST_DIR / "index.html"
        if index_file.exists():
            return FileResponse(str(index_file))
    return {"error": "Not found", "path": full_path}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=port, reload=False)
