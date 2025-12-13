import { Route, Routes } from "react-router-dom";
import GSTBillingLanding from "./Landing/gst-landing-final";
import PrivacyPolicy from "./Landing/PrivacyPolicy";
import TermsandConditions from "./Landing/TermsandConditions";
import RefundPolicy from "./Landing/RefundPolicy";
import Updates from "./Landing/Updates";
import ContactNow from "./Landing/ContactNow";
import Documentation from "./Landing/Documentation";
import InsideInvoiceHelpCenter from "./Landing/InsideInvoiceHelpCenter";
import InsideInvoiceVideoTutorials from "./Landing/InsideInvoiceVideoTutorials";
import GSTCalculator from "./Landing/Services/GSTCalculator";
import QRCodeGenerator from "./Landing/Services/QRCodeGenerator";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<GSTBillingLanding />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-condition" element={<TermsandConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/contact" element={<ContactNow />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/help" element={<InsideInvoiceHelpCenter />} />
        <Route path="/video" element={<InsideInvoiceVideoTutorials />} />
        <Route path="/gst-calculator" element={<GSTCalculator />} />
        <Route path="/qr-generator" element={<QRCodeGenerator />} />
      </Routes>
    </>
  );
}

export default App;
