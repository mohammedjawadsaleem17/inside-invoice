import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../api/auth";
import { LogOut, FileText, Users, Package, Building2, PlusCircle, List, UserPlus, Shield, BarChart3, UserCheck, Eye, EyeOff, UserCircle, Settings } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

import AppNavbar from "../components/AppNavbar";
export default function Dashboard() {
  const { user, logout, isBusinessSetupComplete, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [businesses, setBusinesses] = useState([]);

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
      adminAPI.getAllBusinesses()
        .then((res) => setBusinesses(res.data.data || []))
        .catch((err) => console.error("Businesses fetch failed:", err.response?.status, err.message));
      adminAPI.getAnalytics()
        .then((res) => setAnalytics(res.data.data))
        .catch((err) => console.error("Analytics fetch failed:", err.response?.status, err.message));
    }
  }, [isAdmin]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { label: "New Invoice", icon: PlusCircle, path: "/invoice", color: "from-blue-500 to-blue-600" },
    { label: "View Invoices", icon: List, path: "/invoices", color: "from-indigo-500 to-indigo-600" },
    { label: "Add Customer", icon: Users, path: "/customers/new", color: "from-emerald-500 to-emerald-600" },
    { label: "Add Product", icon: Package, path: "/products/new", color: "from-purple-500 to-purple-600" },
    { label: "Profile", icon: UserCircle, path: "/profile", color: "from-amber-500 to-amber-600" },
    ...(isAdmin ? [
      { label: "Add User", icon: UserPlus, path: "/admin/users", color: "from-rose-500 to-rose-600" },
      { label: "All Users", icon: UserCheck, path: "/admin/users-list", color: "from-teal-500 to-teal-600" },
    ] : []),
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
      <AppNavbar />

      <div className="flex px-6">
        <main className="flex-1 px-6 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">Welcome, {user?.name}</h1>
            <p className="text-slate-500 text-sm mt-1">
              {isAdmin ? "Overview of the entire platform" : "Manage your invoices, customers, and products"}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: "New Invoice", icon: PlusCircle, path: "/invoice", color: "from-blue-500 to-blue-600", desc: "Create invoice" },
              { label: "View Invoices", icon: List, path: "/invoices", color: "from-indigo-500 to-indigo-600", desc: "Browse all" },
              { label: "Add Customer", icon: Users, path: "/customers/new", color: "from-emerald-500 to-emerald-600", desc: "New customer" },
              { label: "Add Product", icon: Package, path: "/products/new", color: "from-purple-500 to-purple-600", desc: "New product" },
              { label: "Invoice Templates", icon: FileText, path: "/invoice-templates", color: "from-cyan-500 to-cyan-600", desc: "Choose layout" },
              { label: "Profile", icon: UserCircle, path: "/profile", color: "from-amber-500 to-amber-600", desc: "Manage account" },
            ].map((card) => (
              <div key={card.label} onClick={() => navigate(card.path)}
                className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 shadow-sm`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm font-semibold text-slate-800">{card.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{card.desc}</div>
              </div>
            ))}
          </div>

          {isAdmin && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {[
                  { label: "Users", icon: Users, count: stats?.totalUsers, color: "from-indigo-500 to-indigo-600", path: "/admin/users-list" },
                  { label: "Businesses", icon: Building2, count: stats?.totalBusinesses, color: "from-amber-500 to-amber-600", path: "/admin/businesses" },
                  { label: "Invoices", icon: FileText, count: stats?.totalInvoices, color: "from-blue-500 to-blue-600", path: "/admin/invoices" },
                  { label: "Customers", icon: UserCheck, count: stats?.totalCustomers, color: "from-emerald-500 to-emerald-600", path: "/admin/customers" },
                  { label: "Active Users", icon: Users, count: users.length || 0, color: "from-teal-500 to-teal-600", path: "/admin/users-list" },
                  { label: "Settings", icon: Settings, count: user?.role === "ADMIN" ? "Admin" : "Client", color: "from-purple-500 to-purple-600", path: "/profile" },
                ].map((card) => (
                  <div key={card.label}
                    onClick={() => card.path && navigate(card.path)}
                    className={`bg-white rounded-xl shadow-sm border border-slate-100 p-5 transition-shadow ${card.path ? "cursor-pointer hover:shadow-md" : "hover:shadow-sm"}`}>
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
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-base font-semibold text-slate-900">Platform Overview</h2>
                  </div>
                  {chartData.length > 0 && (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} labelStyle={{ fontWeight: 600, color: '#1e293b' }} cursor={{ fill: '#f8fafc' }} />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                            {chartData.map((entry, idx) => {
                              const colors = ['#6366f1', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];
                              return <Cell key={idx} fill={colors[idx % colors.length]} />;
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h2 className="text-base font-semibold text-slate-900">Invoice Status Breakdown</h2>
                    <span className="text-xs text-slate-400 ml-1">(monthly)</span>
                  </div>
                  {analytics?.invoicesByStatus?.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.invoicesByStatus} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} labelStyle={{ fontWeight: 600, color: '#1e293b' }} cursor={{ fill: '#f8fafc' }} />
                          <Bar dataKey="PAID" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="Paid" />
                          <Bar dataKey="PENDING" stackId="a" fill="#f59e0b" name="Pending" />
                          <Bar dataKey="DRAFT" stackId="a" fill="#94a3b8" name="Draft" />
                          <Bar dataKey="CANCELLED" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} name="Cancelled" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-12">No invoice data yet</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-base font-semibold text-slate-900">User Signups</h2>
                    <span className="text-xs text-slate-400 ml-1">(monthly)</span>
                  </div>
                  {analytics?.usersByMonth?.length > 0 ? (
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.usersByMonth} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} labelStyle={{ fontWeight: 600, color: '#1e293b' }} />
                          <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={50} name="Users" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-12">No data yet</p>
                  )}
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-slate-600" />
                    <h2 className="text-base font-semibold text-slate-900">Invoices Generated</h2>
                    <span className="text-xs text-slate-400 ml-1">(monthly)</span>
                  </div>
                  {analytics?.invoicesByMonth?.length > 0 ? (
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.invoicesByMonth} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} labelStyle={{ fontWeight: 600, color: '#1e293b' }} />
                          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} name="Invoices" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-12">No data yet</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-slate-600" />
                    <h2 className="text-base font-semibold text-slate-900">Revenue</h2>
                    <span className="text-xs text-slate-400 ml-1">(monthly, paid invoices)</span>
                  </div>
                  {analytics?.revenueByMonth?.length > 0 ? (
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.revenueByMonth} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} labelStyle={{ fontWeight: 600, color: '#1e293b' }} />
                          <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} name="Revenue (₹)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-12">No paid invoices yet</p>
                  )}
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-slate-600" />
                    <h2 className="text-base font-semibold text-slate-900">Customers & Businesses</h2>
                    <span className="text-xs text-slate-400 ml-1">(monthly)</span>
                  </div>
                  {analytics?.customersByMonth?.length > 0 || analytics?.businessesByMonth?.length > 0 ? (
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={
                          (analytics.customersByMonth || []).map((c, i) => ({
                            month: c.month,
                            Customers: c.count,
                            Businesses: analytics.businessesByMonth?.[i]?.count || 0
                          }))
                        } margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} labelStyle={{ fontWeight: 600, color: '#1e293b' }} />
                          <Bar dataKey="Customers" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={30} />
                          <Bar dataKey="Businesses" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={30} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-12">No data yet</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-slate-600" />
                  <h2 className="text-base font-semibold text-slate-900">Registered Businesses</h2>
                  <span className="text-xs text-slate-400 ml-1">({businesses.length} total)</span>
                </div>
                {businesses.length > 0 ? (
                  <div className="h-64 overflow-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-2 px-3 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Business Name</th>
                          <th className="text-left py-2 px-3 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Owner</th>
                          <th className="text-left py-2 px-3 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Email</th>
                          <th className="text-left py-2 px-3 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Phone</th>
                          <th className="text-left py-2 px-3 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">GST</th>
                          <th className="text-left py-2 px-3 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Website</th>
                          <th className="text-left py-2 px-3 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Invoice Prefix</th>
                          <th className="text-left py-2 px-3 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {businesses.map((b) => (
                          <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td className="py-2 px-3 text-xs font-medium whitespace-nowrap">
                              <button onClick={() => navigate(`/admin/businesses/${b.id}/invoices`)}
                                className="text-slate-800 hover:text-indigo-600 hover:underline transition-colors text-left">
                                {b.businessName}
                              </button>
                            </td>
                            <td className="py-2 px-3 text-xs whitespace-nowrap">
                              <button onClick={() => navigate(`/admin/businesses/${b.id}/invoices`)}
                                className="text-slate-600 hover:text-indigo-600 hover:underline transition-colors text-left">
                                {b.ownerName || "-"}
                              </button>
                            </td>
                            <td className="py-2 px-3 text-xs text-slate-600 whitespace-nowrap">{b.email || "-"}</td>
                            <td className="py-2 px-3 text-xs text-slate-600 whitespace-nowrap">{b.phone || "-"}</td>
                            <td className="py-2 px-3 text-xs text-slate-600 whitespace-nowrap">{b.gstIn || "-"}</td>
                            <td className="py-2 px-3 text-xs text-slate-600 whitespace-nowrap">{b.website || "-"}</td>
                            <td className="py-2 px-3 text-xs text-slate-600 whitespace-nowrap">{b.invoicePrefix || "-"}</td>
                            <td className="py-2 px-3 text-xs text-slate-600">{[b.addressLine1, b.addressLine2, b.city, b.state, b.pincode].filter(Boolean).join(", ") || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No businesses registered yet</p>
                )}
              </div>
            </>
          )}

          {!isAdmin && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Invoices", icon: FileText, count: "0", color: "from-blue-500 to-blue-600" },
                  { label: "Customers", icon: Users, count: "0", color: "from-emerald-500 to-emerald-600" },
                  { label: "Settings", icon: Settings, count: user?.role === "ADMIN" ? "Admin" : "Client", color: "from-purple-500 to-purple-600", path: "/profile" },
                ].map((card) => (
                  <div key={card.label}
                    onClick={() => card.path && navigate(card.path)}
                    className={`bg-white rounded-xl shadow-sm border border-slate-100 p-5 transition-shadow ${card.path ? "cursor-pointer hover:shadow-md" : "hover:shadow-sm"}`}>
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                      <card.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-semibold text-slate-900">{card.count}</div>
                    <div className="text-sm text-slate-500">{card.label}</div>
                  </div>
                ))}
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
