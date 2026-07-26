import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LogOut, Users, Plus, List, UserPlus, UserCheck,
  UserCircle, LayoutDashboard, Shield, Package, FileText, Settings,
  ChevronDown, Menu, X
} from "lucide-react";
import insideInvoiceLogo from "../assets/inside-invoice-logo.svg";

const sections = (isAdmin) => [
  {
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    ],
  },
  {
    header: "Invoices",
    items: [
      { label: "New Invoice", icon: Plus, path: "/invoice" },
      { label: "View Invoices", icon: List, path: "/invoices" },
      { label: "Invoice Templates", icon: FileText, path: "/invoice-templates" },
      { label: "Add Customer", icon: Users, path: "/customers/new" },
      { label: "View Customers", icon: Users, path: "/customers" },
      { label: "Add Product", icon: Package, path: "/products/new" },
      { label: "Product Items", icon: Package, path: "/products" },
    ],
  },
  ...(isAdmin ? [
    {
      header: "Admin",
      items: [
        { label: "Add User", icon: UserPlus, path: "/admin/users" },
        { label: "All Users", icon: UserCheck, path: "/admin/users-list" },
        { label: "Registered Products", icon: Package, path: "/admin/products" },
      ],
    },
  ] : []),
];

export default function AppNavbar() {
  const { user, logout, isAdmin, isBusinessSetupComplete } = useAuth();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const dropdownSections = sections(isAdmin).filter((s) => s.header);

  const handleNav = (path) => {
    navigate(path);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-3 sm:px-4 py-2 sm:py-3 relative z-[99]">
      <div className="flex items-center justify-between max-w-full">
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          <button onClick={() => handleNav("/dashboard")} className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
            <img src={insideInvoiceLogo} alt="Inside Invoice" className="w-7 h-7 sm:w-8 sm:h-8" />
            <span className="font-semibold text-slate-800 text-sm sm:text-base truncate">Inside Invoice</span>
          </button>
          <div className="items-center gap-1 hidden md:flex ml-2">
            {dropdownSections.map((section) => (
              <div key={section.header} className="relative">
                <button onClick={() => setOpenDropdown(openDropdown === section.header ? null : section.header)}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors min-h-[44px]">
                  {section.header}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === section.header ? "rotate-180" : ""}`} />
                </button>
                {openDropdown === section.header && (
                  <>
                    <div className="fixed inset-0 z-[100]" onClick={() => setOpenDropdown(null)} />
                    <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-[101]">
                      {section.items.map((item) => (
                        <button key={item.label} onClick={() => { navigate(item.path); setOpenDropdown(null); }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left min-h-[44px]">
                          <item.icon className="w-4 h-4 text-slate-400 shrink-0" />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] shrink-0">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Desktop right actions */}
        <div className="items-center gap-3 sm:gap-4 hidden md:flex shrink-0">
          {isAdmin && (
            <span className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">
              <Shield className="w-3 h-3" /> Admin
            </span>
          )}
          <button onClick={() => navigate("/settings")} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors min-h-[44px]">
            <Settings className="w-4 h-4" /> <span className="hidden sm:inline">Settings</span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors min-h-[44px]">
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile bottom sheet menu */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[70vh] overflow-y-auto md:hidden">
            <div className="sticky top-0 bg-white pt-3 pb-1 px-4 border-b border-slate-100">
              <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-2" />
              {isAdmin && (
                <span className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-medium w-fit mb-2">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              )}
            </div>
            <div className="p-3 pb-6">
              {dropdownSections.map((section) => (
                <div key={section.header} className="mb-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">{section.header}</div>
                  {section.items.map((item) => (
                    <button key={item.label} onClick={() => handleNav(item.path)}
                      className="flex items-center gap-3 w-full px-3 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left min-h-[48px]">
                      <item.icon className="w-4 h-4 text-slate-400 shrink-0" />
                      {item.label}
                    </button>
                  ))}
                </div>
              ))}
              <hr className="my-3 border-slate-100" />
              <button onClick={() => { navigate("/settings"); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 w-full px-3 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left min-h-[48px]">
                <Settings className="w-4 h-4 text-slate-400 shrink-0" /> Settings
              </button>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 w-full px-3 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left min-h-[48px]">
                <LogOut className="w-4 h-4 shrink-0" /> Logout
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
