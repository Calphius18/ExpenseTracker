import React, { useEffect, useState, useCallback } from "react";
import SpendingProgress from "./SpendingProgress";

const RecentBudgetWithChart = ({ data, totalBudget }) => {
  const [chartData, setChartData] = useState([]);

  const prepareChartData = useCallback(() => {
    const dataArr = data?.map((item) => ({
      name: item?.source,
      amount: item?.amount,
      category: item?.category,
      source: item?.source,
      personnel: item?.name
    }));

    setChartData(dataArr);
  }, [data]);

  useEffect(() => {
    prepareChartData();
  }, [prepareChartData]);

  return (
    <div className="card hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h5 className="text-xl font-bold text-gray-800">Budget Distribution</h5>
      </div>

      <SpendingProgress
        data={chartData}
        total={totalBudget}
      />
    </div>
  );
};

export default RecentBudgetWithChart;
