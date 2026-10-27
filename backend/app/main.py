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

@app.get("/")
def root():
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

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=port, reload=False)
