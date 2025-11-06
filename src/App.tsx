import React, { useEffect, useState } from "react";
import MetricCard from "./components/MetricCard";
import MetricChart from "./components/MetricChart";
import CpuGauge from "./components/CpuGauge";
import SystemOverview from "./components/SystemOverview";
import ActivityLog from "./components/ActivityLog";
import { fetchKernelMetrics } from "./api/health";
import { toggleStress } from "./api/stress";
import { motion } from "framer-motion";

interface Metrics {
  cpu_psi_stall_percent: number;
  context_switches_per_sec: number;
  blocked_processes_d_state: number;
}

export default function App() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [stress, setStress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cores, setCores] = useState(2);
  const [logs, setLogs] = useState<{ time: string; message: string }[]>([]);

  // Fetch metrics every 2 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await fetchKernelMetrics();
      if (data) {
        setMetrics(data);
        setHistory((prev) => [
          ...prev.slice(-19),
          { ...data, time: new Date().toLocaleTimeString() },
        ]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Stress toggle
  const handleStressToggle = async () => {
    setLoading(true);
    const newStressState = !stress;
    setStress(newStressState);

    setLogs((prev) => [
      {
        time: new Date().toLocaleTimeString(),
        message: `${newStressState ? "Started" : "Stopped"} stress (${cores} cores)`,
      },
      ...prev.slice(0, 9),
    ]);

    try {
      const response = await toggleStress(newStressState, cores, true);
      if (response) console.log("Stress API:", response.message);
    } catch (err) {
      console.error("Failed to toggle stress:", err);
    }
    setLoading(false);
  };

  if (!metrics) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400 text-xl animate-pulse">
        Loading kernel metrics...
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-6 space-y-8 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#000000] relative overflow-hidden">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e3a8a_0%,transparent_60%),radial-gradient(circle_at_70%_70%,#7e22ce_0%,transparent_60%)] opacity-25 blur-3xl -z-10"></div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-5 -z-10"></div>

      {/* Header */}
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold tracking-wide">
          🐧 Kernel Health Dashboard
        </h1>

        <div className="flex items-center gap-4">
          {/* Core Selector */}
          <input
            type="number"
            min="1"
            max={navigator.hardwareConcurrency || 8}
            value={cores}
            onChange={(e) => setCores(Number(e.target.value))}
            className="w-20 px-2 py-1 rounded-md text-black text-center border border-gray-600"
          />
          <span className="text-gray-300 text-sm">Cores</span>

          {/* Stress Button */}
          <button
            onClick={handleStressToggle}
            disabled={loading}
            className={`px-5 py-2.5 rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] ${
              stress
                ? "bg-gradient-to-r from-red-600 to-pink-600"
                : "bg-gradient-to-r from-green-500 to-emerald-600"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Applying..." : stress ? "Stop Stress" : "Start Stress"}
          </button>
        </div>
      </motion.div>

      {/* System Overview */}
      <SystemOverview metrics={metrics} stress={stress} cores={cores} />

      {/* Metric Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <MetricCard
          title="CPU PSI Stall"
          value={metrics.cpu_psi_stall_percent.toFixed(2)}
          unit="%"
          color="text-violet-400"
        />
        <MetricCard
          title="Context Switch Rate"
          value={metrics.context_switches_per_sec.toFixed(2)}
          unit="/s"
          color="text-blue-400"
        />
        <MetricCard
          title="Blocked Processes (D-STATE)"
          value={metrics.blocked_processes_d_state}
          color="text-yellow-400"
        />
      </motion.div>

      {/* Charts */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <div className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-2xl shadow-xl border border-gray-700 hover:border-gray-600 transition">
          <CpuGauge value={metrics.cpu_psi_stall_percent} />
        </div>

        <MetricChart
          data={history}
          dataKey="cpu_psi_stall_percent"
          color="#a855f7"
          title="CPU PSI Stall Over Time"
        />
        <MetricChart
          data={history}
          dataKey="context_switches_per_sec"
          color="#3b82f6"
          title="Context Switches Over Time"
        />
        <MetricChart
          data={history}
          dataKey="blocked_processes_d_state"
          color="#facc15"
          title="Blocked Processes Over Time"
        />
      </motion.div>

      {/* Logs */}
      <ActivityLog logs={logs} />

      {/* Footer */}
      <motion.footer
        className="text-center text-gray-500 text-sm pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        © {new Date().getFullYear()} Kernel Health Monitor • Built with ❤️ by Kamran and Pranjal 
      </motion.footer>
    </div>
  );
}