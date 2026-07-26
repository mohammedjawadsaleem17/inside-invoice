export async function processPrint(invoiceRef, documentType, filename) {
  const { downloadInvoicePDF } = await import("../components/InvoicePDF");
  await downloadInvoicePDF(invoiceRef.current, filename);
}
