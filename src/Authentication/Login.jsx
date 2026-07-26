import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail, Lock, Eye, EyeOff,
  ArrowRight, Check, AlertCircle,
} from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;600&display=swap');
        * { font-family: 'Inter', sans-serif; }
        h1, h2, h3, .logo-text { font-family: 'Space Grotesk', sans-serif; }
        .glass-effect { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.6); }
        .input-focus:focus { border-color: #64748b; box-shadow: 0 0 0 2px rgba(100, 116, 139, 0.08); }
        .gradient-text { background: linear-gradient(135deg, #475569 0%, #64748b 50%, #94a3b8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      `}</style>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
        <div className="hidden lg:block space-y-6 sm:space-y-8">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-11 h-11 bg-gradient-to-br from-slate-700 via-gray-700 to-slate-800 rounded-lg flex items-center justify-center shadow-md">
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none"><circle cx="10" cy="8" r="2.5" fill="white"/><rect x="8.5" y="12" width="3" height="12" rx="1.5" fill="white"/><circle cx="20" cy="11" r="1.8" fill="white" opacity="0.9"/><rect x="18.6" y="15" width="2.8" height="9" rx="1.4" fill="white" opacity="0.9"/></svg>
            </div>
            <div>
              <span className="text-xl font-semibold logo-text text-slate-800">Inside Invoice</span>
              <div className="text-[8px] text-slate-500 font-medium tracking-widest">BY 2X+1</div>
            </div>
          </Link>

          <div className="space-y-3">
            <h1 className="text-3xl font-semibold text-slate-900 leading-tight">
              Simplify Your <span className="gradient-text">GST Billing</span>
            </h1>
            <p className="text-base text-slate-600 leading-relaxed font-normal">
              Join hundreds of Indian businesses managing their invoices, inventory, and GST compliance effortlessly.
            </p>
          </div>

          <div className="space-y-2.5">
            {[
              "Generate GST-compliant invoices in seconds",
              "Track payments and inventory in real-time",
              "Automated GST calculations and filing",
              "Secure cloud storage with 99.9% uptime",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-slate-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
                <span className="text-slate-600 font-normal text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4">
            {[{ val: "100%", label: "Web-Based" }, { val: "24/7", label: "Support" }, { val: "Secure", label: "Cloud" }].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-semibold gradient-text">{s.val}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="glass-effect rounded-xl shadow-lg p-5 sm:p-6 md:p-8 border border-white/60">
            <Link to="/" className="lg:hidden flex items-center justify-center mb-4 sm:mb-5 hover:opacity-80 transition-opacity">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-gradient-to-br from-slate-700 via-gray-700 to-slate-800 rounded-lg flex items-center justify-center shadow-md">
                  <svg width="22" height="22" viewBox="0 0 32 32" fill="none"><circle cx="10" cy="8" r="2.5" fill="white"/><rect x="8.5" y="12" width="3" height="12" rx="1.5" fill="white"/><circle cx="20" cy="11" r="1.8" fill="white" opacity="0.9"/><rect x="18.6" y="15" width="2.8" height="9" rx="1.4" fill="white" opacity="0.9"/></svg>
                </div>
                <div>
                  <span className="text-base font-semibold logo-text text-slate-800">Inside Invoice</span>
                  <div className="text-[7px] text-slate-500 font-medium tracking-widest">BY 2X+1</div>
                </div>
              </div>
            </Link>

            <div className="text-center mb-5 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1">
                {isForgotMode ? "Reset Password" : "Welcome Back"}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm font-normal">
                {isForgotMode ? "We'll send you a reset link" : "Login to access your dashboard"}
              </p>
            </div>

            {apiError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-xs sm:text-sm">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {apiError}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs sm:text-sm">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-[11px] font-medium text-slate-600 mb-1.5">Email or Username</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-3.5 sm:h-3.5" />
                      <input type="text" name="email" value={formData.email} onChange={handleInputChange}
                      className={`w-full pl-10 sm:pl-9 pr-3 py-3 sm:py-2 bg-white border rounded-lg focus:outline-none input-focus transition-all text-sm sm:text-sm ${errors.email ? "border-red-400" : "border-slate-200"}`} placeholder="Enter your email or username" />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs sm:text-[10px] mt-1 sm:mt-0.5 flex items-center gap-1"><AlertCircle className="w-3 h-3 sm:w-2.5 sm:h-2.5" />{errors.email}</p>}
                </div>

              {!isForgotMode && (
                <div>
                  <label className="block text-xs sm:text-[11px] font-medium text-slate-600 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange}
                      className={`w-full pl-10 sm:pl-9 pr-10 sm:pr-9 py-3 sm:py-2 bg-white border rounded-lg focus:outline-none input-focus transition-all text-sm sm:text-sm ${errors.password ? "border-red-400" : "border-slate-200"}`} placeholder="Enter your password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center">
                      {showPassword ? <EyeOff className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> : <Eye className="w-4 h-4 sm:w-3.5 sm:h-3.5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs sm:text-[10px] mt-1 sm:mt-0.5 flex items-center gap-1"><AlertCircle className="w-3 h-3 sm:w-2.5 sm:h-2.5" />{errors.password}</p>}
                </div>
              )}

              {!isForgotMode && (
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer min-h-[44px]">
                    <input type="checkbox" className="w-4 h-4 sm:w-3 sm:h-3 rounded border-slate-300 text-slate-700 focus:ring-slate-400" />
                    <span className="text-xs sm:text-[11px] text-slate-600 font-normal">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-xs sm:text-[11px] font-medium text-slate-700 hover:text-slate-900 transition-colors">Forgot Password?</Link>
                </div>
              )}

              {isForgotMode && (
                <p className="text-xs sm:text-[11px] text-slate-500 mt-1.5">We'll send you a link to reset your password</p>
              )}

              <button type="submit" disabled={isLoading}
                className="w-full bg-gradient-to-r from-slate-700 via-gray-700 to-slate-800 text-white font-medium py-3 sm:py-2.5 rounded-lg hover:shadow-md hover:shadow-slate-500/20 hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-sm mt-2 min-h-[48px] sm:min-h-[44px]">
                {isLoading ? (
                  <><div className="w-4 h-4 sm:w-3.5 sm:h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing...</>
                ) : (
                  <>{isForgotMode ? "Send Reset Link" : "Login"}<ArrowRight className="w-4 h-4 sm:w-3.5 sm:h-3.5" /></>
                )}
              </button>
            </form>

            {isForgotMode && (
              <div className="mt-5 text-center">
                <p className="text-slate-600 text-xs sm:text-sm font-normal">
                  Remember your password?{" "}
                  <Link to="/login" className="text-slate-700 font-medium hover:underline">Back to Login</Link>
                </p>
              </div>
            )}
          </div>

          <div className="text-center mt-4 sm:mt-5">
            <p className="text-slate-500 text-xs sm:text-[11px] font-normal">&copy; {year} Inside Invoice by 2X+1. All rights reserved.</p>
            <div className="flex justify-center gap-2.5 mt-1 text-xs sm:text-[10px]">
              <Link to="/privacy-policy" className="text-slate-500 hover:text-slate-700 font-normal">Privacy Policy</Link>
              <span className="text-slate-300">&bull;</span>
              <Link to="/terms-and-condition" className="text-slate-500 hover:text-slate-700 font-normal">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
