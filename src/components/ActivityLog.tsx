import React from "react";

interface LogEntry {
  time: string;
  message: string;
}

interface Props {
  logs: LogEntry[];
}

const ActivityLog: React.FC<Props> = ({ logs }) => {
  return (
    <div className="bg-gray-800/50 p-5 rounded-2xl shadow-md border border-gray-700 h-64 overflow-y-auto backdrop-blur-md">
      <h2 className="text-lg font-semibold text-gray-200 mb-3">
        🧾 Activity Log
      </h2>
      {logs.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">No recent actions</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {logs.map((log, idx) => (
            <li key={idx} className="text-gray-400 hover:text-gray-300">
              <span className="text-gray-500">[{log.time}]</span> {log.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityLog;
