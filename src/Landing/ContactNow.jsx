import React, { useEffect, useState } from "react";
import InvoiceNav from "./Navigation/InvoiceNav";
import axios from "axios";

 export default function ContactNow() {
   const [form, setForm] = useState({
     name: "",
     email: "",
     phone: "",
     message: "",
   });
   const [isMenuOpen, setIsMenuOpen] = useState(false);

   const [submitted, setSubmitted] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [error, setError] = useState("");

   const handleChange = (e) => {
     setForm({ ...form, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
     e.preventDefault();
     setSubmitting(true);
     setError("");

      try {
        await axios.post("https://inside-invoice-backend.onrender.com/contact", {
         name: form.name,
         email: form.email,
         phone: form.phone,
         message: form.message,
       });
       setSubmitted(true);
       setForm({ name: "", email: "", phone: "", message: "" });
     } catch (err) {
       setError(err.response?.data?.message || "Something went wrong. Please try again.");
     } finally {
       setSubmitting(false);
     }
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
       <div className="max-w-3xl mx-auto px-4 py-12 mt-20">
         <h1 className="text-3xl font-bold mb-2">Contact Inside Invoice</h1>
         <p className="text-slate-500 mb-8">
           Have a question or need help? Our team is always happy to assist you.
         </p>

          {submitted && (
            <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-1">
                Thank you for contacting Inside Invoice
              </h3>
              <p className="text-sm text-green-700">
                We've received your message and one of our team members will
                surely get back to you shortly.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

         <form
           onSubmit={handleSubmit}
           className="bg-white shadow-md rounded-xl p-6 space-y-4"
         >
           {/* Name */}
           <div>
             <label className="block text-sm font-medium mb-1 text-slate-700">
               Full Name
             </label>
             <input
               type="text"
               name="name"
               required
               value={form.name}
               onChange={handleChange}
               placeholder="Enter your name"
               className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-800"
             />
           </div>

           {/* Email */}
           <div>
             <label className="block text-sm font-medium mb-1 text-slate-700">
               Email Address
             </label>
             <input
               type="email"
               name="email"
               required
               value={form.email}
               onChange={handleChange}
               placeholder="Enter your email"
               className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-800"
             />
           </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-800"
              />
            </div>

           {/* Message */}
           <div>
             <label className="block text-sm font-medium mb-1 text-slate-700">
               Message
             </label>
             <textarea
               name="message"
               required
               value={form.message}
               onChange={handleChange}
               placeholder="Tell us how we can help you..."
               rows="4"
               className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-800"
             />
           </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Contact Now"}
            </button>

            <p className="text-xs text-center text-slate-400 pt-2">
              Thank you for choosing Inside Invoice
            </p>
         </form>
       </div>
     </>
   );
 }
