export async function processPrint(invoiceRef, documentType, filename, paperSizeId) {
  const { downloadInvoicePDF } = await import("../components/InvoicePDF");
  await downloadInvoicePDF(invoiceRef.current, filename, paperSizeId);
}
