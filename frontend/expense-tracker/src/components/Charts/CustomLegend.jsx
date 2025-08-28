import React from "react";

const CustomLegend = ({ payload }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-5 sm:mt-7 space-x-6">
      {payload.map((entry, index) => {
        return (
          <div key={`legend-${index}`} className="flex items-center space-x-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-xs text-gray-700 font-medium">
              {entry.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CustomLegend;
