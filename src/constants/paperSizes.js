export const PAPER_SIZES = {
  A4_PORTRAIT: {
    id: "A4_PORTRAIT",
    label: "A4 Portrait",
    width: "210mm",
    height: "297mm",
    contentWidth: 714,
    thermal: false,
  },
  A4_LANDSCAPE: {
    id: "A4_LANDSCAPE",
    label: "A4 Landscape",
    width: "297mm",
    height: "210mm",
    contentWidth: 1020,
    thermal: false,
  },
  A5: {
    id: "A5",
    label: "A5",
    width: "148mm",
    height: "210mm",
    contentWidth: 480,
    thermal: false,
  },
  LETTER: {
    id: "LETTER",
    label: "Letter",
    width: "215.9mm",
    height: "279.4mm",
    contentWidth: 730,
    thermal: false,
  },
  THERMAL_58MM: {
    id: "THERMAL_58MM",
    label: "Thermal 58mm (2\")",
    width: "58mm",
    height: "auto",
    contentWidth: 384,
    thermal: true,
  },
  THERMAL_80MM: {
    id: "THERMAL_80MM",
    label: "Thermal 80mm (3\")",
    width: "80mm",
    height: "auto",
    contentWidth: 576,
    thermal: true,
  },
};

export const PAPER_SIZE_LIST = Object.values(PAPER_SIZES);

export const ALL_TEMPLATES = [
  { id: "template-1", label: "Original", desc: "Default classic black border layout" },
  { id: "template-3", label: "Corporate Blue", desc: "Professional navy blue accents" },
  { id: "template-5", label: "Minimalist", desc: "Borderless design with maximum whitespace" },
  { id: "template-6", label: "Nature Green", desc: "Warm green tones with organic feel" },
  { id: "template-8", label: "Premium Gold", desc: "Elegant navy and gold luxury style" },
  { id: "template-10", label: "Slate Professional", desc: "Clean slate-grey corporate style" },
  { id: "template-11", label: "Teal Modern", desc: "Fresh teal accents with mint undertones" },
  { id: "template-12", label: "Side by Side", desc: "Seller and buyer side by side" },
  { id: "template-13", label: "Stacked", desc: "Full-width sections stacked vertically" },
  { id: "template-16", label: "Modern", desc: "Seller + metadata side by side, buyer below" },
  { id: "template-17", label: "Centered", desc: "Centered formal layout with elegant symmetry" },
  { id: "template-18", label: "Executive", desc: "Company name in bold header band" },
  { id: "template-19", label: "Divided", desc: "Three-column grid: seller | buyer | details" },
  { id: "template-21", label: "Letterhead", desc: "Formal letter style with company letterhead" },
  { id: "template-23", label: "Clean White", desc: "Ultra minimal greyscale" },
];

export const DEFAULT_PRINT_SETTINGS = {
  TAX_INVOICE: { paperSize: "A4_PORTRAIT", template: "template-1" },
  PROFORMA_INVOICE: { paperSize: "A4_PORTRAIT", template: "template-1" },
  QUOTATION: { paperSize: "A4_PORTRAIT", template: "template-1" },
  PURCHASE_ORDER: { paperSize: "A4_PORTRAIT", template: "template-1" },
};

export function getPrintSettings() {
  try {
    const stored = localStorage.getItem("print_settings");
    if (!stored) return structuredClone(DEFAULT_PRINT_SETTINGS);
    const parsed = JSON.parse(stored);
    const result = {};
    for (const key of Object.keys(DEFAULT_PRINT_SETTINGS)) {
      const val = parsed[key];
      if (!val) {
        result[key] = structuredClone(DEFAULT_PRINT_SETTINGS[key]);
      } else if (typeof val === "string") {
        result[key] = { paperSize: val, template: parsed[key + "_template"] || "template-1" };
      } else {
        result[key] = { ...DEFAULT_PRINT_SETTINGS[key], ...val };
      }
    }
    return result;
  } catch {
    return structuredClone(DEFAULT_PRINT_SETTINGS);
  }
}

export function savePrintSettings(settings) {
  localStorage.setItem("print_settings", JSON.stringify(settings));
}

const PDF_DIMENSIONS = {
  A4_PORTRAIT:  { orientation: "p", format: "a4",     pageW: 210,    pageH: 297,    contentW: 190,   left: 10,  usableH: 277 },
  A4_LANDSCAPE: { orientation: "l", format: "a4",     pageW: 297,    pageH: 210,    contentW: 277,   left: 10,  usableH: 190 },
  A5:           { orientation: "p", format: "a5",     pageW: 148,    pageH: 210,    contentW: 128,   left: 10,  usableH: 190 },
  LETTER:       { orientation: "p", format: "letter", pageW: 215.9,  pageH: 279.4,  contentW: 195.9, left: 10,  usableH: 262 },
  THERMAL_58MM: { orientation: "p", format: [58, 200], pageW: 58,    pageH: 200,    contentW: 48,    left: 5,   usableH: 200 },
  THERMAL_80MM: { orientation: "p", format: [80, 200], pageW: 80,    pageH: 200,    contentW: 70,    left: 5,   usableH: 200 },
};

export function getPaperDimensions(paperSizeId) {
  return PDF_DIMENSIONS[paperSizeId] || PDF_DIMENSIONS.A4_PORTRAIT;
}
