import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchHealthMetrics, type KernelMetrics } from "./api/health";
import MetricCard from "./components/MetricCard";
import MetricChart from "./components/MetricChart";
import CpuGauge from "./components/CpuGauge";

function App() {
  const [metrics, setMetrics] = useState<KernelMetrics | null>(null);

  // Poll backend every 2 seconds
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchHealthMetrics();
        setMetrics(data);
      } catch (err) {
        console.error("Error fetching metrics:", err);
      }
    };
    getData();
    const interval = setInterval(getData, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 text-xl">
        Loading Kernel Metrics...
      </div>
    );
  }

  // Status logic
  const cpuStatus =
    metrics.cpu_psi.full > 7
      ? "critical"
      : metrics.cpu_psi.full > 3
      ? "warning"
      : "normal";

  const csStatus = metrics.context_switch_rate > 4000 ? "warning" : "normal";
  const blockedStatus = metrics.blocked_processes > 0 ? "critical" : "normal";

  const overallStatus =
    cpuStatus === "critical" || blockedStatus === "critical"
      ? "critical"
      : cpuStatus === "warning" || csStatus === "warning"
      ? "warning"
      : "normal";

  const statusColor =
    overallStatus === "critical"
      ? "bg-red-500"
      : overallStatus === "warning"
      ? "bg-yellow-400"
      : "bg-green-500";

  const statusText =
    overallStatus === "critical"
      ? "Critical"
      : overallStatus === "warning"
      ? "Warning"
      : "Healthy";

  const bannerGradient =
    overallStatus === "critical"
      ? "from-red-500/30 via-red-600/20 to-red-900/10"
      : overallStatus === "warning"
      ? "from-yellow-400/30 via-yellow-500/20 to-yellow-700/10"
      : "from-green-500/30 via-green-600/20 to-green-900/10";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-10 border-b border-gray-700 pb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-3 h-3 rounded-full bg-green-400 animate-pulse"
              animate={{
                backgroundColor:
                  overallStatus === "critical"
                    ? "#ef4444"
                    : overallStatus === "warning"
                    ? "#facc15"
                    : "#22c55e",
              }}
              transition={{ duration: 0.3 }}
            />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Kernel Health Management System
            </h1>
          </div>

          <motion.div
            key={statusText}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusColor} text-black font-semibold mt-3 md:mt-0`}
          >
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2.5 h-2.5 rounded-full bg-black opacity-40"
            />
            {statusText}
          </motion.div>
        </header>

        {/* Banner */}
        <motion.div
          className={`h-3 rounded-full bg-gradient-to-r ${bannerGradient} mb-8`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Timestamp */}
        <p className="text-gray-400 text-sm mb-6 text-center md:text-left">
          Last Updated:{" "}
          <span className="text-gray-200 font-medium">
            {new Date(metrics.timestamp).toLocaleTimeString()}
          </span>
        </p>

        {/* Metric Cards */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
        >
          <MetricCard
            title="CPU PSI Stall"
            value={`${metrics.cpu_psi.some.toFixed(2)} / ${metrics.cpu_psi.full.toFixed(2)}`}
            unit="%"
            status={cpuStatus}
            description="CPU pressure (some/full)"
          />
          <MetricCard
            title="Context Switch Rate"
            value={metrics.context_switch_rate.toLocaleString()}
            unit="CS/sec"
            status={csStatus}
            description="Context switches per second"
          />
          <MetricCard
            title="Blocked Processes"
            value={metrics.blocked_processes}
            status={blockedStatus}
            description="Processes in uninterruptible sleep (D-State)"
          />
        </motion.div>

        {/* Large Chart */}
        <div className="mb-10">
          <MetricChart metrics={metrics} />
        </div>

        {/* Gauge Below */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-md">
            <CpuGauge metrics={metrics} />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-6">
          <p>
            © {new Date().getFullYear()} Kernel Health Dashboard · Built by{" "}
            <span className="text-gray-300 font-medium">Kamran Ahmed</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
