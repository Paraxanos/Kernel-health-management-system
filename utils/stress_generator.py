import subprocess
import os
import time

class SystemLoadGenerator:
    def __init__(self):
        self.stress_process = None
        self.running = False

    def start_stress(self, num_cores: int, io_stress: bool = False):
        if self.running:
            return

        # Build stress-ng command
        cmd = [
            "stress-ng",
            "--cpu", str(num_cores),
            "--timeout", "10m"  # Auto-stop after 10 minutes (safety)
        ]

        if io_stress:
            # Use real disk (Windows C:\temp) to force D-state
            io_dir = "/mnt/c/temp"
            os.makedirs(io_dir, exist_ok=True)
            cmd += [
                "--io", "2",               # 2 I/O workers
                "--hdd", "1",              # 1 HDD writer
                "--hdd-bytes", "1G",       # Write 1GB total
                "--temp-path", io_dir      # Critical: use real disk
            ]

        try:
            # Start stress-ng in background
            self.stress_process = subprocess.Popen(
                cmd,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            self.running = True
        except Exception as e:
            print(f"Stress start failed: {e}")
            self.running = False

    def stop_stress(self):
        if not self.running or self.stress_process is None:
            return

        try:
            # Terminate gracefully
            self.stress_process.terminate()
            self.stress_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            # Force kill if needed
            self.stress_process.kill()
        except Exception as e:
            print(f"Stress stop error: {e}")
        finally:
            self.stress_process = None
            self.running = False