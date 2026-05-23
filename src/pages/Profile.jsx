import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppNavbar from "../components/AppNavbar";
import { authAPI, businessAPI } from "../api/auth";
import toast from "react-hot-toast";
import { ArrowLeft, User, Lock, Upload, Trash2, Pen, Eye, EyeOff } from "lucide-react";

export default function Profile() {
  const { user, token, setUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.username || user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [signature, setSignature] = useState(null);
  const [uploadingSig, setUploadingSig] = useState(false);
  const [ghostMode, setGhostMode] = useState(localStorage.getItem("ghost_mode") === "true");
  const fileInputRef = useRef(null);

  useEffect(() => {
    businessAPI.getProfile()
      .then((res) => setSignature(res.data.data?.signature || null))
      .catch(() => {});
  }, []);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setSavingName(true);
    try {
      const val = displayName.trim();
      const res = await authAPI.updateProfile({ name: val, username: val });
      const updated = { ...user, name: val, username: val };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      toast.success(res.data.message || "Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    if (newPassword.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }
    setSavingPw(true);
    try {
      const res = await authAPI.changePassword({ currentPassword, newPassword });
      toast.success(res.data.message || "Password changed");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setSavingPw(false);
    }
  };

  const handleSignatureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1_048_576) {
      toast.error("File size must not exceed 1MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    setUploadingSig(true);
    try {
      const res = await businessAPI.uploadSignature(file);
      setSignature(res.data.data);
      toast.success("Signature uploaded successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload signature");
    } finally {
      setUploadingSig(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveSignature = async () => {
    setUploadingSig(true);
    try {
      await businessAPI.removeSignature();
      setSignature(null);
      toast.success("Signature removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove signature");
    } finally {
      setUploadingSig(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <AppNavbar />
      <div className="px-6 py-6">
        <button onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-all mb-6">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <User className="w-5 h-5 text-slate-600" />
            <h2 className="text-base font-semibold text-slate-900">Profile</h2>
          </div>

          <form onSubmit={handleUpdateName} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400"
              />
            </div>
            <button type="submit" disabled={savingName || !displayName.trim()}
              className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors">
              {savingName ? "Saving..." : "Save"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-slate-600" />
              <h2 className="text-base font-semibold text-slate-900">Ghost Mode</h2>
            </div>
            <button onClick={() => {
              const next = !ghostMode;
              setGhostMode(next);
              localStorage.setItem("ghost_mode", String(next));
            }}
              className={`relative w-11 h-6 rounded-full transition-colors ${ghostMode ? "bg-amber-500" : "bg-slate-300"}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${ghostMode ? "translate-x-5" : ""}`} />
            </button>
          </div>
          <p className="text-xs text-slate-500">
            When enabled, you can manually set the invoice number when creating invoices.
            Use this only for corrections (e.g., fixing a mistakenly generated invoice).
            Auto-increment resumes when Ghost Mode is off.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Lock className="w-5 h-5 text-slate-600" />
            <h2 className="text-base font-semibold text-slate-900">Password</h2>
          </div>

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

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Pen className="w-5 h-5 text-slate-600" />
            <h2 className="text-base font-semibold text-slate-900">Signature</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">Upload your signature image to appear on invoices. Max 1MB.</p>

          {signature && (
            <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 inline-block">
              <img src={`data:image/png;base64,${signature}`} alt="Signature"
                className="h-12 object-contain" />
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleSignatureUpload}
              className="hidden"
              id="signature-upload"
            />
            <label htmlFor="signature-upload"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              {uploadingSig ? "Uploading..." : signature ? "Change" : "Upload Signature"}
            </label>
            {signature && (
              <button onClick={handleRemoveSignature} disabled={uploadingSig}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 className="w-4 h-4" /> Remove
              </button>
            )}
          </div>
        </div>
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
