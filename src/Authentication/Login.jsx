import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail, Lock, Eye, EyeOff,
  ArrowRight, Check, AlertCircle,
} from "lucide-react";
import InvoiceNav from "../Landing/Navigation/InvoiceNav";

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const year = new Date().getFullYear();

  const isForgotMode = location.pathname === "/forgot-password";

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setApiError("");
    setSuccessMessage("");
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email or username is required";
    if (!isForgotMode && !formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setApiError("");

    try {
      if (isForgotMode) {
        setSuccessMessage("If the email exists in our system, a reset link will be sent.");
      } else {
        const data = await login(formData.email, formData.password);
        navigate(data.businessSetupCompleted ? "/dashboard" : "/business-setup");
      }
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || "Something went wrong. Please try again.";
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen min-h-[100dvh] flex flex-col bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <InvoiceNav scrolled={true} setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />

      {/* Main content — centered vertically */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 pt-20">
        <div className="w-full max-w-sm">
          {/* Heading */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {isForgotMode ? "Reset password" : "Sign in"}
            </h1>
            <p className="text-sm text-slate-500 font-normal">
              {isForgotMode
                ? "Enter your email and we'll send you a reset link"
                : "Enter your credentials to access your account"}
            </p>
          </div>

          {/* Error / Success */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {apiError}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
              {successMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="username"
                  className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all text-base placeholder:text-slate-400 ${errors.email ? "border-red-400" : "border-slate-200"}`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{errors.email}
                </p>
              )}
            </div>

            {!isForgotMode && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    autoComplete="current-password"
                    className={`w-full pl-11 pr-12 py-3 bg-white border rounded-xl focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all text-base placeholder:text-slate-400 ${errors.password ? "border-red-400" : "border-slate-200"}`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{errors.password}
                  </p>
                )}
              </div>
            )}

            {!isForgotMode && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-700 focus:ring-slate-400" />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-slate-800 to-slate-700 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-slate-500/25 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-base min-h-[50px] mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  {isForgotMode ? "Send reset link" : "Sign in"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {isForgotMode && (
            <div className="mt-5 text-center">
              <p className="text-slate-500 text-sm">
                Remember your password?{" "}
                <Link to="/login" className="text-slate-800 font-semibold hover:underline">Sign in</Link>
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 sm:mt-10 text-center">
            <p className="text-slate-400 text-xs">&copy; {year} Inside Invoice by 2X+1</p>
            <div className="flex justify-center gap-3 mt-1 text-xs">
              <Link to="/privacy-policy" className="text-slate-400 hover:text-slate-600">Privacy</Link>
              <span className="text-slate-300">&bull;</span>
              <Link to="/terms-and-condition" className="text-slate-400 hover:text-slate-600">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
