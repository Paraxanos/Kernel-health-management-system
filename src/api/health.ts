import axios from "axios";

export interface KernelMetrics {
  timestamp: string;
  cpu_psi: { some: number; full: number };
  context_switch_rate: number;
  blocked_processes: number;
}

export async function fetchHealthMetrics(): Promise<KernelMetrics> {
 const response = await axios.get<KernelMetrics>("http://127.0.0.1:3000/api/health/latest");
  return response.data;
}
