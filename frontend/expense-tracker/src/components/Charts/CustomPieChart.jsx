import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import CustomLegend from "./CustomLegend";

const CustomPieChart = ({
  data = [],
  label,
  totalAmount,
  colors = [],
  showTextAnchor,
}) => {

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[350px] text-gray-400 bg-gray-50/50 rounded-[20px] border border-dashed border-gray-200">
        <p className="text-sm">No data available for {label}</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350} className="mt-3">
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          paddingAngle={5}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length] || "#CBD5E1"}
              stroke="none"
              className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
            />
          ))}
        </Pie>

        <Tooltip content={CustomTooltip} />
        <Legend content={CustomLegend} verticalAlign="bottom" />

        {showTextAnchor && (
          <g>
            <text
              x="50%"
              y="50%"
              dy={-25}
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="14px"
              fontWeight="medium"
            >
              {label}
            </text>

            <text
              x="50%"
              y="50%"
              dy={12}
              textAnchor="middle"
              fill="#1E293B"
              fontSize="24px"
              fontWeight="bold"
            >
              ₦{totalAmount}
            </text>
          </g>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
