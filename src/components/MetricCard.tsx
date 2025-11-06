import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, color }) => (
  <div className={`rounded-2xl p-5 shadow-lg bg-gray-800 text-white hover:scale-105 transition-transform duration-300`}>
    <h2 className="text-lg font-semibold text-gray-400">{title}</h2>
    <p className={`text-3xl font-bold mt-2 ${color || "text-blue-400"}`}>
      {value} <span className="text-lg text-gray-400">{unit}</span>
    </p>
  </div>
);

export default MetricCard;
