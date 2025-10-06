import React, { useRef, useContext } from "react";
import { Download, Upload } from "lucide-react";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";
import { UserContext } from "../../context/UserContext";
import toast from "react-hot-toast";

const ExpenseList = ({ transactions, onDelete, onDownload, onUpload }) => {
  const fileInputRef = useRef(null);
  const { hasRole } = useContext(UserContext);

  // ✅ Role Checks
  const isViewer = !hasRole(["user", "admin"]);
  const isAdmin = hasRole(["admin"]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      onUpload(e.target.files[0]);
      e.target.value = ""; // reset input
    }
  };

  const handleDelete = (id) => {
    if (!isAdmin) {
      toast.error("Only admins can delete expenses.");
      return;
    }
    onDelete(id);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expense Details</h5>

        {/* Upload/Download controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-3 w-auto sm:w-auto mt-3 sm:mt-0">
          {/* Hidden file input */}
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            disabled={isViewer} // viewers can't upload
          />

          {/* Upload button */}
          <button
            className={`card-btn w-full sm:w-auto flex items-center justify-center ${
              isViewer ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => {
              if (isViewer) {
                toast.error("You do not have permission to upload files.");
                return;
              }
              fileInputRef.current.click();
            }}
          >
            <Upload className="text-base" /> Upload
          </button>

          {/* Download button (open to all) */}
          <button
            className="card-btn w-full sm:w-auto flex items-center justify-center"
            onClick={onDownload}
          >
            <Download className="text-base" /> Download
          </button>
        </div>
      </div>

      {/* Expense cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
        {transactions?.map((expense) => (
          <TransactionInfoCard
            key={expense._id}
            title={`${expense.category} -> ${expense.name}`}
            icon={expense.icon}
            date={moment(expense.date).format("Do MMM YYYY")}
            amount={expense.amount}
            type="expense"
            onDelete={() => handleDelete(expense._id)}
            disableDelete={!isAdmin} // pass prop to hide delete icon
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
