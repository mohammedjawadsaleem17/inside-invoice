import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminAPI } from "../api/auth";
import toast from "react-hot-toast";
import { ArrowLeft, FileText, Building2 } from "lucide-react";
import AppNavbar from "../components/AppNavbar";
import PageHeader from "../components/PageHeader";

export default function BusinessInvoices() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bRes, iRes] = await Promise.all([
          adminAPI.getAllBusinesses(),
          adminAPI.getBusinessInvoices(businessId),
        ]);
        const biz = bRes.data.data?.find((b) => String(b.id) === String(businessId));
        setBusiness(biz);
        setInvoices(iRes.data.data || []);
      } catch (err) {
        console.error("Failed to load business invoices:", err);
        toast.error(err.response?.data?.message || "Failed to load invoices");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [businessId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <AppNavbar />
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <PageHeader title={business?.businessName || `Business #${businessId}`} backTo="/admin/businesses" />
        <p className="text-xs text-slate-500 -mt-4 mb-6">
          {business?.ownerName ? `${business.ownerName} — ` : ""}
          {invoices.length} invoice{invoices.length !== 1 ? "s" : ""} total
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          </div>
        ) : invoices.length > 0 ? (
          <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-6 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Invoice #</th>
                  <th className="text-left py-3 px-6 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Customer</th>
                  <th className="text-left py-3 px-6 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Date</th>
                  <th className="text-left py-3 px-6 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Due Date</th>
                  <th className="text-right py-3 px-6 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Grand Total</th>
                  <th className="text-left py-3 px-6 text-[10px] font-medium text-slate-500 uppercase whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-6 text-xs font-mono whitespace-nowrap">
                      <button onClick={() => navigate(`/admin/invoices/${inv.id}`)}
                        className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
                        {inv.invoiceNumber}
                      </button>
                    </td>
                    <td className="py-3 px-6 text-xs text-slate-600 whitespace-nowrap">{inv.customerName}</td>
                    <td className="py-3 px-6 text-xs text-slate-600 whitespace-nowrap">{inv.invoiceDate}</td>
                    <td className="py-3 px-6 text-xs text-slate-600 whitespace-nowrap">{inv.dueDate}</td>
                    <td className="py-3 px-6 text-xs text-slate-800 font-medium text-right whitespace-nowrap">₹{Number(inv.grandTotal).toLocaleString()}</td>
                    <td className="py-3 px-6 whitespace-nowrap">
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                        inv.status === "PAID" ? "bg-emerald-100 text-emerald-700" :
                        inv.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                        inv.status === "DRAFT" ? "bg-slate-100 text-slate-600" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No invoices created by this business yet</p>
          </div>
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
