import React, { useEffect, useState } from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = [
  "#f5875c", // orange
  "#22c55e", // green
  "#ef4444", // red
  "#3b82f6", // blue
  "#a855f7", // purple
  "#eab308", // yellow
  "#14b8a6", // teal
  "#6366f1", // indigo
  "#f97316", // deep orange
];

const RecentBudgetWithChart = ({ data, totalBudget }) => {
  const [chartData, setChartData] = useState([]);

  const prepareChartData = () => {
    const dataArr = data?.map((item) => ({
      name: item?.source,
      amount: item?.amount,
      category: item?.category,
      source: item?.source,
    }));

    setChartData(dataArr);
  };

  useEffect(() => {
    prepareChartData();

    return () => {};
  }, [data]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 60 Days Budget</h5>
      </div>

      <CustomPieChart
        data={chartData}
        label="Total Budget"
        totalAmount={`${totalBudget}`}
        showTextAnchor
        colors={COLORS}
      />
    </div>
  );
};

export default RecentBudgetWithChart;
