import React from "react";

interface CpuGaugeProps {
  value: number;
}

const CpuGauge: React.FC<CpuGaugeProps> = ({ value }) => {
  const percent = Math.min(100, value * 10); // convert 0–10 to %
  return (
    <div className="relative w-48 h-48 flex items-center justify-center bg-gray-900 rounded-full shadow-md">
      <svg className="absolute inset-0" viewBox="0 0 36 36">
        <path
          className="text-gray-700"
          strokeWidth="3.8"
          fill="none"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="text-green-400"
          strokeWidth="3.8"
          strokeDasharray={`${percent}, 100`}
          fill="none"
          strokeLinecap="round"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <span className="text-xl font-bold text-green-400">{percent.toFixed(1)}%</span>
    </div>
  );
};

export default CpuGauge;
