import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../api/auth";
import { ArrowLeft, Building2 } from "lucide-react";
import AppNavbar from "../components/AppNavbar";

export default function AdminBusinessesList() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAllBusinesses()
      .then((res) => setBusinesses(res.data.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <AppNavbar />
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Registered Businesses</h1>
              <p className="text-xs text-slate-500">{businesses.length} total</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          </div>
        ) : businesses.length > 0 ? (
          <div className="overflow-auto -mx-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-6 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Business Name</th>
                  <th className="text-left py-3 px-6 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Owner</th>
                  <th className="text-left py-3 px-6 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Email</th>
                  <th className="text-left py-3 px-6 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Phone</th>
                  <th className="text-left py-3 px-6 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">GST</th>
                  <th className="text-left py-3 px-6 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Website</th>
                  <th className="text-left py-3 px-6 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Invoice Prefix</th>
                  <th className="text-left py-3 px-6 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Address</th>
                  <th className="text-left py-3 px-6 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Invoices</th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((b) => (
                  <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-6 text-xs font-medium whitespace-nowrap">
                      <button onClick={() => navigate(`/admin/businesses/${b.id}/invoices`)}
                        className="text-slate-800 hover:text-indigo-600 hover:underline transition-colors text-left">
                        {b.businessName}
                      </button>
                    </td>
                    <td className="py-3 px-6 text-xs text-slate-600 whitespace-nowrap">{b.ownerName || "-"}</td>
                    <td className="py-3 px-6 text-xs text-slate-600 whitespace-nowrap">{b.email || "-"}</td>
                    <td className="py-3 px-6 text-xs text-slate-600 whitespace-nowrap">{b.phone || "-"}</td>
                    <td className="py-3 px-6 text-xs text-slate-600 whitespace-nowrap">{b.gstIn || "-"}</td>
                    <td className="py-3 px-6 text-xs text-slate-600 whitespace-nowrap">{b.website || "-"}</td>
                    <td className="py-3 px-6 text-xs text-slate-600 whitespace-nowrap">{b.invoicePrefix || "-"}</td>
                    <td className="py-3 px-6 text-xs text-slate-600">{[b.addressLine1, b.addressLine2, b.city, b.state, b.pincode].filter(Boolean).join(", ") || "-"}</td>
                    <td className="py-3 px-6 text-xs whitespace-nowrap">
                      <button onClick={() => navigate(`/admin/businesses/${b.id}/invoices`)}
                        className="text-indigo-600 hover:text-indigo-800 hover:underline text-xs">
                        View Invoices
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-16">No businesses registered yet</p>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;600&display=swap');
        * { font-family: 'Inter', sans-serif; }
        h1 { font-family: 'Space Grotesk', sans-serif; }
      `}</style>
    </div>
  );
}
