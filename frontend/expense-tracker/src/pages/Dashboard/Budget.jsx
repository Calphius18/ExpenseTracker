import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import BudgetOverview from "../../components/Budget/BudgetOverview";
import axiosInstance from "../../utils/axiosInstance";
import { API_ENDPOINTS } from "../../utils/apiPaths";
import Modal from "../../components/Modal";
import AddBudgetForm from "../../components/Budget/AddBudgetForm";;
import toast from "react-hot-toast";
import BudgetList from "../../components/Budget/BudgetList";
import DeleteAlert from "../../components/DeleteAlert";
import { useUserAuth } from "../../hooks/useUserAuth";

const Budget = () => {

  useUserAuth();

  const [budgetData, setBudgetData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const [openAddBudgetModal, setOpenAddBudgetModal] = useState(false);

  //Fetching ALL Budget Details
  const fetchBudgetDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.BUDGET.GET_ALL_BUDGET}`
      );

      if (response.data) {
        setBudgetData(response.data);
      }
    } catch (error) {
      console.error("Something Went Wrong, Please Try Again", error);
    } finally {
      setLoading(false);
    }
  };

  // Add Budget
  const addBudget = async (budget) => {
    const { source, amount, name, category, date, icon } = budget;

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
      await axiosInstance.post(API_ENDPOINTS.BUDGET.ADD_BUDGET, {
        source,
        category,
        amount,
        date,
        name,
        icon,
      });

      setOpenAddBudgetModal(false);
      toast.success("Budget Added Successfully");
      fetchBudgetDetails();
    } catch (error) {
      console.error(
        "Error Adding Budget:",
        error.response?.data?.message || error.message
      );
    }
  };

  // Delete Budget
  const deleteBudget = async (id) => {
    try {
      await axiosInstance.delete(API_ENDPOINTS.BUDGET.DELETE_BUDGET(id));

      setOpenDeleteAlert({ show : false, data: null});
      toast.success("Budget Deleted Successfully");
      fetchBudgetDetails();
    } catch (error) {
      console.error("Error Deleting Budget:", error.response.data?.message || error.message);
    }
  };

  // Download Budget
  const downloadBudgetDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.BUDGET.DOWNLOAD_EXCEL_BUDGET, {
          responseType: "blob"
        }
      );

      // Create the URL for the Binary Large Object(blob)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      
      link.href = url;
      link.setAttribute("download","budget_details.xlsx");

      document.body.appendChild(link);
      
      link.click();
      link.parentNode.removeChild(link);
      
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error downloading budget details", error);
      toast.error("Failed to download budget details. Please try again")
    }
  };

  useEffect(() => {
    fetchBudgetDetails();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Budget">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <BudgetOverview
              transactions={budgetData}
              onAddBudget={() => {
                setOpenAddBudgetModal(true);
              }}
            />
          </div>

          <BudgetList
          transactions={budgetData}
          onDelete={(id) => {
            setOpenDeleteAlert({show: true, data: id});
          }}
          onDownload={downloadBudgetDetails}
          />

        </div>

        <Modal
          isOpen={openAddBudgetModal}
          onClose={() => setOpenAddBudgetModal(false)}
          title="Add Budget"
        >
          <AddBudgetForm onAddBudget={addBudget} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({show:false, data: null})
        }
          title="Delete Budget"
        >
          <DeleteAlert
            content="Are you sure you want to delete this budget"
            onDelete={() => deleteBudget(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Budget;
