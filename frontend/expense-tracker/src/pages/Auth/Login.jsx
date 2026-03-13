import React, { useState, useContext } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_ENDPOINTS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError("");
    setLoading(true);

    // API for Login
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <header className="mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h3>
          <p className="text-slate-500 mt-1.5 text-sm font-medium leading-relaxed">
            Please enter your credentials to login to your account.
          </p>
        </header>

        <form onSubmit={handleLogin} className="space-y-1.5">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
            placeholder="blake@example.com"
            type="email"
            required
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="********"
            type="password"
            required
          />

          {error && (
            <div className="bg-rose-50 border border-rose-100 p-2.5 rounded-lg mb-3 animate-shake">
              <p className="text-rose-600 text-[12px] font-medium leading-tight">{error}</p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary h-11 flex items-center justify-center gap-2 group relative overflow-hidden ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="relative z-10 font-bold uppercase tracking-wider text-[11px]">Login to Account</span>
              )}
              <div className={`absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${loading ? 'hidden' : ''}`}></div>
            </button>
          </div>

          <footer className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center">
            <p className="text-[12px] text-slate-500 font-medium">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-bold hover:underline underline-offset-4 ml-1">
                Create Account
              </Link>
            </p>
          </footer>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;

