import React, { useContext } from "react";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";
import { UserContext } from "../../context/UserContext";
import toast from "react-hot-toast";
import { ReceiptText } from "lucide-react";

const ExpenseList = ({ transactions, onDelete }) => {
  const { hasRole } = useContext(UserContext);
  const isAdmin = hasRole(["admin"]);

  const handleDelete = (id) => {
    if (!isAdmin) {
      toast.error("Only admins can delete expenses.");
      return;
    }
    onDelete(id);
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center p-20 text-slate-400">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <ReceiptText className="text-slate-300 w-8 h-8" />
        </div>
        <p className="text-sm font-medium">No expenses found</p>
        <p className="text-xs mt-1">Try adjusting your filters or add a new expense.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="mb-6">
        <h5 className="text-xl font-bold text-slate-800">Expense Details</h5>
        <p className="text-sm text-slate-500">View and manage your transaction history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {transactions?.map((expense) => (
          <TransactionInfoCard
            key={expense._id}
            title={`${expense.category} -> ${expense.name}`}
            icon={expense.icon}
            date={moment(expense.date).format("Do MMM YYYY")}
            amount={expense.amount}
            type="expense"
            onDelete={() => handleDelete(expense._id)}
            disableDelete={!isAdmin}
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
