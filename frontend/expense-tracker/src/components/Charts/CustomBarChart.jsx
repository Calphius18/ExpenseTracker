import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomBarChart = ({ data = [] }) => {
  // Alternate Color Function
  const getBarColor = (index) => {
    return index % 2 === 0 ? "#f5875c" : "#fdba74";
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-xl p-3 border border-gray-100">
          <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">
            {payload[0].payload.category}
          </p>
          <p className="text-sm font-semibold text-gray-700">
            Amount:{" "}
            <span className="text-lg font-bold text-gray-900">
              ₦{payload[0].payload.amount}
            </span>
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            {payload[0].payload.month}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) return null;

  return (
    <div className="mt-4">
      <ResponsiveContainer width="100%" height={310}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={CustomTooltip} cursor={{ fill: '#f8fafc' }} />

          <Bar
            dataKey="amount"
            fill="#f5875c"
            radius={[8, 8, 0, 0]}
            barSize={30}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={getBarColor(index)}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
