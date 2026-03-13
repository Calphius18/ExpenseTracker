import axios from "axios";
import { BASE_URL } from "./apiPaths";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                // Clear token and redirect
                localStorage.removeItem("token");
                window.location.href = "/login";
            } else if (error.response.status === 500) {
                toast.error("Internal Server Error. Please try again later.");
            } else if (error.response.data?.message) {
                // Let the hook or component handle specific error toasts if needed,
                // but log it here for debugging.
                console.error("API Error:", error.response.data.message);
            }
        } else if (error.code === "ECONNABORTED") {
            toast.error("Request timed out. Please try again later.");
        } else {
            toast.error("Network Error. Please check your connection.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;