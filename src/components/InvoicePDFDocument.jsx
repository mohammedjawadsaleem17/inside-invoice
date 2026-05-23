import { Document, Page, View, Text, Image, StyleSheet, Svg, Circle, G, Text as SvgText, pdf } from "@react-pdf/renderer";

const numberToWords = (num) => {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const convert = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
    if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
    return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
  };
  const whole = Math.floor(num);
  const decimal = Math.round((num - whole) * 100);
  let result = convert(whole) + " Rupees";
  if (decimal > 0) result += " and " + convert(decimal) + " Paise";
  return result + " Only";
};

const formatINR = (val) => {
  const n = parseFloat(val) || 0;
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const brdB = { borderBottomWidth: 0.5, borderBottomColor: "#000", borderBottomStyle: "solid" };
const brdR = { borderRightWidth: 0.5, borderRightColor: "#000", borderRightStyle: "solid" };
const brdT = { borderTopWidth: 0.5, borderTopColor: "#000", borderTopStyle: "solid" };

const styles = StyleSheet.create({
  page: { padding: 25, fontFamily: "Helvetica", fontSize: 7.5, color: "#000", lineHeight: 1.35 },
  titleRow: { flexDirection: "row", borderBottom: "0.5 solid #000" },
  titleText: { flex: 1, textAlign: "center", fontSize: 11, fontWeight: "bold", padding: "5 0" },
  titleRight: { position: "absolute", right: 10, fontSize: 8, fontStyle: "italic", fontWeight: "normal" },

  topRow: { flexDirection: "row" },
  leftPane: { width: "57%", borderLeft: "0.5 solid #000", borderRight: "0.5 solid #000" },
  rightPane: { width: "43%", borderRight: "0.5 solid #000" },

  bizName: { fontSize: 14, fontWeight: "bold", marginBottom: 3 },
  bizDetail: { fontSize: 7.5, lineHeight: 1.45 },
  sectionPad1: { padding: "8 8 5 10" },
  sectionPad2: { padding: "6 10" },

  buyerLabel: { fontSize: 8, fontWeight: "bold", marginBottom: 3 },
  buyerName: { fontSize: 12, fontWeight: "bold", marginBottom: 2 },

  rightLabel: { width: "52%", ...brdB, ...brdR, padding: "4 5", fontSize: 7.5 },
  rightValue: { width: "48%", ...brdB, padding: "4 5", fontSize: 7.5, fontWeight: "bold" },
  rightLabelLast: { width: "52%", ...brdR, padding: "4 5", fontSize: 7.5 },
  rightValueLast: { width: "48%", padding: "4 5", fontSize: 7.5, fontWeight: "bold" },

  itemTable: { marginTop: 4, borderLeft: "0.5 solid #000", borderRight: "0.5 solid #000" },
  itemHeaderRow: { flexDirection: "row", backgroundColor: "#f0f0f0", ...brdT },
  itemHeaderCell: { padding: "2 2", fontSize: 7.5, fontWeight: "bold", textAlign: "center", ...brdR, ...brdB },
  itemRow: { flexDirection: "row" },
  itemCell: { padding: "2 3", fontSize: 7.5, ...brdR, ...brdB },

  gstSummary: { borderLeft: "0.5 solid #000", borderRight: "0.5 solid #000", ...brdB, padding: "3 8", alignItems: "flex-end" },
  gstLine: { flexDirection: "row", fontSize: 7.5, marginBottom: 1 },
  gstLabel: { marginRight: 12 },

  amountRow: { flexDirection: "row", borderLeft: "0.5 solid #000", borderRight: "0.5 solid #000", ...brdB },
  wordsPane: { width: "72%", ...brdR, padding: "5 8" },
  totalPane: { width: "28%", padding: "5 8" },
  wordsLabel: { fontSize: 7.5, fontWeight: "bold", marginBottom: 2 },
  wordsValue: { fontSize: 8, fontWeight: "bold" },
  totalLabel: { fontSize: 7.5, fontWeight: "bold", marginBottom: 1 },
  totalValue: { fontSize: 14, fontWeight: "bold", marginVertical: 1 },
  eoe: { fontSize: 7.5, fontStyle: "italic", textAlign: "right" },

  taxTable: { borderLeft: "0.5 solid #000", borderRight: "0.5 solid #000", ...brdB },
  taxHeaderTop: { flexDirection: "row" },
  taxHeaderBottom: { flexDirection: "row" },
  taxHeaderCell: { padding: "2 2", fontSize: 7.5, fontWeight: "bold", textAlign: "center", border: "0.5 solid #000" },
  taxRow: { flexDirection: "row" },
  taxCell: { padding: "2 3", fontSize: 7.5, border: "0.5 solid #000" },
  taxTotalRow: { flexDirection: "row", backgroundColor: "#f0f0f0" },
  taxTotalCell: { padding: "2 3", fontSize: 7.5, fontWeight: "bold", border: "0.5 solid #000" },

  taxWordsRow: { borderLeft: "0.5 solid #000", borderRight: "0.5 solid #000", ...brdB, padding: "4 8" },
  taxWords: { fontSize: 7.5, fontWeight: "bold" },

  bottomRow: { flexDirection: "row", borderLeft: "0.5 solid #000", borderRight: "0.5 solid #000", ...brdB },
  bankPane: { width: "37%", ...brdR, padding: "4 5" },
  declPane: { width: "33%", ...brdR, padding: "4 5" },
  signPane: { width: "30%", padding: "4 5" },
  bottomHeader: { fontSize: 8, fontWeight: "bold", ...brdB, paddingBottom: 2, marginBottom: 3 },
  bankLine: { fontSize: 7.5, lineHeight: 1.5 },

  footerRow: { padding: "4 8", borderLeft: "0.5 solid #000", borderRight: "0.5 solid #000", ...brdB },
  footerText: { fontSize: 7.5, fontWeight: "bold", textAlign: "center" },
  footerSub: { fontSize: 7.5, textAlign: "center", marginTop: 1 },
  sealContainer: { alignItems: "flex-end", marginTop: 6 },
});

function SealSvg({ size = 60 }) {
  return (
    <Svg viewBox="0 0 300 300" width={size} height={size}>
      <Circle cx="150" cy="150" r="148" fill="none" stroke="#0A4BFF" strokeWidth={3.5} />
      <Circle cx="150" cy="150" r="125" fill="none" stroke="#0A4BFF" strokeWidth={2} />
      <G>
        <SvgText x={150} y={143} textAnchor="middle" fill="#0A4BFF" fontSize={28} fontFamily="Courier" fontWeight="bold">
          SEAL
        </SvgText>
        <SvgText x={150} y={173} textAnchor="middle" fill="#0A4BFF" fontSize={24} fontFamily="Courier" fontWeight="bold">
          {new Date().getFullYear()}
        </SvgText>
      </G>
    </Svg>
  );
}

export async function downloadInvoice(data, filename) {
  const blob = await pdf(<InvoicePDFDocument {...data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function InvoicePDFDocument({ business, customer, form, items, totals, type, invoiceNumber }) {
  const displayInvNo = invoiceNumber || "DRAFT";
  const validItems = (items || []).filter((i) => i.itemName?.trim() && parseFloat(i.qty) > 0);
  const sigSrc = business?.signature ? `data:image/png;base64,${business.signature}` : null;

  let cgstTotal = 0, sgstTotal = 0;
  validItems.forEach((item) => {
    const gst = parseFloat(item.gstPercentage) || 0;
    const taxable = parseFloat(item.taxableValue) || parseFloat(item.qty || 0) * parseFloat(item.rate || 0);
    const halfGst = gst / 2;
    cgstTotal += (taxable * halfGst) / 100;
    sgstTotal += (taxable * halfGst) / 100;
  });

  const rightLabels = [
    "Invoice No.", "Delivery Note", "Reference No. & Date.", "Buyer's Order No.",
    "Dispatch Doc No.", "Dispatched through", "Terms of Delivery", "Payment Date",
    "Mode/Terms of Payment", "Other References", "Dated", "Delivery Note Date", "Destination",
  ];
  const rightValues = [
    displayInvNo, form?.deliveryNote,
    form?.referenceNumber ? `${form.referenceNumber} / ${form.invoiceDate || ""}` : form?.invoiceDate,
    form?.buyerOrderNumber, form?.dispatchDocNumber, form?.dispatchedThrough,
    form?.termsOfDelivery, form?.dueDate, form?.paymentTerms, form?.otherReferences,
    form?.invoiceDate, form?.deliveryNoteDate, form?.destination,
  ];

  const showSeal = typeof window !== "undefined" && localStorage.getItem("show_seal") === "true";

  const colW = (pct) => `${pct}%`;

  const itemCols = [
    { pct: 7.1, key: "sl", align: "center" },
    { pct: 35.8, key: "desc", align: "left" },
    { pct: 10.4, key: "hsn", align: "center" },
    { pct: 8.5, key: "gst", align: "center" },
    { pct: 9.8, key: "qty", align: "center" },
    { pct: 10.4, key: "rate", align: "center" },
    { pct: 5.7, key: "per", align: "center" },
    { pct: 12.3, key: "amt", align: "right" },
  ];

  const itemHeaders = ["Sl No", "Description of Goods", "HSN/SAC", "GST Rate", "Quantity", "Rate (Incl. of Tax)", "per", "Amount"];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.titleRow}>
          <View style={styles.titleText}>
            <Text>{type === "PROFORMA_INVOICE" ? "Proforma Invoice" : "Tax Invoice"}</Text>
            <Text style={styles.titleRight}>(ORIGINAL FOR RECIPIENT)</Text>
          </View>
        </View>

        <View style={styles.topRow}>
          <View style={styles.leftPane}>
            <View style={styles.sectionPad1}>
              <Text style={styles.bizName}>{business?.businessName || "Business Name"}</Text>
              <Text style={styles.bizDetail}>
                {business?.addressLine1 || ""}{business?.addressLine2 ? ", " + business.addressLine2 : ""}
              </Text>
              <Text style={styles.bizDetail}>
                {[business?.city, business?.state, business?.pincode].filter(Boolean).join(", ")}
              </Text>
              {business?.phone ? <Text style={styles.bizDetail}>Ph: {business.phone}</Text> : null}
              {business?.email ? <Text style={styles.bizDetail}>{business.email}</Text> : null}
              {business?.gstIn ? <Text style={styles.bizDetail}>GSTIN/UIN: {business.gstIn}</Text> : null}
              {business?.state ? <Text style={styles.bizDetail}>State: {business.state} Code: {business.gstIn?.substring(0, 2) || ""}</Text> : null}
            </View>
            <View style={{ ...brdT, ...styles.sectionPad2 }}>
              <Text style={styles.buyerLabel}>Buyer (Bill to)</Text>
              <Text style={styles.buyerName}>{customer?.name || "Customer Name"}</Text>
              {customer?.billingAddress ? <Text style={styles.bizDetail}>{customer.billingAddress}</Text> : null}
              {customer?.phone ? <Text style={styles.bizDetail}>Ph: {customer.phone}</Text> : null}
              {customer?.email ? <Text style={styles.bizDetail}>{customer.email}</Text> : null}
              {customer?.gstIn ? <Text style={styles.bizDetail}>GSTIN/UIN: {customer.gstIn}</Text> : null}
              {customer?.state ? <Text style={styles.bizDetail}>State: {customer.state}</Text> : null}
            </View>
          </View>
          <View style={styles.rightPane}>
            {rightLabels.map((label, idx) => {
              const isLast = idx === rightLabels.length - 1;
              return (
                <View key={idx} style={{ flexDirection: "row" }}>
                  <Text style={isLast ? styles.rightLabelLast : styles.rightLabel}>{label}</Text>
                  <Text style={isLast ? styles.rightValueLast : styles.rightValue}>{rightValues[idx] || "-"}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ borderLeft: "0.5 solid #000", borderRight: "0.5 solid #000", ...brdT, height: 5 }} />

        <View style={styles.itemTable}>
          <View style={styles.itemHeaderRow}>
            {itemCols.map((col, idx) => (
              <Text key={idx} style={[styles.itemHeaderCell, { width: colW(col.pct), textAlign: "center" }]}>
                {itemHeaders[idx]}
              </Text>
            ))}
          </View>
          {validItems.length > 0 ? validItems.map((item, idx) => (
            <View key={idx} style={styles.itemRow} wrap={false}>
              {[
                { a: "center", v: String(idx + 1), pct: 7.1 },
                { a: "left", v: item.itemName, pct: 35.8 },
                { a: "center", v: item.hsn || "-", pct: 10.4 },
                { a: "center", v: (parseFloat(item.gstPercentage) || 0).toFixed(1) + "%", pct: 8.5 },
                { a: "center", v: parseFloat(item.qty).toFixed(2), pct: 9.8 },
                { a: "center", v: formatINR(item.rate), pct: 10.4 },
                { a: "center", v: "Piece", pct: 5.7 },
                { a: "right", v: formatINR(item.total), pct: 12.3 },
              ].map((c, ci) => (
                <Text key={ci} style={[styles.itemCell, { width: colW(c.pct), textAlign: c.a }]}>
                  {c.v}
                </Text>
              ))}
            </View>
          )) : (
            <View style={styles.itemRow}>
              <Text style={[styles.itemCell, { width: "100%", textAlign: "center" }]}>No items</Text>
            </View>
          )}
        </View>

        <View style={styles.gstSummary}>
          {totals.taxAmount > 0 ? (
            <>
              <View style={styles.gstLine}>
                <Text style={styles.gstLabel}>CGST</Text>
                <Text style={{ fontWeight: "bold" }}>{formatINR(cgstTotal)}</Text>
              </View>
              <View style={styles.gstLine}>
                <Text style={styles.gstLabel}>SGST</Text>
                <Text style={{ fontWeight: "bold" }}>{formatINR(sgstTotal)}</Text>
              </View>
            </>
          ) : null}
          <View style={styles.gstLine}>
            <Text style={styles.gstLabel}>Round Off</Text>
            <Text style={{ fontWeight: "bold" }}>0.00</Text>
          </View>
        </View>

        <View style={styles.amountRow}>
          <View style={styles.wordsPane}>
            <Text style={styles.wordsLabel}>Amount Chargeable (in words)</Text>
            <Text style={styles.wordsValue}>
              {totals.grandTotal > 0 ? numberToWords(totals.grandTotal) : "Zero Rupees Only"}
            </Text>
          </View>
          <View style={styles.totalPane}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>Rs: {formatINR(totals.grandTotal)}</Text>
            <Text style={styles.eoe}>E. & O.E</Text>
          </View>
        </View>

        <View style={styles.taxTable}>
          <View style={styles.taxHeaderTop}>
            <Text style={[styles.taxHeaderCell, { width: "16%" }]}>HSN/SAC</Text>
            <Text style={[styles.taxHeaderCell, { width: "18%" }]}>Taxable Value</Text>
            <Text style={[styles.taxHeaderCell, { width: "24%" }]} colSpan={2}>CGST</Text>
            <Text style={[styles.taxHeaderCell, { width: "28%" }]}>SGST/UTGST</Text>
            <Text style={[styles.taxHeaderCell, { width: "14%" }]}>Total Tax Amount</Text>
          </View>
          <View style={styles.taxHeaderBottom}>
            <Text style={[styles.taxHeaderCell, { width: "16%" }]}></Text>
            <Text style={[styles.taxHeaderCell, { width: "18%" }]}></Text>
            <Text style={[styles.taxHeaderCell, { width: "12%" }]}>Rate</Text>
            <Text style={[styles.taxHeaderCell, { width: "12%" }]}>Amount</Text>
            <Text style={[styles.taxHeaderCell, { width: "14%" }]}>Rate</Text>
            <Text style={[styles.taxHeaderCell, { width: "14%" }]}>Amount</Text>
            <Text style={[styles.taxHeaderCell, { width: "14%" }]}></Text>
          </View>
          {validItems.map((item, idx) => {
            const gst = parseFloat(item.gstPercentage) || 0;
            const halfGst = gst / 2;
            const taxable = parseFloat(item.taxableValue) || 0;
            const taxAmt = parseFloat(item.taxAmount) || 0;
            return (
              <View key={idx} style={styles.taxRow} wrap={false}>
                <Text style={[styles.taxCell, { width: "16%", textAlign: "center" }]}>{item.hsn || "-"}</Text>
                <Text style={[styles.taxCell, { width: "18%", textAlign: "right" }]}>{formatINR(taxable)}</Text>
                <Text style={[styles.taxCell, { width: "12%", textAlign: "center" }]}>{halfGst.toFixed(1)}%</Text>
                <Text style={[styles.taxCell, { width: "12%", textAlign: "right" }]}>{formatINR(taxAmt / 2)}</Text>
                <Text style={[styles.taxCell, { width: "14%", textAlign: "center" }]}>{halfGst.toFixed(1)}%</Text>
                <Text style={[styles.taxCell, { width: "14%", textAlign: "right" }]}>{formatINR(taxAmt / 2)}</Text>
                <Text style={[styles.taxCell, { width: "14%", textAlign: "right", fontWeight: "bold" }]}>{formatINR(taxAmt)}</Text>
              </View>
            );
          })}
          <View style={styles.taxTotalRow}>
            <Text style={[styles.taxTotalCell, { width: "16%", textAlign: "center" }]}>Total</Text>
            <Text style={[styles.taxTotalCell, { width: "18%", textAlign: "right" }]}>{formatINR(totals.subtotal)}</Text>
            <Text style={[styles.taxTotalCell, { width: "12%", textAlign: "center" }]}></Text>
            <Text style={[styles.taxTotalCell, { width: "12%", textAlign: "right" }]}>{formatINR(totals.taxAmount / 2)}</Text>
            <Text style={[styles.taxTotalCell, { width: "14%", textAlign: "center" }]}></Text>
            <Text style={[styles.taxTotalCell, { width: "14%", textAlign: "right" }]}>{formatINR(totals.taxAmount / 2)}</Text>
            <Text style={[styles.taxTotalCell, { width: "14%", textAlign: "right" }]}>{formatINR(totals.taxAmount)}</Text>
          </View>
        </View>

        <View style={styles.taxWordsRow}>
          <Text style={styles.taxWords}>
            Tax Amount (in words): {totals.taxAmount > 0 ? numberToWords(totals.taxAmount) : "Nil"}
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.bankPane}>
            <Text style={styles.bottomHeader}>Company's Bank Details</Text>
            <Text style={styles.bankLine}>Bank Name: {business?.bankName || "-"}</Text>
            <Text style={styles.bankLine}>A/c No: {business?.accountNo || "-"}</Text>
            <Text style={styles.bankLine}>Branch: {business?.branch || "-"}</Text>
            <Text style={styles.bankLine}>IFSC: {business?.ifsc || "-"}</Text>
            <Text style={styles.bankLine}>Address: {business?.bankAddress || "-"}</Text>
          </View>
          <View style={styles.declPane}>
            <Text style={styles.bottomHeader}>Declaration</Text>
            <Text style={{ fontSize: 7.5, lineHeight: 1.4 }}>
              We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
            </Text>
          </View>
          <View style={styles.signPane}>
            <Text style={styles.bottomHeader}>{business?.businessName || "Company Name"}</Text>
            {sigSrc ? (
              <View style={{ alignItems: "center", marginTop: 8 }}>
                <Image src={sigSrc} style={{ height: 40, width: 120, objectFit: "contain" }} />
              </View>
            ) : null}
            <Text style={{ fontSize: 7.5, textAlign: "center", marginTop: 3 }}>Authorised Signatory</Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>SUBJECT TO BENGALURU JURISDICTION</Text>
          <Text style={styles.footerSub}>This is a Computer Generated Invoice</Text>
          {showSeal ? (
            <View style={styles.sealContainer}>
              <SealSvg size={70} />
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}
