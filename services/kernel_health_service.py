import time
from typing import Dict, Optional
from utils.metric_reader import get_kernel_metrics
from utils.stress_generator import SystemLoadGenerator

class KernelHealthService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.last_ctxt = None
            cls._instance.last_time = time.time()
            cls._instance._stress_gen = SystemLoadGenerator()
        return cls._instance

    def get_current_metrics(self) -> Dict[str, Optional[float]]:
        raw = get_kernel_metrics()

        current_ctxt = raw.get("context_switches_per_sec")
        if current_ctxt is not None and self.last_ctxt is not None:
            elapsed = time.time() - self.last_time
            if elapsed > 0.1:
                rate = (current_ctxt - self.last_ctxt) / elapsed
                raw["context_switches_per_sec"] = max(0.0, rate)
            else:
                raw["context_switches_per_sec"] = 0.0
        else:
            raw["context_switches_per_sec"] = 0.0

        self.last_ctxt = current_ctxt
        self.last_time = time.time()
        return raw

    def set_stress(self, enabled: bool, cores: int = 1, io_stress: bool = False):
        if enabled:
            self._stress_gen.start_stress(cores, io_stress)
        else:
            self._stress_gen.stop_stress()