import ExpenseHeader from "../../components/Expense/ExpenseHeader";
import ExpenseFilters from "../../components/Expense/ExpenseFilters";
import React, { useState, useContext, useRef, useMemo } from "react";
import { UserContext } from "../../context/UserContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useExpenses } from "../../hooks/useExpenses";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import ExpenseTable from "../../components/Expense/ExpenseTable";
import DeleteAlert from "../../components/DeleteAlert";
import moment from "moment";

const Expense = () => {
  useUserAuth();
  const { hasRole } = useContext(UserContext);
  const fileInputRef = useRef(null);

  const {
    expenseData,
    addExpense,
    deleteExpense,
    downloadExpenses,
    uploadExpenses,
  } = useExpenses();

  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  const handleAddExpense = async (expense) => {
    const success = await addExpense(expense);
    if (success) setOpenAddExpenseModal(false);
  };

  const handleDeleteExpense = async () => {
    const success = await deleteExpense(openDeleteAlert.data);
    if (success) setOpenDeleteAlert({ show: false, data: null });
  };

  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      uploadExpenses(e.target.files[0]);
      e.target.value = "";
    }
  };

  const filteredExpenses = useMemo(() => {
    return expenseData?.filter(exp => {
      const matchesSearch =
        exp.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = category === "" || exp.type === category;

      const expenseDate = moment(exp.date);
      const matchesDate =
        (!dateRange.start || expenseDate.isSameOrAfter(moment(dateRange.start), 'day')) &&
        (!dateRange.end || expenseDate.isSameOrBefore(moment(dateRange.end), 'day'));

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [expenseData, searchQuery, category, dateRange]);

  const totalAmount = filteredExpenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setDateRange({ start: "", end: "" });
  };

  return (
    <DashboardLayout activeMenu="Expenses">
      <div className="my-8 mx-auto max-w-7xl px-4 md:px-8">
        <ExpenseHeader
          totalCount={filteredExpenses?.length || 0}
          totalAmount={totalAmount}
          onAddExpense={() => {
            if (!hasRole(["user", "admin"])) {
              return toast.error("You are not allowed to add expenses.");
            }
            setOpenAddExpenseModal(true);
          }}
          onDownload={downloadExpenses}
          onUpload={handleFileUpload}
          fileInputRef={fileInputRef}
          isViewer={!hasRole(["user", "admin"])}
        />

        <ExpenseFilters
          search={searchQuery}
          onSearchChange={setSearchQuery}
          category={category}
          onCategoryChange={setCategory}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onClearFilters={handleClearFilters}
        />

        <div className="grid grid-cols-1 gap-8">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <ExpenseOverview transactions={filteredExpenses} />
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <ExpenseTable
              data={filteredExpenses}
              onDelete={(id) => {
                if (!hasRole(["admin"])) {
                  return toast.error("Only admins can delete expenses.");
                }
                setOpenDeleteAlert({ show: true, data: id });
              }}
              isAdmin={hasRole(["admin"])}
            />
          </div>
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense"
            onDelete={handleDeleteExpense}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
