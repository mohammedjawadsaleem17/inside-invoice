import React from "react";
import { useAuth } from "../context/AuthContext";
import InvoicePDF from "./InvoicePDF";
import InvoiceTemplateVariants from "./InvoiceTemplateVariants";

const PAPER_WIDTHS = {
  A4_PORTRAIT: 794,
  A4_LANDSCAPE: 1123,
  A5: 559,
  LETTER: 816,
};

const InvoiceTemplateRenderer = React.forwardRef((props, ref) => {
  const { paperSize, template } = props;
  let globalTemplate;
  try {
    globalTemplate = useAuth().selectedTemplate;
  } catch {
    globalTemplate = typeof window !== "undefined"
      ? localStorage.getItem("invoice_template") || "template-1"
      : "template-1";
  }

  const templateId = template || globalTemplate;
  const width = PAPER_WIDTHS[paperSize] || 794;

  if (templateId === "template-1") {
    return (
      <div style={{ width: `${width}px`, overflow: "hidden" }}>
        <InvoicePDF ref={ref} {...props} />
      </div>
    );
  }

  return (
    <div style={{ width: `${width}px`, overflow: "hidden" }}>
      <InvoiceTemplateVariants ref={ref} theme={templateId} {...props} />
    </div>
  );
});

InvoiceTemplateRenderer.displayName = "InvoiceTemplateRenderer";
export default InvoiceTemplateRenderer;
