import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { LogOut, FileText, Users, Package, Building2, PlusCircle, List, Menu, X, UserPlus, Shield } from "lucide-react";

export default function Dashboard() {
  const { user, logout, isBusinessSetupComplete, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isBusinessSetupComplete) {
      navigate("/business-setup");
    }
  }, [isBusinessSetupComplete, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    ...(isAdmin ? [{ label: "Add Users", icon: UserPlus, action: () => navigate("/admin/users"), color: "text-indigo-600" }] : []),
  ];

  const cards = [
    { label: "Invoices", icon: FileText, count: "0", color: "from-blue-500 to-blue-600" },
    { label: "Customers", icon: Users, count: "0", color: "from-emerald-500 to-emerald-600" },
    { label: "Products", icon: Package, count: "0", color: "from-purple-500 to-purple-600" },
    { label: "Business", icon: Building2, count: "", color: "from-amber-500 to-amber-600" },
  ];

  const quickActions = [
    { label: "New Invoice", icon: PlusCircle, action: () => {}, color: "text-slate-700" },
    { label: "View Invoices", icon: List, action: () => {}, color: "text-slate-700" },
    { label: "Add Customer", icon: Users, action: () => {}, color: "text-slate-700" },
    { label: "Add Product", icon: Package, action: () => {}, color: "text-slate-700" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors lg:hidden">
              {isSidebarOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><circle cx="10" cy="8" r="2.5" fill="white"/><rect x="8.5" y="12" width="3" height="12" rx="1.5" fill="white"/><circle cx="20" cy="11" r="1.8" fill="white" opacity="0.9"/><rect x="18.6" y="15" width="2.8" height="9" rx="1.4" fill="white" opacity="0.9"/></svg>
            </div>
            <span className="font-semibold text-slate-800">Inside Invoice</span>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <span className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-medium">
                <Shield className="w-3 h-3" /> Admin
              </span>
            )}
            <span className="text-sm text-slate-600">{user?.name}</span>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </nav>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div className="absolute left-0 top-16 bottom-0 w-64 bg-white shadow-xl p-4" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-1">
              {menuItems.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">Admin</div>
                  {menuItems.map((item) => (
                    <button key={item.label} onClick={() => { item.action(); setIsSidebarOpen(false); }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex max-w-7xl mx-auto">
        {menuItems.length > 0 && (
          <aside className="hidden lg:block w-56 border-r border-slate-200 min-h-[calc(100vh-64px)] bg-white/50 p-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">Admin</div>
            {menuItems.map((item) => (
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
            <p className="text-slate-500 text-sm mt-1">Manage your invoices, customers, and products</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card) => (
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
              {quickActions.map((action) => (
                <button key={action.label} onClick={action.action}
                  className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                  <span className="text-sm font-medium text-slate-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
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
