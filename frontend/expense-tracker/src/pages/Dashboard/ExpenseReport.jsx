import React, { useEffect, useState, useCallback, useMemo } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { API_ENDPOINTS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import ReportFilters from "../../components/Report/ReportFilters";
import ExpenseReportTable from "../../components/Report/ExpenseReportTable";
import { FileDown, FileText } from "lucide-react";

const ExpenseReport = () => {
  useUserAuth();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialFilters = useMemo(() => ({
    type: "",
    dateFrom: "",
    dateTo: "",
    search: "",
  }), []);

  const [filters, setFilters] = useState(initialFilters);

  const fetchFilteredExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.EXPENSE.GET_FILTERED_EXPENSE}?${params.toString()}`
      );

      setExpenses(response.data.expenses || []);
    } catch (error) {
      console.error("Error fetching filtered expenses:", error);
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const downloadExpensesReport = async () => {
    const toastId = toast.loading("Preparing your report...");
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.EXPENSE.DOWNLOAD_EXPENSE_REPORT}?${params.toString()}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Expense_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Report downloaded successfully", { id: toastId });
    } catch (error) {
      console.error("Error downloading filtered expenses:", error);
      toast.error("Download failed", { id: toastId });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  useEffect(() => {
    fetchFilteredExpenses();
  }, [fetchFilteredExpenses]);

  return (
    <DashboardLayout activeMenu="Report">
      <div className="my-8 mx-auto max-w-7xl px-4 md:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Expense Report</h1>
            <p className="text-slate-500 mt-1">
              Generate detailed insights and export your transaction data.
            </p>
          </div>

          <button
            onClick={downloadExpensesReport}
            disabled={expenses.length === 0}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl cursor-pointer text-sm font-bold text-white transition-all shadow-lg active:scale-95 ${expenses.length === 0
              ? "bg-slate-300"
              : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 hover:scale-105"
              }`}
          >
            <FileDown className="w-5 h-5" />
            <span>Export to Excel</span>
          </button>
        </div>

        {/* Filters Section */}
        <ReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
        />

        {/* Results Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-slate-800">
              Report Results
              <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full font-medium">
                {expenses.length} records
              </span>
            </h3>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <ExpenseReportTable data={expenses} loading={loading} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExpenseReport;
