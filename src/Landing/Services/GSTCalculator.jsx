import React, { useState, useEffect } from "react";
import InvoiceNav from "../Navigation/InvoiceNav";

const GSTCalculator = () => {
  // Calculator State
  const [amount, setAmount] = useState(1000);
  const [taxRate, setTaxRate] = useState(18);
  const [isCustomRate, setIsCustomRate] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [calculationMode, setCalculationMode] = useState("exclusive"); // 'exclusive' or 'inclusive'
  const [userType, setUserType] = useState("Buyer");
  const year = new Date().getFullYear();

  // Results State
  const [results, setResults] = useState({
    netPrice: 0,
    grossPrice: 0,
    totalTax: 0,
    cgst: 0,
    sgst: 0,
  });

  // Calculation Logic
  useEffect(() => {
    const price = parseFloat(amount) || 0;
    const rate = parseFloat(taxRate) || 0;

    let totalTax = 0;
    let net = 0;
    let gross = 0;

    if (calculationMode === "exclusive") {
      // Add GST to Net Price
      totalTax = (price * rate) / 100;
      net = price;
      gross = price + totalTax;
    } else {
      // Remove GST from Gross Price
      totalTax = price - price * (100 / (100 + rate));
      gross = price;
      net = price - totalTax;
    }

    setResults({
      netPrice: net,
      grossPrice: gross,
      totalTax: totalTax,
      cgst: totalTax / 2,
      sgst: totalTax / 2,
    });
  }, [amount, taxRate, calculationMode]);

  // Helper for currency formatting
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(val);
  };

  // Simple Section Component
  const ContentSection = ({ title, children }) => {
    return (
      <div className="mb-8 border-b border-gray-100 pb-6 last:border-0 hover:bg-white p-6 rounded-2xl transition-all duration-300 hover:shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-3 font-heading">
          {title}
        </h3>
        <div className="text-slate-600 leading-relaxed text-sm md:text-base">
          {children}
        </div>
      </div>
    );
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <InvoiceNav
        scrolled={true}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <div className="fixed top-0 left-0 w-full h-20 bg-white/90 backdrop-blur-md z-40 border-b border-gray-100"></div>
      {/* Injecting Trendy Fonts */}

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
          
          .font-heading { font-family: 'Outfit', sans-serif; }
          .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}
      </style>

      <div className="min-h-screen bg-[#F3F6F8] font-body text-slate-800 py-12 px-4 mt-10">
        <div className="max-w-6xl mx-auto">
          {/* --- CALCULATOR CARD --- */}
          <div className="bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden mb-16 border border-white/50">
            {/* Header */}
            <div className="p-8 md:p-10 text-center border-b border-gray-100 bg-white relative">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wider uppercase mb-3">
                Inside Invoice Tool
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 font-heading tracking-tight">
                GST Calculator{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  India
                </span>
              </h1>
            </div>

            <div className="flex flex-col lg:flex-row">
              {/* LEFT SIDE: INPUTS */}
              <div className="p-8 md:p-10 lg:w-3/5 space-y-9">
                {/* User Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    User Type
                  </label>
                  <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                    {["Buyer", "Manufacturer", "Wholesaler"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setUserType(type)}
                        className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                          userType === type
                            ? "bg-white text-slate-900 shadow-md transform scale-[1.02]"
                            : "text-slate-500 hover:text-slate-700 hover:bg-gray-200/50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tax Mode */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Tax Mode
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setCalculationMode("exclusive")}
                      className={`py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 border-2 ${
                        calculationMode === "exclusive"
                          ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                          : "border-gray-200 text-slate-500 bg-transparent hover:border-slate-300"
                      }`}
                    >
                      Excluding GST
                    </button>
                    <button
                      onClick={() => setCalculationMode("inclusive")}
                      className={`py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 border-2 ${
                        calculationMode === "inclusive"
                          ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                          : "border-gray-200 text-slate-500 bg-transparent hover:border-slate-300"
                      }`}
                    >
                      Including GST
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    {calculationMode === "exclusive"
                      ? "Net Price (Pre-Tax)"
                      : "Gross Price (Total)"}
                  </label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 text-xl font-bold group-focus-within:text-blue-600 transition-colors">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-2xl text-slate-800 focus:border-blue-600 focus:bg-white outline-none transition-all shadow-inner"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* GST Rate */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    GST Rate
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[5, 12, 18, 28].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => {
                          setTaxRate(rate);
                          setIsCustomRate(false);
                        }}
                        className={`flex-1 py-3.5 rounded-xl font-bold text-lg border-2 transition-all duration-200 ${
                          taxRate === rate && !isCustomRate
                            ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                            : "border-gray-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                    <div className="relative w-24">
                      <input
                        type="number"
                        placeholder="%"
                        value={isCustomRate ? taxRate : ""}
                        onClick={() => setIsCustomRate(true)}
                        onChange={(e) => {
                          setTaxRate(e.target.value);
                          setIsCustomRate(true);
                        }}
                        className={`w-full h-full px-2 rounded-xl border-2 text-center font-bold text-lg outline-none transition-all ${
                          isCustomRate
                            ? "border-blue-600 text-blue-700 bg-blue-50"
                            : "border-gray-200 text-slate-500 bg-white focus:border-slate-400"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: RESULTS (Dark Theme) */}
              <div className="bg-[#0F172A] p-8 md:p-10 lg:w-2/5 text-white flex flex-col justify-between relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

                <div className="relative z-10 space-y-6">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1">
                      Net Amount
                    </p>
                    <p className="text-2xl font-bold font-heading">
                      {formatCurrency(results.netPrice)}
                    </p>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-700/50">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">
                        CGST ({parseFloat(taxRate / 2).toFixed(1)}%)
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(results.cgst)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">
                        SGST ({parseFloat(taxRate / 2).toFixed(1)}%)
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(results.sgst)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                    <span className="text-slate-300 font-bold text-sm">
                      Total Tax
                    </span>
                    <span className="text-xl font-bold text-rose-400">
                      {formatCurrency(results.totalTax)}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 mt-10 pt-8 border-t border-slate-700">
                  <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">
                    Total Payable
                  </p>
                  <p className="text-4xl md:text-5xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                    {formatCurrency(results.grossPrice)}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Live Calculation
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- MAIN CONTENT SECTION --- */}
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Main Article */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
              <section className="mb-14">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 font-heading">
                  What is GST?
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  GST has brought to simplifying taxation for service and
                  commodity businesses. GST is an indirect tax applicable to the
                  supply of goods and services in India.
                </p>
                <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                  <ul className="space-y-4">
                    <li className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <strong className="block text-slate-900 font-heading">
                          Indirect Tax
                        </strong>
                        <span className="text-sm text-slate-500">
                          Collected by intermediary (retail stores) from the
                          consumer.
                        </span>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <strong className="block text-slate-900 font-heading">
                          Launch Date
                        </strong>
                        <span className="text-sm text-slate-500">
                          Midnight on 1st July 2017 by the President of India.
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </section>

              <section className="mb-14">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 font-heading">
                  Benefits of GST
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <ContentSection title="Transparency">
                    GST provides transparency throughout the tax structure.
                    Centralised registration allows small businesses to file
                    returns easily.
                  </ContentSection>
                  <ContentSection title="Threshold Limits">
                    Relaxation in threshold limits (exempt under ₹20 lakh) gives
                    relief to small businesses from lengthy taxation processes.
                  </ContentSection>
                  <ContentSection title="Composition Schemes">
                    Taxpayers under composition schemes benefit by paying only
                    1% tax on turnover (for turnover up to ₹75 lakh).
                  </ContentSection>
                  <ContentSection title="GDP Impact">
                    GST is expected to positively impact GDP by increasing
                    competition, boosting exports, and generating employment.
                  </ContentSection>
                </div>
              </section>

              <section className="mb-14">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 font-heading">
                  GST Rate Slabs
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      rate: "5%",
                      color: "border-l-4 border-emerald-500",
                      desc: "Sugar, oil, spices, coffee, coal, medicines, railways.",
                    },
                    {
                      rate: "12%",
                      color: "border-l-4 border-blue-500",
                      desc: "Cell phones, sewing machines, processed foods, construction.",
                    },
                    {
                      rate: "18%",
                      color: "border-l-4 border-indigo-500",
                      desc: "Electronics, pastries, furniture, cameras, IT services.",
                    },
                    {
                      rate: "28%",
                      color: "border-l-4 border-rose-500",
                      desc: "Automobiles, cement, pan masala, 5-star hotels.",
                    },
                  ].map((slab, i) => (
                    <div
                      key={i}
                      className={`p-4 bg-gray-50 rounded-r-xl ${slab.color}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold font-heading text-slate-900">
                          {slab.rate} Slab
                        </span>
                        <span className="text-sm text-slate-600">
                          {slab.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-6 font-heading">
                  Formulas
                </h2>
                <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="relative z-10 grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-bold text-lg text-slate-300 mb-3">
                        Adding GST
                      </h3>
                      <code className="block bg-black/30 p-3 rounded-lg text-green-400 font-mono text-sm">
                        GST = (Cost * Rate) / 100
                      </code>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-300 mb-3">
                        Removing GST
                      </h3>
                      <code className="block bg-black/30 p-3 rounded-lg text-blue-400 font-mono text-sm">
                        GST = Cost - [Cost x {`{100/(100+Rate)}`}]
                      </code>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar / FAQ */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6 font-heading">
                  FAQ
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      q: "How is GST calculated?",
                      a: "Multiply the GST rate with the taxable amount. GST = (Cost * Rate) / 100.",
                    },
                    {
                      q: "What are the 3 types of GST?",
                      a: "CGST (Central), SGST (State), and IGST (Integrated).",
                    },
                    {
                      q: "Who pays GST?",
                      a: "The consumer bears the cost, but the supplier collects and pays it to the government.",
                    },
                  ].map((faq, index) => (
                    <details key={index} className="group">
                      <summary className="flex justify-between items-center font-bold text-slate-700 cursor-pointer list-none py-3 hover:text-blue-600 transition-colors">
                        <span className="text-sm">{faq.q}</span>
                        <span className="transform transition-transform duration-200 group-open:rotate-180 text-slate-400">
                          <svg
                            fill="none"
                            height="12"
                            width="12"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 9l6 6 6-6"></path>
                          </svg>
                        </span>
                      </summary>
                      <div className="text-slate-500 text-sm leading-relaxed pb-3">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* --- FOOTER --- */}
          <footer className="mt-16 border-t border-slate-200 pt-8 pb-4 text-center">
            <p className="text-slate-500 text-sm font-medium">
              © {year} Inside Invoice by 2X+1. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default GSTCalculator;
