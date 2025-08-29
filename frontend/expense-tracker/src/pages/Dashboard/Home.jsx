import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_ENDPOINTS } from "../../utils/apiPaths";
import { CreditCard, Wallet, HandCoins } from "lucide-react";
import { addThousandsSeparator } from "../../utils/helper";
import InfoCard from "../../components/Cards/InfoCard";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import RecentBudgetWithChart from "../../components/Dashboard/RecentBudgetWithChart";
import Last30DaysExpenses from "../../components/Dashboard/Last30DaysExpenses";
import RecentBudget from "../../components/Dashboard/RecentBudget";

const Home = () => {
  useUserAuth();

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
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
  };

  useEffect(() => {
    fetchDashboardData();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<CreditCard />}
            label="Total Balance"
            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
            color="bg-primary"
          />

          <InfoCard
            icon={<Wallet />}
            label="Total Budget"
            value={addThousandsSeparator(dashboardData?.totalBudget || 0)}
            color="bg-green-500"
          />

          <InfoCard
            icon={<HandCoins />}
            label="Total Expense"
            value={addThousandsSeparator(dashboardData?.totalExpenses || 0)}
            color="bg-red-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
          />

          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalBudget={dashboardData?.totalBudget || 0}
            totalExpense={dashboardData?.totalExpenses || 0}
          />

          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpenses?.transactions || []}
            onSeeMore={() => navigate("/expense")}
          />

          <Last30DaysExpenses
            data={dashboardData?.last30DaysExpenses?.transactions || []}
          />
          
          <RecentBudget
            transactions={dashboardData?.last60DaysBudget?.transactions || []}
            onSeeMore={() => navigate("/budget")}
          />

          <RecentBudgetWithChart
            data={
              dashboardData?.last60DaysBudget?.transactions?.slice(0, 4) || []
            }
            totalBudget={dashboardData?.totalBudget || 0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
