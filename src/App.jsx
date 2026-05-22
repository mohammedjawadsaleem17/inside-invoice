import { Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
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
import Login from "./Authentication/Login";
import BarcodeGenerator from "./Landing/Services/BarcodeGenerator";
import BusinessCardMaker from "./Landing/Services/BusinessCardMaker";
import BusinessSetup from "./pages/BusinessSetup";
import Dashboard from "./pages/Dashboard";
import AdminAddUsers from "./pages/AdminAddUsers";
import AdminUsersList from "./pages/AdminUsersList";

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-700 border-t-transparent rounded-full animate-spin"></div></div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GSTBillingLanding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<Login />} />
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
      <Route path="/barcode-generator" element={<BarcodeGenerator />} />
      <Route path="/business-card" element={<BusinessCardMaker />} />
      <Route path="/business-setup" element={<PrivateRoute><BusinessSetup /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/admin/users" element={<PrivateRoute><AdminAddUsers /></PrivateRoute>} />
      <Route path="/admin/users-list" element={<PrivateRoute><AdminUsersList /></PrivateRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
