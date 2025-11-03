from fastapi import APIRouter
from models.schemas import KernelMetrics

router = APIRouter()

@router.get("/metrics", response_model=KernelMetrics)
def get_kernel_health():
    from services.kernel_health_service import KernelHealthService
    service = KernelHealthService()
    return service.get_current_metrics()