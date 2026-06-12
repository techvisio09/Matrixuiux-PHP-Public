import React from "react";
import { Link } from "react-router-dom";
import { Zap, Check, Sparkles, ShieldCheck, Star } from "lucide-react";
import { appIcons } from "../../mock";
import { findProduct } from "../../data/variants";
import { useCurrency } from "../../context/CurrencyContext";

const FLOATING_ICONS = [
  { name: "word", top: "22%", left: "6%", delay: "0s" },
  { name: "excel", bottom: "30%", left: "4%", delay: "0.3s" },
  { name: "powerpoint", top: "10%", left: "24%", delay: "0.6s" },
  { name: "outlook", top: "22%", right: "6%", delay: "0.9s" },
];

const SideCard = ({ product, name, position, rotate, testId, format }) => (
  <Link to={`/product/${product.id}`} className={`absolute ${position} w-32 lg:w-40 bg-white rounded-2xl shadow-xl p-3 ${rotate} transition-transform hidden sm:block`} data-testid={testId}>
    <img src={product.image} alt={product.name} className="w-full h-24 lg:h-28 object-contain" />
    <p className="text-[11px] font-semibold text-slate-900 mt-2 line-clamp-1">{name || product.name}</p>
    <p className="text-xs font-bold text-blue-700">{format(product.price)}</p>
  </Link>
);

const MainCard = ({ product, format }) => (
  <Link to={`/product/${product.id}`} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 lg:w-64 bg-white rounded-3xl shadow-2xl p-4 lg:p-5 rotate-[-2deg] hover:rotate-0 hover:scale-[1.02] transition-transform" data-testid="hero-card-main">
    <span className="absolute -top-2.5 left-4 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">BEST SELLER</span>
    <img src={product.image} alt={product.name} className="w-full h-44 lg:h-52 object-contain" />
    <p className="text-sm font-bold text-slate-900 mt-3 leading-snug">Office 2024 Professional Plus</p>
    <div className="flex items-center gap-1 mt-1">
      {[1, 2, 3, 4, 5].map((n) => <Star key={n} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
      <span className="text-[11px] text-slate-500 ml-1">({(product.reviews || 0).toLocaleString()})</span>
    </div>
    <div className="flex items-baseline gap-2 mt-1">
      <span className="text-lg font-bold text-blue-700">{format(product.price)}</span>
      {product.originalPrice && <span className="text-xs text-slate-400 line-through">{format(product.originalPrice)}</span>}
    </div>
  </Link>
);

export const HeroVisual = () => {
  const { format } = useCurrency();
  const main = findProduct("microsoft-office-2024-professional-plus-windows");
  const win = findProduct("windows-11-pro");
  const mac = findProduct("microsoft-office-home-business-2024-mac");
  return (
    <div className="relative h-[460px] lg:h-[560px]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[420px] h-[420px] rounded-full bg-gradient-to-br from-blue-100/60 to-indigo-100/40 border border-blue-200/40" />
      </div>

      {win && <SideCard product={win} position="left-[2%] top-1/2 -translate-y-[80%]" rotate="rotate-[-8deg] hover:rotate-[-4deg]" testId="hero-card-windows" format={format} />}
      {mac && <SideCard product={mac} name="Office 2024 for Mac" position="right-[2%] top-1/2 translate-y-[5%]" rotate="rotate-[8deg] hover:rotate-[4deg]" testId="hero-card-mac" format={format} />}
      {main && <MainCard product={main} format={format} />}

      {/* Floating delivery chip */}
      <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white shadow-lg rounded-full px-4 py-2 text-xs font-semibold text-slate-800" data-testid="hero-delivery-chip">
        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Zap className="w-3.5 h-3.5" /></span>
        Key delivered in minutes
      </div>

      {FLOATING_ICONS.map((p) => (
        <div key={p.name} className="absolute w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center animate-bounce"
          style={{ top: p.top, bottom: p.bottom, left: p.left, right: p.right, animationDuration: "3s", animationDelay: p.delay }}>
          <img src={appIcons[p.name]} alt={p.name} className="w-8 h-8 object-contain" />
        </div>
      ))}
      {/* Microsoft logo top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center">
        <div className="grid grid-cols-2 gap-0.5 w-9 h-9">
          <div className="bg-red-500" /><div className="bg-green-500" /><div className="bg-blue-500" /><div className="bg-yellow-500" />
        </div>
      </div>
    </div>
  );
};

export const TrustStrip = () => (
  <div className="relative max-w-7xl mx-auto px-4 pb-8">
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-600">
      <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-600" />SSL Secured</div>
      <div className="w-1 h-1 bg-slate-300 rounded-full hidden md:block" />
      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" />30-Day Guarantee</div>
      <div className="w-1 h-1 bg-slate-300 rounded-full hidden md:block" />
      <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-600" />Microsoft Verified</div>
      <div className="w-1 h-1 bg-slate-300 rounded-full hidden md:block" />
      <a href="#reviews" className="flex items-center gap-2 hover:text-slate-900">
        <span className="font-semibold text-slate-900">Shopper Approved</span>
        <span className="text-xs text-slate-500">5,519+ verified reviews</span>
        <span className="text-yellow-500 font-bold">★ 4.6</span>
      </a>
    </div>
  </div>
);
