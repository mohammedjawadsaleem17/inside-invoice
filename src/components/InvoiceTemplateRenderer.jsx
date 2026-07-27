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

  const wrapperStyle = { width: `${width}px`, maxWidth: "100%", overflow: "hidden" };

  if (templateId === "template-1") {
    return (
      <div style={{ overflowX: "auto", width: "100%" }}>
        <div style={wrapperStyle}>
          <InvoicePDF ref={ref} {...props} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto", width: "100%" }}>
      <div style={wrapperStyle}>
        <InvoiceTemplateVariants ref={ref} theme={templateId} {...props} />
      </div>
    </div>
  );
});

InvoiceTemplateRenderer.displayName = "InvoiceTemplateRenderer";
export default InvoiceTemplateRenderer;
