import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { motion } from "framer-motion";

interface CpuGaugeProps {
  cpuSome: number;
  cpuFull: number;
}

const CpuGauge: React.FC<CpuGaugeProps> = ({ cpuSome, cpuFull }) => {
  const data = [
    { name: "CPU Some", value: cpuSome, fill: "#60a5fa" },
    { name: "CPU Full", value: cpuFull, fill: "#f87171" },
  ];

  const avg = ((cpuSome + cpuFull) / 2).toFixed(1);
  const isCritical = cpuFull > 7;
  const isWarning = cpuFull > 3 && cpuFull <= 7;

  const gaugeColor = isCritical
    ? "text-red-500"
    : isWarning
    ? "text-yellow-400"
    : "text-green-400";

  return (
    <motion.div
      className={`relative bg-gray-900/50 p-5 rounded-2xl shadow-lg border border-gray-700 mt-10 flex flex-col items-center justify-center overflow-hidden`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 🔴 Pulse Glow Animation (Critical Mode) */}
      {isCritical && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-red-500/20 blur-xl"
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      <h2 className="text-lg font-semibold mb-3 text-gray-200 relative z-10">CPU Usage Gauge</h2>

      <ResponsiveContainer width="100%" height={260}>
        <RadialBarChart
          data={data}
          startAngle={180}
          endAngle={0}
          innerRadius="50%"
          outerRadius="100%"
        >
          <PolarAngleAxis type="number" domain={[0, 10]} tick={false} />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={15}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <p className={`text-3xl font-bold ${gaugeColor} relative z-10`}>{avg}%</p>
      <p className="text-gray-400 text-sm relative z-10">Average CPU PSI (some/full)</p>
    </motion.div>
  );
};

export default CpuGauge;

