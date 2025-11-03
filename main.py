from fastapi import FastAPI
from routes.health import router as health_router
from routes.stress import router as stress_router

app = FastAPI(
    title="Kernel Health Manager",
    description="Real-time Linux kernel health monitoring with adaptive stress testing."
)

app.include_router(health_router, prefix="/api/v1", tags=["Health"])
app.include_router(stress_router, prefix="/api/v1", tags=["Stress"])

@app.get("/")
def root():
    return {"message": "Kernel Health Manager is running! 🐧"}