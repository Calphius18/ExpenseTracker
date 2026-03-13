import React, { useEffect, useState } from 'react'
import { prepareExpenseBarChartData } from '../../utils/helper';
import DailySpendBarList from "./DailySpendBarList";

const Last30DaysExpenses = ({ data = [] }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const result = prepareExpenseBarChartData(data);
      setChartData(result);
    }
  }, [data]);

  return (
    <div className="card hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold text-gray-800">Last 30 Days Expenses</h5>
      </div>

      {!data || data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[250px] text-gray-400 bg-gray-50/50 rounded-[20px] border border-dashed border-gray-200">
          <p className="text-sm">No expenses recorded in the last 30 days</p>
        </div>
      ) : (
        <DailySpendBarList data={chartData} />
      )}
    </div>
  );
};

export default Last30DaysExpenses