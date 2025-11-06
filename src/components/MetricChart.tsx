import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface MetricChartProps {
  data: any[];
  dataKey: string;
  color: string;
  title: string;
}

const MetricChart: React.FC<MetricChartProps> = ({ data, dataKey, color, title }) => (
  <div className="p-4 bg-gray-800 rounded-2xl shadow-md">
    <h3 className="text-lg text-gray-300 mb-3">{title}</h3>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="time" stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default MetricChart;
