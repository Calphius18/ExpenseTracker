import SpendingProgress from "./SpendingProgress";

const FinanceOverview = ({ transactions = [], totalExpense }) => {
  // Group transactions by category
  const categoryData = transactions.reduce((acc, curr) => {
    const existing = acc.find((item) => item.name === curr.category);
    if (existing) {
      existing.amount += curr.amount;
    } else {
      acc.push({ name: curr.category, amount: curr.amount, category: curr.category });
    }
    return acc;
  }, []);

  return (
    <div className="card hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h5 className="text-xl font-bold text-gray-800">Expense Breakdown</h5>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Total Spend</p>
          <p className="text-lg font-bold text-primary">₦{totalExpense.toLocaleString()}</p>
        </div>
      </div>

      <SpendingProgress
        data={categoryData.sort((a, b) => b.amount - a.amount).slice(0, 5)}
        total={totalExpense}
      />
    </div>
  );
};

export default FinanceOverview;
