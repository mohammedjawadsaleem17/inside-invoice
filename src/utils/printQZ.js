const QZ_PRINTER_KEY = 'qz_default_printer';
let qzScriptPromise = null;

function loadQZScript() {
  if (qzScriptPromise) return qzScriptPromise;
  qzScriptPromise = new Promise((resolve, reject) => {
    if (typeof qz !== 'undefined' && qz.websocket) { resolve(); return; }
    const s = document.createElement('script');
    s.src = '/qz-tray.js';
    s.onload = () => {
      const check = () => {
        if (typeof qz !== 'undefined' && qz.websocket) resolve();
        else setTimeout(check, 200);
      };
      check();
    };
    s.onerror = () => {
      const s2 = document.createElement('script');
      s2.src = 'https://qz.io/qz-tray.js';
      s2.onload = () => {
        const check = () => {
          if (typeof qz !== 'undefined' && qz.websocket) resolve();
          else setTimeout(check, 200);
        };
        check();
      };
      s2.onerror = () => { qzScriptPromise = null; reject(new Error('SCRIPT_FAILED')); };
      document.head.appendChild(s2);
    };
    document.head.appendChild(s);
  });
  return qzScriptPromise;
}

let connecting = null;

async function connect() {
  await loadQZScript();
  if (qz.websocket.isActive()) return;
  if (connecting) return connecting;
  connecting = qz.websocket.connect({ host: '127.0.0.1', port: 4242, retries: 3, delay: 0.5, timeout: 3000 })
    .catch(e => { connecting = null; throw e; });
  return connecting;
}

export async function checkQZStatus() {
  const diag = { scriptLoaded: false, qzExists: false, connectAttempted: false, connectResult: null, error: null, raw: null };
  try {
    await loadQZScript();
    diag.scriptLoaded = true;
    diag.qzExists = typeof qz !== 'undefined' && !!qz.websocket;
  } catch (e) {
    diag.error = e.message || 'SCRIPT_FAILED';
    return { available: false, reason: 'script', message: 'Could not load QZ script.', diag };
  }
  try {
    diag.connectAttempted = true;
    const cfg = { host: '127.0.0.1', port: 4242, retries: 2, delay: 0.5, timeout: 2000 };
    await qz.websocket.connect(cfg);
    await qz.websocket.disconnect();
    diag.connectResult = 'success';
    return { available: true, reason: null, message: null, diag };
  } catch (err) {
    diag.connectResult = 'failed';
    diag.raw = err;
    const msg = (err.message || err || '').toString().toLowerCase();
    if (msg.includes('refused') || msg.includes('econnrefused')) {
      return { available: false, reason: 'not_running', message: 'QZ Tray is not running. Launch it from system tray.', diag };
    }
    if (msg.includes('close') || msg.includes('handshake') || msg.includes('security') || msg.includes('blocked') || msg.includes('denied') || msg.includes('origin')) {
      return { available: false, reason: 'security', message: 'QZ Tray blocked the connection. Add this site to whitelist.', diag };
    }
    return { available: false, reason: 'unknown', message: msg || 'Unknown QZ Tray error', diag };
  }
}

export async function getPrinters() {
  await connect();
  return qz.printers.find();
}

export function getSavedPrinter() {
  return localStorage.getItem(QZ_PRINTER_KEY);
}

export function savePrinter(name) {
  localStorage.setItem(QZ_PRINTER_KEY, name);
}

export function clearSavedPrinter() {
  localStorage.removeItem(QZ_PRINTER_KEY);
}

export async function printPdf(blob, printerName) {
  const printer = printerName || getSavedPrinter();
  if (!printer) throw new Error('NO_PRINTER');
  await connect();
  const base64 = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onloadend = () => resolve(r.result.split(',')[1]);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
  await qz.print(
    { printer },
    [{ type: 'pdf', data: base64, format: 'base64', options: {} }]
  );
}

export function disconnectQZ() {
  try { if (qz.websocket.isActive()) qz.websocket.disconnect(); } catch {}
}
