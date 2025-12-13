import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Building2,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  AlertCircle,
} from "lucide-react";

export default function AuthPage() {
  const location = useLocation();
  const year = new Date().getFullYear();

  // Set initial mode based on URL path
  const getInitialMode = () => {
    if (location.pathname === "/signup") return "signup";
    if (location.pathname === "/forgot-password") return "forgot";
    return "login"; // default to login for /login or any other path
  };

  const [mode, setMode] = useState(getInitialMode());
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    businessName: "",
    phone: "",
    gstin: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});

  // Update mode when URL changes
  useEffect(() => {
    setMode(getInitialMode());
  }, [location.pathname]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (mode === "login" || mode === "forgot") {
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }

      if (mode === "login" && !formData.password) {
        newErrors.password = "Password is required";
      }
    }

    if (mode === "signup") {
      if (!formData.fullName) newErrors.fullName = "Full name is required";
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      if (!formData.businessName)
        newErrors.businessName = "Business name is required";
      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = "Phone number must be 10 digits";
      }
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "You must agree to the terms and conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log("Form submitted:", formData);
      // Here you would make your actual API call
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 flex items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;600&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        h1, h2, h3, .logo-text {
          font-family: 'Space Grotesk', sans-serif;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.6);
        }

        .input-focus:focus {
          border-color: #64748b;
          box-shadow: 0 0 0 2px rgba(100, 116, 139, 0.08);
        }

        .gradient-text {
          background: linear-gradient(135deg, #475569 0%, #64748b 50%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:block space-y-8">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-11 h-11 bg-gradient-to-br from-slate-700 via-gray-700 to-slate-800 rounded-lg flex items-center justify-center shadow-md">
              <svg
                width="26"
                height="26"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="10" cy="8" r="2.5" fill="white" />
                <rect
                  x="8.5"
                  y="12"
                  width="3"
                  height="12"
                  rx="1.5"
                  fill="white"
                />
                <circle cx="20" cy="11" r="1.8" fill="white" opacity="0.9" />
                <rect
                  x="18.6"
                  y="15"
                  width="2.8"
                  height="9"
                  rx="1.4"
                  fill="white"
                  opacity="0.9"
                />
              </svg>
            </div>
            <div>
              <span className="text-xl font-semibold logo-text text-slate-800">
                Inside Invoice
              </span>
              <div className="text-[8px] text-slate-500 font-medium tracking-widest">
                BY 2X+1
              </div>
            </div>
          </Link>

          {/* Hero Text */}
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold text-slate-900 leading-tight">
              Simplify Your <span className="gradient-text">GST Billing</span>
            </h1>
            <p className="text-base text-slate-600 leading-relaxed font-normal">
              Join hundreds of Indian businesses managing their invoices,
              inventory, and GST compliance effortlessly.
            </p>
          </div>

          {/* Features */}
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
                <span className="text-slate-600 font-normal text-sm">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="text-center">
              <div className="text-xl font-semibold gradient-text">100%</div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                Web-Based
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold gradient-text">Free</div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                Forever Plan
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold gradient-text">24/7</div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                Support
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full">
          <div className="glass-effect rounded-xl shadow-lg p-6 lg:p-8 border border-white/60">
            {/* Mobile Logo */}
            <Link
              to="/"
              className="lg:hidden flex items-center justify-center mb-5 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-gradient-to-br from-slate-700 via-gray-700 to-slate-800 rounded-lg flex items-center justify-center shadow-md">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="10" cy="8" r="2.5" fill="white" />
                    <rect
                      x="8.5"
                      y="12"
                      width="3"
                      height="12"
                      rx="1.5"
                      fill="white"
                    />
                    <circle
                      cx="20"
                      cy="11"
                      r="1.8"
                      fill="white"
                      opacity="0.9"
                    />
                    <rect
                      x="18.6"
                      y="15"
                      width="2.8"
                      height="9"
                      rx="1.4"
                      fill="white"
                      opacity="0.9"
                    />
                  </svg>
                </div>
                <div>
                  <span className="text-base font-semibold logo-text text-slate-800">
                    Inside Invoice
                  </span>
                  <div className="text-[7px] text-slate-500 font-medium tracking-widest">
                    BY 2X+1
                  </div>
                </div>
              </div>
            </Link>

            {/* Header */}
            <div className="text-center mb-5">
              <h2 className="text-xl font-semibold text-slate-900 mb-1">
                {mode === "login" && "Welcome Back"}
                {mode === "signup" && "Create Your Account"}
                {mode === "forgot" && "Reset Password"}
              </h2>
              <p className="text-slate-500 text-xs font-normal">
                {mode === "login" && "Login to access your dashboard"}
                {mode === "signup" && "Start your free account today"}
                {mode === "forgot" && "We'll send you a reset link"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Login Form */}
              {mode === "login" && (
                <>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-9 pr-2.5 py-2 bg-white border rounded-lg focus:outline-none input-focus transition-all text-sm ${
                          errors.email ? "border-red-400" : "border-slate-200"
                        }`}
                        placeholder="you@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-[10px] mt-0.5 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-9 pr-9 py-2 bg-white border rounded-lg focus:outline-none input-focus transition-all text-sm ${
                          errors.password
                            ? "border-red-400"
                            : "border-slate-200"
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-[10px] mt-0.5 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-3 h-3 rounded border-slate-300 text-slate-700 focus:ring-slate-400"
                      />
                      <span className="text-[11px] text-slate-600 font-normal">
                        Remember me
                      </span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-[11px] font-medium text-slate-700 hover:text-slate-900 transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </>
              )}

              {/* Signup Form */}
              {mode === "signup" && (
                <>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`w-full pl-9 pr-2.5 py-2 bg-white border rounded-lg focus:outline-none input-focus transition-all text-sm ${
                            errors.fullName
                              ? "border-red-400"
                              : "border-slate-200"
                          }`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-red-500 text-[10px] mt-0.5 flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" />
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-9 pr-2.5 py-2 bg-white border rounded-lg focus:outline-none input-focus transition-all text-sm ${
                            errors.phone ? "border-red-400" : "border-slate-200"
                          }`}
                          placeholder="9876543210"
                          maxLength="10"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-[10px] mt-0.5 flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-9 pr-2.5 py-2 bg-white border rounded-lg focus:outline-none input-focus transition-all text-sm ${
                          errors.email ? "border-red-400" : "border-slate-200"
                        }`}
                        placeholder="you@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-[10px] mt-0.5 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Business Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className={`w-full pl-9 pr-2.5 py-2 bg-white border rounded-lg focus:outline-none input-focus transition-all text-sm ${
                          errors.businessName
                            ? "border-red-400"
                            : "border-slate-200"
                        }`}
                        placeholder="Your Business Name"
                      />
                    </div>
                    {errors.businessName && (
                      <p className="text-red-500 text-[10px] mt-0.5 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        {errors.businessName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      GSTIN <span className="text-slate-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleInputChange}
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none input-focus transition-all text-sm uppercase"
                      placeholder="22AAAAA0000A1Z5"
                      maxLength="15"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full pl-9 pr-9 py-2 bg-white border rounded-lg focus:outline-none input-focus transition-all text-sm ${
                            errors.password
                              ? "border-red-400"
                              : "border-slate-200"
                          }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-[10px] mt-0.5 flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" />
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full pl-9 pr-9 py-2 bg-white border rounded-lg focus:outline-none input-focus transition-all text-sm ${
                            errors.confirmPassword
                              ? "border-red-400"
                              : "border-slate-200"
                          }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-[10px] mt-0.5 flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" />
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-start gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className={`mt-0.5 w-3 h-3 rounded border-slate-300 text-slate-700 focus:ring-slate-400 ${
                          errors.agreeToTerms ? "border-red-400" : ""
                        }`}
                      />
                      <span className="text-[11px] text-slate-600 font-normal">
                        I agree to the{" "}
                        <Link
                          to="/terms-and-condition"
                          className="text-slate-700 font-medium hover:underline"
                        >
                          Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacy-policy"
                          className="text-slate-700 font-medium hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    {errors.agreeToTerms && (
                      <p className="text-red-500 text-[10px] mt-0.5 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        {errors.agreeToTerms}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Forgot Password Form */}
              {mode === "forgot" && (
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-9 pr-2.5 py-2 bg-white border rounded-lg focus:outline-none input-focus transition-all text-sm ${
                        errors.email ? "border-red-400" : "border-slate-200"
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-[10px] mt-0.5 flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5" />
                      {errors.email}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    We'll send you a link to reset your password
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-slate-700 via-gray-700 to-slate-800 text-white font-medium py-2 rounded-lg hover:shadow-md hover:shadow-slate-500/20 hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm mt-4"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {mode === "login" && "Login"}
                    {mode === "signup" && "Create Account"}
                    {mode === "forgot" && "Send Reset Link"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-5 text-center">
              {mode === "login" && (
                <p className="text-slate-600 text-xs font-normal">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-slate-700 font-medium hover:underline"
                  >
                    Sign up for free
                  </Link>
                </p>
              )}
              {mode === "signup" && (
                <p className="text-slate-600 text-xs font-normal">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-slate-700 font-medium hover:underline"
                  >
                    Login
                  </Link>
                </p>
              )}
              {mode === "forgot" && (
                <p className="text-slate-600 text-xs font-normal">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="text-slate-700 font-medium hover:underline"
                  >
                    Back to Login
                  </Link>
                </p>
              )}
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-5">
            <p className="text-slate-500 text-[11px] font-normal">
              © {year} Inside Invoice by 2X+1. All rights reserved.
            </p>
            <div className="flex justify-center gap-2.5 mt-1 text-[10px]">
              <Link
                to="/privacy-policy"
                className="text-slate-500 hover:text-slate-700 font-normal"
              >
                Privacy Policy
              </Link>
              <span className="text-slate-300">•</span>
              <Link
                to="/terms-and-condition"
                className="text-slate-500 hover:text-slate-700 font-normal"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
