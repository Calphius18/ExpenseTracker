export const BASE_URL = "https://expensetrackerbackend-y964.onrender.com";

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN : "/api/v1/auth/login",
        REGISTER : "/api/v1/auth/register",
        GET_USER_INFO : "/api/v1/auth/getUser",
    },

    DASHBOARD: {
        GET_DASHBOARD_DATA : "/api/v1/dashboard",
    },
    BUDGET: {
        ADD_BUDGET : "/api/v1/budget/add",
        GET_ALL_BUDGET : "/api/v1/budget/get",
        DELETE_BUDGET : (budgetId) => `/api/v1/budget/${budgetId}`,
        DOWNLOAD_EXCEL_BUDGET : "/api/v1/budget/downloadExcel"
    },
    EXPENSE: {
        ADD_EXPENSE : "/api/v1/expense/add",
        GET_ALL_EXPENSE : "/api/v1/expense/get",
        DELETE_EXPENSE : (expenseId) => `/api/v1/expense/${expenseId}`,
        DOWNLOAD_EXCEL_EXPENSE : "/api/v1/expense/downloadExcel"
    },
    IMAGE : {
        UPLOAD_IMAGE : "/api/v1/auth/upload-image",
    },
};
