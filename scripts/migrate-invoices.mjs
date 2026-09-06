// Change this URL to match your environment
const BASE = "https://insideinvoice-production.up.railway.app/api";
const TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwidXNlcklkIjozLCJidXNpbmVzc0lkIjozLCJ1c2VyTmFtZSI6IkZhaGFkIFBhc2hhIiwiZW1haWwiOiJyc2hhcmR3YXJlMjIxMEBnbWFpbC5jb20iLCJpYXQiOjE3ODUxODQzNzIsImV4cCI6MTc4NTIwNTk3Mn0.oqZ9aHH48tZuO_rl05AeJ87dZB7LroBrxnZwndIwrQ0A3m8Q1eLpWfwVMKGwTFrO5DZz9rhdF6HeZjR73FO2KQ";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

const invoices = [
  { id: "69d54438002081ca13fa07ff", invoiceId: "257", name: "Good Luck Enterprises", email: "", phoneNumber: "9036843735", billingAddress: "#63 Narayanappa Garden 1st main road, Near Lakshmi Theatre, Thavarekere, Bangalore", gstIn: "29AEQPJ1655J1Z0", placeOfSupply: "Karnataka", dueDate: "Invalid Date", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2026-03-20", deliveryNoteDate: "", destination: "Karnataka", items: [{ sno: "1", id: "1", item: "3/4 Concealed Valve ", hsn: "39172390", rate: 1500, qty: 5, taxableValue: 6355.93, taxAmount: 1144.06, total: 7499.99 }] },
  { id: "69d542f6002081ca13fa07fe", invoiceId: "253", name: "Good Luck Enterprises", email: "", phoneNumber: "9036843735", billingAddress: "#63 Narayanappa Garden 1st main road, Near Lakshmi Theatre, Thavarekere, Bangalore", gstIn: "29AEQPJ1655J1Z0", placeOfSupply: "Karnataka", dueDate: "Invalid Date", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2026-03-10", deliveryNoteDate: "", destination: "Karnataka", items: [{ sno: "1", id: "1", item: '4" PVC Pipe', hsn: "3917239", rate: 1200, qty: 6, taxableValue: 6101.69, taxAmount: 1098.3, total: 7199.99 }, { sno: "2", id: "2", item: '4" PVC Door Elbow', hsn: "3917239", rate: 250, qty: 5, taxableValue: 1059.32, taxAmount: 190.68, total: 1250 }, { sno: "3", id: "3", item: "3/4 CPVC Pipes", hsn: "3917239", rate: 380, qty: 10, taxableValue: 3220.34, taxAmount: 579.66, total: 3800 }] },
  { id: "69d5421f002081ca13fa07fd", invoiceId: "251", name: "Good Luck Enterprises", email: "", phoneNumber: "9036843735", billingAddress: "#63 Narayanappa Garden 1st main road, Near Lakshmi Theatre, Thavarekere, Bangalore ", gstIn: "29AEQPJ1655J1Z0", placeOfSupply: "Karnataka", dueDate: "07 Apr 2026", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2026-03-05", deliveryNoteDate: "", destination: "Karnataka", items: [{ sno: "1", id: "1", item: "Fevicol Heatex 5ltr", hsn: "35069190", rate: 1400, qty: 2, taxableValue: 2372.88, taxAmount: 427.12, total: 2800 }, { sno: "2", id: "2", item: "Fevicol SH 60kg ", hsn: "35069190", rate: 9807, qty: 1, taxableValue: 8311.02, taxAmount: 1495.98, total: 9807 }] },
  { id: "6985ca44c0145ff595e1ea2d", invoiceId: "240", name: "Good luck Enterprises", email: "", phoneNumber: "+91 9036843735", billingAddress: "#63 Narayanappa Garden, 1st main road, near Lakshmi Theatre, Thavarekere, Bangalore - 560029", gstIn: "29AEQPJ1655J1Z0", placeOfSupply: "Karnataka", dueDate: "06 Feb 2026", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2026-02-26", deliveryNoteDate: "", destination: "Karnataka", items: [{ sno: "1", id: "1", item: "4 PVC Pipe", hsn: "", rate: 1200, qty: 10, taxableValue: 10169.49, taxAmount: 1830.5, total: 11999.99 }, { sno: "2", id: "2", item: '4" PVC Elbow', hsn: "", rate: 152, qty: 7, taxableValue: 901.69, taxAmount: 162.3, total: 1063.99 }] },
  { id: "6985c91ac0145ff595e1ea2c", invoiceId: "236", name: "Good luck Enterprises", email: "", phoneNumber: "+91 9036843735", billingAddress: "#63 Narayanappa Garden, 1st main road, near Lakshmi Theatre, Thavarekere, Bangalore - 560029", gstIn: "29AEQPJ1655J1Z0", placeOfSupply: "Karnataka", dueDate: "Invalid Date", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2026-02-18", deliveryNoteDate: "", destination: "Karnataka", items: [{ sno: "1", id: "1", item: '1" CPVC Pipe ', hsn: "39172390", rate: 580, qty: 20, taxableValue: 9830.51, taxAmount: 1769.5, total: 11600.01 }, { sno: "2", id: "2", item: '1" CPVC Elbow ', hsn: "39172390", rate: 30, qty: 30, taxableValue: 762.71, taxAmount: 137.28, total: 899.99 }] },
  { id: "6985c792c0145ff595e1ea2b", invoiceId: "234", name: "Good luck Enterprises", email: "", phoneNumber: "+91 9036843735", billingAddress: "#63 Narayanappa Garden, 1st main road, near Lakshmi Theatre, Thavarekere, Bangalore - 560029", gstIn: "29AEQPJ1655J1Z0", placeOfSupply: "Karnataka", dueDate: "Invalid Date", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2026-01-16", deliveryNoteDate: "", destination: "Karnataka", items: [{ sno: "1", id: "1", item: "3/4 CPVC Pipe ", hsn: "39172390", rate: 420, qty: 10, taxableValue: 3559.32, taxAmount: 640.68, total: 4200 }, { sno: "2", id: "2", item: "3/4 CPVC Gate Wall ", hsn: "39172390", rate: 180, qty: 8, taxableValue: 1220.34, taxAmount: 219.66, total: 1440 }, { sno: "3", id: "3", item: "3/4 CPVC Union", hsn: "39172390", rate: 120, qty: 5, taxableValue: 508.47, taxAmount: 91.52, total: 599.99 }, { sno: "4", id: "4", item: "3/4 CPVC Elbow", hsn: "39172390", rate: 20, qty: 48, taxableValue: 813.56, taxAmount: 146.44, total: 960 }, { sno: "5", id: "5", item: "3/4 CPVC Tee", hsn: "39172390", rate: 30, qty: 20, taxableValue: 508.47, taxAmount: 91.52, total: 599.99 }, { sno: "6", id: "6", item: "3/4*1/2 Brass Collar", hsn: "39172390", rate: 90, qty: 10, taxableValue: 762.71, taxAmount: 137.28, total: 899.99 }, { sno: "7", id: "7", item: "CPVC Solvent Tin", hsn: "35061000", rate: 200, qty: 4, taxableValue: 677.97, taxAmount: 122.04, total: 800.01 }] },
  { id: "6985c64ec0145ff595e1ea2a", invoiceId: "233", name: "Good luck Enterprises", email: "", phoneNumber: "+91 9036843735", billingAddress: "#63 Narayanappa Garden, 1st main road, near Lakshmi Theatre, Thavarekere, Bangalore - 560029", gstIn: "29AEQPJ1655J1Z0", placeOfSupply: "Karnataka", dueDate: "06 Feb 2026", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2026-01-10", deliveryNoteDate: "", destination: "Karnataka", items: [{ sno: "1", id: "1", item: '6" PVC Pipe', hsn: "3917400", rate: 2600, qty: 2, taxableValue: 4406.78, taxAmount: 793.22, total: 5200 }, { sno: "2", id: "2", item: '6" PVC Collar ', hsn: "3917400", rate: 210, qty: 6, taxableValue: 1067.8, taxAmount: 192.2, total: 1260 }, { sno: "3", id: "3", item: '6" PVC Elbow ', hsn: "3917400", rate: 310, qty: 3, taxableValue: 788.14, taxAmount: 141.86, total: 930 }] },
  { id: "6985c460c0145ff595e1ea29", invoiceId: "231", name: "Good luck Enterprises", email: "", phoneNumber: "+91 9036843735", billingAddress: "#63 Narayanappa Garden, 1st main road, near Lakshmi Theatre, Thavarekere, Bangalore - 560029", gstIn: "29AEQPJ1655J1Z0", placeOfSupply: "Karnataka", dueDate: "06 Feb 2026", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "Cash", otherReferences: "", dated: "2026-01-05", deliveryNoteDate: "", destination: "Karnataka", items: [{ sno: "1", id: "1", item: '4" PVC Pipe ', hsn: "", rate: 1200, qty: 5, taxableValue: 5084.75, taxAmount: 915.26, total: 6000.01 }, { sno: "2", id: "2", item: '4" PVC D.Elbow', hsn: "", rate: 155, qty: 10, taxableValue: 1313.56, taxAmount: 236.44, total: 1550 }] },
  { id: "69687c5869e764cc6ab91f0b", invoiceId: "229", name: "", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "", dueDate: "Invalid Date", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-12-26", deliveryNoteDate: "", destination: "", items: [{ sno: "1", id: "1", item: "3/4 CPVC pipe  ", hsn: "3917", rate: 420, qty: 1, taxableValue: 355.93, taxAmount: 64.06, total: 419.99 }] },
  { id: "69687d0569e764cc6ab91f0c", invoiceId: "230", name: "", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "", dueDate: "Invalid Date", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-12-26", deliveryNoteDate: "", destination: "", items: [{ sno: "1", id: "1", item: "3/4 CPVC pipe", hsn: "3917", rate: 420, qty: 1, taxableValue: 355.93, taxAmount: 64.06, total: 419.99 }] },
  { id: "69687bbb69e764cc6ab91f0a", invoiceId: "229", name: "", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "", dueDate: "Invalid Date", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-12-22", deliveryNoteDate: "", destination: "", items: [{ sno: "1", id: "1", item: "Polish wheels bhatti", hsn: "680422", rate: 75, qty: 6, taxableValue: 381.36, taxAmount: 68.64, total: 450 }] },
  { id: "69687b0e69e764cc6ab91f09", invoiceId: "228", name: "", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "", dueDate: "Invalid Date", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-12-20", deliveryNoteDate: "", destination: "", items: [{ sno: "1", id: "1", item: "Marvel flush tank", hsn: "6910", rate: 550, qty: 1, taxableValue: 466.1, taxAmount: 83.9, total: 550 }, { sno: "2", id: "2", item: "Marvel seat cover", hsn: "6910", rate: 330, qty: 1, taxableValue: 279.66, taxAmount: 50.34, total: 330 }] },
  { id: "69687a5969e764cc6ab91f08", invoiceId: "227", name: "", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "", dueDate: "Invalid Date", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-12-19", deliveryNoteDate: "", destination: "", items: [{ sno: "1", id: "1", item: "2feet connection pipe", hsn: "3917", rate: 120, qty: 4, taxableValue: 406.78, taxAmount: 73.22, total: 480 }] },
  { id: "6968797969e764cc6ab91f07", invoiceId: "226", name: "", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "", dueDate: "Invalid Date", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-12-17", deliveryNoteDate: "", destination: "", items: [{ sno: "1", id: "1", item: "3/4 CPVC Elbow ", hsn: "3917", rate: 18, qty: 20, taxableValue: 305.08, taxAmount: 54.92, total: 360 }] },
  { id: "69686fc45be7accca34880e9", invoiceId: "223", name: "", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "", dueDate: "Invalid Date", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-12-11", deliveryNoteDate: "", destination: "", items: [{ sno: "1", id: "1", item: "Acid ", hsn: "2807", rate: 150, qty: 2, taxableValue: 254.24, taxAmount: 45.76, total: 300 }, { sno: "2", id: "2", item: "Steel wool", hsn: "73231000", rate: 35, qty: 3, taxableValue: 88.98, taxAmount: 16.02, total: 105 }] },
  { id: "69686e535be7accca34880e8", invoiceId: "222", name: "", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "", dueDate: "Invalid Date", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-12-09", deliveryNoteDate: "", destination: "", items: [{ sno: "1", id: "1", item: "1 CPVC Long bend", hsn: "39172390", rate: 90, qty: 6, taxableValue: 457.63, taxAmount: 82.38, total: 540.01 }, { sno: "2", id: "2", item: "1 CPVC Elbow ", hsn: "39172390", rate: 30, qty: 2, taxableValue: 50.85, taxAmount: 9.16, total: 60.01 }] },
  { id: "69686c8c5be7accca34880e7", invoiceId: "221", name: "", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "", dueDate: "Invalid Date", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-12-07", deliveryNoteDate: "", destination: "", items: [{ sno: "1", id: "1", item: "3/4 CPVC pipe", hsn: "39172390", rate: 420, qty: 1, taxableValue: 355.93, taxAmount: 64.06, total: 419.99 }] },
  { id: "69686bcb5be7accca34880e6", invoiceId: "220", name: "CASH", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "Karnataka", dueDate: "15 Jan 2026", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-12-06", deliveryNoteDate: "", destination: "Karnataka", items: [{ sno: "1", id: "1", item: "4 PVC Pipe", hsn: "3917", rate: 60, qty: 10, taxableValue: 508.47, taxAmount: 91.52, total: 599.99 }, { sno: "2", id: "2", item: "4 PVC Collar", hsn: "3917", rate: 100, qty: 1, taxableValue: 84.75, taxAmount: 15.26, total: 100.01 }] },
  { id: "6932839014b33917b3dbba31", invoiceId: "219", name: "United Precision Plastics", email: "", phoneNumber: "9019803235", billingAddress: "", gstIn: "29ACFPR6871D1Z8", placeOfSupply: "Karnataka", dueDate: "05 Dec 2025", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "Cash", otherReferences: "", dated: "2025-12-05", deliveryNoteDate: "2025-12-05", destination: "Karnataka", items: [{ sno: "1", id: "1", item: "3/4 Cpvc Pipe", hsn: "", rate: 531, qty: 2, taxableValue: 900, taxAmount: 162, total: 1062 }, { sno: "2", id: "2", item: "Tube", hsn: "", rate: 94.4, qty: 2, taxableValue: 160, taxAmount: 28.8, total: 188.8 }, { sno: "3", id: "3", item: "Teflon Tape", hsn: "", rate: 35.4, qty: 2, taxableValue: 60, taxAmount: 10.8, total: 70.8 }, { sno: "4", id: "4", item: "Cp Plug ", hsn: "", rate: 94.4, qty: 4, taxableValue: 320, taxAmount: 57.6, total: 377.6 }, { sno: "5", id: "5", item: "3/4 Clamps", hsn: "", rate: 5.9, qty: 20, taxableValue: 100, taxAmount: 18, total: 118 }, { sno: "6", id: "6", item: "Blade", hsn: "", rate: 23.6, qty: 2, taxableValue: 40, taxAmount: 7.2, total: 47.2 }, { sno: "7", id: "7", item: "3/4*1/2 R Brass Elbow ", hsn: "", rate: 88.5, qty: 4, taxableValue: 300, taxAmount: 54, total: 354 }, { sno: "8", id: "8", item: "Long Body Tap", hsn: "", rate: 649, qty: 1, taxableValue: 550, taxAmount: 99, total: 649 }, { sno: "9", id: "9", item: "Angle Cock ", hsn: "", rate: 295, qty: 1, taxableValue: 250, taxAmount: 45, total: 295 }, { sno: "10", id: "10", item: "3/4 Cpvc Elbow", hsn: "", rate: 23.6, qty: 4, taxableValue: 80, taxAmount: 14.4, total: 94.4 }] },
  { id: "69686b155be7accca34880e5", invoiceId: "218", name: "CASH", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "Karnataka", dueDate: "15 Jan 2026", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-12-05", deliveryNoteDate: "", destination: "Karnataka", items: [{ sno: "1", id: "1", item: "3/4 CPVC Elbow ", hsn: "39172390", rate: 18, qty: 10, taxableValue: 152.54, taxAmount: 27.46, total: 180 }, { sno: "2", id: "2", item: "3/4 CPVC Long Bend", hsn: "39172390", rate: 60, qty: 5, taxableValue: 254.24, taxAmount: 45.76, total: 300 }] },
  { id: "696869485be7accca34880e3", invoiceId: "216", name: "", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "", dueDate: "Invalid Date", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-12-03", deliveryNoteDate: "", destination: "", items: [{ sno: "1", id: "1", item: "3/4 CPVC pipe", hsn: "39172390", rate: 350, qty: 1, taxableValue: 296.61, taxAmount: 53.38, total: 349.99 }] },
  { id: "69686a545be7accca34880e4", invoiceId: "217", name: "", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "", dueDate: "Invalid Date", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-12-03", deliveryNoteDate: "", destination: "", items: [{ sno: "1", id: "1", item: "Wood Cutting Blade ", hsn: "82082000", rate: 270, qty: 2, taxableValue: 457.63, taxAmount: 82.38, total: 540.01 }] },
  { id: "696868a55be7accca34880e2", invoiceId: "215", name: "CASH", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "Karnataka", dueDate: "15 Jan 2026", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-12-02", deliveryNoteDate: "", destination: "Karnataka", items: [{ sno: "1", id: "1", item: "White Cement ", hsn: "25232100", rate: 40, qty: 5, taxableValue: 169.49, taxAmount: 30.5, total: 199.99 }] },
  { id: "6968680e5be7accca34880e1", invoiceId: "214", name: "CASH", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "Karnataka", dueDate: "15 Jan 2026", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-12-01", deliveryNoteDate: "", destination: "Karnataka", items: [{ sno: "1", id: "1", item: "12*12 FRP ", hsn: "39269099", rate: 426, qty: 1, taxableValue: 361.02, taxAmount: 64.98, total: 426 }] },
  { id: "6939b54a9cc30c410f776803", invoiceId: "213", name: "CASH", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "Karnataka", dueDate: "10 Dec 2025", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-11-29", deliveryNoteDate: "", destination: "Karnataka", items: [{ sno: "1", id: "1", item: "24*24 FRP", hsn: "39269099", rate: 1600, qty: 2, taxableValue: 2711.86, taxAmount: 488.14, total: 3200 }] },
  { id: "69259d9216638c52bd16b9c0", invoiceId: "212", name: "Aura Airtechnics", email: "auraairtechnicspurchasedept@gmail.com", phoneNumber: "9886969268", billingAddress: "19, Ranoji Rao Road, Basavanagudi Bengaluru, Bengaluru Urban", gstIn: "29AJJPJ1075E1Z9", placeOfSupply: "Karnataka", dueDate: "25 Nov 2025", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "UPI", otherReferences: "Aura Airtechnics", dated: "2025-11-25", deliveryNoteDate: "2025-11-25", destination: "Karnataka", items: [{ sno: "1", id: "1", item: "25mm PVC Pipe ", hsn: "", rate: 270, qty: 6, taxableValue: 1372.88, taxAmount: 247.12, total: 1620 }, { sno: "2", id: "2", item: "25mm PVC Elbow", hsn: "391723", rate: 8, qty: 18, taxableValue: 122.03, taxAmount: 21.96, total: 143.99 }, { sno: "3", id: "3", item: "25mm PVC Collar", hsn: "391723", rate: 7, qty: 10, taxableValue: 59.32, taxAmount: 10.68, total: 70 }, { sno: "4", id: "4", item: "20*25mm PVC R.Collar", hsn: "391723", rate: 6, qty: 6, taxableValue: 30.51, taxAmount: 5.5, total: 36.01 }, { sno: "5", id: "5", item: "6mm PVC Ghatta ", hsn: "39173990", rate: 50, qty: 1, taxableValue: 42.37, taxAmount: 7.62, total: 49.99 }, { sno: "6", id: "6", item: "GI Clamps", hsn: "73182990", rate: 8, qty: 15, taxableValue: 101.69, taxAmount: 18.3, total: 119.99 }, { sno: "7", id: "7", item: "1.1/2 SS Nails", hsn: "73170013", rate: 20, qty: 3, taxableValue: 50.85, taxAmount: 9.16, total: 60.01 }, { sno: "8", id: "8", item: "PVC Solvent ", hsn: "35061000", rate: 180, qty: 1, taxableValue: 152.54, taxAmount: 27.46, total: 180 }] },
  { id: "6939b1989cc30c410f776802", invoiceId: "211", name: "CASH", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "Karnataka", dueDate: "10 Dec 2025", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-11-25", deliveryNoteDate: "", destination: "Karnataka", items: [{ sno: "1", id: "1", item: "SS Health Faucet Gun", hsn: "84818090", rate: 450, qty: 2, taxableValue: 762.71, taxAmount: 137.28, total: 899.99 }, { sno: "2", id: "2", item: "PVC Pillar Cock", hsn: "39174000", rate: 260, qty: 4, taxableValue: 881.36, taxAmount: 158.64, total: 1040 }] },
  { id: "6939b0609cc30c410f776800", invoiceId: "209", name: "CASH", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "Karnataka", dueDate: "10 Dec 2025", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-11-24", deliveryNoteDate: "", destination: "Karnataka", items: [{ sno: "1", id: "1", item: '1.1/4 PVC Pipe 20ft', hsn: "39174000", rate: 600, qty: 2, taxableValue: 1016.95, taxAmount: 183.06, total: 1200.01 }] },
  { id: "6939b1119cc30c410f776801", invoiceId: "210", name: "CASH", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "Karnataka", dueDate: "10 Dec 2025", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-11-24", deliveryNoteDate: "", destination: "Karnataka", items: [{ sno: "1", id: "1", item: "Angle Valve ", hsn: "84818090", rate: 360, qty: 2, taxableValue: 610.17, taxAmount: 109.84, total: 720.01 }] },
  { id: "6939af9b9cc30c410f7767ff", invoiceId: "208", name: "CASH", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "Karnataka", dueDate: "10 Dec 2025", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-11-22", deliveryNoteDate: "", destination: "Karnataka", items: [{ sno: "1", id: "1", item: "White Cement 5kg", hsn: "25232100", rate: 200, qty: 3, taxableValue: 508.47, taxAmount: 91.52, total: 599.99 }] },
  { id: "6939af119cc30c410f7767fe", invoiceId: "207", name: "CASH", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "Karnataka", dueDate: "10 Dec 2025", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-11-21", deliveryNoteDate: "", destination: "Karnataka", items: [{ sno: "1", id: "1", item: "Roff Cement 30kg", hsn: "38245090", rate: 430, qty: 4, taxableValue: 1457.63, taxAmount: 262.38, total: 1720.01 }] },
  { id: "6939ae989cc30c410f7767fd", invoiceId: "206", name: "CASH", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "Karnataka", dueDate: "10 Dec 2025", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-11-19", deliveryNoteDate: "", destination: "Karnataka", items: [{ sno: "1", id: "1", item: "110mm PVC Collar", hsn: "39172990", rate: 100, qty: 3, taxableValue: 254.24, taxAmount: 45.76, total: 300 }, { sno: "2", id: "2", item: "110mm PVC Elbow ", hsn: "39172990", rate: 160, qty: 2, taxableValue: 271.19, taxAmount: 48.82, total: 320.01 }, { sno: "3", id: "3", item: "110mm PVC Pipe", hsn: "39172990", rate: 1280, qty: 1, taxableValue: 1084.75, taxAmount: 195.26, total: 1280.01 }] },
  { id: "69396a8ed074091caefc918c", invoiceId: "205", name: "", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "", dueDate: "Invalid Date", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-11-17", deliveryNoteDate: "", destination: "", items: [{ sno: "1", id: "1", item: "Plaster Of Paris", hsn: "25201020", rate: 20, qty: 20, taxableValue: 338.98, taxAmount: 61.02, total: 400 }, { sno: "2", id: "2", item: "1 cpvc Union ", hsn: "39174000", rate: 100, qty: 5, taxableValue: 423.73, taxAmount: 76.28, total: 500.01 }, { sno: "3", id: "3", item: "1 cpvc Pipe ", hsn: "39174000", rate: 650, qty: 2, taxableValue: 1101.69, taxAmount: 198.3, total: 1299.99 }] },
  { id: "6939ae109cc30c410f7767fc", invoiceId: "204", name: "CASH", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "Karnataka", dueDate: "10 Dec 2025", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-11-15", deliveryNoteDate: "", destination: "Karnataka", items: [{ sno: "1", id: "1", item: "160mm PVC Pipe", hsn: "39172390", rate: 160, qty: 20, taxableValue: 2711.86, taxAmount: 488.14, total: 3200 }] },
  { id: "693968a0d074091caefc918a", invoiceId: "203", name: "", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "", dueDate: "Invalid Date", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-11-13", deliveryNoteDate: "", destination: "", items: [{ sno: "1", id: "1", item: "20 wts batten ", hsn: "94054090", rate: 95, qty: 3, taxableValue: 241.53, taxAmount: 43.48, total: 285.01 }] },
  { id: "6939684ed074091caefc9189", invoiceId: "202", name: "CASH", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "Karnataka", dueDate: "10 Dec 2025", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-11-11", deliveryNoteDate: "2025-12-10", destination: "Karnataka", items: [{ sno: "1", id: "1", item: "Fevicol Heatex 1/2 ltr ", hsn: "35061000", rate: 320, qty: 2, taxableValue: 542.37, taxAmount: 97.62, total: 639.99 }, { sno: "2", id: "2", item: "Renderoc Plug 5kg ", hsn: "38245090", rate: 360, qty: 2, taxableValue: 610.17, taxAmount: 109.84, total: 720.01 }, { sno: "3", id: "3", item: "5 mtr Rope Light ", hsn: "94054090", rate: 600, qty: 3, taxableValue: 1525.42, taxAmount: 274.58, total: 1800 }] },
  { id: "69396520d074091caefc9188", invoiceId: "201", name: "", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "", dueDate: "Invalid Date", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-11-10", deliveryNoteDate: "", destination: "", items: [{ sno: "1", id: "1", item: "Syphon Set", hsn: "391740", rate: 80, qty: 10, taxableValue: 677.97, taxAmount: 122.04, total: 800.01 }, { sno: "2", id: "2", item: "140mm PVC Tee", hsn: "391740", rate: 280, qty: 6, taxableValue: 1423.73, taxAmount: 256.28, total: 1680.01 }] },
  { id: "6939631fd074091caefc9186", invoiceId: "200", name: "", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "", dueDate: "Invalid Date", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-11-05", deliveryNoteDate: "", destination: "", items: [{ sno: "1", id: "1", item: "3/4 CPVC Pipe", hsn: "39172390", rate: 420, qty: 2, taxableValue: 711.86, taxAmount: 128.14, total: 840 }, { sno: "2", id: "2", item: "3/4 CPVC Elbow", hsn: "39172390", rate: 20, qty: 10, taxableValue: 169.49, taxAmount: 30.5, total: 199.99 }] },
  { id: "693958dc68630e73a3549668", invoiceId: "199", name: "", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "", dueDate: "Invalid Date", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-11-03", deliveryNoteDate: "", destination: "", items: [{ sno: "1", id: "1", item: "75mm PVC Nahani Trap", hsn: "39174000", rate: 120, qty: 3, taxableValue: 305.08, taxAmount: 54.92, total: 360 }, { sno: "2", id: "2", item: "MultiTrap", hsn: "39174000", rate: 220, qty: 3, taxableValue: 559.32, taxAmount: 100.68, total: 660 }, { sno: "3", id: "3", item: "110mm PVC Pipe", hsn: "39174000", rate: 1250, qty: 2, taxableValue: 2118.64, taxAmount: 381.36, total: 2500 }] },
  { id: "6939ad149cc30c410f7767fb", invoiceId: "198", name: "CASH", email: "", phoneNumber: "", billingAddress: "", gstIn: "", placeOfSupply: "Karnataka", dueDate: "10 Dec 2025", deliveryNote: "", referenceNumber: "", buyerOrderNumber: "", dispatchDocNumber: "", dispatchedThrough: "", termsOfDelivery: "", paymentTerms: "", otherReferences: "", dated: "2025-11-01", deliveryNoteDate: "", destination: "Karnataka", items: [{ sno: "1", id: "1", item: "3/4 CPVC Collar ", hsn: "39174000", rate: 16, qty: 20, taxableValue: 271.19, taxAmount: 48.82, total: 320.01 }, { sno: "2", id: "2", item: "3/4 CPVC Elbow ", hsn: "39174000", rate: 20, qty: 20, taxableValue: 338.98, taxAmount: 61.02, total: 400 }, { sno: "3", id: "3", item: "3/4*1/2 CPVC Brass Elbow ", hsn: "39174000", rate: 65, qty: 10, taxableValue: 550.85, taxAmount: 99.16, total: 650.01 }] },
];

async function api(method, path, body) {
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const json = await res.json();
  return json;
}

// Normalize customer name for dedup
function normalizeName(n) {
  return (n || "").trim().toLowerCase().replace(/\s+/g, " ");
}

// GST percentage from taxable/tax
function calcGstPct(taxable, tax) {
  if (!taxable || !tax) return 18;
  return Math.round((tax / taxable) * 100 * 100) / 100;
}

async function main() {
  console.log("Starting migration...");

  // 1. Deduplicate customers
  const customerMap = new Map();
  for (const inv of invoices) {
    const key = normalizeName(inv.name) || `anonymous_${inv.invoiceId}`;
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        name: inv.name || `Invoice ${inv.invoiceId} Customer`,
        email: inv.email || undefined,
        phone: inv.phoneNumber || undefined,
        billingAddress: inv.billingAddress || undefined,
        gstIn: inv.gstIn || undefined,
        _invoices: [],
      });
    }
    customerMap.get(key)._invoices.push(inv);
  }

  console.log(`Found ${customerMap.size} unique customers across ${invoices.length} invoices`);

  // 2. Create customers and get IDs
  const customerIdMap = new Map();
  for (const [key, cust] of customerMap) {
    const payload = { name: cust.name };
    if (cust.email) payload.email = cust.email;
    if (cust.phone) payload.phone = cust.phone;
    if (cust.billingAddress) payload.billingAddress = cust.billingAddress;
    if (cust.gstIn) payload.gstIn = cust.gstIn;

    try {
      const res = await api("POST", "/customers", payload);
      if (res.success && res.data?.id) {
        customerIdMap.set(key, res.data.id);
        console.log(`  Created customer: ${cust.name} -> ${res.data.id}`);
      } else {
        console.log(`  Failed to create customer: ${cust.name}`, JSON.stringify(res));
      }
    } catch (err) {
      console.log(`  Error creating customer: ${cust.name}`, err.message);
    }
  }

  // 3. Create invoices
  let successCount = 0;
  let failCount = 0;

  for (const inv of invoices) {
    const key = normalizeName(inv.name) || `anonymous_${inv.invoiceId}`;
    const customerId = customerIdMap.get(key);

    if (!customerId) {
      console.log(`  Skipping invoice ${inv.invoiceId} - no customer ID for "${inv.name}"`);
      failCount++;
      continue;
    }

    // Build items
    const items = inv.items
      .filter((i) => i.item && i.item.trim() && i.qty > 0 && i.rate > 0)
      .map((i, idx) => ({
        sno: idx + 1,
        itemName: i.item.trim(),
        hsn: i.hsn || undefined,
        qty: parseFloat(i.qty),
        rate: parseFloat(i.rate),
        gstPercentage: calcGstPct(i.taxableValue, i.taxAmount),
      }));

    if (items.length === 0) {
      console.log(`  Skipping invoice ${inv.invoiceId} - no valid items`);
      failCount++;
      continue;
    }

    // Ensure dueDate is always provided (required by backend)
    let dueDate = inv.dueDate;
    if (!dueDate || dueDate === "Invalid Date" || dueDate === "") {
      // Default to invoice date + 30 days
      const invDate = new Date(inv.dated || "2025-01-01");
      invDate.setDate(invDate.getDate() + 30);
      dueDate = invDate.toISOString().split("T")[0];
    } else {
      // Parse non-ISO dates like "07 Apr 2026" or "25 Nov 2025"
      try {
        const parsed = new Date(dueDate);
        if (!isNaN(parsed.getTime())) {
          dueDate = parsed.toISOString().split("T")[0];
        } else {
          dueDate = "2026-01-01";
        }
      } catch {
        dueDate = "2026-01-01";
      }
    }

    // Ensure invoiceDate is ISO format
    let invoiceDate = inv.dated;
    if (invoiceDate && !invoiceDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      try {
        const parsed = new Date(invoiceDate);
        if (!isNaN(parsed.getTime())) {
          invoiceDate = parsed.toISOString().split("T")[0];
        } else {
          invoiceDate = "2025-01-01";
        }
      } catch {
        invoiceDate = "2025-01-01";
      }
    }

    const payload = {
      customerId,
      invoiceType: "TAX_INVOICE",
      invoiceDate: invoiceDate || "2025-01-01",
      dueDate,
      placeOfSupply: inv.placeOfSupply || undefined,
      paymentTerms: inv.paymentTerms || undefined,
      deliveryNote: inv.deliveryNote || undefined,
      referenceNumber: inv.referenceNumber || undefined,
      buyerOrderNumber: inv.buyerOrderNumber || undefined,
      dispatchDocNumber: inv.dispatchDocNumber || undefined,
      dispatchedThrough: inv.dispatchedThrough || undefined,
      termsOfDelivery: inv.termsOfDelivery || undefined,
      otherReferences: inv.otherReferences || undefined,
      destination: inv.destination || undefined,
      notes: undefined,
      items,
    };

    try {
      const res = await api("POST", "/invoices", payload);
      if (res.success) {
        successCount++;
        console.log(`  Invoice ${inv.invoiceId} created OK`);
      } else {
        failCount++;
        console.log(`  Invoice ${inv.invoiceId} FAILED:`, JSON.stringify(res).slice(0, 200));
      }
    } catch (err) {
      failCount++;
      console.log(`  Invoice ${inv.invoiceId} ERROR:`, err.message);
    }
  }

  console.log(`\nMigration complete: ${successCount} succeeded, ${failCount} failed out of ${invoices.length} total`);
}

main().catch(console.error);
