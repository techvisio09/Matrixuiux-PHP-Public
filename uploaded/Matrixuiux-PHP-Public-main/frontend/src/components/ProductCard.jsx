import React from "react";
import { Link } from "react-router-dom";
import { Star, Zap, ShieldCheck, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { useToast } from "../hooks/use-toast";
import { appIcons } from "../mock";

const ProductCard = ({ product, variant = "default" }) => {
  const { addToCart } = useCart();
  const { format } = useCurrency();
  const { toast } = useToast();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({ title: "Added to cart", description: product.name });
  };

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <Link to={`/product/${product.id}`} className="product-card group block bg-white rounded-xl border border-slate-200 overflow-hidden relative">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 items-start max-w-[70%]">
        {product.isNew && <span className="bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded">New</span>}
        {product.badge === "Best Seller" && <span className="bg-orange-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded">Best Seller</span>}
        {product.badge === "Hot Pick" && <span className="bg-rose-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded">Hot Pick</span>}
      </div>
      {discount > 0 && variant === "business" && (
        <span className="absolute top-3 right-3 z-10 bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded">-{discount}%</span>
      )}

      <div className="aspect-square bg-gradient-to-br from-slate-50 to-blue-50/40 flex items-center justify-center p-6 overflow-hidden">
        <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-600 font-medium">{product.platform}</span>
          {product.rating && (
            <div className="flex items-center gap-1 text-xs">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-slate-700">{product.rating}</span>
              <span className="text-slate-400">({product.reviews})</span>
            </div>
          )}
        </div>
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 min-h-[40px] group-hover:text-blue-700 transition">{product.name}</h3>

        {product.apps && product.apps.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2.5">
            {product.apps.slice(0, 5).map((a) => (
              <img key={a} src={appIcons[a]} alt={a} className="w-5 h-5 object-contain" />
            ))}
          </div>
        )}

        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-xl font-bold text-blue-700">{format(product.price)}</span>
          {product.originalPrice && <span className="text-sm text-slate-400 line-through">{format(product.originalPrice)}</span>}
        </div>

        <button onClick={handleAdd} className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition">
          <ShoppingCart className="w-4 h-4" />Add to Cart
        </button>

        <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" />Instant Delivery</span>
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" />Genuine License</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
