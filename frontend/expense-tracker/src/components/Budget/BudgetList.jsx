import React from 'react'
import { Download } from 'lucide-react';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import moment from "moment"

const BudgetList = ({ transactions, onDelete, onDownload}) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Budget Category / Source</h5>

        <button className="card-btn" onClick={onDownload}>
        <Download className='text-base' /> Download
        </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {transactions?.map((budget) => (
            <TransactionInfoCard
              key={budget._id}
              title={budget.category + " -> " + budget.source}
              icon={budget.icon}
              date={moment(budget.date).format("Do MMM YYYY")}
              amount={budget.amount}
              type="budget"
              onDelete = {() => onDelete(budget._id)}
            />
          ))}
        </div>

    </div>
  )
}

export default BudgetList