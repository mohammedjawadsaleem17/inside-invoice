import { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppNavbar from "../components/AppNavbar";
import { invoiceAPI, businessAPI } from "../api/auth";
import toast from "react-hot-toast";
import { ArrowLeft, FileText, Download, Eye } from "lucide-react";
import { downloadInvoicePDF } from "../components/InvoicePDF";
import InvoiceTemplateRenderer from "../components/InvoiceTemplateRenderer";

export default function InvoicesList() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const res = await invoiceAPI.getAll({ size: 100, sortBy: "createdAt", sortDir: "desc" });
      setInvoices(res.data.data?.content || res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvoices(); }, []);

  const downloadPDF = async (invoice) => {
    let business = null;
    try {
      const bRes = await businessAPI.getProfile();
      business = bRes.data.data;
    } catch (_) {}
    const items = (invoice.items || []).map((i) => ({
      itemName: i.itemName, hsn: i.hsn || "", qty: String(i.qty), rate: String(i.rate),
      gstPercentage: String(i.gstPercentage), taxableValue: i.taxableValue, taxAmount: i.taxAmount, total: i.total,
    }));
    const totals = {
      subtotal: invoice.subtotal || 0,
      taxAmount: invoice.taxAmount || 0,
      grandTotal: invoice.grandTotal || 0,
    };

    const container = document.createElement("div");
    container.style.cssText = "position:absolute;left:-9999px;top:0;pointer-events:none;";
    document.body.appendChild(container);
    const root = createRoot(container);
    const filename = `${invoice.invoiceType === "PROFORMA_INVOICE" ? "Proforma" : "Tax"}_Invoice_${invoice.invoiceNumber}.pdf`;

    try {
      await new Promise((resolve, reject) => {
        let done = false;
        root.render(
          <InvoiceTemplateRenderer
            ref={(el) => {
              if (el && !done) {
                done = true;
                setTimeout(() => {
                  downloadInvoicePDF(el, filename).then(resolve).catch(reject);
                }, 150);
              }
            }}
            business={business}
            customer={{
              name: invoice.customerName || "",
              billingAddress: invoice.billingAddress || "",
              gstIn: invoice.customerGstIn || "",
              phone: invoice.customerPhone || "",
              email: invoice.customerEmail || "",
            }}
            form={{
              invoiceDate: invoice.invoiceDate || "",
              dueDate: invoice.dueDate || "",
              placeOfSupply: invoice.placeOfSupply || "",
              destination: invoice.destination || "",
              termsOfDelivery: invoice.termsOfDelivery || "",
              paymentTerms: invoice.paymentTerms || "",
              deliveryNote: invoice.deliveryNote || "",
              otherReferences: invoice.otherReferences || "",
              notes: invoice.notes || "",
              deliveryNoteDate: invoice.deliveryNoteDate || "",
              referenceNumber: invoice.referenceNumber || "",
              buyerOrderNumber: invoice.buyerOrderNumber || "",
              dispatchDocNumber: invoice.dispatchDocNumber || "",
              dispatchedThrough: invoice.dispatchedThrough || "",
            }}
            items={items}
            totals={totals}
            type={invoice.invoiceType}
            invoiceNumber={invoice.invoiceNumber}
          />
        );
      });
    } catch (err) {
      toast.error("Failed to download PDF");
    } finally {
      root.unmount();
      document.body.removeChild(container);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <AppNavbar />
      <div className="px-6 py-6">
        <button onClick={() => navigate("/dashboard")}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-all mb-4">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {invoices.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium">No invoices yet</p>
              <button onClick={() => navigate("/invoice")} className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Create your first invoice
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Invoice No.</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Type</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <button onClick={() => navigate(`/invoice/${inv.id}`)} className="font-mono text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline text-left">
                        {inv.invoiceNumber}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{inv.customerName}</td>
                    <td className="py-3 px-4 text-slate-600">{inv.invoiceDate}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        inv.invoiceType === "PROFORMA_INVOICE" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {inv.invoiceType === "PROFORMA_INVOICE" ? "Proforma" : "Tax"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-sm font-medium text-slate-800">
                      Rs. {parseFloat(inv.grandTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigate(`/invoice/${inv.id}`)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600" title="View Invoice">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => downloadPDF(inv)}
                          className="p-2 hover:bg-indigo-50 rounded-lg transition-colors text-slate-400 hover:text-indigo-600" title="Download PDF">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
