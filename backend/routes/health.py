from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["Health"])

@router.get("/health")
def get_health():
    return {
        "status": "ok",
        "service": "ZepGO Backend"
    }
