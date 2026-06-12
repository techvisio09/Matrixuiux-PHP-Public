import React from "react";
import ProductCard from "../ProductCard";
import { useCatalog } from "../../context/CatalogContext";

const BestSellers = () => {
  const { products } = useCatalog();
  const items = [products[1], products[0], products[4], products[5]].filter(Boolean);
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Best Sellers</h2>
          <p className="text-slate-500 mt-1 text-sm">4 products available</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
