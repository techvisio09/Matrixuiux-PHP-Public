import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { appIcons } from "../mock";
import { catalog, findProduct, getVariantGroup } from "../data/variants";
import { COMPANY } from "../data/company";
import { useCurrency } from "../context/CurrencyContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../hooks/use-toast";
import { Button } from "../components/ui/button";
import { Stars, MoreOptionsSection, ProductReviewsSection, CompareSection, ProductFaqSection } from "./ProductDetailSections";
import {
  APP_LABELS, OptionSelector, TrustChips, VerifiedReviewsBox,
  DescriptionSection, SystemRequirementsSection, HelpAndWhyBuy,
} from "./ProductDetailInfo";
import { Zap, RotateCcw, Check, ShoppingCart, Minus, Plus, Flame } from "lucide-react";

const soldLabel = (reviews) => {
  const n = Math.round((reviews || 100) * 1.5);
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K+` : `${n}+`;
};

const getCategoryLabel = (cur, isMac) => {
  if (cur.base === "windows") return "Windows OS";
  if (cur.base === "project" || cur.base === "visio") return "Microsoft Apps";
  return isMac ? "Office For Mac" : "Office For Windows";
};

const buildProductFaqs = (product) => [
  { q: `Is ${product.name} a one-time purchase?`, a: "Yes. This is a one-time purchase with a lifetime license — there are no monthly or yearly subscription fees. You pay once and own the software permanently on your device." },
  { q: "How will I receive my product key?", a: "Your genuine product key is delivered to your email within 15-30 minutes of purchase, along with official download links and step-by-step activation instructions." },
  { q: "Is this a genuine product?", a: `Absolutely. ${COMPANY.brand} only sells 100% genuine licenses sourced from authorized distributors. Every key is verified before delivery and activates directly with the official vendor.` },
  { q: "What if I need help with installation?", a: `Our support team provides free installation and activation assistance. Call ${COMPANY.phone} or email ${COMPANY.email} — we're available ${COMPANY.hours}.` },
  { q: "What is your refund policy?", a: "We offer a 30-day money-back guarantee. If your license cannot be activated and our team can't resolve the issue, you'll receive a full refund — no questions asked." },
];

const ProductBadges = ({ product, year }) => (
  <div className="flex items-center flex-wrap gap-2 mb-3" data-testid="product-badges">
    <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">{product.platform}</span>
    {year && <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">{year}</span>}
    <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md flex items-center gap-1"><Check className="w-3 h-3" />In Stock</span>
    <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md">One Time Purchase Lifetime License</span>
  </div>
);

const IncludesRow = ({ apps }) => (
  <div className="mt-5" data-testid="includes-section">
    <p className="text-sm font-semibold text-slate-700 mb-2">Includes:</p>
    <div className="flex flex-wrap gap-2.5">
      {apps.map((a) => (
        <div key={a} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          <img src={appIcons[a]} alt={APP_LABELS[a] || a} className="w-6 h-6 object-contain" />
          <span className="text-xs font-medium text-slate-700">{APP_LABELS[a] || a}</span>
        </div>
      ))}
    </div>
  </div>
);

const StockStatus = ({ inStock }) =>
  inStock === false ? (
    <p className="mt-3 text-sm text-red-600 flex items-center gap-1.5" data-testid="stock-status"><span className="w-2 h-2 rounded-full bg-red-500" />Currently Out of Stock — check back soon</p>
  ) : (
    <p className="mt-3 text-sm text-emerald-700 flex items-center gap-1.5" data-testid="stock-status"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />In Stock - Ready for Instant Delivery</p>
  );

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = findProduct(id) || catalog[0];
  const { addToCart } = useCart();
  const { format } = useCurrency();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);

  React.useEffect(() => { window.scrollTo(0, 0); setQty(1); }, [id]);

  const { cur, versions, editions, osOptions, baseGroup } = getVariantGroup(product);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const isMac = cur.os === "Mac";

  // Availability checks — unavailable options are shown blurred & disabled
  const editionAvailable = (ed) => baseGroup.some((p) => p.version === cur.version && p.os === cur.os && p.edition === ed);
  // OS is available if ANY product of this version exists on that OS (clicking jumps to the closest edition)
  const osAvailable = (os) => baseGroup.some((p) => p.version === cur.version && p.os === os);
  const versionAvailable = (v) => baseGroup.some((p) => p.version === v && p.os === cur.os);

  const goTo = (target) => { if (target && target.id !== product.id) navigate(`/product/${target.id}`); };
  const pickEdition = (ed) => {
    if (!editionAvailable(ed)) return;
    goTo(baseGroup.find((p) => p.version === cur.version && p.os === cur.os && p.edition === ed));
  };
  const pickOS = (os) => {
    if (!osAvailable(os)) return;
    goTo(
      baseGroup.find((p) => p.version === cur.version && p.os === os && p.edition === cur.edition) ||
      baseGroup.find((p) => p.version === cur.version && p.os === os)
    );
  };
  const pickVersion = (v) => {
    if (!versionAvailable(v)) return;
    goTo(
      baseGroup.find((p) => p.version === v && p.os === cur.os && p.edition === cur.edition) ||
      baseGroup.find((p) => p.version === v && p.os === cur.os) ||
      baseGroup.find((p) => p.version === v)
    );
  };
  const versionLabel = (v) => (cur.base === "windows" ? `Windows ${v}` : v);

  const addAndToast = () => {
    addToCart(product, qty);
    toast({ title: "Added to cart", description: `${qty} × ${product.name}` });
  };

  // Related collections
  const samePlatform = catalog.filter((p) => p.platform === product.platform && p.id !== product.id);
  const moreOptions = samePlatform.filter((p) => p.name.toLowerCase().includes("office") || (p.apps && p.apps.length > 0)).slice(0, 6);
  const variantSiblings = baseGroup.filter((p) => p.id !== product.id);
  const compareItems = [
    ...variantSiblings,
    ...samePlatform.filter((p) => !variantSiblings.some((g) => g.id === p.id)),
  ].slice(0, 3);
  const youMayLike = catalog.filter((p) => p.id !== product.id).sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 4);

  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-screen" data-testid="product-detail-page">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="text-sm text-slate-500 mb-5" data-testid="breadcrumb">
            <Link to="/" className="hover:text-blue-700">Home</Link> / <Link to="/shop" className="hover:text-blue-700">Shop</Link> / <span className="text-slate-900">{product.name}</span>
          </div>

          {/* ============ MAIN PRODUCT AREA ============ */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-2xl p-6 lg:p-10 border border-slate-200">
            {/* Image */}
            <div className="relative bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl p-8 flex items-center justify-center self-start">
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-md" data-testid="discount-badge">{discount}% Off</span>
              )}
              <img src={product.image} alt={product.name} className="max-h-[420px] object-contain" data-testid="product-image" />
            </div>

            {/* Info */}
            <div>
              <ProductBadges product={product} year={cur.year} />

              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-snug" data-testid="product-title">{product.name}</h1>

              <div className="flex items-center gap-2 mt-2.5">
                <Stars value={product.rating || 5} />
                <span className="text-sm font-semibold text-slate-900">{product.rating || "5.0"}</span>
                <span className="text-sm text-slate-500">({(product.reviews || 0).toLocaleString()} reviews)</span>
              </div>

              {product.apps && product.apps.length > 0 && <IncludesRow apps={product.apps} />}

              {versions.length > 0 && (
                <OptionSelector title="Version" testPrefix="version" className="mt-5"
                  currentValue={cur.version} currentLabel={versionLabel(cur.version)}
                  options={versions} isAvailable={versionAvailable} onPick={pickVersion} getLabel={versionLabel} />
              )}
              {editions.length > 0 && (
                <OptionSelector title="Edition" testPrefix="edition"
                  currentValue={cur.edition} currentLabel={cur.edition}
                  options={editions} isAvailable={editionAvailable} onPick={pickEdition} />
              )}
              {osOptions.length > 0 && (
                <OptionSelector title="Operating system" testPrefix="os" btnClass=" px-5"
                  currentValue={cur.os} currentLabel={cur.os}
                  options={osOptions} isAvailable={osAvailable} onPick={pickOS} />
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-6">
                <span className="text-4xl font-bold text-blue-700" data-testid="product-price">{format(product.price)}</span>
                {product.originalPrice && <span className="text-lg text-slate-400 line-through" data-testid="product-original-price">{format(product.originalPrice)}</span>}
              </div>

              <div className="flex items-center flex-wrap gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-sm text-emerald-700 font-medium"><RotateCcw className="w-4 h-4" />30-Day Money Back Guarantee</span>
                <span className="flex items-center gap-1 text-sm text-orange-600 font-semibold" data-testid="sold-count"><Flame className="w-4 h-4" />Over {soldLabel(product.reviews)} Sold</span>
              </div>

              {/* Qty + Add to Cart + Buy Now */}
              <div className="mt-6 flex items-stretch gap-3 flex-wrap">
                <div className="flex items-center border border-slate-300 rounded-full overflow-hidden" data-testid="quantity-stepper">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3.5 h-12 text-slate-600 hover:bg-slate-100 transition" data-testid="qty-decrease" aria-label="Decrease quantity"><Minus className="w-4 h-4" /></button>
                  <span className="w-10 text-center font-semibold text-slate-900" data-testid="qty-value">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="px-3.5 h-12 text-slate-600 hover:bg-slate-100 transition" data-testid="qty-increase" aria-label="Increase quantity"><Plus className="w-4 h-4" /></button>
                </div>
                <Button onClick={addAndToast} disabled={product.inStock === false} size="lg" className="flex-1 min-w-[150px] bg-blue-600 hover:bg-blue-700 rounded-full h-12 text-base" data-testid="add-to-cart-btn">
                  <ShoppingCart className="w-4 h-4 mr-1.5" />Add to Cart
                </Button>
                <Button onClick={() => { addToCart(product, qty); navigate("/cart"); }} disabled={product.inStock === false} size="lg" variant="outline" className="flex-1 min-w-[150px] border-2 border-blue-600 text-blue-700 hover:bg-blue-50 rounded-full h-12 text-base font-bold" data-testid="buy-now-btn">
                  <Zap className="w-4 h-4 mr-1.5" />Buy Now
                </Button>
              </div>

              <StockStatus inStock={product.inStock} />
              <TrustChips />
              <VerifiedReviewsBox />
            </div>
          </div>

          <DescriptionSection product={product} isMac={isMac} curOs={cur.os} />
          <SystemRequirementsSection isMac={isMac} />
          <HelpAndWhyBuy />
          <MoreOptionsSection items={moreOptions} categoryLabel={getCategoryLabel(cur, isMac)} />
          <ProductReviewsSection />
          <CompareSection product={product} compareItems={compareItems} />
          <ProductFaqSection productName={product.name} faqs={buildProductFaqs(product)} />

          {/* ============ YOU MAY ALSO LIKE ============ */}
          <div className="mt-10 mb-4" data-testid="you-may-also-like-section">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900">You May Also Like</h2>
              <Link to="/shop" className="text-sm font-semibold text-blue-700 hover:underline" data-testid="view-all-link">View All</Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {youMayLike.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
