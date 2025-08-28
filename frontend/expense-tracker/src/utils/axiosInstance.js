import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL : BASE_URL,
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
            // Redirect to login
            window.location.href = "/login";
            // Handle unauthorized access
        } else if (error.response.status === 500) {
            // Handle server errors
            console.error("Server Error. Please try again later.");
        }
       } else if (error.code === "ECONNABORTED") {
           console.error("Request timed out. Please try again later.");
       }
        return Promise.reject(error);
    }
);

export default axiosInstance;