import React from "react";
import { Link } from "react-router-dom";
import { Star, BadgeCheck } from "lucide-react";
import { appIcons, testimonials } from "../mock";
import { useCurrency } from "../context/CurrencyContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

export const Stars = ({ value, size = "w-4 h-4" }) => (
  <div className="flex">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} className={`${size} ${n <= Math.round(value) ? "fill-yellow-400 text-yellow-400" : "text-slate-200 fill-slate-200"}`} />
    ))}
  </div>
);

export const MoreOptionsSection = ({ items, categoryLabel }) => {
  const { format } = useCurrency();
  if (items.length === 0) return null;
  return (
    <div className="mt-10" data-testid="more-options-section">
      <h2 className="text-xl font-bold text-slate-900 mb-5">More options in {categoryLabel}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} className="bg-white rounded-xl border border-slate-200 p-3 hover:shadow-md transition group" data-testid={`more-option-${p.id}`}>
            <div className="aspect-square bg-slate-50 rounded-lg flex items-center justify-center p-3 mb-2.5">
              <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
            </div>
            <p className="text-xs font-semibold text-slate-900 line-clamp-2 min-h-[32px] group-hover:text-blue-700 transition">{p.name}</p>
            <div className="flex items-center gap-1 mt-1.5 text-[11px] text-slate-500">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{p.rating} ({p.reviews})
            </div>
            <p className="text-sm font-bold text-blue-700 mt-1">{format(p.price)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const ProductReviewsSection = () => (
  <div className="mt-10 bg-white rounded-2xl border border-slate-200 p-6 lg:p-10" data-testid="reviews-section">
    <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
      <h2 className="text-xl font-bold text-slate-900">Customer Reviews</h2>
      <div className="flex items-center gap-2">
        <BadgeCheck className="w-5 h-5 text-emerald-600" />
        <span className="text-sm font-semibold text-slate-900">Verified Reviews</span>
        <Stars value={4.6} size="w-3.5 h-3.5" />
        <span className="text-sm text-slate-500">4.6 / 5</span>
      </div>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {testimonials.map((t, i) => (
        <div key={t.name} className="border border-slate-200 rounded-xl p-5" data-testid={`review-card-${i}`}>
          <div className="flex items-center justify-between">
            <Stars value={t.rating} size="w-3.5 h-3.5" />
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600"><BadgeCheck className="w-3.5 h-3.5" />Verified</span>
          </div>
          <p className="text-sm text-slate-700 mt-3 line-clamp-4">"{t.text}"</p>
          <div className="flex items-center gap-2.5 mt-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">{t.initials}</div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{t.name}</p>
              <p className="text-xs text-slate-500">{t.location}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CompareCard = ({ p, idx }) => {
  const { format } = useCurrency();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const osLabel = p.platform === "Mac" ? "macOS" : "Win 10/11";
  const deviceLabel = p.platform === "Mac" ? "Mac" : "PC";
  return (
    <div className={`bg-white rounded-xl border p-4 flex flex-col ${p._this ? "border-blue-600 ring-1 ring-blue-600" : "border-slate-200"}`} data-testid={`compare-card-${idx}`}>
      {p._this && <span className="self-start text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded mb-2">This Product</span>}
      <div className="h-28 flex items-center justify-center mb-3">
        <img src={p.image} alt={p.name} className="max-h-full object-contain" />
      </div>
      <Link to={`/product/${p.id}`} className="text-sm font-semibold text-slate-900 hover:text-blue-700 line-clamp-2 min-h-[40px]">{p.name}</Link>
      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />({(p.reviews || 0).toLocaleString()})
      </div>
      <p className="text-lg font-bold text-blue-700 mt-1.5">{format(p.price)}</p>
      {p.apps && p.apps.length > 0 && (
        <div className="flex gap-1.5 mt-2">{p.apps.slice(0, 6).map((a) => <img key={a} src={appIcons[a]} alt={a} className="w-5 h-5 object-contain" />)}</div>
      )}
      <div className="mt-3 space-y-1.5 text-xs flex-1">
        <div className="flex justify-between"><span className="text-slate-500">OS</span><span className="font-medium text-slate-900">{osLabel}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Type</span><span className="font-medium text-slate-900">1-Time</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Devices</span><span className="font-medium text-slate-900">1 {deviceLabel}</span></div>
      </div>
      <button
        onClick={() => { addToCart(p); toast({ title: "Added to cart", description: p.name }); }}
        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded-lg transition"
        data-testid={`compare-add-${idx}`}
      >
        Add to cart
      </button>
    </div>
  );
};

export const CompareSection = ({ product, compareItems }) => {
  if (compareItems.length === 0) return null;
  const cards = [{ ...product, _this: true }, ...compareItems];
  return (
    <div className="mt-10" data-testid="compare-section">
      <h2 className="text-xl font-bold text-slate-900">Compare Similar Products</h2>
      <p className="text-sm text-slate-500 mb-5">See how this product compares to similar options</p>
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-flow-col auto-cols-[minmax(220px,1fr)] gap-4 min-w-min">
          {cards.map((p, idx) => <CompareCard key={p.id + (p._this ? "-this" : "")} p={p} idx={idx} />)}
        </div>
      </div>
    </div>
  );
};

export const ProductFaqSection = ({ productName, faqs }) => (
  <div className="mt-10 bg-white rounded-2xl border border-slate-200 p-6 lg:p-10" data-testid="product-faq-section">
    <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
    <p className="text-sm text-slate-500 mb-4">Common questions about {productName}</p>
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((f, i) => (
        <AccordionItem key={f.q} value={`faq-${i}`}>
          <AccordionTrigger className="text-left text-sm font-semibold text-slate-900 hover:text-blue-700" data-testid={`faq-trigger-${i}`}>{f.q}</AccordionTrigger>
          <AccordionContent className="text-sm text-slate-600">{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);
