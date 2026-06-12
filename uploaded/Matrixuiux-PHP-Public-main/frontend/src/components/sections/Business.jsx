import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, ArrowRight, Star } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useCatalog } from "../../context/CatalogContext";
import { useCurrency } from "../../context/CurrencyContext";

const Business = () => {
  const { businessProducts } = useCatalog();
  const { format } = useCurrency();
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c1e3d] via-[#0f2447] to-[#1e293b] text-white">
          <div className="grid lg:grid-cols-12 gap-8 p-8 lg:p-12">
            <div className="lg:col-span-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-6">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight">For Every<br />Business</h2>
              <p className="mt-4 text-slate-300">Professional tools for teams of all sizes. Volume discounts available.</p>
              <ul className="mt-6 space-y-2.5 text-sm">
                <li className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-400">✓</span>Team Licensing</li>
                <li className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-400">✓</span>Priority Support</li>
                <li className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-400">✓</span>Bulk Discounts</li>
              </ul>
              <Button className="mt-6 bg-white text-slate-900 hover:bg-slate-100 rounded-full font-semibold">Contact Sales <ArrowRight className="w-4 h-4 ml-1.5" /></Button>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {businessProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="bg-white text-slate-900 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all relative group">
                  <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
                    {p.isNew && <span className="bg-blue-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">New</span>}
                    {p.badge === "Hot Pick" && <span className="bg-rose-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">Hot Pick</span>}
                    {p.badge === "Best Seller" && <span className="bg-orange-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">Best Seller</span>}
                  </div>
                  <span className="absolute top-2.5 right-2.5 z-10 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{p.discount}</span>
                  <div className="aspect-square bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
                    <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs font-semibold line-clamp-2 min-h-[32px]">{p.name}</h3>
                    <div className="flex items-center gap-1 mt-1.5">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((n) => <Star key={n} className={`w-3 h-3 ${n <= Math.floor(p.rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-200 fill-slate-200"}`} />)}
                      </div>
                      <span className="text-[10px] text-slate-500">{p.rating} ({p.reviews})</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-2">
                      <span className="text-base font-bold text-blue-700">{format(p.price)}</span>
                      <span className="text-xs text-slate-400 line-through">{format(p.originalPrice)}</span>
                    </div>
                    <button className="mt-2 w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-1.5 rounded-md">Buy Now</button>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
                      <span>Instant Delivery</span>
                      <span>Genuine</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Business;
