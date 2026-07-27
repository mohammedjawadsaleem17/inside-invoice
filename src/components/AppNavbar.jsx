import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LogOut, Users, Plus, List, UserPlus, UserCheck,
  UserCircle, LayoutDashboard, Shield, Package, FileText, Settings,
  ChevronDown, Menu, X, Home, CreditCard
} from "lucide-react";
import insideInvoiceLogo from "../assets/inside-invoice-logo.svg";

const sections = (isAdmin) => [
  {
    header: "Dashboard",
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
      { label: "Add Product", icon: Package, path: "/products/new" },
      { label: "Product Items", icon: Package, path: "/products" },
    ],
  },
  {
    header: "Customers",
    items: [
      { label: "New Customer", icon: UserPlus, path: "/customers/new" },
      { label: "View Customers", icon: UserCheck, path: "/customers" },
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

const bottomTabs = [
  { label: "Dashboard", icon: Home, path: "/dashboard" },
  { label: "Invoices", icon: FileText, path: "/invoices" },
  { label: "Customers", icon: Users, path: "/customers" },
  { label: "More", icon: Menu, path: "/more" },
];

export default function AppNavbar() {
  const { user, logout, isAdmin, isBusinessSetupComplete } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const dropdownSections = sections(isAdmin).filter((s) => s.header);

  const closeMobile = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleNav = useCallback((path) => {
    navigate(path);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }, [navigate]);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onEscape = (e) => { if (e.key === "Escape") closeMobile(); };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [mobileMenuOpen, closeMobile]);

  useEffect(() => {
    closeMobile();
  }, [location.pathname, closeMobile]);

  return (
    <>
      <nav className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2 sm:py-3 relative z-[99]">
        <div className="flex items-center justify-between max-w-full">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
            <button onClick={() => handleNav("/dashboard")} className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
              <img src={insideInvoiceLogo} alt="Inside Invoice" className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="font-semibold text-slate-800 text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">Inside Invoice</span>
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

          <button onClick={() => setMobileMenuOpen(true)}
            className="md:hidden flex items-center justify-center p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] shrink-0">
            <Menu className="w-5 h-5" />
          </button>

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

      </nav>

      <div
        className={`fixed inset-0 z-[999] transition-all duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "pointer-events-auto visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-in-out ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMobile}
        />
        <div
          className={`absolute top-0 left-0 h-full w-5/6 max-w-sm bg-white shadow-2xl transition-all duration-300 ease-in-out flex flex-col ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{
            paddingTop: "env(safe-area-inset-top, 0px)",
          }}
        >
          {/* Header — fixed, never scrolls */}
          <div className="bg-white border-b border-slate-100 relative z-10 shrink-0" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <img src={insideInvoiceLogo} alt="Inside Invoice" className="w-7 h-7" />
                <span className="font-semibold text-slate-800 text-sm">Inside Invoice</span>
              </div>
              <button onClick={closeMobile}
                className="flex items-center justify-center p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors min-h-[44px] min-w-[44px]">
                <X className="w-5 h-5" />
              </button>
            </div>
            {isAdmin && (
              <div className="px-4 pb-2">
                <span className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-medium w-fit">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              </div>
            )}
          </div>

          {/* Scrollable body — flex: 1 + min-h-0 so it scrolls independently */}
          <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingBottom: "calc(64px + env(safe-area-inset-bottom, 0px))" }}>
            <div className="p-3">
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
              <button onClick={() => { navigate("/settings"); closeMobile(); }}
                className="flex items-center gap-3 w-full px-3 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left min-h-[48px]">
                <Settings className="w-4 h-4 text-slate-400 shrink-0" /> Settings
              </button>
              <button onClick={() => { handleLogout(); }}
                className="flex items-center gap-3 w-full px-3 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left min-h-[48px]">
                <LogOut className="w-4 h-4 shrink-0" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-[1000] md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)", backgroundColor: "#ffffff" }}>
        <div className="bg-white border-t border-slate-200">
          <div className="flex items-center justify-around px-2">
            {bottomTabs.map((tab) => (
              <button key={tab.label} onClick={() => handleNav(tab.path)}
                className={`flex flex-col items-center justify-center py-1.5 px-2 min-w-[44px] min-h-[44px] rounded-lg transition-colors ${
                  tab.path && isActive(tab.path) ? "text-indigo-600" : "text-slate-500"
                }`}>
                <tab.icon className={`w-5 h-5 ${tab.path && isActive(tab.path) ? "text-indigo-600" : "text-slate-400"}`} />
                <span className="text-[10px] mt-0.5 font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
