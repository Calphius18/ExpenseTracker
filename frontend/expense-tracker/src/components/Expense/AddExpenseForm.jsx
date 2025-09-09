import React, { useState, useEffect } from "react";
import Input from "../Inputs/Input";

const AddExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    source: "",
    category: "",
    amount: "",
    date: "",
    icon: "",
    name: "",
    type: "CAPEX",          // default type
    percentagePaid: 0,     // new field
    balanceAmount: 0,      // calculated
  });

  const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

  // Recalculate balanceAmount whenever amount or percentagePaid changes
  useEffect(() => {
    const amount = Number(expense.amount) || 0;
    const pct = Math.min(Math.max(Number(expense.percentagePaid) || 0, 0), 100);
    const balance = Math.round((amount - (amount * pct) / 100 + Number.EPSILON) * 100) / 100;
    setExpense(prev => ({ ...prev, balanceAmount: balance }));
  }, [expense.amount, expense.percentagePaid]);

  return (
    <div>
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
        placeholder=""
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
        placeholder=""
        type="number"
        readOnly
      />

      {/* Dropdown for type */}
      <label className="block mb-2 mt-3 text-sm font-medium text-slate-400">Expense Type</label>
      <select
        value={expense.type}
        onChange={({ target }) => handleChange("type", target.value)}
        className="w-full border rounded p-2 mb-4 text-slate-600 bg-white"
      >
        <option value="CAPEX">CAPEX</option>
        <option value="OPEX">OPEX</option>
        <option value="Transport Fee">Transport Fee</option>
      </select>

      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onAddExpense(expense)}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
