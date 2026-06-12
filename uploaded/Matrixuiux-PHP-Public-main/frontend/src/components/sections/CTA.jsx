import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Download, Headphones, Lock } from "lucide-react";
import { Button } from "../../components/ui/button";

const CTA = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="relative rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b3bb0 50%, #4f46e5 100%)" }}>
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="relative px-8 py-14 lg:px-16 text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold leading-tight">Get Your Microsoft Office License Today</h2>
          <p className="mt-3 text-blue-100 max-w-2xl mx-auto">Authentic perpetual licenses with professional support and instant delivery. Join 50,000+ satisfied customers.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-300" />Genuine Licenses</span>
            <span className="flex items-center gap-1.5"><Download className="w-4 h-4 text-amber-300" />Instant Download</span>
            <span className="flex items-center gap-1.5"><Headphones className="w-4 h-4 text-purple-300" />Professional Support</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-cyan-300" />Secure Checkout</span>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/shop"><Button size="lg" className="bg-white text-blue-700 hover:bg-slate-100 rounded-full px-6 h-12 font-semibold">Browse Products</Button></Link>
            <Button size="lg" variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white/10 rounded-full px-6 h-12 font-semibold">Compare Editions</Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CTA;
