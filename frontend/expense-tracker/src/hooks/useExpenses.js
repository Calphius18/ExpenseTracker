import { useState, useEffect, useCallback, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_ENDPOINTS } from "../utils/apiPaths";
import { UserContext } from "../context/UserContext";
import toast from "react-hot-toast";

/**
 * Custom hook for managing expense state and operations.
 */
export const useExpenses = () => {
    const { hasRole } = useContext(UserContext);
    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchExpenses = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.EXPENSE.GET_ALL_EXPENSE);
            if (response.data) {
                setExpenseData(response.data);
            }
        } catch (error) {
            console.error("Error fetching expenses:", error);
            toast.error("Failed to load expenses.");
        } finally {
            setLoading(false);
        }
    }, []);

    const addExpense = async (expense) => {
        if (!hasRole(["user", "admin"])) {
            toast.error("You are not allowed to add expenses.");
            return false;
        }

        const { source, name, amount, category, date, type, percentagePaid } = expense;

        // Simple validation
        if (!source?.trim() || !name?.trim() || !category?.trim() || !amount || !percentagePaid || !date || !type) {
            toast.error("Please fill in all required fields.");
            return false;
        }

        try {
            await axiosInstance.post(API_ENDPOINTS.EXPENSE.ADD_EXPENSE, expense);
            toast.success("Expense Added Successfully");
            await fetchExpenses();
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Error adding expense");
            return false;
        }
    };

    const deleteExpense = async (id) => {
        if (!hasRole(["admin"])) {
            toast.error("Only admins can delete expenses.");
            return false;
        }

        try {
            await axiosInstance.delete(API_ENDPOINTS.EXPENSE.DELETE_EXPENSE(id));
            toast.success("Expense Deleted Successfully");
            await fetchExpenses();
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting expense");
            return false;
        }
    };

    const downloadExpenses = async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.EXPENSE.DOWNLOAD_EXCEL_EXPENSE, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "expense_details.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.error("Failed to download expenses.");
        }
    };

    const uploadExpenses = async (file) => {
        if (!hasRole(["user", "admin"])) {
            toast.error("You cannot upload expenses.");
            return false;
        }

        if (!file) {
            toast.error("Please select a file to upload");
            return false;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axiosInstance.post(API_ENDPOINTS.EXPENSE.UPLOAD_EXCEL_EXPENSE, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success(response.data?.message || "Upload successful");
            await fetchExpenses();
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to upload file");
            return false;
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    return {
        expenseData,
        loading,
        fetchExpenses,
        addExpense,
        deleteExpense,
        downloadExpenses,
        uploadExpenses,
    };
};
