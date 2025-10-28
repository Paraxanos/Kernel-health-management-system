import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

interface Props {
  cpuSome: number;
  cpuFull: number;
}

const MetricChart: React.FC<Props> = ({ cpuSome, cpuFull }) => {
  const [data, setData] = useState<{ time: string; some: number; full: number }[]>([]);

  useEffect(() => {
    const now = new Date().toLocaleTimeString();
    setData((prev) => {
      const updated = [...prev, { time: now, some: cpuSome, full: cpuFull }];
      return updated.slice(-15); // keep last 15 points
    });
  }, [cpuSome, cpuFull]);

  return (
    <motion.div
      className="bg-gray-900/50 p-4 rounded-2xl shadow-lg mt-10 border border-gray-700"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-lg font-semibold mb-3 text-gray-200">CPU PSI Trend (last 30s)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="time" stroke="#aaa" />
          <YAxis stroke="#aaa" domain={[0, 10]} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#fff" }}
          />
          <Line type="monotone" dataKey="some" stroke="#60a5fa" strokeWidth={2} name="CPU Some %" />
          <Line type="monotone" dataKey="full" stroke="#f87171" strokeWidth={2} name="CPU Full %" />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default MetricChart;
