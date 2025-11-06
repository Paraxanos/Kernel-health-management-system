import React from "react";

interface Props {
  metrics: {
    cpu_psi_stall_percent: number;
    context_switches_per_sec: number;
    blocked_processes_d_state: number;
  };
  stress: boolean;
  cores: number;
}

const SystemOverview: React.FC<Props> = ({ metrics, stress, cores }) => {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1e1b4b] via-[#111827] to-[#000000] border border-indigo-800/50 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700/10 via-transparent to-blue-600/10 blur-3xl"></div>

      <div className="relative z-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-200 flex items-center gap-2">
          <span>🖥️ System Overview</span>
          <span
            className={`text-xs px-2 py-1 rounded-full animate-pulse ${
              stress
                ? "bg-red-500/20 text-red-400"
                : "bg-green-500/20 text-green-400"
            }`}
          >
            {stress ? "Under Stress" : "Stable"}
          </span>
        </h2>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="hover:scale-105 transition-transform">
            <p className="text-gray-400 text-sm">Active Cores</p>
            <p className="text-2xl font-bold text-indigo-400">{cores}</p>
          </div>
          <div className="hover:scale-105 transition-transform">
            <p className="text-gray-400 text-sm">Context Switch Rate</p>
            <p className="text-2xl font-bold text-pink-400">
              {metrics.context_switches_per_sec.toFixed(0)}
            </p>
          </div>
          <div className="hover:scale-105 transition-transform">
            <p className="text-gray-400 text-sm">Blocked Processes</p>
            <p className="text-2xl font-bold text-yellow-400">
              {metrics.blocked_processes_d_state}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
