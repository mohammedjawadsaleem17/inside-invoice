import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api/auth";
import { ArrowLeft, User, AtSign, Lock, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Profile() {
  const { user, token, setUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [nameMsg, setNameMsg] = useState({ type: "", text: "" });
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });
  const [savingName, setSavingName] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) return;
    setSavingName(true);
    setNameMsg({ type: "", text: "" });
    try {
      const res = await authAPI.updateProfile({ name: name.trim(), username: username.trim() });
      const updated = { ...user, name: name.trim(), username: username.trim() };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setNameMsg({ type: "success", text: res.data.message || "Profile updated" });
    } catch (err) {
      setNameMsg({ type: "error", text: err.response?.data?.message || "Failed to update profile" });
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    if (newPassword.length < 4) {
      setPwMsg({ type: "error", text: "Password must be at least 4 characters" });
      return;
    }
    setSavingPw(true);
    setPwMsg({ type: "", text: "" });
    try {
      const res = await authAPI.changePassword({ currentPassword, newPassword });
      setPwMsg({ type: "success", text: res.data.message || "Password changed" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPwMsg({ type: "error", text: err.response?.data?.message || "Failed to change password" });
    } finally {
      setSavingPw(false);
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
            <span className="font-semibold text-slate-800">My Profile</span>
          </div>
          <button onClick={logout} className="text-sm text-slate-500 hover:text-slate-700">Logout</button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <User className="w-5 h-5 text-slate-600" />
            <h2 className="text-base font-semibold text-slate-900">Profile</h2>
          </div>

          {nameMsg.text && (
            <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
              nameMsg.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              {nameMsg.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {nameMsg.text}
            </div>
          )}

          <form onSubmit={handleUpdateName} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Username</label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>
            <button type="submit" disabled={savingName || !name.trim() || !username.trim()}
              className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors">
              {savingName ? "Saving..." : "Save"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Lock className="w-5 h-5 text-slate-600" />
            <h2 className="text-base font-semibold text-slate-900">Password</h2>
          </div>

          {pwMsg.text && (
            <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
              pwMsg.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              {pwMsg.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {pwMsg.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400"
              />
            </div>
            <button type="submit" disabled={savingPw || !currentPassword || !newPassword}
              className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors">
              {savingPw ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;600&display=swap');
        * { font-family: 'Inter', sans-serif; }
        h2 { font-family: 'Space Grotesk', sans-serif; }
      `}</style>
    </div>
  );
}
