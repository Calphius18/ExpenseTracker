import React from "react";
import { Plus, Download, Upload } from "lucide-react";

const ExpenseHeader = ({ totalCount, totalAmount, onAddExpense, onDownload, onUpload, isViewer, fileInputRef }) => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 animate-fade-in-up">
            <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold text-slate-800">Expenses</h1>
                <p className="text-slate-500 mt-1">
                    Manage and track all your spending in one place.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:items-center gap-4">
                {/* Stats Summary Tooltip-like Mini Cards */}
                <div className="flex items-center justify-center gap-4 bg-white/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/50 shadow-sm grow sm:grow-0">
                    <div className="text-center px-2">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Count</p>
                        <p className="text-sm font-bold text-slate-700">{totalCount}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <div className="text-center px-2">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Amount</p>
                        <p className="text-sm font-bold text-primary">₦{totalAmount.toLocaleString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:flex items-center gap-3 w-full sm:w-auto">
                    {/* Hidden file input */}
                    <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={onUpload}
                        disabled={isViewer}
                    />

                    <button
                        className={`card-btn flex justify-center ${isViewer ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={onUpload ? () => !isViewer && fileInputRef.current.click() : undefined}
                    >
                        <Upload className="w-4 h-4" /> <span className="hidden xs:inline">Upload</span>
                    </button>

                    <button
                        className="card-btn flex justify-center"
                        onClick={onDownload}
                    >
                        <Download className="w-4 h-4" /> <span className="hidden xs:inline">Download</span>
                    </button>

                    <button
                        className={`add-btn add-btn-fill col-span-2 sm:col-auto flex justify-center py-2.5 shadow-lg shadow-primary/20 hover:scale-105 transition-transform ${isViewer ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={onAddExpense}
                    >
                        <Plus className="w-4 h-4" /> Add Expense
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpenseHeader;
