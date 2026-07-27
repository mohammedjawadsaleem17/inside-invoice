import { AlertCircle } from "lucide-react";

export default function ConfirmModal({ open, title, message, confirmLabel, confirmVariant, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel}></div>
      <div className="relative bg-white rounded-none sm:rounded-xl shadow-xl border border-slate-200 h-full sm:h-auto w-full sm:max-w-md p-6" style={{ paddingBottom: "env(safe-area-inset-bottom, 24px)" }}>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel}
            className="px-4 py-2 min-h-[44px] text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className={`px-4 py-2 min-h-[44px] text-sm font-medium text-white rounded-lg transition-colors ${
              confirmVariant === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"
            }`}>
            {confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
