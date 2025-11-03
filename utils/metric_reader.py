import re
import subprocess
from typing import Dict, Optional

def read_cpu_psi_stall() -> Optional[float]:
    try:
        with open("/proc/pressure/cpu", "r") as f:
            content = f.read()
        match = re.search(r"some\s+avg10=([\d.]+)", content)
        return float(match.group(1)) if match else None
    except (FileNotFoundError, ValueError):
        return None

def read_context_switches() -> Optional[int]:
    try:
        with open("/proc/stat", "r") as f:
            for line in f:
                if line.startswith("ctxt"):
                    return int(line.split()[1])
    except (FileNotFoundError, IndexError, ValueError):
        return None

def read_blocked_processes() -> Optional[int]:
    try:
        with open("/proc/stat", "r") as f:
            for line in f:
                if line.startswith("procs_blocked"):
                    return int(line.split()[1])
    except (FileNotFoundError, IndexError, ValueError):
        pass

    try:
        result = subprocess.run(
            ["ps", "axo", "stat"],
            capture_output=True,
            text=True,
            check=True
        )
        count = 0
        for line in result.stdout.splitlines()[1:]:
            if 'D' in line:
                count += 1
        return count
    except Exception:
        return None

def get_kernel_metrics() -> Dict[str, Optional[float]]:
    return {
        "cpu_psi_stall_percent": read_cpu_psi_stall(),
        "context_switches_per_sec": read_context_switches(),
        "blocked_processes_d_state": read_blocked_processes()
    }