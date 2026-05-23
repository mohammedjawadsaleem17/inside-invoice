import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppNavbar from "../components/AppNavbar";
import { invoiceAPI, businessAPI, customerAPI } from "../api/auth";
import toast from "react-hot-toast";
import { ArrowLeft, Download, Save, Edit3, Plus, Trash2, FileText, AlertCircle, User, Building2, Phone, MapPin, Hash, Package, Mail, Globe, X } from "lucide-react";
import InvoicePDF, { downloadInvoicePDF } from "../components/InvoicePDF";
import { processQueue } from "../utils/retryQueue";

const emptyItem = () => ({ itemName: "", hsn: "", qty: "1", rate: "", gstPercentage: "18", taxableValue: "0", taxAmount: "0", total: "0" });
const fmt = (v) => parseFloat(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
const inputClass = "w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400/30 focus:border-slate-400";
const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5";

export default function InvoiceView() {
  const { id } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [invoiceType, setInvoiceType] = useState("TAX_INVOICE");
  const invoiceRef = useRef(null);
  const [business, setBusiness] = useState(null);
  const [form, setForm] = useState({
    customerName: "", customerEmail: "", customerPhone: "", billingAddress: "", customerGstIn: "",
    invoiceDate: "", dueDate: "", placeOfSupply: "", destination: "", termsOfDelivery: "",
    paymentTerms: "", deliveryNote: "", otherReferences: "", notes: "", invoiceNumber: "",
    deliveryNoteDate: "", referenceNumber: "", buyerOrderNumber: "",
    dispatchDocNumber: "", dispatchedThrough: "",
  });
  const [items, setItems] = useState([{ ...emptyItem() }]);

  useEffect(() => {
    Promise.all([
      invoiceAPI.getById(id),
      businessAPI.getProfile().catch(() => null),
    ]).then(([invRes, bizRes]) => {
      const inv = invRes.data.data;
      setBusiness(bizRes?.data?.data || null);
      setInvoiceType(inv.invoiceType || "TAX_INVOICE");
      setForm({
        customerName: inv.customerName || "", customerEmail: "", customerPhone: "",
        billingAddress: "", customerGstIn: "", invoiceDate: inv.invoiceDate || "",
        dueDate: inv.dueDate || "", placeOfSupply: inv.placeOfSupply || "",
        destination: inv.destination || "", termsOfDelivery: inv.termsOfDelivery || "",
        paymentTerms: inv.paymentTerms || "", deliveryNote: inv.deliveryNote || "",
        otherReferences: inv.otherReferences || "", notes: inv.notes || "",
        invoiceNumber: inv.invoiceNumber || "",
        deliveryNoteDate: inv.deliveryNoteDate || "", referenceNumber: inv.referenceNumber || "",
        buyerOrderNumber: inv.buyerOrderNumber || "", dispatchDocNumber: inv.dispatchDocNumber || "",
        dispatchedThrough: inv.dispatchedThrough || "",
      });
      setItems((inv.items || []).length > 0 ? inv.items.map((i) => ({
        itemName: i.itemName, hsn: i.hsn || "", qty: String(i.qty), rate: String(i.rate),
        gstPercentage: String(i.gstPercentage), taxableValue: String(i.taxableValue || 0),
        taxAmount: String(i.taxAmount || 0), total: String(i.total || 0),
      })) : [{ ...emptyItem() }]);
      if (inv.customerId) {
        customerAPI.getById(inv.customerId)
          .then((cRes) => {
            const c = cRes.data.data;
            setForm((p) => ({
              ...p, customerEmail: c.email || "", customerPhone: c.phone || "",
              billingAddress: c.billingAddress || "", customerGstIn: c.gstIn || "",
            }));
          })
          .catch(() => {});
      }
    })
    .catch(() => setError("Failed to load invoice"))
    .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    processQueue(
      (data) => customerAPI.create(data),
      (data) => invoiceAPI.create(data)
    ).then((count) => {
      if (count > 0) toast.success(`${count} pending invoice${count > 1 ? 's' : ''} synced`);
    });
  }, []);

  const handleFieldChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const calcItem = (item) => {
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    const gst = parseFloat(item.gstPercentage) || 0;
    const taxableValue = qty * rate;
    const taxAmount = taxableValue * gst / 100;
    const total = taxableValue + taxAmount;
    return { ...item, taxableValue: taxableValue.toFixed(2), taxAmount: taxAmount.toFixed(2), total: total.toFixed(2) };
  };
  const handleItemChange = (idx, field, value) => {
    setItems(items.map((item, i) => i !== idx ? item : calcItem({ ...item, [field]: value })));
  };
  const addItem = () => setItems([...items, { ...emptyItem() }]);
  const removeItem = (idx) => { if (items.length > 1) setItems(items.filter((_, i) => i !== idx)); };

  const totals = items.reduce(
    (acc, item) => {
      const tv = parseFloat(item.taxableValue) || 0;
      const ta = parseFloat(item.taxAmount) || 0;
      const t = parseFloat(item.total) || 0;
      return { subtotal: acc.subtotal + tv, taxAmount: acc.taxAmount + ta, grandTotal: acc.grandTotal + t };
    },
    { subtotal: 0, taxAmount: 0, grandTotal: 0 }
  );

  const validate = () => {
    if (!form.customerName.trim()) { toast.error("Customer name is required"); return false; }
    if (!form.invoiceDate) { toast.error("Invoice date is required"); return false; }
    const validItems = items.filter((i) => i.itemName.trim() && parseFloat(i.qty) > 0 && parseFloat(i.rate) > 0);
    if (validItems.length === 0) { toast.error("At least one valid item required"); return false; }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await invoiceAPI.update(id, {
        invoiceDate: form.invoiceDate, dueDate: form.dueDate || undefined,
        placeOfSupply: form.placeOfSupply || undefined, destination: form.destination || undefined,
        termsOfDelivery: form.termsOfDelivery || undefined, paymentTerms: form.paymentTerms || undefined,
        deliveryNote: form.deliveryNote || undefined, otherReferences: form.otherReferences || undefined,
        notes: form.notes || undefined,
        customerName: form.customerName.trim(), customerEmail: form.customerEmail || undefined,
        customerPhone: form.customerPhone || undefined, billingAddress: form.billingAddress || undefined,
        customerGstIn: form.customerGstIn || undefined,
        items: items.filter((i) => i.itemName.trim() && parseFloat(i.qty) > 0 && parseFloat(i.rate) > 0)
          .map((i, idx) => ({
            sno: idx + 1, itemName: i.itemName, hsn: i.hsn || undefined, qty: parseFloat(i.qty),
            rate: parseFloat(i.rate), gstPercentage: parseFloat(i.gstPercentage) || 0,
            taxableValue: parseFloat(i.taxableValue), taxAmount: parseFloat(i.taxAmount), total: parseFloat(i.total),
          })),
      });
      toast.success("Invoice updated successfully");
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update invoice");
    } finally {
      setSaving(false);
    }
  };

  const downloadPDF = async (type) => {
    if (isEditing) {
      if (!validate()) return;
      handleSave().catch(() => {});
    }
    try {
      const filename = `${type === "PROFORMA_INVOICE" ? "Proforma" : "Tax"}_Invoice_${form.invoiceNumber}.pdf`;
      await new Promise((r) => setTimeout(r, 100));
      await downloadInvoicePDF(invoiceRef.current, filename);
    } catch (err) {
      toast.error("Failed to generate PDF");
    }
  };

  const viewPDF = async (type) => {
    try {
      const filename = `${type === "PROFORMA_INVOICE" ? "Proforma" : "Tax"}_Invoice_${form.invoiceNumber}.pdf`;
      await new Promise((r) => setTimeout(r, 100));
      await downloadInvoicePDF(invoiceRef.current, filename);
    } catch (err) {
      toast.error("Failed to generate PDF");
    }
  };

  const InfoRow = ({ label, value }) => value ? <p className="text-sm text-slate-600"><span className="text-slate-400">{label}:</span> {value}</p> : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <AppNavbar />
        <div className="px-6 py-12 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-slate-600">{error}</p>
          <button onClick={() => navigate("/invoices")} className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium">Back to Invoices</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <AppNavbar />
      {/* Hidden Invoice PDF for capture */}
      <div style={{ position: "absolute", left: "-9999px", top: 0, pointerEvents: "none" }}>
        <InvoicePDF
          ref={invoiceRef}
          business={business}
          customer={{ name: form.customerName, billingAddress: form.billingAddress, gstIn: form.customerGstIn, phone: form.customerPhone, email: form.customerEmail, state: form.placeOfSupply }}
          form={form}
          items={items}
          totals={totals}
          type={invoiceType}
          invoiceNumber={form.invoiceNumber}
        />
      </div>
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate("/invoices")} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Invoices
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              invoiceType === "PROFORMA_INVOICE" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
            }`}>
              {invoiceType === "PROFORMA_INVOICE" ? "Proforma" : "Tax"} Invoice
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-4 space-y-6">
            {/* Seller & Buyer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-slate-600" />
                  <h2 className="text-sm font-bold text-slate-800">Seller</h2>
                </div>
                {business ? (
                  <>
                    <p className="text-sm font-semibold text-slate-800">{business.businessName}</p>
                    <InfoRow label="GSTIN" value={business.gstIn} />
                    <InfoRow label="Phone" value={business.phone} />
                    <InfoRow label="Email" value={business.email} />
                    {business.addressLine1 && <p className="text-xs text-slate-500 mt-1">{business.addressLine1}{business.city ? `, ${business.city}` : ""}{business.state ? `, ${business.state}` : ""}{business.pincode ? ` - ${business.pincode}` : ""}</p>}
                  </>
                ) : (
                  <p className="text-sm text-slate-400">Business details not available</p>
                )}
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-slate-600" />
                  <h2 className="text-sm font-bold text-slate-800">Buyer</h2>
                </div>
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className={labelClass}>Name *</label>
                      <input name="customerName" value={form.customerName} onChange={handleFieldChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Email</label>
                      <input name="customerEmail" value={form.customerEmail} onChange={handleFieldChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Phone</label>
                      <input name="customerPhone" value={form.customerPhone} onChange={handleFieldChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>GSTIN</label>
                      <input name="customerGstIn" value={form.customerGstIn} onChange={handleFieldChange} className={inputClass + " font-mono uppercase"} />
                    </div>
                    <div>
                      <label className={labelClass}>Billing Address</label>
                      <textarea name="billingAddress" value={form.billingAddress} onChange={handleFieldChange} rows={2} className={inputClass + " resize-none"} />
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-slate-800">{form.customerName}</p>
                    {form.customerEmail && <InfoRow label="Email" value={form.customerEmail} />}
                    {form.customerPhone && <InfoRow label="Phone" value={form.customerPhone} />}
                    {form.customerGstIn && <InfoRow label="GSTIN" value={form.customerGstIn} />}
                    {form.billingAddress && <p className="text-xs text-slate-500 mt-1">{form.billingAddress}</p>}
                  </>
                )}
              </div>
            </div>

            {/* Invoice Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
                <FileText className="w-5 h-5 text-slate-600" />
                <h2 className="text-sm font-bold text-slate-800">Invoice Details</h2>
              </div>
              {isEditing ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <div>
                    <label className={labelClass}>Invoice No.</label>
                    <input value={form.invoiceNumber} disabled className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 font-mono" />
                  </div>
                  <div>
                    <label className={labelClass}>Invoice Date *</label>
                    <input type="date" name="invoiceDate" value={form.invoiceDate} onChange={handleFieldChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Due Date</label>
                    <input type="date" name="dueDate" value={form.dueDate} onChange={handleFieldChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Place of Supply</label>
                    <input name="placeOfSupply" value={form.placeOfSupply} onChange={handleFieldChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Destination</label>
                    <input name="destination" value={form.destination} onChange={handleFieldChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Terms of Delivery</label>
                    <input name="termsOfDelivery" value={form.termsOfDelivery} onChange={handleFieldChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Payment Terms</label>
                    <input name="paymentTerms" value={form.paymentTerms} onChange={handleFieldChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Delivery Note</label>
                    <input name="deliveryNote" value={form.deliveryNote} onChange={handleFieldChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Other References</label>
                    <input name="otherReferences" value={form.otherReferences} onChange={handleFieldChange} className={inputClass} />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <div>
                    <label className={labelClass}>Invoice No.</label>
                    <p className="text-sm font-mono text-slate-800 font-medium">{form.invoiceNumber}</p>
                  </div>
                  <div>
                    <label className={labelClass}>Invoice Date</label>
                    <p className="text-sm text-slate-800">{form.invoiceDate}</p>
                  </div>
                  {form.dueDate && <div>
                    <label className={labelClass}>Due Date</label>
                    <p className="text-sm text-slate-800">{form.dueDate}</p>
                  </div>}
                  {form.placeOfSupply && <div>
                    <label className={labelClass}>Place of Supply</label>
                    <p className="text-sm text-slate-800">{form.placeOfSupply}</p>
                  </div>}
                  {form.destination && <div>
                    <label className={labelClass}>Destination</label>
                    <p className="text-sm text-slate-800">{form.destination}</p>
                  </div>}
                  {form.termsOfDelivery && <div>
                    <label className={labelClass}>Terms of Delivery</label>
                    <p className="text-sm text-slate-800">{form.termsOfDelivery}</p>
                  </div>}
                  {form.paymentTerms && <div>
                    <label className={labelClass}>Payment Terms</label>
                    <p className="text-sm text-slate-800">{form.paymentTerms}</p>
                  </div>}
                  {form.deliveryNote && <div>
                    <label className={labelClass}>Delivery Note</label>
                    <p className="text-sm text-slate-800">{form.deliveryNote}</p>
                  </div>}
                  {form.otherReferences && <div>
                    <label className={labelClass}>Other References</label>
                    <p className="text-sm text-slate-800">{form.otherReferences}</p>
                  </div>}
                </div>
              )}
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-slate-600" />
                  <h2 className="text-sm font-bold text-slate-800">Items</h2>
                </div>
                {isEditing && (
                  <button onClick={addItem}
                    className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all shadow-sm">
                    <Plus className="w-3.5 h-3.5" /> Add Item
                  </button>
                )}
              </div>

              <div className="overflow-hidden border border-slate-200 rounded-lg">
                <table className="w-full text-sm border-collapse table-fixed">
                  <thead>
                    <tr className="bg-slate-800">
                      <th className="text-white text-xs font-semibold py-3.5 px-3 text-center w-10">#</th>
                      <th className="text-white text-xs font-semibold py-3.5 px-3 text-left w-72">Description</th>
                      <th className="text-white text-xs font-semibold py-3.5 px-3 text-center w-40">HSN/SAC</th>
                      <th className="text-white text-xs font-semibold py-3.5 px-3 text-center w-28">Qty</th>
                      <th className="text-white text-xs font-semibold py-3.5 px-3 text-center w-36">Rate</th>
                      <th className="text-white text-xs font-semibold py-3.5 px-3 text-center w-28">GST %</th>
                      <th className="text-white text-xs font-semibold py-3.5 px-3 text-right w-36">Taxable</th>
                      <th className="text-white text-xs font-semibold py-3.5 px-3 text-right w-28">Tax</th>
                      <th className="text-white text-xs font-semibold py-3.5 px-3 text-right w-36">Total</th>
                      {isEditing && <th className="text-white w-12"></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className={`${idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"} ${isEditing ? "hover:bg-blue-50/20" : ""} transition-colors`}>
                        <td className="py-3 px-3 text-center text-slate-400 font-mono text-xs border-b border-slate-100">{idx + 1}</td>
                        {isEditing ? (
                          <>
                            <td className="py-3 px-3 border-b border-slate-100">
                              <input type="text" value={item.itemName}
                                onChange={(e) => handleItemChange(idx, "itemName", e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400/20 bg-white" placeholder="Item name" />
                            </td>
                            <td className="py-3 px-3 border-b border-slate-100">
                              <input type="text" value={item.hsn}
                                onChange={(e) => handleItemChange(idx, "hsn", e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400/20 bg-white font-mono" />
                            </td>
                            <td className="py-3 px-3 border-b border-slate-100">
                              <input type="number" step="0.01" min="0" value={item.qty}
                                onChange={(e) => handleItemChange(idx, "qty", e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded text-sm text-right focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400/20 bg-white font-mono [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
                            </td>
                            <td className="py-3 px-3 border-b border-slate-100">
                              <input type="number" step="0.01" min="0" value={item.rate}
                                onChange={(e) => handleItemChange(idx, "rate", e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded text-sm text-right focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400/20 bg-white font-mono [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
                            </td>
                            <td className="py-3 px-3 border-b border-slate-100">
                              <div className="relative">
                                <input type="number" step="0.01" min="0" max="100" value={item.gstPercentage}
                                  onChange={(e) => handleItemChange(idx, "gstPercentage", e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-200 rounded text-sm text-right focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400/20 bg-white font-mono pr-7 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-3 px-3 text-slate-800 border-b border-slate-100 truncate">{item.itemName}</td>
                            <td className="py-3 px-3 text-center font-mono text-xs text-slate-500 border-b border-slate-100">{item.hsn || "-"}</td>
                            <td className="py-3 px-3 text-right font-mono text-sm text-slate-700 border-b border-slate-100">{item.qty}</td>
                            <td className="py-3 px-3 text-right font-mono text-sm text-slate-700 border-b border-slate-100">{fmt(item.rate)}</td>
                            <td className="py-3 px-3 text-right font-mono text-sm text-slate-600 border-b border-slate-100">{item.gstPercentage}%</td>
                          </>
                        )}
                        <td className={`py-3 px-3 text-right font-mono text-sm border-b border-slate-100 truncate ${isEditing ? "text-slate-700" : "text-slate-700"}`}>
                          {fmt(item.taxableValue)}
                        </td>
                        <td className={`py-3 px-3 text-right font-mono text-sm border-b border-slate-100 truncate ${isEditing ? "text-slate-600" : "text-slate-600"}`}>
                          {fmt(item.taxAmount)}
                        </td>
                        <td className={`py-3 px-3 text-right font-mono text-sm font-semibold border-b border-slate-100 truncate ${isEditing ? "text-slate-900" : "text-slate-900"}`}>
                          {fmt(item.total)}
                        </td>
                        {isEditing && (
                          <td className="py-3 px-2 text-center border-b border-slate-100">
                            <button onClick={() => removeItem(idx)}
                              className="p-1.5 hover:bg-red-50 rounded transition-colors text-slate-400 hover:text-red-500">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-5 pt-4 border-t border-slate-200">
                <div className="w-72 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal:</span>
                    <span className="font-mono font-medium text-slate-700">Rs. {fmt(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tax Amount:</span>
                    <span className="font-mono font-medium text-slate-700">Rs. {fmt(totals.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t-2 border-slate-800">
                    <span className="text-slate-800">Grand Total:</span>
                    <span className="font-mono text-slate-800">Rs. {fmt(totals.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-sm font-bold text-slate-800 mb-3">Notes</h2>
              {isEditing ? (
                <textarea name="notes" value={form.notes} onChange={handleFieldChange}
                  rows={2} className={inputClass + " resize-none"} placeholder="Additional notes..." />
              ) : form.notes ? (
                <p className="text-sm text-slate-600">{form.notes}</p>
              ) : (
                <p className="text-sm text-slate-400 italic">No notes</p>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sticky top-6">
              <h2 className="text-sm font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">Actions</h2>
              <div className="space-y-3">
                {isEditing ? (
                  <>
                    <button onClick={handleSave} disabled={saving}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-all shadow-sm">
                      {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? "Saving..." : "Save Invoice"}
                    </button>
                    <button onClick={() => setIsEditing(false)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-all">
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-all shadow-sm">
                    <Edit3 className="w-4 h-4" /> Update Invoice
                  </button>
                )}
                <button onClick={() => viewPDF(invoiceType)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm">
                  <FileText className="w-4 h-4" /> View PDF
                </button>
                <button onClick={() => downloadPDF(invoiceType)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-indigo-300 text-indigo-700 text-sm font-semibold rounded-lg hover:bg-indigo-50 transition-all">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
                <button onClick={() => downloadPDF("PROFORMA_INVOICE")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-emerald-300 text-emerald-700 text-sm font-semibold rounded-lg hover:bg-emerald-50 transition-all">
                  <Download className="w-4 h-4" /> Proforma PDF
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Items:</span>
                    <span className="font-semibold text-slate-800">{items.filter((i) => i.itemName.trim() && parseFloat(i.qty) > 0).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subtotal:</span>
                    <span className="font-mono text-slate-700">Rs. {fmt(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tax:</span>
                    <span className="font-mono text-slate-700">Rs. {fmt(totals.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-800 pt-2 border-t border-slate-200">
                    <span>Total:</span>
                    <span className="font-mono">Rs. {fmt(totals.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
