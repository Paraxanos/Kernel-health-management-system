export interface KernelMetrics {
  cpu_psi_stall_percent: number;
  context_switches_per_sec: number;
  blocked_processes_d_state: number;
}
export async function fetchKernelMetrics() {
  try {
    const res = await fetch("/api/v1/metrics"); // ✅ Use proxy instead of hardcoding IP
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("❌ Fetch error:", err);
    return null;
  }
}
