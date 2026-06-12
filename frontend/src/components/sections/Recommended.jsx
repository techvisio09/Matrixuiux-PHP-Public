import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import ProductCard from "../ProductCard";
import { useCatalog } from "../../context/CatalogContext";

const Recommended = () => {
  const { products } = useCatalog();
  const items = [products[0], products[6], products[7], products[8]].filter(Boolean);
  return (
    <section className="py-14 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full text-[11px] font-semibold mb-2">
              <Sparkles className="w-3 h-3" />AI
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Recommended For You</h2>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-blue-700 hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
};

export default Recommended;
