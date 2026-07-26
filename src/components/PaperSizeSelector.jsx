import { PAPER_SIZE_LIST } from "../constants/paperSizes";

export default function PaperSizeSelector({ value, onChange, label = "Paper Size" }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{label}</h3>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400/30 focus:border-slate-400 bg-white"
      >
        {PAPER_SIZE_LIST.map((size) => (
          <option key={size.id} value={size.id}>
            {size.label}
          </option>
        ))}
      </select>
      <p className="text-[10px] text-slate-400 mt-1">
        {value === "THERMAL_58MM" || value === "THERMAL_80MM"
          ? "Uses browser print (best for POS printers)"
          : "Generates PDF"}
      </p>
    </div>
  );
}
