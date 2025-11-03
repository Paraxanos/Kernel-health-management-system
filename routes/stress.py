from fastapi import APIRouter, HTTPException
from models.schemas import StressConfig

router = APIRouter()

@router.post("/stress")
def set_stress(config: StressConfig):
    try:
        from services.kernel_health_service import KernelHealthService
        service = KernelHealthService()
        service.set_stress(
            enabled=config.enabled,
            cores=config.cores,
            io_stress=config.io_stress
        )
        action = "enabled" if config.enabled else "disabled"
        details = f"on {config.cores} CPU cores"
        if config.io_stress:
            details += " + I/O stress"
        return {
            "status": "success",
            "message": f"Stress {action} {details}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))