import React, { useState, useContext } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_ENDPOINTS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";
import { LogIn } from "lucide-react";

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
        <div className="glass-card border border-slate-200/50 rounded-3xl p-8 md:p-10 shadow-2xl shadow-slate-200/50 animate-fade-in-up">
          {/* Welcome icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-orange-100 rounded-2xl flex items-center justify-center animate-scale-in">
              <LogIn className="w-7 h-7 text-primary" />
            </div>
          </div>

          <header className="mb-8 text-center">
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back
            </h3>
            <p className="text-slate-500 mt-2 text-sm font-medium leading-relaxed">
              Please enter your credentials to login to your account.
            </p>
          </header>

          <form onSubmit={handleLogin} className="space-y-1">
            <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email Address"
                placeholder="blake@example.com"
                type="email"
                floating
              />
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                placeholder="Enter your password"
                type="password"
                floating
              />
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl mb-2 animate-shake">
                <p className="text-rose-600 text-[13px] font-medium leading-tight">
                  {error}
                </p>
              </div>
            )}

            <div
              className="pt-4 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <button
                type="submit"
                disabled={loading}
                className={`btn-primary h-12 flex items-center justify-center gap-2 group relative overflow-hidden rounded-xl ${loading ? "opacity-80 cursor-not-allowed" : ""
                  }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="relative z-10 font-bold uppercase tracking-wider text-[12px]">
                      Login to Account
                    </span>
                    <LogIn className="relative z-10 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </>
                )}
                <div
                  className={`absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${loading ? "hidden" : ""
                    }`}
                ></div>
              </button>
            </div>

            <footer className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <p className="text-[13px] text-slate-500 font-medium">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary font-bold hover:underline underline-offset-4 ml-1"
                >
                  Create Account
                </Link>
              </p>
            </footer>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
