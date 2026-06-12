import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "../ProductCard";
import { useCatalog } from "../../context/CatalogContext";

const Discover = () => {
  const { products } = useCatalog();
  const featured = products.slice(0, 4);
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-10">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />New to UCODE SOFTTECH
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">Discover top Microsoft software for your needs</h2>
            <p className="mt-3 text-slate-600">Find the perfect tools for productivity and creativity.</p>
            <p className="text-slate-600">Instant digital delivery on all licenses.</p>
          </div>
          <div className="lg:col-span-5 flex lg:justify-end">
            <Link to="/shop" className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:gap-3 transition-all">Explore now <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
};

export default Discover;
