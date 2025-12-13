import React from "react";

export default function InsideInvoiceVideoTutorials() {
   const year = new Date().getFullYear();
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-slate-800 text-center">
      <h1 className="text-3xl font-bold mb-4">🎥 Video Tutorials</h1>

      <p className="text-lg text-slate-600 mb-8">
        We’re making great progress! 🚀 Our step-by-step video tutorials are
        currently under production.
      </p>

      <div className="bg-slate-100 border border-dashed border-slate-300 rounded-2xl p-10">
        <h2 className="text-2xl font-semibold mb-3">Stay Tuned!</h2>
        <p className="text-slate-600 mb-4">
          Soon you’ll be able to watch guided videos on how to:
        </p>

        <ul className="list-disc text-left max-w-md mx-auto pl-6 space-y-2 text-slate-600">
          <li>Create GST-compliant invoices</li>
          <li>Manage customers and products</li>
          <li>Track payments and reports</li>
          <li>Configure business and GST settings</li>
        </ul>

        <p className="mt-6 text-sm text-slate-500">
          📢 New videos will be announced here and via email notifications.
        </p>
      </div>

      <footer className="mt-10 text-sm text-slate-500">
        © {year} Inside Invoice by 2X+1. All rights reserved.
      </footer>
    </div>
  );
}
