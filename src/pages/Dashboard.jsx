import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../api/auth";
import { LogOut, FileText, Users, Package, Building2, PlusCircle, List, Menu, X, UserPlus, Shield, BarChart3, LayoutDashboard, TrendingUp, UserCheck, Eye, EyeOff } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { user, logout, isBusinessSetupComplete, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [users, setUsers] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  useEffect(() => {
    if (!isBusinessSetupComplete && !isAdmin) {
      navigate("/business-setup");
    }
  }, [isBusinessSetupComplete, navigate, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      setLoadingStats(true);
      adminAPI.getStats()
        .then((res) => setStats(res.data.data))
        .catch((err) => console.error("Stats fetch failed:", err.response?.status, err.message))
        .finally(() => setLoadingStats(false));
      adminAPI.getAllUsers()
        .then((res) => setUsers(res.data.data || []))
        .catch((err) => console.error("Users fetch failed:", err.response?.status, err.message));
    }
  }, [isAdmin]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const adminMenuItems = [
    { label: "Add User", icon: UserPlus, action: () => navigate("/admin/users"), color: "text-indigo-600" },
    { label: "All Users", icon: Users, action: () => navigate("/admin/users-list"), color: "text-slate-600" },
  ];

  const chartData = stats ? [
    { name: "Users", value: stats.totalUsers },
    { name: "Businesses", value: stats.totalBusinesses },
    { name: "Invoices", value: stats.totalInvoices },
    { name: "Customers", value: stats.totalCustomers },
    { name: "Products", value: stats.totalProducts },
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors lg:hidden">
              {isSidebarOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-800">Inside Invoice</span>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <span className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-medium">
                <Shield className="w-3 h-3" /> Admin
              </span>
            )}
            <button onClick={() => navigate("/profile")} className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-800 transition-colors">
              @{user?.username || user?.name}
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </nav>

      {isSidebarOpen && isAdmin && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div className="absolute left-0 top-16 bottom-0 w-64 bg-white shadow-xl p-4" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-1">
              {adminMenuItems.map((item) => (
                <button key={item.label} onClick={() => { item.action(); setIsSidebarOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex max-w-7xl mx-auto">
        {isAdmin && (
          <aside className="hidden lg:block w-56 border-r border-slate-200 min-h-[calc(100vh-64px)] bg-white/50 p-4">
            {adminMenuItems.map((item) => (
              <button key={item.label} onClick={item.action}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
              </button>
            ))}
          </aside>
        )}

        <main className="flex-1 px-6 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">Welcome, {user?.name}</h1>
            <p className="text-slate-500 text-sm mt-1">
              {isAdmin ? "Overview of the entire platform" : "Manage your invoices, customers, and products"}
            </p>
          </div>

          {isAdmin && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {[
                  { label: "Users", icon: Users, count: stats?.totalUsers, color: "from-indigo-500 to-indigo-600" },
                  { label: "Businesses", icon: Building2, count: stats?.totalBusinesses, color: "from-amber-500 to-amber-600" },
                  { label: "Invoices", icon: FileText, count: stats?.totalInvoices, color: "from-blue-500 to-blue-600" },
                  { label: "Customers", icon: UserCheck, count: stats?.totalCustomers, color: "from-emerald-500 to-emerald-600" },
                  { label: "Products", icon: Package, count: stats?.totalProducts, color: "from-purple-500 to-purple-600" },
                  { label: "Active Users", icon: Users, count: users.length || 0, color: "from-teal-500 to-teal-600" },
                ].map((card) => (
                  <div key={card.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                      <card.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-semibold text-slate-900">
                      {loadingStats ? <span className="animate-pulse">...</span> : (card.count ?? 0)}
                    </div>
                    <div className="text-sm text-slate-500">{card.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-slate-600" />
                    <h2 className="text-base font-semibold text-slate-900">Platform Overview</h2>
                  </div>
                  {chartData.length > 0 && (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                          <Tooltip
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                            labelStyle={{ fontWeight: 600, color: '#1e293b' }}
                          />
                          <Bar dataKey="value" fill="#64748b" radius={[4, 4, 0, 0]} maxBarSize={50} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-slate-600" />
                    <h2 className="text-base font-semibold text-slate-900">Active Users</h2>
                    <span className="text-xs text-slate-400 ml-1">({users.length} total)</span>
                  </div>
                  {users.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-2 px-3 text-[10px] font-medium text-slate-500 uppercase">Name</th>
                            <th className="text-left py-2 px-3 text-[10px] font-medium text-slate-500 uppercase">Email</th>
                            <th className="text-left py-2 px-3 text-[10px] font-medium text-slate-500 uppercase">Role</th>
                            <th className="text-left py-2 px-3 text-[10px] font-medium text-slate-500 uppercase">Password</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((u) => (
                            <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                              <td className="py-2 px-3 text-xs text-slate-800 font-medium">{u.name}</td>
                              <td className="py-2 px-3 text-xs text-slate-600">{u.email}</td>
                              <td className="py-2 px-3">
                                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${u.role === "ADMIN" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="py-2 px-3">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-mono text-slate-600 truncate max-w-[120px]">
                                    {visiblePasswords[u.id] ? (u.rawPassword || u.password) : "••••••••"}
                                  </span>
                                  <button onClick={() => setVisiblePasswords((prev) => ({ ...prev, [u.id]: !prev[u.id] }))}
                                    className="p-1 hover:bg-slate-200 rounded transition-colors shrink-0">
                                    {visiblePasswords[u.id] ? <EyeOff className="w-3 h-3 text-slate-500" /> : <Eye className="w-3 h-3 text-slate-400" />}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">No users found</p>
                  )}
                </div>
              </div>
            </>
          )}

          {!isAdmin && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Invoices", icon: FileText, count: "0", color: "from-blue-500 to-blue-600" },
                  { label: "Customers", icon: Users, count: "0", color: "from-emerald-500 to-emerald-600" },
                  { label: "Products", icon: Package, count: "0", color: "from-purple-500 to-purple-600" },
                  { label: "Business", icon: Building2, count: "", color: "from-amber-500 to-amber-600" },
                ].map((card) => (
                  <div key={card.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                      <card.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-semibold text-slate-900">{card.count}</div>
                    <div className="text-sm text-slate-500">{card.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "New Invoice", icon: PlusCircle, action: () => {}, color: "text-slate-700" },
                    { label: "View Invoices", icon: List, action: () => {}, color: "text-slate-700" },
                    { label: "Add Customer", icon: Users, action: () => {}, color: "text-slate-700" },
                    { label: "Add Product", icon: Package, action: () => {}, color: "text-slate-700" },
                  ].map((action) => (
                    <button key={action.label} onClick={action.action}
                      className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
                      <action.icon className={`w-5 h-5 ${action.color}`} />
                      <span className="text-sm font-medium text-slate-700">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;600&display=swap');
        * { font-family: 'Inter', sans-serif; }
        h1, h2 { font-family: 'Space Grotesk', sans-serif; }
      `}</style>
    </div>
  );
}
