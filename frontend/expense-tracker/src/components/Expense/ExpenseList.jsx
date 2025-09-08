import React, { useRef } from "react";
import { Download, Upload } from "lucide-react";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";

const ExpenseList = ({ transactions, onDelete, onDownload, onUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      onUpload(e.target.files[0]); // pass selected file up
      e.target.value = ""; // reset so same file can be re-uploaded
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expense Details</h5>

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-3 w-auto sm:w-auto mt-3 sm:mt-0">
  {/* Hidden file input */}
  <input
    type="file"
    accept=".xlsx,.xls,.csv"
    ref={fileInputRef}
    className="hidden"
    onChange={handleFileChange}
  />

  {/* Upload button triggers file input */}
  <button
    className="card-btn w-full sm:w-auto flex items-center justify-center"
    onClick={() => fileInputRef.current.click()}
  >
    <Upload className="text-base" /> Upload
  </button>

  {/* Download button */}
  <button className="card-btn w-full sm:w-auto flex items-center justify-center" onClick={onDownload}>
    <Download className="text-base" /> Download
  </button>
</div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
        {transactions?.map((expense) => (
          <TransactionInfoCard
            key={expense._id}
            title={expense.category + " -> " + expense.name}
            icon={expense.icon}
            date={moment(expense.date).format("Do MMM YYYY")}
            amount={expense.amount}
            type="expense"
            onDelete={() => onDelete(expense._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
