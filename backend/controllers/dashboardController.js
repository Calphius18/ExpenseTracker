const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");

// Dashboard Data
exports.getDashboardData = async (req, res) => {
    try {
      const userId = req.user.id;
      const userObjectId = new Types.ObjectId(String(userId));

      // Get Total Budget and Expenses
      const totalBudget = await Budget.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      console.log("TotalBudget", {
        totalBudget,
        userId: isValidObjectId(userId),
      });

      const totalExpenses = await Expense.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      // Calculate the date 60 days ago
      const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Find all budget transactions for this user in the last 60 days
      const last60DaysBudgetTransactions = await Budget.find({
        userId: userId,
        date: { $gte: sixtyDaysAgo },
      }).sort({ date: -1 }); // newest first

      // Find all expense transactions for this user in the last 30 days
      const last30DaysExpenseTransactions = await Expense.find({
        userId: userId,
        date: { $gte: thirtyDaysAgo },
      }).sort({ date: -1 }); // newest first

      // Get Total Budget of last 60 days
      const budgetLast60Days = last60DaysBudgetTransactions.reduce(
        (sum, transaction) => sum + transaction.amount, 0
      );

      // Get Total Expenses of last 30 days
      const expensesLast30Days = last30DaysExpenseTransactions.reduce(
        (sum, transaction) => sum + transaction.amount, 0
      );

      // Get Last 5 transaction (budget + expense)
      const lastTransactions = [
        ...(await Budget.find({ userId }).sort({ date: -1 }).limit(5)).map((txn) => ({
          ...txn.toObject(),
          type: "budget",
        })),
        ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map((txn) => ({
          ...txn.toObject(),
          type: "expense",
        })),
      ].sort((a, b) => b.date - a.date); // Sort by Latest first

      res.json({
        totalBalance: 
            (totalBudget[0]?.total || 0) - (totalExpenses[0]?.total || 0),

        totalBudget: totalBudget[0]?.total || 0,
        totalExpenses: totalExpenses[0]?.total || 0,

        last30DaysExpenseTransactions: {
            total: expensesLast30Days,
            transactions: last30DaysExpenseTransactions,
        },
        last60DaysBudget: {
            total: budgetLast60Days,
            transactions: last60DaysBudgetTransactions,
        },

        recentTransactions: lastTransactions,

      });

    } catch (error) {
       res.status(500).json({ message: "Error fetching dashboard data", error: error.message });
    }
  };
