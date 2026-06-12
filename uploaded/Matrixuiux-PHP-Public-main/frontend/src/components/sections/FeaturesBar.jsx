import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Zap, Infinity as InfinityIcon, Headphones, Lock, RotateCcw } from "lucide-react";
import { categories } from "../../mock";

const features = [
  { icon: ShieldCheck, title: "100% Genuine", sub: "Microsoft Verified", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: Zap, title: "Instant Delivery", sub: "15-30 Minutes", color: "text-amber-600", bg: "bg-amber-50" },
  { icon: InfinityIcon, title: "Perpetual License", sub: "No Subscriptions", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Headphones, title: "Free Support", sub: "Mon-Sat, 9-6 EST", color: "text-purple-600", bg: "bg-purple-50" },
  { icon: Lock, title: "SSL Secured", sub: "Safe Checkout", color: "text-indigo-600", bg: "bg-indigo-50" },
  { icon: RotateCcw, title: "30-Day Guarantee", sub: "Full Refund", color: "text-rose-600", bg: "bg-rose-50" },
];

const FeaturesBar = () => {
  return (
    <section className="py-10 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 p-3.5 hover:shadow-md transition">
              <div className={`w-10 h-10 rounded-lg ${f.bg} flex items-center justify-center shrink-0`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 truncate">{f.title}</div>
                <div className="text-xs text-slate-500 truncate">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-700 shrink-0">Browse:</span>
          <div className="flex-1 min-w-0 overflow-x-auto" style={{ scrollbarWidth: "thin" }} data-testid="browse-toggle-bar">
            <div className="flex gap-2 pb-1.5 w-max">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  to={c.slug === "microsoft-office-2016" ? "/shop" : `/category/${c.slug}`}
                  className="inline-flex shrink-0 items-center gap-1.5 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-700 transition whitespace-nowrap"
                  data-testid={`browse-chip-${c.slug}`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;
