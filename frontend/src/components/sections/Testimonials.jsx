import React from "react";
import { Star, BadgeCheck } from "lucide-react";
import { testimonials, trustLogos } from "../../mock";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";

const Testimonials = () => (
  <section id="reviews" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto">
        <div className="text-xs font-bold tracking-[0.2em] text-blue-700 mb-3">TESTIMONIALS</div>
        <h2 className="text-4xl font-bold text-slate-900">What Our Customers Say</h2>
        <p className="mt-3 text-slate-600">Real verified reviews from Shopper Approved</p>
        <div className="mt-4 inline-flex items-center gap-2">
          <div className="flex">{[1, 2, 3, 4, 5].map((n) => <Star key={n} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
          <span className="font-bold text-slate-900">4.6/5</span>
          <span className="text-sm text-slate-500">(5,519+ verified reviews)</span>
          <a href="#" className="text-sm text-blue-700 font-semibold hover:underline">View all on Shopper Approved</a>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <div key={t.text} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded"><BadgeCheck className="w-3 h-3" />Verified Purchase</span>
              <span className="text-[11px] text-slate-500">Shopper Approved</span>
            </div>
            <div className="flex items-center gap-1 mb-2">{[1, 2, 3, 4, 5].map((n) => <Star key={n} className={`w-3.5 h-3.5 ${n <= t.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200 fill-slate-200"}`} />)}</div>
            <div className="text-[11px] font-semibold text-slate-500 mb-2">{t.product}</div>
            <p className="text-sm text-slate-700 leading-relaxed line-clamp-5">“{t.text}”</p>
            <div className="mt-4 flex items-center gap-3 pt-4 border-t border-slate-100">
              <Avatar className="w-9 h-9"><AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-bold">{t.initials}</AvatarFallback></Avatar>
              <div>
                <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                <div className="text-xs text-slate-500">{t.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <a href="#" className="text-sm text-blue-700 font-semibold hover:underline">See all 5,519 reviews on Shopper Approved &rsaquo;</a>
      </div>

      {/* Trusted by logos */}
      <div className="mt-20 pt-12 border-t border-slate-200">
        <div className="text-center text-sm font-semibold text-slate-500 mb-8">Trusted by</div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {trustLogos.map((l) => (
            <div key={l.name} className="flex items-center justify-center grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition">
              <img src={l.src} alt={l.name} className="max-h-12 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Testimonials;
