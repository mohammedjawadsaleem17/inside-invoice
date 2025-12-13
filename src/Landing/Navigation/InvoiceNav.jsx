import { Menu, X } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';

export default function InvoiceNav({ scrolled, setIsMenuOpen, isMenuOpen }) {
  
  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "glass-effect shadow-xl" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            {/* Super Trendy Modern Logo */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-gray-700 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-slate-700 via-gray-700 to-slate-900 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 overflow-hidden">
                {/* Subtle geometric pattern */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 right-0 w-6 h-6 bg-white opacity-5 rounded-bl-full"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 bg-white opacity-5 rounded-tr-full"></div>
                </div>
                {/* Modern i icon design */}
                <div className="relative">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Big I */}
                    <circle cx="10" cy="8" r="2.5" fill="white" />
                    <rect
                      x="8.5"
                      y="12"
                      width="3"
                      height="12"
                      rx="1.5"
                      fill="white"
                    />

                    {/* Small i */}
                    <circle
                      cx="20"
                      cy="11"
                      r="1.8"
                      fill="white"
                      opacity="0.9"
                    />
                    <rect
                      x="18.6"
                      y="15"
                      width="2.8"
                      height="9"
                      rx="1.4"
                      fill="white"
                      opacity="0.9"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <span className="text-2xl font-black logo-text text-slate-700">
                <Link to="/">Inside Invoice</Link>
              </span>
              <div className="text-[10px] text-slate-600 font-semibold tracking-wider">
                BY{" "}
                <a href="https://twoxplusone.netlify.app/" target="_blank">
                  2X+1
                </a>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/contact"
              className="text-slate-700 hover:text-slate-900 transition-colors font-semibold"
            >
              Contact
            </Link>
            <Link
              to="/login"
              className="text-slate-700 hover:text-slate-900 transition-colors font-semibold"
            >
              Login
            </Link>
            <Link to="/signup">
              <button className="px-6 py-2.5 bg-gradient-to-r from-slate-700 via-gray-700 to-slate-800 text-white rounded-xl hover:shadow-2xl hover:shadow-slate-500/50 hover:scale-105 transition-all duration-300 font-bold">
                Try Now →
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 glass-effect rounded-b-2xl shadow-xl">
            <Link
              to="/contact"
              className="block px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors font-semibold"
            >
              Contact
            </Link>
            <Link
              to="/login"
              className="block px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors font-semibold"
            >
              Login
            </Link>
            <div className="px-4 pt-3">
              <button className="w-full px-6 py-2.5 bg-gradient-to-r from-slate-700 to-gray-800 text-white rounded-xl font-bold">
                Try Now →
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
