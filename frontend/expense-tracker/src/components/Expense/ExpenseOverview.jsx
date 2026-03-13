import React, { useEffect, useState } from "react";
import { prepareExpenseLineChartData } from "../../utils/helper";
import CustomLineChart from "../Charts/CustomLineChart";

const ExpenseOverview = ({ transactions }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareExpenseLineChartData(transactions);
    setChartData(result);
  }, [transactions]);

  return (
    <div className="card glass-card border-none shadow-2xl shadow-slate-200/50 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <div className="w-32 h-32 bg-primary rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <h5 className="text-xl font-bold text-slate-800">Expense Trends</h5>
        <p className="text-sm text-slate-500 mt-1">
          Analyze your spending patterns over time
        </p>
      </div>

      <div className="mt-8 relative z-10 min-h-[300px]">
        {/* We keep LineChart but ensure it's in a stable container */}
        <CustomLineChart data={chartData} />
      </div>
    </div>
  );
};

export default ExpenseOverview;
