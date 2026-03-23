import React, { useState, useContext } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_ENDPOINTS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";
import uploadImage from "../../utils/uploadImage";
import StepIndicator from "../../components/Inputs/StepIndicator";
import PasswordStrengthIndicator from "../../components/Inputs/PasswordStrengthIndicator";
import { ArrowRight, ArrowLeft } from "lucide-react";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState("right");

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const TOTAL_STEPS = 2;
  const STEP_LABELS = ["Profile", "Credentials"];

  // Navigate to next step
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!fullName.trim()) {
        setError("Please enter your name");
        return;
      }
      setError(null);
      setSlideDirection("right");
      setCurrentStep(2);
    }
  };

  // Navigate to previous step
  const handlePrevStep = () => {
    setError(null);
    setSlideDirection("left");
    setCurrentStep(1);
  };

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data) {
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
          <header className="mb-6">
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Create Account
            </h3>
            <p className="text-slate-500 mt-2 text-sm font-medium leading-relaxed">
              {currentStep === 1
                ? "Let's start with your profile details."
                : "Almost there! Set up your login credentials."}
            </p>
          </header>

          {/* Step Indicator */}
          <StepIndicator
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            labels={STEP_LABELS}
          />

          <form onSubmit={handleSignUp} className="mt-10">
            {/* Step 1: Profile Info */}
            {currentStep === 1 && (
              <div
                key="step-1"
                className={
                  slideDirection === "right"
                    ? "animate-slide-in-right"
                    : "animate-slide-in-left"
                }
              >
                <div className="flex justify-center mb-6">
                  <ProfilePhotoSelector
                    image={profilePic}
                    setImage={setProfilePic}
                  />
                </div>

                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  label="Full Name"
                  placeholder="Blake Specter"
                  type="text"
                  floating
                />

                {error && (
                  <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl mb-2 animate-shake">
                    <p className="text-rose-600 text-[12px] font-medium leading-tight">
                      {error}
                    </p>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn-primary h-12 flex items-center justify-center gap-2 group relative overflow-hidden rounded-xl"
                  >
                    <span className="relative z-10 font-bold uppercase tracking-wider text-[12px]">
                      Continue
                    </span>
                    <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Credentials */}
            {currentStep === 2 && (
              <div
                key="step-2"
                className={
                  slideDirection === "right"
                    ? "animate-slide-in-right"
                    : "animate-slide-in-left"
                }
              >
                <div className="space-y-1">
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email Address"
                    placeholder="blake@example.com"
                    type="email"
                    floating
                  />

                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    placeholder="Min. 6 characters"
                    type="password"
                    floating
                  />

                  <PasswordStrengthIndicator password={password} />
                </div>

                {error && (
                  <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl mb-2 animate-shake">
                    <p className="text-rose-600 text-[12px] font-medium leading-tight">
                      {error}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex items-center justify-center gap-2 h-12 px-5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-[12px] uppercase tracking-wider hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn-primary h-12 flex-1 flex items-center justify-center gap-2 group relative overflow-hidden rounded-xl ${loading ? "opacity-80 cursor-not-allowed" : ""
                      }`}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <span className="relative z-10 font-bold uppercase tracking-wider text-[12px]">
                        Create Account
                      </span>
                    )}
                    <div
                      className={`absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${loading ? "hidden" : ""
                        }`}
                    ></div>
                  </button>
                </div>
              </div>
            )}

            <footer className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center">
              <p className="text-[13px] text-slate-500 font-medium">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-bold hover:underline underline-offset-4 ml-1"
                >
                  Login
                </Link>
              </p>
            </footer>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
