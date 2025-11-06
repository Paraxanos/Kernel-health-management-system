import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, color }) => (
  <div
    className={`
      group rounded-2xl p-5 shadow-lg bg-gradient-to-br from-[#1f2937] to-[#0f172a]
      text-white hover:scale-105 hover:shadow-[0_0_25px_rgba(147,51,234,0.4)]
      transition-all duration-300 border border-gray-700/40
    `}
  >
    <h2 className="text-sm font-semibold text-gray-400 group-hover:text-gray-300 transition">
      {title}
    </h2>
    <p
      className={`text-4xl font-extrabold mt-2 tracking-tight ${color || "text-violet-400"}`}
    >
      {value}
      <span className="text-lg ml-1 text-gray-400">{unit}</span>
    </p>
  </div>
);

export default MetricCard;
