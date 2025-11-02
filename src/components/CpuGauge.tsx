import React from "react";

interface CpuGaugeProps {
  metrics: {
    cpu_psi: { some: number; full: number };
  };
}

const CpuGauge: React.FC<CpuGaugeProps> = ({ metrics }) => {
  const cpuSome = metrics.cpu_psi.some;
  const cpuFull = metrics.cpu_psi.full;

  const percentage = Math.min(100, (cpuSome + cpuFull) * 5); // scaling visually
  const strokeColor =
    percentage > 80 ? "#ef4444" : percentage > 50 ? "#facc15" : "#22c55e";

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700 flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold text-gray-200 mb-6">CPU PSI Gauge</h2>
      <svg viewBox="0 0 36 36" className="w-40 h-40">
        <path
          className="text-gray-700"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          stroke={strokeColor}
          strokeWidth="3"
          strokeDasharray={`${percentage}, 100`}
          strokeLinecap="round"
          fill="none"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <text
          x="18"
          y="20.35"
          className="text-lg font-bold"
          textAnchor="middle"
          fill="white"
        >
          {percentage.toFixed(0)}%
        </text>
      </svg>
      <p className="text-gray-400 mt-3">
        PSI (some/full): {cpuSome.toFixed(2)} / {cpuFull.toFixed(2)}
      </p>
    </div>
  );
};

export default CpuGauge;
