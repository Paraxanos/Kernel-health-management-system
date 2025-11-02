import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

interface Props {
  metrics: {
    timestamp: string;
    cpu_psi: { some: number; full: number };
    context_switch_rate: number;
    blocked_processes: number;
  };
}

export default function MetricChart({ metrics }: Props) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData((prev) => {
      const updated = [
        ...prev,
        {
          time: new Date(metrics.timestamp).toLocaleTimeString(),
          cpu_some: metrics.cpu_psi.some,
          cpu_full: metrics.cpu_psi.full,
          cs_rate: metrics.context_switch_rate,
          blocked: metrics.blocked_processes,
        },
      ];
      // Keep only last 20 data points
      return updated.slice(-20);
    });
  }, [metrics]);

  return (
    <div className="mt-10 bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-700">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">
        Live Kernel Metrics Trend
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="time" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
          <Legend />
          <Line type="monotone" dataKey="cpu_some" stroke="#22c55e" dot={false} name="CPU PSI (some)" />
          <Line type="monotone" dataKey="cpu_full" stroke="#ef4444" dot={false} name="CPU PSI (full)" />
          <Line type="monotone" dataKey="cs_rate" stroke="#3b82f6" dot={false} name="Context Switches/sec" />
          <Line type="monotone" dataKey="blocked" stroke="#facc15" dot={false} name="Blocked Procs" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
