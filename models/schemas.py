from pydantic import BaseModel
from typing import Optional

class KernelMetrics(BaseModel):
    cpu_psi_stall_percent: Optional[float]
    context_switches_per_sec: Optional[float]
    blocked_processes_d_state: Optional[int]

class StressConfig(BaseModel):
    enabled: bool
    cores: int = 1
    io_stress: bool = False