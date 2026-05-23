import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../api/auth";
import { ArrowLeft, UserCheck } from "lucide-react";
import AppNavbar from "../components/AppNavbar";

export default function AdminCustomersList() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAllCustomers()
      .then((res) => setCustomers(res.data.data || []))
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
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">All Customers</h1>
              <p className="text-xs text-slate-500">{customers.length} total</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          </div>
        ) : customers.length > 0 ? (
          <div className="overflow-auto -mx-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-6 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Name</th>
                  <th className="text-left py-3 px-6 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Email</th>
                  <th className="text-left py-3 px-6 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Phone</th>
                  <th className="text-left py-3 px-6 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">GSTIN</th>
                  <th className="text-left py-3 px-6 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">City</th>
                  <th className="text-left py-3 px-6 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Business ID</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-6 text-xs text-slate-800 font-medium whitespace-nowrap">{c.name}</td>
                    <td className="py-3 px-6 text-xs text-slate-600 whitespace-nowrap">{c.email || "-"}</td>
                    <td className="py-3 px-6 text-xs text-slate-600 whitespace-nowrap">{c.phone || "-"}</td>
                    <td className="py-3 px-6 text-xs text-slate-600 whitespace-nowrap">{c.gstIn || "-"}</td>
                    <td className="py-3 px-6 text-xs text-slate-600 whitespace-nowrap">{c.city || "-"}</td>
                    <td className="py-3 px-6 text-xs text-slate-600 whitespace-nowrap">{c.businessId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-16">No customers found</p>
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
