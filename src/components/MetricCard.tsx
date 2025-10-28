import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  description: string;
  status: "normal" | "warning" | "critical";
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  description,
  status,
}) => {
  const getColorClasses = () => {
    switch (status) {
      case "critical":
        return "bg-red-600/90 border-red-500 shadow-red-700/40";
      case "warning":
        return "bg-yellow-500/90 border-yellow-400 shadow-yellow-600/30";
      case "normal":
      default:
        return "bg-green-500/90 border-green-400 shadow-green-600/30";
    }
  };

  const colorClasses = getColorClasses();

  return (
    <motion.div
      className={`rounded-2xl border p-6 text-gray-100 shadow-md transition-all duration-300 ease-in-out transform hover:scale-[1.03] hover:shadow-xl ${colorClasses}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="flex items-end gap-1">
        <motion.p
          key={value.toString()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold text-white"
        >
          {value}
        </motion.p>
        {unit && <span className="text-gray-200 mb-1">{unit}</span>}
      </div>
      <p className="text-gray-900 font-medium text-sm mt-1">{description}</p>
    </motion.div>
  );
};

export default MetricCard;
