import React from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = ["#f5875c", "#22c55e", "#ef4444"];

const FinanceOverview = ({ totalBalance, totalBudget, totalExpense }) => {
  const balanceData = [
    { name: "Total Balance", amount: totalBalance },
    { name: "Total Budget", amount: totalBudget },
    { name: "Total Expense", amount: totalExpense },
  ];
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Financial OverView</h5>
      </div>

      <CustomPieChart
        data={balanceData}
        label="Total Balance"
        totalAmount={`${totalBalance}`}
        colors={COLORS}
        showTextAnchor
      />
    </div>
  );
};

export default FinanceOverview;
