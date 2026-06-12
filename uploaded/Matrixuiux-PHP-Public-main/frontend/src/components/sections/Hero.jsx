import React from "react";
import { Link } from "react-router-dom";
import { Zap, Check, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { HeroVisual, TrustStrip } from "./HeroVisual";

const HERO_POINTS = ["100% Genuine Microsoft License Keys", "Perpetual Access - No Subscriptions", "Instant Digital Delivery"];
const HERO_STATS = [{ k: "50K+", v: "Happy Customers" }, { k: "24/7", v: "Instant Delivery" }, { k: "4.9/5", v: "Customer Rating" }];

const Hero = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40">
    <div className="absolute inset-0 dot-pattern opacity-70" />
    <div className="relative max-w-7xl mx-auto px-4 pt-12 lg:pt-16 pb-16 lg:pb-20 grid lg:grid-cols-2 gap-10 items-center">
      <div className="fade-up">
        <div className="inline-flex items-center gap-2 bg-blue-100/70 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-5">
          <Zap className="w-3.5 h-3.5" />Instant Digital Delivery
        </div>
        <h1 className="text-[34px] lg:text-5xl xl:text-[56px] font-extrabold text-slate-900 leading-[1.08] tracking-tight">
          <span className="block">Boost Productivity with</span>
          <span className="block">Microsoft Office 2024</span>
          <span className="block mt-1 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">for Business and Personal Use</span>
        </h1>
        <p className="mt-5 text-lg text-slate-600 max-w-lg">Trusted by over fifty thousand users across the globe.</p>

        <ul className="mt-6 space-y-2.5">
          {HERO_POINTS.map((x) => (
            <li key={x} className="flex items-center gap-2.5 text-slate-700">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Check className="w-3 h-3" /></span>
              {x}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/shop">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 h-12 font-semibold">Shop Now <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </Link>
          <Button size="lg" variant="outline" className="rounded-full px-6 h-12 font-semibold border-slate-300">Compare Editions</Button>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
          {HERO_STATS.map((s) => (
            <div key={s.k}>
              <div className="text-2xl font-bold text-slate-900">{s.k}</div>
              <div className="text-xs text-slate-500">{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      <HeroVisual />
    </div>

    <TrustStrip />
  </section>
);

export default Hero;
