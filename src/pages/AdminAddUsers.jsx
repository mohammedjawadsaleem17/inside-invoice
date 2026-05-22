import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api/auth";
import { UserPlus, ArrowLeft, AlertCircle, Check, Mail, Lock, User, Building2, Shield } from "lucide-react";

export default function AdminAddUsers() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    businessName: "",
    role: "USER",
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-slate-900">Access Denied</h2>
          <p className="text-sm text-slate-500 mt-1">Only administrators can access this page.</p>
          <button onClick={() => navigate("/dashboard")} className="mt-4 text-sm text-slate-700 underline">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccess("");
    if (!formData.name || !formData.email || !formData.password) {
      setApiError("Name, email, and password are required");
      return;
    }
    setIsLoading(true);
    try {
      const res = await authAPI.signup({
        name: formData.name,
        username: formData.username || undefined,
        email: formData.email,
        password: formData.password,
        businessName: formData.businessName || undefined,
        role: formData.role,
      });
      setSuccess(`User created successfully: ${formData.email}`);
      setFormData({ name: "", username: "", email: "", password: "", businessName: "", role: "USER" });
    } catch (err) {
      const msg = err.response?.data?.message
        || (err.response?.data?.fieldErrors ? Object.values(err.response.data.fieldErrors).join(", ") : null)
        || "Failed to create user";
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-800">Add New User</span>
          </div>
          <button onClick={logout} className="text-sm text-slate-500 hover:text-slate-700">Logout</button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="mb-6">
            <h1 className="text-lg font-semibold text-slate-900">Create User Account</h1>
            <p className="text-sm text-slate-500 mt-1">The user will be able to login with these credentials and set up their business.</p>
          </div>

          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{apiError}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
              <Check className="w-4 h-4 flex-shrink-0" />{success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="text" name="username" value={formData.username} onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" placeholder="Defaults to email if empty" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="password" name="password" value={formData.password} onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 z-10" />
                  <select name="role" value={formData.role} onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400 bg-white appearance-none">
                    <option value="USER">Client</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Business Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="text" name="businessName" value={formData.businessName} onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full bg-gradient-to-r from-slate-700 to-slate-800 text-white font-medium py-2.5 rounded-lg hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50">
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Creating...</>
              ) : (
                <><UserPlus className="w-4 h-4" /> Create User</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
