import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Budget from "./pages/Dashboard/Budget";
import Expense from "./pages/Dashboard/Expense";
import ExpenseReport from "./pages/Dashboard/ExpenseReport";
import AdminPage from "./pages/AdminPage";
import { UserContext } from "./context/UserContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { user, loadingUser } = useContext(UserContext);

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading user info...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/expense" element={<Expense />} />
        <Route path="/report" element={<ExpenseReport />} />

        {/* ✅ Admin Protected Route */}
        <Route
          path="/admin"
          element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/" replace />}
        />
      </Routes>

      <Toaster
        toastOptions={{
          className: "",
          style: { fontSize: "13px" },
        }}
      />
    </Router>
  );
};

export default App;

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};
