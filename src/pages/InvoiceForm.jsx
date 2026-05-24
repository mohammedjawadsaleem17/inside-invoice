import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppNavbar from "../components/AppNavbar";
import { invoiceAPI, customerAPI, businessAPI } from "../api/auth";
import toast from "react-hot-toast";
import {
  ArrowLeft, Plus, Trash2, Save, FileText, Download,
  User, Building2, Phone, MapPin, Hash,
  Package, FileSpreadsheet
} from "lucide-react";
import InvoicePDF, { downloadInvoicePDF } from "../components/InvoicePDF";
import { addToQueue, processQueue } from "../utils/retryQueue";

const emptyItem = { itemName: "", hsn: "", qty: "", rate: "", gstPercentage: "18", taxableValue: 0, taxAmount: 0, total: 0 };

export default function InvoiceForm() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedInvoiceNumber, setSavedInvoiceNumber] = useState(null);
  const [savedInvoiceId, setSavedInvoiceId] = useState(null);
  const [customInvoiceNumber, setCustomInvoiceNumber] = useState("");
  const ghostMode = localStorage.getItem("ghost_mode") === "true";
  const [sealType, setSealType] = useState(localStorage.getItem("seal_type") || "");
  const sealEnabled = localStorage.getItem("show_seal") === "true";
  const sealRequired = sealEnabled && !sealType;
  const invoiceRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  const [customer, setCustomer] = useState({
    name: "", email: "", phone: "", billingAddress: "", gstIn: "",
  });

  const [form, setForm] = useState({
    invoiceType: "TAX_INVOICE",
    invoiceDate: today,
    dueDate: "",
    placeOfSupply: "",
    deliveryNote: "",
    deliveryNoteDate: "",
    referenceNumber: "",
    buyerOrderNumber: "",
    dispatchDocNumber: "",
    dispatchedThrough: "",
    termsOfDelivery: "",
    paymentTerms: "",
    otherReferences: "",
    destination: "",
    notes: "",
  });

  const [items, setItems] = useState([{ ...emptyItem }]);

  const nextInvoiceNumber = business
    ? `INV-${new Date().getFullYear()}-${String(business.nextInvoiceSequence).padStart(3, "0")}`
    : "";

  useEffect(() => {
    if (business && ghostMode && !customInvoiceNumber) {
      setCustomInvoiceNumber(nextInvoiceNumber);
    }
  }, [business]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bRes = await businessAPI.getProfile();
        setBusiness(bRes.data.data);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    processQueue(
      (data) => customerAPI.create(data),
      (data) => invoiceAPI.create(data)
    ).then((count) => {
      if (count > 0) toast.success(`${count} pending invoice${count > 1 ? 's' : ''} synced`);
    });
  }, []);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (idx, field, value) => {
    const newItems = items.map((item, i) => {
      if (i !== idx) return item;
      const updated = { ...item, [field]: value };
      if (["qty", "rate", "gstPercentage"].includes(field)) {
        recalcItem(updated);
      }
      return updated;
    });
    setItems(newItems);
  };

  const recalcItem = (item) => {
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    const gst = parseFloat(item.gstPercentage) || 0;
    const taxableValue = qty * rate;
    const taxAmount = (taxableValue * gst) / 100;
    item.taxableValue = Math.round(taxableValue * 100) / 100;
    item.taxAmount = Math.round(taxAmount * 100) / 100;
    item.total = Math.round((taxableValue + taxAmount) * 100) / 100;
  };

  const recalcAll = () => {
    setItems(items.map((item) => {
      recalcItem(item);
      return { ...item };
    }));
  };

  const addItem = () => setItems([...items, { ...emptyItem }]);

  const removeItem = (idx) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

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
    if (!customer.name.trim()) { toast.error("Customer name is required"); return false; }
    if (!form.dueDate) { toast.error("Due date is required"); return false; }
    if (!form.invoiceDate) { toast.error("Invoice date is required"); return false; }
    const validItems = items.filter((i) => i.itemName.trim() && parseFloat(i.qty) > 0 && parseFloat(i.rate) > 0);
    if (validItems.length === 0) { toast.error("Add at least one item"); return false; }
    return true;
  };

  const buildPayload = (customerId) => ({
    customerId,
    invoiceType: form.invoiceType,
    invoiceDate: form.invoiceDate,
    dueDate: form.dueDate,
    placeOfSupply: form.placeOfSupply || undefined,
    paymentTerms: form.paymentTerms || undefined,
    notes: form.notes || undefined,
    deliveryNote: form.deliveryNote || undefined,
    deliveryNoteDate: form.deliveryNoteDate || undefined,
    referenceNumber: form.referenceNumber || undefined,
    buyerOrderNumber: form.buyerOrderNumber || undefined,
    dispatchDocNumber: form.dispatchDocNumber || undefined,
    dispatchedThrough: form.dispatchedThrough || undefined,
    termsOfDelivery: form.termsOfDelivery || undefined,
    otherReferences: form.otherReferences || undefined,
    destination: form.destination || undefined,
    ...(ghostMode && customInvoiceNumber.trim() ? { invoiceNumber: customInvoiceNumber.trim() } : {}),
    items: items.filter((i) => i.itemName.trim() && parseFloat(i.qty) > 0 && parseFloat(i.rate) > 0).map((i, idx) => ({
      sno: idx + 1, itemName: i.itemName, hsn: i.hsn || undefined,
      qty: parseFloat(i.qty), rate: parseFloat(i.rate), gstPercentage: parseFloat(i.gstPercentage) || 0,
    })),
  });

  const saveInvoice = async () => {
    recalcAll();
    const custRes = await customerAPI.create({
      name: customer.name,
      email: customer.email || undefined,
      phone: customer.phone || undefined,
      billingAddress: customer.billingAddress || undefined,
      gstIn: customer.gstIn || undefined,
    });
    const customerId = custRes.data.data?.id;
    let res;
    if (savedInvoiceId) {
      res = await invoiceAPI.update(savedInvoiceId, { ...buildPayload(customerId), status: "DRAFT" });
    } else {
      res = await invoiceAPI.create(buildPayload(customerId));
    }
    setSavedInvoiceId(res.data.data.id);
    setSavedInvoiceNumber(res.data.data.invoiceNumber);
    return res;
  };

  const saveToQueue = () => {
    const customerData = {
      name: customer.name,
      email: customer.email || undefined,
      phone: customer.phone || undefined,
      billingAddress: customer.billingAddress || undefined,
      gstIn: customer.gstIn || undefined,
    };
    const invoiceData = buildPayload(null);
    delete invoiceData.customerId;
    addToQueue({ customerData, invoiceData });
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const res = await saveInvoice();
      toast.success(`Invoice ${res.data.data.invoiceNumber} ${savedInvoiceId ? "updated" : "created"} successfully`);
    } catch (err) {
      saveToQueue();
      toast.error("Invoice saved locally. Will sync automatically.");
    } finally {
      setSaving(false);
    }
  };

  const generatePDF = async (type) => {
    if (!validate()) return;
    recalcAll();

    const expectedNumber = savedInvoiceNumber || customInvoiceNumber || nextInvoiceNumber || "";

    // 1. Generate and download PDF instantly (capture HTML component)
    setSaving(true);
    try {
      const filename = `${type === "PROFORMA_INVOICE" ? "Proforma_Invoice" : "Tax_Invoice"}_${form.invoiceDate || new Date().toISOString().split("T")[0]}.pdf`;
      // Small delay to let React render the hidden component with latest data
      await new Promise((r) => setTimeout(r, 100));
      await downloadInvoicePDF(invoiceRef.current, filename);
    } catch (err) {
      toast.error("Failed to generate PDF");
      setSaving(false);
      return;
    }

    // 2. Persist to backend asynchronously (fire-and-forget with retry queue)
    if (!savedInvoiceId) {
      try {
        const res = await saveInvoice();
        toast.success(`Invoice ${res.data.data.invoiceNumber} saved`);
      } catch {
        saveToQueue();
        toast.success("PDF downloaded. Invoice will be saved in background.");
      }
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400/30 focus:border-slate-400 bg-white transition-all";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide uppercase";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <AppNavbar />
      {/* Hidden Invoice PDF for capture */}
      <div style={{ position: "absolute", left: "-9999px", top: 0, pointerEvents: "none" }}>
        <InvoicePDF
          ref={invoiceRef}
          business={business}
          customer={customer}
          form={form}
          items={items}
          totals={totals}
          type={form.invoiceType}
          invoiceNumber={savedInvoiceNumber || customInvoiceNumber || nextInvoiceNumber || ""}
        />
      </div>
      <div className="pl-6 pr-12 py-6">
        <button onClick={() => navigate("/dashboard")}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-all mb-4">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-4 space-y-6">

            {/* Customer Details - Inline Fields */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
                <h2 className="text-sm font-bold text-slate-800">Customer Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>Customer Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input type="text" name="name" value={customer.name} onChange={handleCustomerChange}
                      className={"pl-10 " + inputClass} placeholder="e.g. Good Luck Enterprises" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <input type="email" name="email" value={customer.email} onChange={handleCustomerChange}
                      className={"pl-10 " + inputClass} placeholder="customer@email.com" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Phone <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input type="text" name="phone" value={customer.phone} onChange={handleCustomerChange}
                      className={"pl-10 " + inputClass} placeholder="e.g. 9036843735" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Billing Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                    <textarea name="billingAddress" value={customer.billingAddress} onChange={handleCustomerChange}
                      rows={2} className={"pl-10 " + inputClass + " resize-none"} placeholder="Full billing address" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>GSTIN</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input type="text" name="gstIn" value={customer.gstIn} onChange={handleCustomerChange}
                      className={"pl-10 font-mono uppercase tracking-wider " + inputClass} placeholder="e.g. 29AEQPJ1655J1Z0" />
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4 text-slate-600" />
                </div>
                <h2 className="text-sm font-bold text-slate-800">Invoice Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className={labelClass}>Type</label>
                  <select name="invoiceType" value={form.invoiceType} onChange={handleFieldChange} className={inputClass}>
                    <option value="TAX_INVOICE">Tax Invoice</option>
                    <option value="PROFORMA_INVOICE">Proforma Invoice</option>
                  </select>
                </div>
                {savedInvoiceNumber && (
                  <div>
                    <label className={labelClass}>Invoice No.</label>
                    <input type="text" value={savedInvoiceNumber} readOnly
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 font-mono cursor-not-allowed" />
                  </div>
                )}
                {!savedInvoiceNumber && (
                  <div>
                    <label className={labelClass}>Invoice No.</label>
                    {ghostMode ? (
                      <input type="text" value={customInvoiceNumber}
                        onChange={(e) => setCustomInvoiceNumber(e.target.value)}
                        className={inputClass + " font-mono"} placeholder="Enter invoice number" />
                    ) : (
                      <input type="text" value={nextInvoiceNumber} readOnly disabled
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 font-mono cursor-not-allowed" />
                    )}
                  </div>
                )}
                <div>
                  <label className={labelClass}>Date <span className="text-red-500">*</span></label>
                  <input type="date" name="invoiceDate" value={form.invoiceDate} onChange={handleFieldChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Due Date <span className="text-red-500">*</span></label>
                  <input type="date" name="dueDate" value={form.dueDate} onChange={handleFieldChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Place of Supply</label>
                  <input type="text" name="placeOfSupply" value={form.placeOfSupply} onChange={handleFieldChange} className={inputClass} placeholder="e.g. Karnataka" />
                </div>
                <div>
                  <label className={labelClass}>Destination</label>
                  <input type="text" name="destination" value={form.destination} onChange={handleFieldChange} className={inputClass} placeholder="e.g. Karnataka" />
                </div>
                <div>
                  <label className={labelClass}>Payment Terms</label>
                  <input type="text" name="paymentTerms" value={form.paymentTerms} onChange={handleFieldChange} className={inputClass} placeholder="e.g. Net 30" />
                </div>
              </div>
            </div>

            {/* References & Delivery */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Hash className="w-4 h-4 text-slate-600" />
                </div>
                <h2 className="text-sm font-bold text-slate-800">References & Delivery</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Delivery Note</label>
                  <input type="text" name="deliveryNote" value={form.deliveryNote} onChange={handleFieldChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Delivery Note Date</label>
                  <input type="date" name="deliveryNoteDate" value={form.deliveryNoteDate} onChange={handleFieldChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Reference No</label>
                  <input type="text" name="referenceNumber" value={form.referenceNumber} onChange={handleFieldChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Buyer Order No</label>
                  <input type="text" name="buyerOrderNumber" value={form.buyerOrderNumber} onChange={handleFieldChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Dispatch Doc No</label>
                  <input type="text" name="dispatchDocNumber" value={form.dispatchDocNumber} onChange={handleFieldChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Dispatched Through</label>
                  <input type="text" name="dispatchedThrough" value={form.dispatchedThrough} onChange={handleFieldChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Terms of Delivery</label>
                  <input type="text" name="termsOfDelivery" value={form.termsOfDelivery} onChange={handleFieldChange} className={inputClass} placeholder="e.g. Free delivery" />
                </div>
                <div>
                  <label className={labelClass}>Other References</label>
                  <input type="text" name="otherReferences" value={form.otherReferences} onChange={handleFieldChange} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Items Table - Professional */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-slate-600" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-800">Items</h2>
                </div>
                <button onClick={addItem}
                  className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all shadow-sm">
                  <Plus className="w-3.5 h-3.5" /> Add Item
                </button>
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
                      <th className="text-white w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className={`${idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"} hover:bg-blue-50/20 transition-colors`}>
                        <td className="py-3 px-3 text-center text-slate-400 font-mono text-xs border-b border-slate-100">{idx + 1}</td>
                        <td className="py-3 px-3 border-b border-slate-100">
                          <input type="text" value={item.itemName}
                            onChange={(e) => handleItemChange(idx, "itemName", e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400/20 bg-white"
                            placeholder="Item name" />
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
                        <td className="py-3 px-3 text-right font-mono text-sm text-slate-700 border-b border-slate-100 truncate">
                          {(parseFloat(item.taxableValue) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-sm text-slate-600 border-b border-slate-100 truncate">
                          {(parseFloat(item.taxAmount) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-sm font-semibold text-slate-900 border-b border-slate-100 truncate">
                          {(parseFloat(item.total) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-2 text-center border-b border-slate-100">
                          <button onClick={() => removeItem(idx)}
                            className="p-1.5 hover:bg-red-50 rounded transition-colors text-slate-400 hover:text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200 flex justify-end">
                <div className="w-72 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal:</span>
                    <span className="font-mono font-medium text-slate-700">Rs. {totals.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tax Amount:</span>
                    <span className="font-mono font-medium text-slate-700">Rs. {totals.taxAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t-2 border-slate-800">
                    <span className="text-slate-800">Grand Total:</span>
                    <span className="font-mono text-slate-800">Rs. {totals.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-sm font-bold text-slate-800 mb-3">Notes</h2>
              <textarea name="notes" value={form.notes} onChange={handleFieldChange}
                rows={2} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400/30 focus:border-slate-400 resize-none"
                placeholder="Additional notes or remarks..." />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1 space-y-4">
            {sealEnabled && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Company Stamp</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sealType"
                      value="round"
                      checked={sealType === "round"}
                      onChange={() => {
                        setSealType("round");
                        localStorage.setItem("seal_type", "round");
                      }}
                      className="accent-blue-500"
                    />
                    <span className="text-sm text-slate-700">Round Seal</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sealType"
                      value="stamp"
                      checked={sealType === "stamp"}
                      onChange={() => {
                        setSealType("stamp");
                        localStorage.setItem("seal_type", "stamp");
                      }}
                      className="accent-blue-500"
                    />
                    <span className="text-sm text-slate-700">Rubber Stamp</span>
                  </label>
                </div>
              </div>
            )}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sticky top-6">
              <h2 className="text-sm font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">Actions</h2>
              <div className="space-y-3">
                <button onClick={handleSave} disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-all shadow-sm">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving..." : "Save Invoice"}
                </button>
                <button onClick={() => generatePDF("TAX_INVOICE")} disabled={sealRequired}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm">
                  <Download className="w-4 h-4" /> Tax Invoice PDF
                </button>
                <button onClick={() => generatePDF("PROFORMA_INVOICE")} disabled={sealRequired}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-sm">
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
                    <span className="font-mono text-slate-700">Rs. {totals.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tax:</span>
                    <span className="font-mono text-slate-700">Rs. {totals.taxAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-800 pt-2 border-t border-slate-200">
                    <span>Total:</span>
                    <span className="font-mono">Rs. {totals.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {business && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Business</h3>
                  <p className="text-xs text-slate-600 font-medium">{business.businessName}</p>
                  {business.gstIn && <p className="text-xs text-slate-400 font-mono">GST: {business.gstIn}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
