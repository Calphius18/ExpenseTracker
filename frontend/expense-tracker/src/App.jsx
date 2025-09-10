import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Budget from "./pages/Dashboard/Budget";
import Expense from "./pages/Dashboard/Expense";
import UserProvider from "./context/UserContext";
import {Toaster} from "react-hot-toast"
import ExpenseReport from "./pages/Dashboard/ExpenseReport";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/signUp" exact element={<SignUp />} />
            <Route path="/dashboard" exact element={<Home />} />
            <Route path="/budget" exact element={<Budget />} />
            <Route path="/expense" exact element={<Expense />} />
            <Route path="/report" exact element={<ExpenseReport />} />
          </Routes>
        </Router>
      </div>
      <Toaster
        toastOptions={{
          className:"",
          style: {
            fontSize: "13px"
          },
        }}
      />
    </UserProvider>
  );
};

export default App;

const Root = () => {
  // Check if the user is authenticated

  const isAuthenticated = !!localStorage.getItem("token");

  // Redirect to dashboard if authenticated, otherwise to login

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};
