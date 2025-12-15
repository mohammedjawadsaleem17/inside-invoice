import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  FileText,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  BarChart3,
  Zap,
  Clock,
  Shield,
  ArrowRight,
  Menu,
  X,
  Check,
  Sparkles,
  Receipt,
  CreditCard,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import InvoiceNav from "./Navigation/InvoiceNav";

export default function GSTBillingLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const year = new Date().getFullYear();

  const testimonials = [
    {
      name: "Fahad Pasha",
      business: "RS Hardware Glass and Electrical",
      location: "Bangalore, Karnataka",
      initials: "RS",
      rating: 5,
      text: "I am very much happy with the product. I now generate invoices with a click and managing invoices is now a piece of cake. It becomes easy for me to file my GST. Computer-generated invoices are now a must and asked by each and every customer. This is really easing my life!",
      gradient: "from-slate-500 to-slate-700",
    },
    {
      name: "Priya Mehta",
      business: "Fashion Boutique",
      location: "Delhi",
      initials: "PM",
      rating: 5,
      text: "Fantastic tool! Saves me hours every week. The GST calculations are always accurate and the interface is so easy to use.",
      gradient: "from-slate-600 to-gray-700",
    },
    {
      name: "Amit Kumar",
      business: "Electronics Store",
      location: "Bangalore",
      initials: "AK",
      rating: 5,
      text: "Best decision for my business! Inventory management and invoicing all in one place. Highly recommended!",
      gradient: "from-gray-500 to-slate-600",
    },
    {
      name: "Sneha Kapoor",
      business: "Cafe Owner",
      location: "Pune",
      initials: "SK",
      rating: 5,
      text: "Simple, powerful, and reliable. My customers love the professional invoices. Great support team too!",
      gradient: "from-slate-500 to-gray-600",
    },
    {
      name: "Vikram Gupta",
      business: "Retail Shop",
      location: "Jaipur",
      initials: "VG",
      rating: 5,
      text: "Made my business operations so much smoother. The real-time tracking is a game changer!",
      gradient: "from-gray-600 to-slate-700",
    },
  ];

  const faqs = [
    {
      question: "Is Inside Invoice really free?",
      answer:
        "Yes! Inside Invoice offers a free forever plan with all essential features including GST invoice generation, inventory management, and customer tracking. We also offer premium plans with advanced features for growing businesses.",
    },
    {
      question: "Is my business data secure?",
      answer:
        "Absolutely! We use bank-level encryption and secure cloud storage to protect your data. Your information is backed up regularly and only you have access to your business data. We are fully compliant with data protection regulations.",
    },
    {
      question: "Do I need to download any software?",
      answer:
        "No downloads needed! Inside Invoice is 100% web-based. Simply sign up and access it from any device with an internet connection - whether it's your computer, tablet, or smartphone.",
    },
    {
      question: "Does it support all GST types?",
      answer:
        "Yes! Inside Invoice supports CGST, SGST, IGST, and all GST scenarios. It automatically calculates the correct tax based on your customer's location and handles interstate and intrastate transactions.",
    },
    {
      question: "Can I track inventory with this tool?",
      answer:
        "Absolutely! Inside Invoice includes comprehensive inventory management. Track stock levels in real-time, get low stock alerts, manage multiple product categories, and generate inventory reports.",
    },
    {
      question: "How do I get support if I need help?",
      answer:
        "We offer multiple support channels including email support, live chat, video tutorials, and comprehensive documentation. Our support team typically responds within 24 hours on business days.",
    },
    {
      question: "Can I export my invoices and reports?",
      answer:
        "Yes! You can export invoices as PDF for printing or sharing with customers. You can also export reports and data in Excel format for accounting purposes or GST filing.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        h1, h2, h3, .logo-text {
          font-family: 'Space Grotesk', sans-serif;
        }

        .fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .invoice-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }

        .gradient-text {
          background: linear-gradient(135deg, #475569 0%, #64748b 50%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .carousel-slide {
          transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
        }

        .carousel-slide.active {
          opacity: 1;
          transform: translateX(0);
        }

        .carousel-slide.inactive {
          opacity: 0;
          transform: translateX(20px);
          position: absolute;
        }
      `}</style>

      {/* Navigation */}
      <InvoiceNav
        scrolled={scrolled}
        setIsMenuOpen={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-1 overflow-hidden">
        <div className="max-w-full mx-auto px-2">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 fade-in px-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-full text-sm font-medium text-slate-700 border border-slate-200">
                <Sparkles className="w-4 h-4" />
                Built for Indian Small Businesses
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight">
                GST Billing <span className="gradient-text">Made Simple</span>{" "}
                for India
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed font-normal">
                Your all-in-one web platform for GST-compliant invoicing,
                inventory tracking, and business management. Built with love for
                Indian entrepreneurs who want to focus on growth, not paperwork.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <button className="px-7 py-3 bg-gradient-to-r from-slate-700 via-gray-700 to-slate-800 text-white rounded-lg hover:shadow-lg hover:shadow-slate-500/30 hover:scale-[1.02] transition-all duration-200 font-medium text-base flex items-center gap-2">
                    Try Now - It's FREE
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <button className="px-7 py-3 glass-effect text-slate-700 rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-base border border-slate-200">
                  Start Acceleration
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">100%</div>
                  <div className="text-xs text-slate-600 mt-1 font-medium">
                    Web-Based
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">Free</div>
                  <div className="text-xs text-slate-600 mt-1 font-medium">
                    Forever Plan
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">24/7</div>
                  <div className="text-xs text-slate-600 mt-1 font-medium">
                    Access
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Preview */}
            <div className="relative px-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl transform rotate-6 opacity-20 blur-xl"></div>
              <div className="relative glass-effect rounded-2xl p-6 shadow-xl border border-white invoice-float">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xl font-bold gradient-text mb-1">
                      TAX INVOICE
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      Invoice #INV-2024-001
                    </div>
                  </div>
                  <div className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium text-xs">
                    PAID
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 mb-3 border border-blue-200">
                  <div className="font-medium text-gray-900 mb-1.5 text-sm">
                    ABC Enterprises Pvt Ltd
                  </div>
                  <div className="text-xs text-gray-600 space-y-0.5">
                    <div>123 Business Street, Mumbai</div>
                    <div className="font-medium text-blue-700">
                      GSTIN: 27AABCU9603R1ZX
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center p-2.5 bg-white/50 rounded-lg border border-gray-200">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        Product Name
                      </div>
                      <div className="text-[10px] text-gray-600">
                        Qty: 2 × ₹1,000
                      </div>
                    </div>
                    <div className="font-medium text-gray-900 text-sm">
                      ₹2,000
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-white/50 rounded-lg border border-gray-200">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        Service Charges
                      </div>
                      <div className="text-[10px] text-gray-600">
                        Qty: 1 × ₹500
                      </div>
                    </div>
                    <div className="font-medium text-gray-900 text-sm">
                      ₹500
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-300 pt-3 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="font-medium">₹2,500</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 font-medium">CGST (9%)</span>
                    <span className="font-medium">₹225</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 font-medium">SGST (9%)</span>
                    <span className="font-medium">₹225</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300">
                    <span className="font-bold text-sm gradient-text">
                      TOTAL
                    </span>
                    <span className="font-bold text-lg gradient-text">
                      ₹2,950
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-violet-200 rounded-lg flex items-center justify-center">
                    <div className="text-[10px] font-medium text-blue-700">
                      QR Code
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-600 font-normal">
                    Scan to verify invoice authenticity
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 glass-effect rounded-xl shadow-lg p-3 border border-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">
                      GST Ready
                    </div>
                    <div className="text-xs text-gray-600 font-normal">
                      100% Compliant
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-1 bg-white">
        <div className="max-w-full mx-auto px-2">
          <div className="text-center mb-16 px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-full text-sm font-medium text-slate-700 mb-6 border border-slate-200">
              <Zap className="w-4 h-4" />
              Powerful Features
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-3">
              Everything You Need in{" "}
              <span className="gradient-text">One Place</span>
            </h2>
            <p className="text-lg text-slate-600 font-normal">
              Built for the modern Indian business owner
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {[
              {
                icon: <Receipt className="w-6 h-6" />,
                color: "from-slate-500 to-gray-600",
                title: "GST Invoice Generation",
                description:
                  "Create professional GST-compliant invoices in seconds. Supports all invoice types and formats with automatic calculations.",
              },
              {
                icon: <Package className="w-6 h-6" />,
                color: "from-gray-500 to-slate-600",
                title: "Inventory Management",
                description:
                  "Track stock levels in real-time. Get low stock alerts and manage your products effortlessly.",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                color: "from-slate-600 to-gray-700",
                title: "Smart GST Calculation",
                description:
                  "Automatic GST calculation with real-time updates. Supports CGST, SGST, IGST, and all tax scenarios.",
              },
              {
                icon: <Users className="w-6 h-6" />,
                color: "from-gray-600 to-slate-700",
                title: "Customer Management",
                description:
                  "Keep track of all your customers, their purchase history, and payment status in one dashboard.",
              },
              {
                icon: <CreditCard className="w-6 h-6" />,
                color: "from-slate-500 to-gray-600",
                title: "Payment Tracking",
                description:
                  "Track payments, send reminders, and reconcile accounts automatically. Never miss a payment.",
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                color: "from-gray-500 to-slate-600",
                title: "Business Analytics",
                description:
                  "Get insights into your business performance with detailed reports and visual dashboards.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group glass-effect rounded-xl p-6 hover:shadow-lg transition-all duration-200 border border-white hover:scale-[1.02] cursor-pointer"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-105 group-hover:rotate-3 transition-all duration-200 shadow-md`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed font-normal text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Invoice Tracking Section */}
      <section
        id="tracking"
        className="py-20 px-1 bg-gradient-to-br from-slate-50 to-gray-100"
      >
        <div className="max-w-full mx-auto px-2">
          <div className="text-center mb-16 px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-full text-sm font-medium text-slate-700 mb-6 border border-slate-200">
              <BarChart3 className="w-4 h-4" />
              Invoice Analytics
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-3">
              Track Every <span className="gradient-text">Invoice</span> in
              Real-Time
            </h2>
            <p className="text-lg text-slate-600 font-normal">
              Powerful insights to help you manage your business better
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 px-4">
            <div className="space-y-5">
              <div className="glass-effect rounded-xl p-6 border border-white shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-5">
                  Invoice Dashboard
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-600 font-medium">
                          Paid Invoices
                        </div>
                        <div className="text-lg font-bold text-slate-900">
                          ₹2,45,000
                        </div>
                      </div>
                    </div>
                    <div className="text-green-600 font-bold text-2xl">156</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-600 font-medium">
                          Pending Invoices
                        </div>
                        <div className="text-lg font-bold text-slate-900">
                          ₹45,000
                        </div>
                      </div>
                    </div>
                    <div className="text-orange-600 font-bold text-2xl">23</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-lg flex items-center justify-center">
                        <X className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-600 font-medium">
                          Overdue Invoices
                        </div>
                        <div className="text-lg font-bold text-slate-900">
                          ₹12,000
                        </div>
                      </div>
                    </div>
                    <div className="text-red-600 font-bold text-2xl">8</div>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-xl p-6 border border-white shadow-lg">
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Key Benefits
                </h3>
                <div className="space-y-2.5">
                  {[
                    "Real-time invoice status tracking",
                    "Automated payment reminders",
                    "Visual analytics and reports",
                    "Export data to Excel/PDF",
                    "Filter by date, customer, status",
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 bg-gradient-to-br from-slate-500 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check
                          className="w-2.5 h-2.5 text-white"
                          strokeWidth={3}
                        />
                      </div>
                      <span className="text-slate-700 font-normal text-sm">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-xl p-6 border border-white shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  Monthly Revenue
                </h3>
                <div className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium text-xs">
                  ↑ 23% Growth
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { month: "Jan", amount: 45000, percentage: 60 },
                  { month: "Feb", amount: 52000, percentage: 70 },
                  { month: "Mar", amount: 38000, percentage: 50 },
                  { month: "Apr", amount: 68000, percentage: 90 },
                  { month: "May", amount: 72000, percentage: 95 },
                  { month: "Jun", amount: 85000, percentage: 100 },
                ].map((data, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-700">
                        {data.month}
                      </span>
                      <span className="text-xs font-bold gradient-text">
                        ₹{data.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="relative h-6 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-slate-600 via-gray-600 to-slate-700 rounded-lg transition-all duration-1000 flex items-center justify-end pr-2"
                        style={{ width: `${data.percentage}%` }}
                      >
                        <span className="text-white text-[10px] font-medium">
                          {data.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg border border-slate-200">
                    <div className="text-xs text-slate-600 font-medium">
                      Total Generated
                    </div>
                    <div className="text-xl font-bold gradient-text">₹3.6L</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-slate-100 rounded-lg border border-gray-200">
                    <div className="text-xs text-slate-600 font-medium">
                      Avg. Invoice
                    </div>
                    <div className="text-xl font-bold gradient-text">₹60K</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section id="testimonials" className="py-20 px-1 bg-white">
        <div className="max-w-full mx-auto px-2">
          <div className="text-center mb-16 px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-full text-sm font-medium text-slate-700 mb-6 border border-slate-200">
              <Star className="w-4 h-4 fill-slate-600" />
              Customer Reviews
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-3">
              Loved by <span className="gradient-text">Business Owners</span>
            </h2>
            <p className="text-lg text-slate-600 font-normal">
              See what our customers have to say
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto px-4">
            <div className="relative overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`carousel-slide ${
                    index === currentTestimonial ? "active" : "inactive"
                  }`}
                  style={{
                    display: index === currentTestimonial ? "block" : "none",
                  }}
                >
                  <div className="glass-effect rounded-2xl p-10 border border-slate-200 shadow-xl">
                    <div className="flex items-center gap-1.5 mb-5 justify-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-6 h-6 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <Quote className="w-12 h-12 text-slate-200 mb-5 mx-auto" />
                    <p className="text-xl text-slate-700 leading-relaxed mb-6 font-normal text-center">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${testimonial.gradient} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md`}
                      >
                        {testimonial.initials}
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-slate-900 text-lg">
                          {testimonial.name}
                        </div>
                        <div className="text-slate-600 font-medium text-sm">
                          {testimonial.business}
                        </div>
                        <div className="text-xs text-slate-500">
                          {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors border border-slate-200"
            >
              <ChevronLeft className="w-6 h-6 text-slate-700" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors border border-slate-200"
            >
              <ChevronRight className="w-6 h-6 text-slate-700" />
            </button>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-slate-700 w-6"
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="py-20 px-1 bg-gradient-to-br from-slate-50 to-gray-100"
      >
        <div className="max-w-full mx-auto px-2">
          <div className="text-center mb-16 px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-full text-sm font-medium text-slate-700 mb-6 border border-slate-200">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-3">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-lg text-slate-600 font-normal">
              Everything you need to know about Inside Invoice
            </p>
          </div>

          <div className="max-w-4xl mx-auto px-4">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="glass-effect rounded-xl border border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-lg"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-slate-50/50"
                  >
                    <span className="text-lg font-bold text-slate-900 pr-8">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-600 flex-shrink-0 transition-transform duration-300 ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      openFaq === index
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-slate-600 leading-relaxed font-normal">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center glass-effect rounded-xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Still have questions?
              </h3>
              <p className="text-slate-600 mb-6 font-normal">
                Can't find the answer you're looking for? Please reach out to
                our friendly team.
              </p>
              <Link to="/contact">
                <button className="px-7 py-3 bg-gradient-to-r from-slate-700 via-gray-700 to-slate-800 text-white rounded-lg hover:shadow-lg hover:shadow-slate-500/30 hover:scale-[1.02] transition-all duration-200 font-medium text-base flex items-center gap-2 mx-auto">
                  Contact Support
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-gray-700 to-slate-800"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-300 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white mb-6 border border-white/30">
            <Sparkles className="w-4 h-4" />
            Start Your Journey
          </div>

          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-5">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg text-slate-200 mb-8 font-normal">
            Join hundreds of Indian businesses already using Inside Invoice to
            streamline their operations
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <button className="px-8 py-3 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium text-base shadow-xl hover:scale-[1.02]">
                Try Now - Free Forever →
              </button>
            </Link>
            <Link to="/contact">
              <button className="px-8 py-3 bg-transparent text-white border border-white rounded-lg hover:bg-white hover:text-slate-700 transition-all duration-200 font-medium text-base hover:scale-[1.02]">
                Contact US
              </button>
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-xs text-slate-200 font-medium">
                Web-Based
              </div>
            </div>
            <div className="w-px h-10 bg-white/30"></div>
            <div className="text-center">
              <div className="text-2xl font-bold">Free</div>
              <div className="text-xs text-slate-200 font-medium">
                Forever Plan
              </div>
            </div>
            <div className="w-px h-10 bg-white/30"></div>
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-xs text-slate-200 font-medium">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-1">
        <div className="max-w-full mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2.5 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-700 via-gray-700 to-slate-900 rounded-xl flex items-center justify-center shadow-md">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="10" cy="8" r="2.5" fill="white" />
                    <rect
                      x="8.5"
                      y="12"
                      width="3"
                      height="12"
                      rx="1.5"
                      fill="white"
                    />
                    <circle
                      cx="20"
                      cy="11"
                      r="1.8"
                      fill="white"
                      opacity="0.9"
                    />
                    <rect
                      x="18.6"
                      y="15"
                      width="2.8"
                      height="9"
                      rx="1.4"
                      fill="white"
                      opacity="0.9"
                    />
                  </svg>
                </div>
                <div>
                  <span className="text-lg font-bold text-white logo-text">
                    Inside Invoice
                  </span>
                  <div className="text-[8px] text-slate-400 font-medium tracking-widest">
                    BY{" "}
                    <a href="https://twoxplusone.netlify.app/" target="_blank">
                      2X+1
                    </a>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm font-normal">
                Built with 💜 for Indian small businesses. Making GST billing
                simple and beautiful.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3">Products</h4>
              <ul className="space-y-2 text-sm font-normal">
                <li>
                  <Link
                    to="/gst-calculator"
                    className="hover:text-slate-400 transition-colors"
                  >
                    GST Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    to="/qr-generator"
                    className="hover:text-slate-400 transition-colors"
                  >
                    QR Code Generator
                  </Link>
                </li>
                <li>
                  <Link
                    to="/barcode-generator"
                    className="hover:text-slate-400 transition-colors"
                  >
                    Barcode Generator
                  </Link>
                </li>
                <li>
                  <Link
                    to="/business-card"
                    className="hover:text-slate-400 transition-colors"
                  >
                    Business Card
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3">Support</h4>
              <ul className="space-y-2 text-sm font-normal">
                <li>
                  <Link
                    to="/help"
                    className="hover:text-slate-400 transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/video"
                    className="hover:text-slate-400 transition-colors"
                  >
                    Video Tutorials
                  </Link>
                </li>
                <li>
                  <a
                    href="/documentation"
                    className="hover:text-slate-400 transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-slate-400 transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3">Company</h4>
              <ul className="space-y-2 text-sm font-normal">
                <li>
                  <a
                    href="https://twoxplusone.netlify.app/"
                    target="_blank"
                    className="hover:text-slate-400 transition-colors"
                  >
                    About 2X+1
                  </a>
                </li>
                <li>
                  <Link
                    to="/terms-and-condition"
                    className="hover:text-slate-400 transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/refund-policy"
                    className="hover:text-slate-400 transition-colors"
                  >
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy-policy"
                    className="hover:text-slate-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400 font-normal">
              © {year} Inside Invoice by{" "}
              <a href="https://twoxplusone.netlify.app/" target="_blank">
                2X+1
              </a>
              . All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-gray-400 hover:text-slate-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="https://github.com/insideinvoice"
                className="text-gray-400 hover:text-slate-400 transition-colors"
                target="_blank"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-slate-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
