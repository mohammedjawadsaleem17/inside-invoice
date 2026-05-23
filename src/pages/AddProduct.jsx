import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppNavbar from "../components/AppNavbar";
import { productAPI } from "../api/auth";
import toast from "react-hot-toast";
import { ArrowLeft, Package, Hash, IndianRupee, Percent, Save } from "lucide-react";

export default function AddProduct() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", hsn: "", rate: "", gstPercentage: "18" });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Product name is required"); return; }
    if (!parseFloat(form.rate) || parseFloat(form.rate) <= 0) { toast.error("Rate must be greater than 0"); return; }
    setSaving(true);
    try {
      await productAPI.create({
        name: form.name.trim(), hsn: form.hsn || undefined,
        rate: parseFloat(form.rate), gstPercentage: parseFloat(form.gstPercentage) || 0,
      });
      toast.success("Product created successfully");
      setForm({ name: "", hsn: "", rate: "", gstPercentage: "18" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400/30 focus:border-slate-400 bg-white transition-all";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide uppercase";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <AppNavbar />
      <div className="px-6 py-6">
        <button onClick={() => navigate("/dashboard")}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-all mb-4">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div>
            <label className={labelClass}>Product Name <span className="text-red-500">*</span></label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input name="name" value={form.name} onChange={handleChange} className={"pl-10 " + inputClass} placeholder="e.g. Service Fee" />
            </div>
          </div>
          <div>
            <label className={labelClass}>HSN/SAC</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input name="hsn" value={form.hsn} onChange={handleChange} className={"pl-10 font-mono uppercase tracking-wider " + inputClass} placeholder="e.g. 9983" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Rate (Rs.) <span className="text-red-500">*</span></label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="number" step="0.01" min="0" name="rate" value={form.rate} onChange={handleChange} className={"pl-10 " + inputClass} placeholder="e.g. 1000" />
            </div>
          </div>
          <div>
            <label className={labelClass}>GST %</label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="number" step="0.01" min="0" max="100" name="gstPercentage" value={form.gstPercentage} onChange={handleChange} className={"pl-10 " + inputClass} />
            </div>
          </div>
          <button type="submit" disabled={saving || !form.name.trim() || !form.rate}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-all shadow-sm">
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
