import React from "react";
import { Search, Lock, Download, KeyRound } from "lucide-react";

const steps = [
  { n: "01", icon: Search, title: "Choose Your Edition", text: "Browse our selection and pick the Microsoft Office edition that fits your needs." },
  { n: "02", icon: Lock, title: "Secure Checkout", text: "Complete your purchase through our SSL-secured payment with multiple options." },
  { n: "03", icon: Download, title: "Instant Delivery", text: "Receive your license key via email within 15-30 minutes of confirmation." },
  { n: "04", icon: KeyRound, title: "Download & Activate", text: "Download directly from Microsoft, enter your key, and start using Office." },
];

const HowItWorks = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <div className="text-xs font-bold tracking-[0.2em] text-blue-700 mb-3">SIMPLE PROCESS</div>
      <h2 className="text-4xl font-bold text-slate-900">How It Works</h2>
      <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Get your authentic Microsoft Office license in four simple steps. Professional support available throughout the process.</p>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((s) => (
          <div key={s.n} className="relative bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="absolute -top-3 -right-3 text-5xl font-extrabold text-blue-50 select-none">{s.n}</div>
            <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 mx-auto">
              <s.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">{s.title}</h3>
            <p className="text-sm text-slate-600 mt-2">{s.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-20">
        <h3 className="text-3xl font-bold text-slate-900">Trusted by Thousands of Customers</h3>
        <p className="mt-2 text-slate-500">Join satisfied customers who chose authentic Microsoft Office software</p>
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[{ k: "100%", v: "Authentic Licenses" }, { k: "50,000+", v: "Happy Customers" }, { k: "15-30min", v: "Delivery Time" }, { k: "4.9/5", v: "Customer Rating" }].map((s) => (
            <div key={s.v} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
              <div className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{s.k}</div>
              <div className="text-sm text-slate-600 mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;
