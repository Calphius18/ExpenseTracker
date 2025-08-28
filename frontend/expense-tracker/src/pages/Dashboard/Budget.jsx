import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import BudgetOverview from "../../components/Budget/BudgetOverview";
import axiosInstance from "../../utils/axiosInstance";
import { API_ENDPOINTS } from "../../utils/apiPaths";

const Budget = () => {

  const [budgetData, setBudgetData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show:false,
    data: null
  });

  const [openAddBudgetModal, setOpenAddBudgetModal] = useState(false);

  //Fetching ALL Budget Details
  const fetchBudgetDetails = async () => {
    if (loading) return

    setLoading(true);

    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.BUDGET.GET_ALL_BUDGET}`);

      if (response.data) {
        setBudgetData(response.data)
      }    
    }
    catch (error) {
      console.error("Something Went Wrong, Please Try Again", error)
    } finally {
      setLoading(false)
    }
  };

  // Add Budget
  const addBudget = async (budget) => {
    
  }

  // Delete Budget
  const deleteBudget = async (id) => {

  }

  // Download Budget
  const downloadBudgetDetails = async () => {

  }


  useEffect(() => {
    fetchBudgetDetails();
  
    return () => {
      
    }
  }, [])
  
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Budget;
