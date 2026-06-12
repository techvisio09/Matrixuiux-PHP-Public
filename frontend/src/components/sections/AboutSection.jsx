import React from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";

const AboutSection = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-4xl font-bold text-slate-900 leading-tight">Your Trusted Software Partner</h2>
        <p className="mt-4 text-slate-600">At UCODE SOFTTECH, we're committed to providing genuine Microsoft software at competitive prices. Our team of experts ensures every customer receives the support they need for a seamless experience.</p>
        <p className="mt-3 text-slate-600">We go beyond simply selling products. Our philosophy revolves around problem-solving, ensuring we address any challenges our customers encounter with installation, activation, or usage.</p>
        <ul className="mt-6 grid sm:grid-cols-2 gap-3">
          {["Authorized Microsoft reseller", "50,000+ satisfied customers", "Instant digital delivery", "Free professional support", "Mon-Sat, 9-6 EST support", "180-day money-back guarantee"].map((x) => (
            <li key={x} className="flex items-center gap-2 text-sm text-slate-700"><span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center"><Check className="w-3 h-3" /></span>{x}</li>
          ))}
        </ul>
        <Link to="/about-us"><Button className="mt-7 bg-blue-600 hover:bg-blue-700 rounded-full">Learn More About Us <ArrowRight className="w-4 h-4 ml-1.5" /></Button></Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[{ k: "50,000+", v: "Happy Customers", c: "from-blue-500 to-indigo-600" }, { k: "100%", v: "Genuine Products", c: "from-emerald-500 to-teal-600" }, { k: "15-30min", v: "Delivery Time", c: "from-amber-500 to-orange-600" }, { k: "4.9/5", v: "Customer Rating", c: "from-purple-500 to-fuchsia-600" }].map((s) => (
          <div key={s.v} className={`rounded-2xl p-6 text-white relative overflow-hidden bg-gradient-to-br ${s.c}`}>
            <div className="relative">
              <div className="text-3xl lg:text-4xl font-extrabold">{s.k}</div>
              <div className="text-sm opacity-90 mt-1">{s.v}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
