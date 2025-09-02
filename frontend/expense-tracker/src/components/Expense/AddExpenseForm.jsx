import React, { useState } from "react";
import Input from "../Inputs/Input";

const AddExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    source: "",
    category: "",
    amount: "",
    date: "",
    icon: "",
    name: "",
  });

  const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

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
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
        />

        <div className="flex justify-end mt-6">
          <button type='button'
          className='add-btn add-btn-fill'
          onClick={() => onAddExpense(expense)}
          >
            Add Expense
          </button>
        </div>

    </div>
  )
};

export default AddExpenseForm;
