import { useState, useEffect } from "react";
import AppNavbar from "../components/AppNavbar";
import toast from "react-hot-toast";
import { Printer, CheckCircle2, AlertTriangle, RefreshCw, Loader2, Save, XCircle, Shield, WifiOff, Bug } from "lucide-react";
import { checkQZStatus, getPrinters, getSavedPrinter, savePrinter, clearSavedPrinter, printPdf } from "../utils/printQZ";

export default function PrinterSetup({ noWrapper }) {
  const [checking, setChecking] = useState(true);
  const [status, setStatus] = useState({ available: false, reason: null, message: null, diag: null });
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState(getSavedPrinter() || "");
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDiag, setShowDiag] = useState(false);

  useEffect(() => { checkConnection(); }, []);

  const checkConnection = async () => {
    setChecking(true);
    const result = await checkQZStatus();
    setStatus(result);
    if (result.available) {
      try {
        const list = await getPrinters();
        setPrinters(list);
      } catch {
        setPrinters([]);
      }
    }
    setChecking(false);
  };

  const handleSave = () => {
    if (!selectedPrinter) { toast.error("Select a printer"); return; }
    savePrinter(selectedPrinter);
    setSaving(true);
    setTimeout(() => setSaving(false), 800);
    toast.success(`Default printer set to "${selectedPrinter}"`);
  };

  const handleClear = () => {
    clearSavedPrinter();
    setSelectedPrinter("");
    toast.success("Printer selection cleared");
  };

  const handleTestPrint = async () => {
    if (!selectedPrinter) { toast.error("Select a printer first"); return; }
    setTesting(true);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.setFontSize(20);
      pdf.text("Inside Invoice - Test Page", 105, 80, { align: "center" });
      pdf.setFontSize(12);
      pdf.text("If you can read this, your printer is working correctly.", 105, 100, { align: "center" });
      pdf.text(new Date().toLocaleString(), 105, 120, { align: "center" });
      const blob = pdf.output("blob");
      await printPdf(blob, selectedPrinter);
      toast.success("Test page sent to printer");
    } catch (err) {
      toast.error(err.message || "Print test failed");
    } finally {
      setTesting(false);
    }
  };

  const StatusIcon = status.available ? CheckCircle2 : AlertTriangle;
  const StatusColor = status.available ? "text-emerald-600 bg-emerald-50" : "text-amber-700 bg-amber-50";

  const content = (
    <>
      <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
          <Printer className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-slate-900">Printer Setup</h1>
          <p className="text-xs text-slate-500 mt-0.5">Configure silent printing for your invoice counter</p>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Connection Status</h2>
            {checking ? (
              <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 rounded-lg px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin" /> Checking QZ Tray...
              </div>
            ) : (
              <>
                <div className={`flex items-start gap-2.5 text-sm rounded-lg px-4 py-3 ${StatusColor}`}>
                  <StatusIcon className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    {status.available ? (
                      <span className="font-medium">QZ Tray connected</span>
                    ) : (
                      <>
                        <span className="font-medium">QZ Tray not detected</span>
                        <p className="text-xs mt-1 opacity-80">{status.message}</p>
                      </>
                    )}
                  </div>
                </div>

                {!status.available && status.diag && (
                  <div className="mt-2">
                    <button onClick={() => setShowDiag(!showDiag)} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600">
                      <Bug className="w-3 h-3" /> {showDiag ? "Hide" : "Show"} diagnostic details
                    </button>
                    {showDiag && (
                      <pre className="mt-2 bg-slate-900 text-slate-200 text-xs p-3 rounded-lg overflow-auto max-h-40 font-mono leading-relaxed">
                        scriptLoaded: {String(status.diag.scriptLoaded)}{'\n'}
                        qzExists: {String(status.diag.qzExists)}{'\n'}
                        connectAttempted: {String(status.diag.connectAttempted)}{'\n'}
                        connectResult: {status.diag.connectResult}{'\n'}
                        origin: {window.location.origin}{'\n'}
                        protocol: {window.location.protocol}{'\n'}
                        {status.diag.raw && <>error: {status.diag.raw.message || status.diag.raw.toString()}</>}
                      </pre>
                    )}
                  </div>
                )}

                {!status.available && status.reason === "security" && (
                  <div className="mt-3 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3">
                    <div className="flex items-start gap-2.5">
                      <Shield className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                      <div className="text-sm text-indigo-700">
                        <p className="font-medium mb-1">Add this site to QZ Tray whitelist</p>
                        <ol className="list-decimal list-inside space-y-1 text-xs mt-2">
                          <li>Right-click the <strong>QZ Tray icon</strong> in the system tray</li>
                          <li>Go to <strong>Preferences → Security → App Authenticity</strong></li>
                          <li>Click <strong>Add My Application</strong> and enter: <code className="bg-indigo-100 px-1 rounded text-xs font-mono">{window.location.origin}</code></li>
                          <li>Click <strong>Save</strong>, then <strong>Retry</strong> below</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}

                {!status.available && status.reason === "not_running" && (
                  <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                    <div className="flex items-start gap-2.5">
                      <WifiOff className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
                      <div className="text-sm text-slate-600">
                        <p className="font-medium mb-1">QZ Tray is not running</p>
                        <p className="text-xs">Launch QZ Tray from the system tray or Start Menu then click <strong>Retry</strong>.</p>
                      </div>
                    </div>
                  </div>
                )}

                {!status.available && status.reason === "script" && (
                  <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                    <div className="flex items-start gap-2.5">
                      <WifiOff className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                      <div className="text-sm text-amber-700">
                        <p className="font-medium mb-1">Could not load QZ Tray script</p>
                        <p className="text-xs mt-1">Download <code className="bg-amber-100 px-1 rounded">qz-tray.js</code> from <a href="https://qz.io/download/" target="_blank" rel="noopener noreferrer" className="underline font-medium">qz.io/download</a> and place it in the <code className="bg-amber-100 px-1 rounded">public/</code> folder of the app, then rebuild.</p>
                      </div>
                    </div>
                  </div>
                )}

                <button onClick={checkConnection} disabled={checking} className="flex items-center gap-1.5 mt-3 text-xs text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50">
                  <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} /> Retry
                </button>
              </>
            )}
          </div>

          {/* Printer Selection */}
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Printer Selection</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Default Printer</label>
                <select value={selectedPrinter}
                  onChange={(e) => setSelectedPrinter(e.target.value)}
                  disabled={!status.available || printers.length === 0}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 disabled:opacity-50 disabled:bg-slate-50">
                  {!status.available && <option value="">— QZ Tray not connected —</option>}
                  {status.available && printers.length === 0 && <option value="">— No printers found —</option>}
                  {status.available && printers.length > 0 && <option value="">— Select a printer —</option>}
                  {printers.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button onClick={handleSave} disabled={!selectedPrinter}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Printer
                </button>
                <button onClick={handleClear} disabled={!getSavedPrinter()}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 border border-slate-300 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all">
                  Clear
                </button>
              </div>
              {getSavedPrinter() && (
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Current default: <strong>{getSavedPrinter()}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Test Print */}
          <div className="pt-5 border-t border-slate-100">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Test Print</h2>
            <p className="text-xs text-slate-500 mb-3">Send a test page to verify your printer is working correctly.</p>
            <button onClick={handleTestPrint} disabled={!selectedPrinter || testing}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-all shadow-sm">
              {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
              {testing ? "Printing..." : "Print Test Page"}
            </button>
          </div>
        </>
      );

  return noWrapper ? content : (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <AppNavbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
          {content}
        </div>
      </div>
    </div>
  );
}
