import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";
import { setCatalog } from "../data/variants";

const CatalogContext = createContext({ allProducts: [], products: [], businessProducts: [], loading: true, error: false });

export const CatalogProvider = ({ children }) => {
  const [state, setState] = useState({ allProducts: [], products: [], businessProducts: [], loading: true, error: false });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/api/products");
        if (cancelled) return;
        setCatalog(data);
        const products = data.filter((p) => p.featured_rank).sort((a, b) => a.featured_rank - b.featured_rank);
        const businessProducts = data
          .filter((p) => p.business_rank)
          .sort((a, b) => a.business_rank - b.business_rank)
          .map((p) => ({ ...p, discount: p.originalPrice ? `-${Math.round((1 - p.price / p.originalPrice) * 100)}%` : null }));
        setState({ allProducts: data, products, businessProducts, loading: false, error: false });
      } catch (e) {
        console.error("Catalog load failed:", e);
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: true }));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (state.loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white" data-testid="catalog-loading">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-extrabold text-xl animate-pulse">U</div>
        <p className="mt-4 text-sm text-slate-500">Loading store…</p>
      </div>
    );
  }
  if (state.error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center" data-testid="catalog-error">
        <p className="text-slate-900 font-bold text-lg">We couldn't load the store</p>
        <p className="mt-1 text-sm text-slate-500">Please check your connection and try again.</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">Retry</button>
      </div>
    );
  }
  return <CatalogContext.Provider value={state}>{children}</CatalogContext.Provider>;
};

export const useCatalog = () => useContext(CatalogContext);
