import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppNavbar from "../components/AppNavbar";
import InvoicePDF from "../components/InvoicePDF";
import InvoiceTemplateVariants, { TEMPLATE_THEMES } from "../components/InvoiceTemplateVariants";
import { ArrowLeft, Check, X, Eye, FileText } from "lucide-react";
import toast from "react-hot-toast";

const ALL_TEMPLATES = [
  {
    id: "template-1",
    label: "Original",
    desc: "Default invoice template with classic black borders and clean layout",
    color: "#000000",
  },
  ...Object.values(TEMPLATE_THEMES),
];

const sampleBusiness = {
  businessName: "Acme Enterprises",
  addressLine1: "42, Industrial Layout",
  addressLine2: "Electronics City",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560100",
  phone: "+91 98765 43210",
  email: "info@acme.in",
  gstIn: "29ABCDE1234F1Z5",
};

const sampleCustomer = {
  name: "Good Luck Traders",
  billingAddress: "15, MG Road, Ashok Nagar, Bengaluru - 560001",
  phone: "+91 87654 32109",
  email: "orders@goodluck.in",
  gstIn: "29PQRST5678K1Z3",
};

const sampleForm = {
  invoiceDate: "2026-06-15",
  dueDate: "2026-07-15",
  placeOfSupply: "Karnataka",
  deliveryNote: "DN-2026-001",
  deliveryNoteDate: "2026-06-14",
  referenceNumber: "REF-001",
  buyerOrderNumber: "PO-2026-042",
  dispatchDocNumber: "DD-2026-001",
  dispatchedThrough: "Express Logistics",
  termsOfDelivery: "Free delivery",
  paymentTerms: "Net 30",
  otherReferences: "Quotation Q-2026-018",
  destination: "Bengaluru",
};

const sampleItems = [
  { itemName: "Premium Office Chair", hsn: "940130", qty: "5", rate: "8500", gstPercentage: "18", taxableValue: 42500, taxAmount: 7650, total: 50150 },
  { itemName: "Standing Desk (Electric)", hsn: "940310", qty: "3", rate: "22500", gstPercentage: "18", taxableValue: 67500, taxAmount: 12150, total: 79650 },
  { itemName: "LED Monitor 27 inch", hsn: "852852", qty: "8", rate: "18500", gstPercentage: "18", taxableValue: 148000, taxAmount: 26640, total: 174640 },
];

const sampleTotals = {
  subtotal: 258000,
  taxAmount: 46440,
  grandTotal: 304440,
};

function TemplatePreview({ templateId }) {
  const previewRef = useRef(null);

  const commonProps = {
    business: sampleBusiness,
    customer: sampleCustomer,
    form: sampleForm,
    items: sampleItems,
    totals: sampleTotals,
    discountPercent: "0",
    type: "TAX_INVOICE",
    invoiceNumber: "INV-2026-001",
  };

  if (templateId === "template-1") {
    return <InvoicePDF ref={previewRef} {...commonProps} />;
  }
  return <InvoiceTemplateVariants ref={previewRef} theme={templateId} {...commonProps} />;
}

function TemplateCard({ template, isSelected, onSelect, onPreview }) {
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const w = containerRef.current.offsetWidth;
      setScale(w / 832);
    }
  }, []);

  return (
    <div
      className={`relative bg-white rounded-xl shadow-sm border-2 transition-all cursor-pointer overflow-hidden flex flex-col ${
        isSelected ? "border-indigo-500 ring-2 ring-indigo-200" : "border-slate-200 hover:border-slate-300 hover:shadow-md"
      }`}
    >
      <div className="px-4 pt-4 pb-0 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800">{template.label}</h3>
          {isSelected && (
            <span className="flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              <Check className="w-3 h-3" /> Active
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{template.desc}</p>
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-lg border border-slate-100 bg-white"
          style={{ height: "220px" }}
          onClick={() => onPreview(template.id)}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              width: "832px",
            }}
            className="pointer-events-none"
          >
            <TemplatePreview templateId={template.id} />
          </div>
        </div>
      </div>
      <div className="px-4 py-3 border-t border-slate-100 mt-3 flex items-center gap-2 justify-between">
        <button
          onClick={() => onPreview(template.id)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> Preview
        </button>
        <button
          onClick={() => onSelect(template.id)}
          className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-all ${
            isSelected
              ? "bg-indigo-100 text-indigo-700 cursor-default"
              : "bg-slate-800 text-white hover:bg-slate-700"
          }`}
        >
          {isSelected ? "Selected" : "Select"}
        </button>
      </div>
    </div>
  );
}

export default function InvoiceTemplates() {
  const navigate = useNavigate();
  const { selectedTemplate, updateTemplate } = useAuth();
  const [selected, setSelected] = useState(selectedTemplate);
  const [previewId, setPreviewId] = useState(null);

  const handleSelect = async (id) => {
    setSelected(id);
    try {
      await updateTemplate(id);
      toast.success(`"${ALL_TEMPLATES.find((t) => t.id === id)?.label}" template selected`);
    } catch {
      toast.error("Failed to save template preference");
      setSelected(selectedTemplate);
    }
  };

  const previewTemplate = ALL_TEMPLATES.find((t) => t.id === previewId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <AppNavbar />
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Invoice Templates</h1>
              <p className="text-xs text-slate-500 mt-0.5">Choose a template style for your invoices</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ALL_TEMPLATES.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              isSelected={selected === t.id}
              onSelect={handleSelect}
              onPreview={setPreviewId}
            />
          ))}
        </div>
      </div>

      {/* Full-size Preview Modal */}
      {previewId && previewTemplate && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-10"
          onClick={() => setPreviewId(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewId(null)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 bg-white rounded-full shadow-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden" style={{ maxWidth: "900px" }}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-600" />
                  <h2 className="text-base font-bold text-slate-800">{previewTemplate.label} Template</h2>
                </div>
                <div className="flex items-center gap-2">
                  {selected !== previewId && (
                    <button
                      onClick={() => { handleSelect(previewId); setPreviewId(null); }}
                      className="text-xs font-semibold px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all"
                    >
                      Select This Template
                    </button>
                  )}
                  {selected === previewId && (
                    <span className="flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg">
                      <Check className="w-3.5 h-3.5" /> Currently Active
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6 overflow-auto max-h-[80vh]">
                <TemplatePreview templateId={previewId} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
