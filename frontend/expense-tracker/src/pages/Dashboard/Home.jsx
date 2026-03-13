import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_ENDPOINTS } from "../../utils/apiPaths";
import { CreditCard, HandCoins } from "lucide-react";
import { addThousandsSeparator } from "../../utils/helper";
import InfoCard from "../../components/Cards/InfoCard";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import Last30DaysExpenses from "../../components/Dashboard/Last30DaysExpenses";

const Home = () => {
  useUserAuth();

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.DASHBOARD.GET_DASHBOARD_DATA}`
      );

      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Unable to get Dashboard Data, Try Again", error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-8 mx-auto animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InfoCard
            icon={<HandCoins />}
            label="Total Expense"
            value={addThousandsSeparator(dashboardData?.totalExpenses || 0)}
            color="bg-red-500"
          />

          <InfoCard
            icon={<CreditCard />}
            label="Last 30 Days Spend"
            value={addThousandsSeparator(dashboardData?.last30DaysExpenses?.total || 0)}
            color="bg-accent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <FinanceOverview
            transactions={dashboardData?.last30DaysExpenses?.transactions || []}
            totalExpense={dashboardData?.totalExpenses || 0}
          />

          <Last30DaysExpenses
            data={dashboardData?.last30DaysExpenses?.transactions || []}
          />

          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
          />

          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpenses?.transactions || []}
            onSeeMore={() => navigate("/expense")}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
