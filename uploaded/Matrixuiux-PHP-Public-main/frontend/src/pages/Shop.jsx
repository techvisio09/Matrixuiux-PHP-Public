import React, { useState, useMemo } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useCatalog } from "../context/CatalogContext";
import { parseVariant } from "../data/variants";
import { Search } from "lucide-react";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const Shop = () => {
  const { allProducts } = useCatalog();
  // allProducts is the comprehensive deduped catalog from the API
  const all = useMemo(() => {
    const dedup = new Set();
    return allProducts
      .filter((p) => { if (dedup.has(p.name)) return false; dedup.add(p.name); return true; })
      .map(parseVariant);
  }, [allProducts]);
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("all");
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    let list = all.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    if (platform !== "all") list = list.filter((p) => p.platform === platform);
    if (year !== "all") list = list.filter((p) => p.version === year);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return list;
  }, [all, query, platform, year, sort]);

  return (
    <>
      <Header />
      <section className="bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/30 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-slate-900">Shop All Products</h1>
          <p className="mt-2 text-slate-600">Browse our complete catalog of genuine Microsoft licenses.</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 mb-6 items-center">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="pl-9 h-11" />
            </div>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-[160px] h-11" data-testid="shop-platform-select"><SelectValue placeholder="Platform" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="Windows">Windows</SelectItem>
                <SelectItem value="Mac">Mac</SelectItem>
              </SelectContent>
            </Select>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[150px] h-11" data-testid="shop-year-select"><SelectValue placeholder="Year" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2019">2019</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[180px] h-11"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
            <div className="ml-auto text-sm text-slate-500">{filtered.length} products</div>
          </div>
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-slate-500">No products match your search.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Shop;
