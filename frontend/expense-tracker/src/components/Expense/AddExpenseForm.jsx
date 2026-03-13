import React, { useState, useEffect, useContext } from "react";
import Input from "../Inputs/Input";
import { UserContext } from "../../context/UserContext";
import toast from "react-hot-toast";

const AddExpenseForm = ({ onAddExpense }) => {
  const { hasRole } = useContext(UserContext);

  const [expense, setExpense] = useState({
    source: "",
    category: "",
    amount: "",
    date: "",
    icon: "",
    name: "",
    type: "CAPEX",
    percentagePaid: 0,
    balanceAmount: 0,
  });

  const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

  // Auto-recalculate balance
  useEffect(() => {
    const amount = Number(expense.amount) || 0;
    const pct = Math.min(Math.max(Number(expense.percentagePaid) || 0, 0), 100);
    const balance = Math.round((amount - (amount * pct) / 100 + Number.EPSILON) * 100) / 100;
    setExpense((prev) => ({ ...prev, balanceAmount: balance }));
  }, [expense.amount, expense.percentagePaid]);

  const isViewer = !hasRole(["user", "admin"]);

  const handleSubmit = () => {
    if (isViewer) {
      toast.error("You do not have permission to add expenses.");
      return;
    }
    onAddExpense(expense);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
        <Input
          value={expense.name}
          onChange={({ target }) => handleChange("name", target.value)}
          label="Personnel Name"
          placeholder="Henry George"
          type="text"
        />

        <Input
          value={expense.source}
          onChange={({ target }) => handleChange("source", target.value)}
          label="Expense Source"
          placeholder="Head Office (Dept), Branch"
          type="text"
        />

        <Input
          value={expense.category}
          onChange={({ target }) => handleChange("category", target.value)}
          label="Expense Category / Description"
          placeholder="Repair, Subscription, Licensing, etc"
          type="text"
        />

        <Input
          value={expense.amount}
          onChange={({ target }) => handleChange("amount", target.value)}
          label="Expense Amount"
          type="number"
        />

        <Input
          value={expense.percentagePaid}
          onChange={({ target }) => handleChange("percentagePaid", target.value)}
          label="Percentage Paid (%)"
          placeholder="0-100"
          type="number"
          min="0"
          max="100"
        />

        <Input
          value={expense.balanceAmount}
          label="Balance Amount"
          type="number"
          readOnly
        />

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div>
            <label className="block mb-2 mt-3 text-sm font-medium text-slate-500">
              Expense Type
            </label>
            <select
              value={expense.type}
              onChange={({ target }) => handleChange("type", target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4 text-slate-700 outline-none focus:border-primary transition-colors"
            >
              <option value="CAPEX">CAPEX</option>
              <option value="OPEX">OPEX</option>
              <option value="Transport Fee">Transport Fee</option>
            </select>
          </div>

          <Input
            value={expense.date}
            onChange={({ target }) => handleChange("date", target.value)}
            label="Date"
            type="date"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className={`add-btn add-btn-fill ${isViewer ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isViewer}
          onClick={handleSubmit}
        >
          {isViewer ? "View Only — Cannot Add" : "Add Expense"}
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
