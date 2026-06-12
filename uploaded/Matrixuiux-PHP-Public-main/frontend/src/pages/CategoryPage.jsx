import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { appIcons } from "../mock";
import { useCatalog } from "../context/CatalogContext";
import { parseVariant, EDITION_ORDER } from "../data/variants";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { useToast } from "../hooks/use-toast";
import { Button } from "../components/ui/button";
import { LayoutGrid, List, Star, ShoppingCart, Zap, ShieldCheck } from "lucide-react";

export const categoryFilters = {
  "microsoft-office-2024": (p) => /2024/i.test(p.name) && !/visio|project/i.test(p.name),
  "microsoft-office-2021": (p) => /2021/i.test(p.name) && !/visio|project/i.test(p.name),
  "microsoft-office-2019": (p) => /2019/i.test(p.name) && !/visio|project/i.test(p.name),
  "microsoft-project": (p) => /project/i.test(p.name),
  "microsoft-visio": (p) => /visio/i.test(p.name),
  "office-for-mac": (p) => /\(mac\)/i.test(p.name),
  "windows-os": (p) => /windows 1[01]/i.test(p.name),
  "office-2024-pc": (p) => /office.*2024/i.test(p.name) && !/\(mac\)/i.test(p.name) && !/visio|project/i.test(p.name),
  "office-2021-pc": (p) => /office.*2021|word 2021|excel 2021/i.test(p.name) && !/\(mac\)/i.test(p.name),
  "office-2019-pc": (p) => /office.*2019/i.test(p.name) && !/\(mac\)/i.test(p.name),
  "office-for-pc": (p) => /office|word|excel/i.test(p.name) && !/\(mac\)/i.test(p.name) && !/visio|project/i.test(p.name),
  "office-2024-mac": (p) => /2024/i.test(p.name) && /\(mac\)/i.test(p.name),
  "office-2021-mac": (p) => /2021/i.test(p.name) && /\(mac\)/i.test(p.name),
  "office-2019-mac": (p) => /2019/i.test(p.name) && /\(mac\)/i.test(p.name),
  "windows-11": (p) => /windows 11/i.test(p.name),
  "windows-10": (p) => /windows 10/i.test(p.name),
  "microsoft-apps": (p) => /project|visio/i.test(p.name),
  bitdefender: (p) => /bitdefender/i.test(p.name),
  mcafee: (p) => /mcafee/i.test(p.name),
  "office-all": (p) => /office|word|excel/i.test(p.name) && !/visio|project/i.test(p.name),
};

// URL aliases used by the home "Browse" bar (same product sets, different slugs)
Object.assign(categoryFilters, {
  office: categoryFilters["office-all"],
  "microsoft-office": categoryFilters["office-all"],
  "office-for-macs": categoryFilters["office-for-mac"],
  "office-2024-for-mac": categoryFilters["office-2024-mac"],
  "office-2021-for-mac": categoryFilters["office-2021-mac"],
  "office-2019-for-mac": categoryFilters["office-2019-mac"],
  "office-for-windows": categoryFilters["office-for-pc"],
  "mcafee-antivirus": categoryFilters.mcafee,
  antivirus: (p) => /bitdefender|mcafee/i.test(p.name),
});

// Granular OS slugs map to a year-wide base list with a pre-selected platform,
// so the Platform filter (All / Windows / Mac) always works across both OSes.
const baseMap = {
  "office-2024-pc": { base: "microsoft-office-2024", platform: "Windows" },
  "office-2024-mac": { base: "microsoft-office-2024", platform: "Mac" },
  "office-2021-pc": { base: "microsoft-office-2021", platform: "Windows" },
  "office-2021-mac": { base: "microsoft-office-2021", platform: "Mac" },
  "office-2019-pc": { base: "microsoft-office-2019", platform: "Windows" },
  "office-2019-mac": { base: "microsoft-office-2019", platform: "Mac" },
  "office-for-pc": { base: "office-all", platform: "Windows" },
  "office-for-mac": { base: "office-all", platform: "Mac" },
};

export const categoryTitles = {
  "microsoft-office-2024": "Microsoft Office 2024",
  "microsoft-office-2021": "Microsoft Office 2021",
  "microsoft-office-2019": "Microsoft Office 2019",
  "microsoft-project": "Microsoft Project",
  "microsoft-visio": "Microsoft Visio",
  "office-for-mac": "Office for Mac",
  "windows-os": "Windows OS",
  "office-2024-pc": "Office 2024 (PC)",
  "office-2021-pc": "Office 2021 (PC)",
  "office-2019-pc": "Office 2019 (PC)",
  "office-for-pc": "Office for PC",
  "office-2024-mac": "Office 2024 for Mac",
  "office-2021-mac": "Office 2021 for Mac",
  "office-2019-mac": "Office 2019 for Mac",
  "windows-11": "Windows 11",
  "windows-10": "Windows 10",
  "microsoft-apps": "Microsoft Apps",
  bitdefender: "Bitdefender Antivirus",
  mcafee: "McAfee Antivirus",
  office: "Office",
  "microsoft-office": "Microsoft Office",
  "office-for-macs": "Office For Mac",
  "office-2024-for-mac": "Office 2024 for Mac",
  "office-2021-for-mac": "Office 2021 for Mac",
  "office-2019-for-mac": "Office 2019 for Mac",
  "office-for-windows": "Office for Windows",
  "mcafee-antivirus": "McAfee Antivirus",
  antivirus: "Antivirus",
};

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "reviews", label: "Most Reviewed" },
];

const SORTERS = {
  newest: (a, b) => {
    if (b.isNew === a.isNew) return (b.reviews || 0) - (a.reviews || 0);
    return b.isNew ? 1 : -1;
  },
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => (b.rating || 0) - (a.rating || 0),
  reviews: (a, b) => (b.reviews || 0) - (a.reviews || 0),
};

const PLATFORM_OPTIONS = ["All", "Windows", "Mac"];

const pillClass = (active) =>
  `text-sm font-medium px-4 py-2 rounded-full border transition ${
    active ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-300 text-slate-700 hover:border-blue-400"
  }`;

const PillRow = ({ label, options, value, onChange, testPrefix }) => (
  <div className="flex items-center gap-2 flex-wrap" data-testid={`${testPrefix}-filter`}>
    <span className="text-sm font-medium text-slate-600">{label}:</span>
    <div className="flex gap-1.5 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          data-testid={`${testPrefix}-filter-${opt.toLowerCase().replace(/\s+/g, "-")}`}
          className={pillClass(value === opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const ViewToggle = ({ view, onChange }) => (
  <div className="flex items-center bg-white border border-slate-300 rounded-full p-1">
    <button onClick={() => onChange("grid")} data-testid="view-grid-btn" aria-label="Grid view" className={`p-2 rounded-full transition ${view === "grid" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-900"}`}><LayoutGrid className="w-4 h-4" /></button>
    <button onClick={() => onChange("list")} data-testid="view-list-btn" aria-label="List view" className={`p-2 rounded-full transition ${view === "list" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-900"}`}><List className="w-4 h-4" /></button>
  </div>
);

const ListRow = ({ product }) => {
  const { addToCart } = useCart();
  const { format } = useCurrency();
  const { toast } = useToast();
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition" data-testid={`list-row-${product.id}`}>
      <Link to={`/product/${product.id}`} className="w-full sm:w-28 h-28 shrink-0 bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-lg flex items-center justify-center p-2">
        <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-600 font-medium">{product.platform}</span>
          {discount > 0 && <span className="bg-rose-50 text-rose-600 font-semibold px-1.5 py-0.5 rounded">-{discount}%</span>}
          {product.isNew && <span className="bg-blue-600 text-white font-semibold px-1.5 py-0.5 rounded">New</span>}
        </div>
        <Link to={`/product/${product.id}`} className="block font-semibold text-slate-900 hover:text-blue-700 transition mt-1">{product.name}</Link>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 text-xs text-slate-500"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{product.rating} ({product.reviews})</span>
          {product.apps && product.apps.length > 0 && (
            <span className="flex gap-1">{product.apps.slice(0, 5).map((a) => <img key={a} src={appIcons[a]} alt={a} className="w-4 h-4 object-contain" />)}</span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
          <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" />Instant Delivery</span>
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" />Genuine License</span>
        </div>
      </div>
      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
        <div className="text-right">
          <div className="text-xl font-bold text-blue-700">{format(product.price)}</div>
          {product.originalPrice && <div className="text-sm text-slate-400 line-through">{format(product.originalPrice)}</div>}
        </div>
        <Button onClick={() => { addToCart(product); toast({ title: "Added to cart", description: product.name }); }} className="bg-blue-600 hover:bg-blue-700 rounded-full" data-testid={`list-add-${product.id}`}>
          <ShoppingCart className="w-4 h-4 mr-1.5" />Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default function CategoryPage({ slug }) {
  const cfg = baseMap[slug];
  const { allProducts } = useCatalog();
  const [platform, setPlatform] = useState(cfg?.platform || "All");
  const [year, setYear] = useState("All");
  const [edition, setEdition] = useState("All");
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("newest");

  React.useEffect(() => {
    window.scrollTo(0, 0);
    setPlatform(baseMap[slug]?.platform || "All");
    setYear("All");
    setEdition("All");
  }, [slug]);

  // Base items of this category (deduped, parsed with year/edition info)
  const baseItems = useMemo(() => {
    const seen = new Set();
    return allProducts
      .filter((p) => { if (seen.has(p.name)) return false; seen.add(p.name); return true; })
      .filter(categoryFilters[cfg?.base || slug])
      .map(parseVariant);
  }, [slug, cfg, allProducts]);

  // Available filter options derived from this category's products
  const yearOptions = useMemo(() => {
    const ys = [...new Set(baseItems.map((p) => p.version).filter((v) => /^20\d{2}$/.test(v || "")))].sort((a, b) => Number(b) - Number(a));
    return ys.length > 1 ? ys : [];
  }, [baseItems]);

  const editionOptions = useMemo(() => {
    const eds = [...new Set(baseItems.map((p) => p.edition).filter((e) => EDITION_ORDER.includes(e)))]
      .sort((a, b) => EDITION_ORDER.indexOf(a) - EDITION_ORDER.indexOf(b));
    return eds.length > 1 ? eds : [];
  }, [baseItems]);

  const list = useMemo(() => {
    let items = baseItems;
    if (platform !== "All") items = items.filter((p) => p.platform === platform);
    if (year !== "All") items = items.filter((p) => p.version === year);
    if (edition !== "All") items = items.filter((p) => p.edition === edition);
    return [...items].sort(SORTERS[sort]);
  }, [baseItems, platform, year, edition, sort]);

  const clearFilters = () => { setPlatform("All"); setYear("All"); setEdition("All"); };

  let content;
  if (list.length === 0) {
    content = (
      <div className="text-center py-20 text-slate-500" data-testid="category-empty">
        No products match this filter.
        <div className="mt-3"><button onClick={clearFilters} className="text-blue-700 font-semibold hover:underline">Clear filters</button></div>
      </div>
    );
  } else if (view === "grid") {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" data-testid="category-grid">
        {list.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    );
  } else {
    content = (
      <div className="space-y-4 max-w-5xl" data-testid="category-list">
        {list.map((p) => <ListRow key={p.id} product={p} />)}
      </div>
    );
  }

  return (
    <>
      <Header />
      <section className="bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="text-sm text-slate-500 mb-3"><Link to="/" className="hover:text-blue-700">Home</Link> / <span className="text-slate-900">{categoryTitles[slug]}</span></div>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900" data-testid="category-title">{categoryTitles[slug]} Products</h1>
              <p className="mt-1.5 text-slate-600" data-testid="category-count">{list.length} product{list.length !== 1 ? "s" : ""} available</p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col items-start lg:items-end gap-3" data-testid="category-toolbar">
              <div className="flex flex-wrap items-center gap-3">
                <PillRow label="Platform" options={PLATFORM_OPTIONS} value={platform} onChange={setPlatform} testPrefix="platform" />
                <ViewToggle view={view} onChange={setView} />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  data-testid="sort-select"
                  className="h-10 rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 cursor-pointer"
                >
                  {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>

              {yearOptions.length > 0 && (
                <PillRow label="Year" options={["All", ...yearOptions]} value={year} onChange={setYear} testPrefix="year" />
              )}
              {editionOptions.length > 0 && (
                <PillRow label="Edition" options={["All", ...editionOptions]} value={edition} onChange={setEdition} testPrefix="edition" />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-slate-50 min-h-[40vh]">
        <div className="max-w-7xl mx-auto px-4">{content}</div>
      </section>
      <Footer />
    </>
  );
}
