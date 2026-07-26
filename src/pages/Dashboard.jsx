import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { adminAPI, invoiceAPI, customerAPI } from "../api/auth";
import { FileText, Users, Package, Building2, PlusCircle, List, UserPlus, BarChart3, UserCheck, UserCircle, Settings, DollarSign, TrendingUp, CreditCard, Calendar, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from "recharts";

import AppNavbar from "../components/AppNavbar";

const PAYMENT_COLORS = { UPI: "#6366f1", CASH: "#10b981", CARD: "#f59e0b", CHEQUE: "#8b5cf6", NEFT: "#3b82f6", IMPS: "#ec4899", OTHER: "#94a3b8" };

export default function Dashboard() {
  const { user, isBusinessSetupComplete, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [businesses, setBusinesses] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    if (!isBusinessSetupComplete && !isAdmin) {
      navigate("/business-setup");
    }
  }, [isBusinessSetupComplete, navigate, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      setLoadingStats(true);
      Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllUsers(),
        adminAPI.getAllBusinesses(),
        adminAPI.getAnalytics(),
      ])
        .then(([statsRes, usersRes, bizRes, analyticsRes]) => {
          setStats(statsRes.data.data);
          setUsers(usersRes.data.data || []);
          setBusinesses(bizRes.data.data || []);
          setAnalytics(analyticsRes.data.data);
        })
        .catch((err) => console.error("Admin data fetch failed:", err.response?.status, err.message))
        .finally(() => setLoadingStats(false));
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) {
      customerAPI.getAll()
        .then((res) => {
          const raw = res.data?.data || res.data;
          setCustomerCount(Array.isArray(raw) ? raw.length : 0);
        })
        .catch(() => {});
    }
  }, [isAdmin]);

  useEffect(() => {
    setLoadingInvoices(true);
    const fetch = isAdmin ? adminAPI.getAllInvoices() : invoiceAPI.getAll({ limit: 1000 });
    fetch
      .then((res) => {
        const raw = res.data?.data || res.data;
        setInvoices(Array.isArray(raw) ? raw : []);
      })
      .catch(() => {})
      .finally(() => setLoadingInvoices(false));
  }, [isAdmin]);

  const navItems = [
    { label: "New Invoice", icon: PlusCircle, path: "/invoice", color: "from-blue-500 to-blue-600" },
    { label: "View Invoices", icon: List, path: "/invoices", color: "from-indigo-500 to-indigo-600" },
    { label: "Payments", icon: CreditCard, path: "/payments", color: "from-emerald-500 to-emerald-600" },
    { label: "Add Customer", icon: Users, path: "/customers/new", color: "from-emerald-500 to-emerald-600" },
    { label: "Add Product", icon: Package, path: "/products/new", color: "from-purple-500 to-purple-600" },
    { label: "Profile", icon: UserCircle, path: "/settings", color: "from-amber-500 to-amber-600" },
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

  const invoiceAnalytics = useMemo(() => {
    const valid = invoices.filter((inv) => inv.status !== "CANCELLED" && inv.status !== "PENDING");
    const totalGrand = valid.reduce((s, inv) => s + (parseFloat(inv.grandTotal) || 0), 0);

    const salesByMonth = {};
    const revenueByMonth = {};
    const salesByPayment = {};
    const last7 = {};
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    valid.forEach((inv) => {
      const d = new Date(inv.invoiceDate);
      const monthKey = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      const amt = parseFloat(inv.grandTotal) || 0;

      salesByMonth[monthKey] = (salesByMonth[monthKey] || 0) + amt;
      if (inv.status === "PAID") {
        revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + amt;
      }

      const pm = inv.paymentMode || "OTHER";
      salesByPayment[pm] = (salesByPayment[pm] || 0) + amt;

      if (d >= sevenDaysAgo && d <= today) {
        const dayKey = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        last7[dayKey] = (last7[dayKey] || 0) + amt;
      }
    });

    const months = Object.keys(salesByMonth).sort((a, b) => {
      const [mA, yA] = a.split(" ");
      const [mB, yB] = b.split(" ");
      return yA !== yB ? yA - yB : monthNames.indexOf(mA) - monthNames.indexOf(mB);
    });

    return {
      totalRevenue: totalGrand,
      salesByMonth: months.map((m) => ({ month: m, sales: salesByMonth[m], revenue: revenueByMonth[m] || 0 })),
      last7Days: Object.entries(last7).sort((a, b) => {
        const parseDay = (s) => { const [d, m] = s.split(" "); return new Date(`${m} ${d}, ${today.getFullYear()}`); };
        return parseDay(a[0]) - parseDay(b[0]);
      }).map(([day, sales]) => ({ day, sales })),
      salesByPayment: Object.entries(salesByPayment).map(([mode, amount]) => ({ mode, amount })),
      invoiceCount: valid.length,
    };
  }, [invoices]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <AppNavbar />

      <div className="flex px-4 sm:px-6 lg:px-8">
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Welcome, {user?.name}</h1>
              <p className="text-slate-500 text-sm mt-1">
                {isAdmin ? "Overview of the entire platform" : "Manage your invoices, customers, and products"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "New Invoice", icon: PlusCircle, path: "/invoice", color: "from-blue-500 to-blue-600", desc: "Create invoice" },
              { label: "View Invoices", icon: List, path: "/invoices", color: "from-indigo-500 to-indigo-600", desc: "Browse all" },
              { label: "Add Customer", icon: Users, path: "/customers/new", color: "from-emerald-500 to-emerald-600", desc: "New customer" },
              { label: "Add Product", icon: Package, path: "/products/new", color: "from-purple-500 to-purple-600", desc: "New product" },
            ].map((card) => (
              <div key={card.label} onClick={() => navigate(card.path)}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 shadow-sm`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm font-semibold text-slate-800">{card.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{card.desc}</div>
              </div>
            ))}
          </div>

          {/* Revenue overview stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 transition-all hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Total Revenue</div>
                  <div className="text-lg font-bold text-slate-900">₹ {invoiceAnalytics.totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 transition-all hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Total Invoices</div>
                  <div className="text-lg font-bold text-slate-900">{invoiceAnalytics.invoiceCount}</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 transition-all hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Total Customers</div>
                  <div className="text-lg font-bold text-slate-900">{isAdmin ? (stats?.totalCustomers || 0) : customerCount}</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 transition-all hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-sm">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">This Month</div>
                  <div className="text-lg font-bold text-slate-900">₹ {(invoiceAnalytics.salesByMonth.length > 0 ? invoiceAnalytics.salesByMonth[invoiceAnalytics.salesByMonth.length - 1].sales : 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sales charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-semibold text-slate-900">Sales vs Months</h2>
              </div>
              {invoiceAnalytics.salesByMonth.length > 0 ? (
                <div className="h-48 sm:h-56 lg:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={invoiceAnalytics.salesByMonth} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} labelStyle={{ fontWeight: 600, color: '#1e293b' }} />
                      <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: "#10b981" }} name="Sales (₹)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-12">No sales data yet</p>
              )}
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-semibold text-slate-900">Last 7 Days Sales</h2>
              </div>
              {invoiceAnalytics.last7Days.length > 0 ? (
                <div className="h-48 sm:h-56 lg:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={invoiceAnalytics.last7Days} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} labelStyle={{ fontWeight: 600, color: '#1e293b' }} cursor={{ fill: '#f8fafc' }} />
                      <Bar dataKey="sales" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={50} name="Sales (₹)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-12">No sales in last 7 days</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-semibold text-slate-900">Monthly Revenue</h2>
            </div>
            {invoiceAnalytics.salesByMonth.length > 0 ? (
              <div className="h-48 sm:h-56 lg:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={invoiceAnalytics.salesByMonth} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} labelStyle={{ fontWeight: 600, color: '#1e293b' }} cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={50} name="Revenue (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-12">No revenue data yet</p>
            )}
            {invoiceAnalytics.salesByMonth.length > 0 && (
              <div className="mt-4 border-t border-slate-200 pt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Month</th>
                      <th className="text-right py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Sales</th>
                      <th className="text-right py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceAnalytics.salesByMonth.slice().reverse().map((row, i) => (
                      <tr key={row.month} className={`border-b border-slate-50 ${i % 2 === 1 ? "bg-slate-50/50" : ""} transition-colors`}>
                        <td className="py-1.5 text-xs font-medium text-slate-700">{row.month}</td>
                        <td className="py-1.5 text-xs text-right text-slate-600 font-mono">₹ {row.sales.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td className="py-1.5 text-xs text-right text-emerald-600 font-semibold font-mono">₹ {row.revenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
                  { label: "Settings", icon: Settings, count: user?.role === "ADMIN" ? "Admin" : "Client", color: "from-purple-500 to-purple-600", path: "/settings" },
                ].map((card) => (
                  <div key={card.label}
                    onClick={() => card.path && navigate(card.path)}
                    className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 transition-all ${card.path ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5" : "hover:shadow-sm"}`}>
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 shadow-sm`}>
                      <card.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {loadingStats ? <span className="inline-block w-12 h-7 bg-slate-200 rounded animate-pulse" /> : (card.count ?? 0)}
                    </div>
                    <div className="text-sm text-slate-500">{card.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base font-semibold text-slate-900">Platform Overview</h2>
                </div>
                {chartData.length > 0 ? (
                  <div className="h-48 sm:h-56 lg:h-64">
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
                ) : (
                  <p className="text-sm text-slate-400 text-center py-12">No data yet</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-base font-semibold text-slate-900">User Signups</h2>
                    <span className="text-xs text-slate-400 ml-1">(monthly)</span>
                  </div>
                  {analytics?.usersByMonth?.length > 0 ? (
                    <div className="h-48 sm:h-56">
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
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-slate-600" />
                    <h2 className="text-base font-semibold text-slate-900">Invoices Generated</h2>
                    <span className="text-xs text-slate-400 ml-1">(monthly)</span>
                  </div>
                  {analytics?.invoicesByMonth?.length > 0 ? (
                    <div className="h-48 sm:h-56">
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

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-slate-600" />
                  <h2 className="text-base font-semibold text-slate-900">Registered Businesses</h2>
                  <span className="text-xs text-slate-400 ml-1">({businesses.length} total)</span>
                </div>
                {businesses.length > 0 ? (
                  <div className="overflow-x-auto max-h-72">
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
                        {businesses.map((b, i) => (
                          <tr key={b.id} className={`border-b border-slate-100 hover:bg-slate-100 transition-colors ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}>
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
            <></>
          )}
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;600&display=swap');
        * { font-family: 'Inter', sans-serif; }
        h1, h2, h3 { font-family: 'Space Grotesk', sans-serif; }
        input, select, textarea, button { font-family: inherit; }
      `}</style>
    </div>
  );
}
