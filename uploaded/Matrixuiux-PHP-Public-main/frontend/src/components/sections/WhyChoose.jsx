import React from "react";
import { Zap, ShieldCheck, Infinity as InfinityIcon, Headphones, Lock, RotateCcw } from "lucide-react";

const items = [
  { icon: Zap, color: "from-amber-500 to-orange-500", title: "Instant Delivery", text: "Receive your authentic license key via email within 15-30 minutes of purchase." },
  { icon: ShieldCheck, color: "from-emerald-500 to-teal-500", title: "100% Genuine Products", text: "All licenses are authentic and sourced from authorized Microsoft distributors." },
  { icon: InfinityIcon, color: "from-blue-500 to-indigo-500", title: "Perpetual License", text: "No recurring fees or subscriptions. One-time purchase with perpetual lifetime use." },
  { icon: Headphones, color: "from-purple-500 to-fuchsia-500", title: "Expert Support", text: "Professional technical support for installation, activation, and any questions." },
  { icon: Lock, color: "from-cyan-500 to-blue-500", title: "Secure Checkout", text: "Shop with confidence using our SSL-encrypted payment processing." },
  { icon: RotateCcw, color: "from-rose-500 to-pink-500", title: "180-Day Guarantee", text: "Not satisfied? Get a full refund within 180 days, no questions asked." },
];

const WhyChoose = () => (
  <section className="py-20 bg-slate-50">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto">
        <div className="text-xs font-bold tracking-[0.2em] text-blue-700 mb-3">WHY CHOOSE US</div>
        <h2 className="text-4xl font-bold text-slate-900">Why Choose Perpetual Licenses?</h2>
        <p className="mt-3 text-slate-600">Get the complete Microsoft Office experience with one-time purchase. No recurring subscription fees, just authentic software that's yours forever.</p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it) => (
          <div key={it.title} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${it.color} flex items-center justify-center mb-4`}>
              <it.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{it.title}</h3>
            <p className="text-sm text-slate-600 mt-2">{it.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChoose;
