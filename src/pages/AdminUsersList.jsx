import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminAPI } from "../api/auth";
import { ArrowLeft, Users, Eye, EyeOff, Shield, AlertCircle, Trash2, ToggleLeft, ToggleRight, KeyRound } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";

export default function AdminUsersList() {
  const { user: currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [actionMsg, setActionMsg] = useState({ type: "", text: "" });
  const [modal, setModal] = useState({ open: false, type: "", user: null });
  const [passwordModal, setPasswordModal] = useState({ open: false, user: null, password: "" });

  const fetchUsers = () => {
    adminAPI.getAllUsers()
      .then((res) => setUsers(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleRole = async (u) => {
    setModal({ open: true, type: "role", user: u });
  };

  const handleDelete = async (u) => {
    setModal({ open: true, type: "delete", user: u });
  };

  const confirmAction = async () => {
    const u = modal.user;
    if (modal.type === "role") {
      const newRole = u.role === "ADMIN" ? "USER" : "ADMIN";
      try {
        await adminAPI.updateRole(u.id, newRole);
        setActionMsg({ type: "success", text: `${u.name} is now ${newRole}` });
        fetchUsers();
      } catch (err) {
        setActionMsg({ type: "error", text: err.response?.data?.message || "Failed to update role" });
      }
    } else if (modal.type === "delete") {
      try {
        await adminAPI.deleteUser(u.id);
        setActionMsg({ type: "success", text: `User "${u.name}" deleted` });
        fetchUsers();
      } catch (err) {
        setActionMsg({ type: "error", text: err.response?.data?.message || "Failed to delete user" });
      }
    }
    setModal({ open: false, type: "", user: null });
  };

  const handlePasswordChange = async () => {
    const u = passwordModal.user;
    const pw = passwordModal.password;
    if (!pw || pw.length < 4) {
      setActionMsg({ type: "error", text: "Password must be at least 4 characters" });
      return;
    }
    try {
      await adminAPI.updatePassword(u.id, { password: pw });
      setActionMsg({ type: "success", text: `Password updated for ${u.name}` });
      setPasswordModal({ open: false, user: null, password: "" });
      fetchUsers();
    } catch (err) {
      setActionMsg({ type: "error", text: err.response?.data?.message || "Failed to update password" });
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-800">All Users</span>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <span className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-medium">
                <Shield className="w-3 h-3" /> Admin
              </span>
            )}
            <button onClick={logout} className="text-sm text-slate-500 hover:text-slate-700">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">User Management</h1>
              <p className="text-sm text-slate-500 mt-1">{users.length} total user{users.length !== 1 ? "s" : ""} on the platform</p>
            </div>
          </div>

          {actionMsg.text && (
            <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
              actionMsg.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{actionMsg.text}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-sm text-slate-400">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-400">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">#</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Name</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Username</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Email</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Role</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Password</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => (
                    <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-xs text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 text-sm text-slate-800 font-medium">{u.name}</td>
                      <td className="py-3 px-4 text-sm text-slate-500 font-mono">{u.username || '-'}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${u.role === "ADMIN" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-slate-600">
                            {visiblePasswords[u.id] ? (u.rawPassword || u.password) : "••••••••••••••••"}
                          </span>
                          <button onClick={() => setVisiblePasswords((prev) => ({ ...prev, [u.id]: !prev[u.id] }))}
                            className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
                            {visiblePasswords[u.id] ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-slate-400" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {u.email !== currentUser?.email && (
                            <>
                              <button onClick={() => handleToggleRole(u)}
                                className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
                                title={u.role === "ADMIN" ? "Revoke admin access" : "Grant admin access"}>
                                {u.role === "ADMIN" ? <ToggleRight className="w-3.5 h-3.5 text-amber-500" /> : <ToggleLeft className="w-3.5 h-3.5 text-slate-400" />}
                                {u.role === "ADMIN" ? "Revoke" : "Promote"}
                              </button>
                              <button onClick={() => setPasswordModal({ open: true, user: u, password: "" })}
                                className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
                                title="Change password">
                                <KeyRound className="w-3.5 h-3.5" /> Password
                              </button>
                              <button onClick={() => handleDelete(u)}
                                className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:bg-red-50 transition-colors text-red-500"
                                title="Delete user">
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </>
                          )}
                          {u.email === currentUser?.email && (
                            <span className="text-xs text-slate-400 italic">You</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={modal.open}
        title={modal.type === "delete" ? "Delete User" : "Change Role"}
        message={
          modal.type === "delete"
            ? `Delete "${modal.user?.name}" (${modal.user?.email})? This will also delete all their invoices, customers, and products.`
            : `Change ${modal.user?.name}'s role from ${modal.user?.role} to ${modal.user?.role === "ADMIN" ? "USER" : "ADMIN"}?`
        }
        confirmLabel={modal.type === "delete" ? "Delete" : "Confirm"}
        confirmVariant={modal.type === "delete" ? "danger" : "primary"}
        onConfirm={confirmAction}
        onCancel={() => setModal({ open: false, type: "", user: null })}
      />

      {passwordModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setPasswordModal({ open: false, user: null, password: "" })}></div>
          <div className="relative bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Change Password</h3>
            <p className="text-sm text-slate-500 mb-4">Set a new password for <strong>{passwordModal.user?.name}</strong></p>
            <input
              type="text"
              value={passwordModal.password}
              onChange={(e) => setPasswordModal({ ...passwordModal, password: e.target.value })}
              placeholder="Enter new password"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setPasswordModal({ open: false, user: null, password: "" })}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={handlePasswordChange}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
                Save Password
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;600&display=swap');
        * { font-family: 'Inter', sans-serif; }
        h1 { font-family: 'Space Grotesk', sans-serif; }
      `}</style>
    </div>
  );
}
