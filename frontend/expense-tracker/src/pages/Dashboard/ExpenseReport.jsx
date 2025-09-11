import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { API_ENDPOINTS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import Input from "../../components/Inputs/Input";

// Subcomponent for rendering expense
const ExpenseRow = ({ exp, mode }) => {
  if (mode === "table") {
    return (
      <tr className="text-center">
        <td className="p-2 border">{exp.name}</td>
        <td className="p-2 border">{exp.source}</td>
        <td className="p-2 border">{exp.category}</td>
        <td className="p-2 border">{exp.type}</td>
        <td className="p-2 border">₦{exp.amount}</td>
        <td className="p-2 border">{exp.percentagePaid}%</td>
        <td className="p-2 border">₦{exp.balanceAmount}</td>
        <td className="p-2 border">
          {new Date(exp.date).toLocaleDateString()}
        </td>
      </tr>
    );
  }

  // Card mode (mobile)
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <p>
        <span className="font-semibold">Name:</span> {exp.name}
      </p>
      <p>
        <span className="font-semibold">Source:</span> {exp.source}
      </p>
      <p>
        <span className="font-semibold">Category:</span> {exp.category}
      </p>
      <p>
        <span className="font-semibold">Type:</span> {exp.type}
      </p>
      <p>
        <span className="font-semibold">Amount:</span> ₦{exp.amount}
      </p>
      <p>
        <span className="font-semibold">Percentage Paid:</span>{" "}
        {exp.percentagePaid}%
      </p>
      <p>
        <span className="font-semibold">Balance Amount:</span>{" "}
        ₦{exp.balanceAmount}
      </p>
      <p>
        <span className="font-semibold">Date:</span>{" "}
        {new Date(exp.date).toLocaleDateString()}
      </p>
    </div>
  );
};

const ExpenseReport = () => {
  useUserAuth();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    name: "",
    source: "",
    type: "",
    dateFrom: "",
    dateTo: "",
    search: "",
  });

  // Fetch filtered data
  const fetchFilteredExpenses = async () => {
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
  };

  // Download filtered results
  const downloadExpensesReport = async () => {
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
      link.setAttribute("download", "filtered_expenses.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading filtered expenses:", error);
      toast.error("Download failed");
    }
  };

  useEffect(() => {
    fetchFilteredExpenses();
  }, []);

  return (
    <DashboardLayout activeMenu="Report">
      <div className="my-5 mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Expense Report</h2>

        <hr className="my-5 text-gray-500" />

        <p className="text-xl font-medium mb-4">Search With Filters</p>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Input
            type="text"
            placeholder="Search"
            label="Search Through All"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="border p-2 rounded"
          />
          <Input
            type="text"
            placeholder="Enter Name"
            label="Search By Name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            className="border p-2 rounded"
          />
          <Input
            type="text"
            placeholder="Enter Source"
            value={filters.source}
            label="Search By Source"
            onChange={(e) => setFilters({ ...filters, source: e.target.value })}
            className="border p-2 rounded"
          />
          {/* filters.type */}
          <div>
            <label className="block mb-5 text-sm font-medium text-slate-600">
              Expense Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full border rounded p-2 text-slate-600 bg-white"
            >
              <option value="">All</option>
              <option value="CAPEX">CAPEX</option>
              <option value="OPEX">OPEX</option>
              <option value="Transport Fee">Transport Fee</option>
            </select>
          </div>

          <Input
            type="date"
            value={filters.dateFrom}
            label="Search From"
            onChange={(e) =>
              setFilters({ ...filters, dateFrom: e.target.value })
            }
            className="border p-2 rounded"
          />
          <Input
            type="date"
            value={filters.dateTo}
            label="Search To"
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            className="border p-2 rounded"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={fetchFilteredExpenses}
            className="bg-primary hover:scale-105 text-white px-4 py-2 rounded cursor-pointer"
          >
            Apply Filters
          </button>
          <button
            onClick={downloadExpensesReport}
            className="bg-green-600 hover:scale-105 text-white px-4 py-2 rounded cursor-pointer"
          >
            Download Results
          </button>
        </div>

        <hr className="text-gray-500" />

        {/* Expenses Table - Stacked on Mobile */}

        <h3 className="text-2xl text-black font-medium py-4">Results:</h3>

        <div className="overflow-x-auto">
          <table className="hidden sm:table w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Source</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Percentage Paid</th>
                <th className="p-2 border">Balance Amount</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : expenses.length > 0 ? (
                expenses.map((exp) => (
                  <ExpenseRow key={exp._id} exp={exp} mode="table" />
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-4">
                    No expenses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-4">
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : expenses.length > 0 ? (
              expenses.map((exp) => (
                <ExpenseRow key={exp._id} exp={exp} mode="card" />
              ))
            ) : (
              <p className="text-center">No expenses found</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExpenseReport;
