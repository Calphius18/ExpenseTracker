import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { API_ENDPOINTS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/DeleteAlert";

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  //Fetching ALL Expense Details
  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.EXPENSE.GET_ALL_EXPENSE}`
      );

      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.error("Something Went Wrong, Please Try Again", error);
    } finally {
      setLoading(false);
    }
  };

  // Add Expense
  const addExpense = async (expense) => {
    const { source, name, amount, category, date, icon } = expense;

    // Validation
    if (!source.trim()) {
      toast.error("Source is required");
      return;
    }
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!category.trim()) {
      toast.error("Category is required");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is required.");
      return;
    }

    try {
      await axiosInstance.post(API_ENDPOINTS.EXPENSE.ADD_EXPENSE, {
        source,
        category,
        amount,
        date,
        name,
        icon,
      });

      setOpenAddExpenseModal(false);
      toast.success("Expense Added Successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error Adding Expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_ENDPOINTS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({ show : false, data: null});
      toast.success("Expense Deleted Successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error Deleting Expense:", error.response.data?.message || error.message);
    }
  }

  // Download Expenses
  const downloadExpenseDetails = async ()=> {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.EXPENSE.DOWNLOAD_EXCEL_EXPENSE, {
          responseType: "blob"
        }
      );

      // Create the URL for the Binary Large Object(blob)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      
      link.href = url;
      link.setAttribute("download","expense_details.xlsx");

      document.body.appendChild(link);
      
      link.click();
      link.parentNode.removeChild(link);
      
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error downloading expense details", error);
      toast.error("Failed to download expense details. Please try again")
    }
  }

  useEffect(() => {
    fetchExpenseDetails();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Expenses">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <ExpenseOverview
              transactions={expenseData}
              onAddExpense={() => {
                setOpenAddExpenseModal(true);
              }}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show : true, data: id});
            }}
            onDownload={downloadExpenseDetails}
          />

        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={addExpense} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({show:false, data: null})
        }
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>


      </div>
    </DashboardLayout>
  );
};

export default Expense;
