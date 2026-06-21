import React from "react";
import { useAuth } from "../context/AuthContext";
import InvoicePDF from "./InvoicePDF";
import InvoiceTemplateVariants from "./InvoiceTemplateVariants";

const InvoiceTemplateRenderer = React.forwardRef((props, ref) => {
  let templateId;
  try {
    templateId = useAuth().selectedTemplate;
  } catch {
    templateId = typeof window !== "undefined"
      ? localStorage.getItem("invoice_template") || "template-1"
      : "template-1";
  }

  if (templateId === "template-1") {
    return <InvoicePDF ref={ref} {...props} />;
  }

  return <InvoiceTemplateVariants ref={ref} theme={templateId} {...props} />;
});

InvoiceTemplateRenderer.displayName = "InvoiceTemplateRenderer";
export default InvoiceTemplateRenderer;
