import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_ENDPOINTS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const updateUser = (userData) => setUser(userData);
  const clearUser = () => setUser(null);

  const hasRole = (roles = []) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoadingUser(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.AUTH.GET_USER_INFO);
        if (res.data) setUser(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch user:", err);
        clearUser();
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser, hasRole, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
