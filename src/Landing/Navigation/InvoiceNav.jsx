import { Menu, X } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function InvoiceNav({ scrolled, setIsMenuOpen, isMenuOpen }) {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-xl" : "bg-transparent"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-12">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative group">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-slate-700 via-gray-700 to-slate-900 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="lg:hidden">
                  <circle cx="10" cy="8" r="2.5" fill="white" />
                  <rect x="8.5" y="12" width="3" height="12" rx="1.5" fill="white" />
                  <circle cx="20" cy="11" r="1.8" fill="white" opacity="0.9" />
                  <rect x="18.6" y="15" width="2.8" height="9" rx="1.4" fill="white" opacity="0.9" />
                </svg>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden lg:block">
                  <circle cx="10" cy="8" r="2.5" fill="white" />
                  <rect x="8.5" y="12" width="3" height="12" rx="1.5" fill="white" />
                  <circle cx="20" cy="11" r="1.8" fill="white" opacity="0.9" />
                  <rect x="18.6" y="15" width="2.8" height="9" rx="1.4" fill="white" opacity="0.9" />
                </svg>
              </div>
            </div>
            <div>
              <span className="text-base sm:text-lg lg:text-2xl font-black text-slate-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <Link to="/">Inside Invoice</Link>
              </span>
              <div className="text-[8px] sm:text-[9px] lg:text-[10px] text-slate-600 font-semibold tracking-wider">
                BY <a href="https://twoxplusone.netlify.app/" target="_blank">2X+1</a>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/contact" className="text-slate-700 hover:text-slate-900 transition-colors font-semibold">
              Contact
            </Link>
            <Link to="/login" className="text-slate-700 hover:text-slate-900 transition-colors font-semibold">
              Login
            </Link>
            <Link to="/login">
              <button className="px-6 py-2.5 bg-gradient-to-r from-slate-700 via-gray-700 to-slate-800 text-white rounded-xl hover:shadow-2xl hover:shadow-slate-500/50 hover:scale-105 transition-all duration-300 font-bold">
                Start Billing →
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center justify-center min-h-[44px] min-w-[44px] -mr-2 text-slate-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 bg-white rounded-b-2xl shadow-xl border-t border-slate-100">
            <Link to="/contact" className="block px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors font-semibold min-h-[44px]">
              Contact
            </Link>
            <Link to="/login" className="block px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors font-semibold min-h-[44px]">
              Login
            </Link>
            <div className="px-4 pt-2">
              <Link to="/login">
                <button className="w-full px-6 py-3 bg-gradient-to-r from-slate-700 to-gray-800 text-white rounded-xl font-bold min-h-[48px]">
                  Start Billing →
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
