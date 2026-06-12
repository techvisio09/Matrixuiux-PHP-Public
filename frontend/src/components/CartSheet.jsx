import React from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { Button } from "./ui/button";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

const CartSheet = ({ open, onOpenChange }) => {
  const { items, removeFromCart, updateQty, totalPrice, clear } = useCart();
  const { format } = useCurrency();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart ({items.length})</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 mt-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 py-20">
              <ShoppingBag className="w-12 h-12 mb-3 text-slate-300" />
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm">Browse our shop to find genuine Microsoft licenses.</p>
              <Link to="/shop" onClick={() => onOpenChange(false)}><Button className="mt-4 bg-blue-600 hover:bg-blue-700">Shop Now</Button></Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 pb-4 border-b border-slate-100">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-slate-50 rounded-lg p-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 line-clamp-2">{item.name}</p>
                    <p className="text-blue-700 font-bold text-sm mt-1">{format(item.price)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 border border-slate-200 rounded-lg">
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="p-1.5 hover:bg-slate-100"><Minus className="w-3 h-3" /></button>
                        <span className="text-sm font-semibold w-6 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="p-1.5 hover:bg-slate-100"><Plus className="w-3 h-3" /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <div className="flex justify-between text-sm"><span className="text-slate-600">Subtotal</span><span className="font-semibold">{format(totalPrice)}</span></div>
            <div className="flex justify-between text-base font-bold"><span>Total</span><span className="text-blue-700">{format(totalPrice)}</span></div>
            <Link to="/cart" onClick={() => onOpenChange(false)}><Button className="w-full bg-blue-600 hover:bg-blue-700">View Cart & Checkout</Button></Link>
            <button onClick={clear} className="w-full text-xs text-slate-500 hover:text-slate-700">Clear Cart</button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
