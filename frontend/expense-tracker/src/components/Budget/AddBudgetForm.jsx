import React, { useState } from 'react'
import Input from '../Inputs/Input';

const AddBudgetForm = ({ onAddBudget}) => {
    const [budget, setBudget] = useState({
        source: "",
        category: "",
        amount: "",
        date: "",
        icon: "",
    });

    const handleChange = (key, value) => setBudget({ ...budget, [key]: value});
  return (
    <div>

        <Input
        value={budget.source}
        onChange={({ target }) => handleChange("source", target.value)}
        label="Budget Source"
        placeholder="Head Office (Dept), Branch"
        type="text"
        />

        <Input
        value={budget.category}
        onChange={({ target }) => handleChange("category", target.value)}
        label="Budget Category / Description"
        placeholder="Repair, Subscription, Licensing, etc"
        type="text"
        />

        <Input
        value={budget.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Budget Amount"
        placeholder=""
        type="number"
        />

        <Input
        value={budget.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
        />

        <div className="flex justify-end mt-6">
          <button type='button'
          className='add-btn add-btn-fill'
          onClick={() => onAddBudget(budget)}
          >
            Add Budget
          </button>
        </div>

    </div>
  )
}

export default AddBudgetForm