import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LogOut, Users, PlusCircle, List, Menu, X, UserPlus, UserCheck,
  UserCircle, LayoutDashboard, Shield, Package
} from "lucide-react";

const navItems = (isAdmin) => [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", color: "from-slate-600 to-slate-700" },
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

export default function AppNavbar() {
  const { user, logout, isAdmin, isBusinessSetupComplete } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
            <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/src/assets/inside-invoice-logo.svg" alt="Inside Invoice" className="w-8 h-8" />
              <span className="font-semibold text-slate-800">Inside Invoice</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <span className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-medium">
                <Shield className="w-3 h-3" /> Admin
              </span>
            )}
            <button onClick={() => navigate("/profile")} className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-800 transition-colors">
              {user?.username || user?.name}
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50" onClick={closeMenu}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-5 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-slate-800 text-sm">Navigation</span>
              </div>
              <button onClick={closeMenu} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="space-y-1">
              {navItems(isAdmin).map((item) => (
                <button key={item.label} onClick={() => { navigate(item.path); closeMenu(); }}
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shadow-sm`}>
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{item.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200">
              <button onClick={() => { navigate("/profile"); closeMenu(); }}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors text-left">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-sm">
                  <UserCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{user?.name || user?.username}</p>
                  <p className="text-xs text-slate-400">View profile</p>
                </div>
              </button>
              <button onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-red-50 transition-colors text-left mt-1">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-sm">
                  <LogOut className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-red-600">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
