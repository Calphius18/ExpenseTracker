import React from "react";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-xl p-3 border border-gray-100">
        <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">
          {payload[0].payload.category || payload[0].payload.name}
        </p>
        <p className="text-sm font-semibold text-gray-700">
          Amount:{" "}
          <span className="text-lg font-bold text-gray-900">
            ₦{payload[0].payload.amount}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
