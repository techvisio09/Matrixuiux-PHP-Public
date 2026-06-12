import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { Trash2, Plus, Minus, ShieldCheck, Headphones, Lock, Award } from "lucide-react";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";

const PRO_ASSIST_PRICE = 47;

const Cart = () => {
  const { items, removeFromCart, updateQty, totalPrice } = useCart();
  const { format, cur } = useCurrency();
  const navigate = useNavigate();
  const [showProAssist, setShowProAssist] = useState(false);
  const [proAssist, setProAssist] = useState(false);

  const proceed = () => { if (!proAssist) { setShowProAssist(true); } else navigate("/checkout"); };
  const addProAndGo = () => { setProAssist(true); setShowProAssist(false); navigate("/checkout?pro=1"); };
  const skipAndGo = () => { setShowProAssist(false); navigate("/checkout"); };

  const finalTotal = totalPrice + (proAssist ? PRO_ASSIST_PRICE : 0);

  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Your Cart</h1>
          {items.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center"><p className="text-slate-600">Your cart is empty.</p><Link to="/shop"><Button className="mt-4 bg-blue-600 hover:bg-blue-700">Continue Shopping</Button></Link></div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 border-b border-slate-100 last:border-0">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-contain bg-slate-50 rounded-lg p-2" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{item.name}</h3>
                      <p className="text-blue-700 font-bold mt-1">{format(item.price)}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 border border-slate-200 rounded-lg">
                          <button onClick={() => updateQty(item.id, item.qty - 1)} className="p-2 hover:bg-slate-100"><Minus className="w-3.5 h-3.5" /></button>
                          <span className="text-sm font-semibold w-7 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.qty + 1)} className="p-2 hover:bg-slate-100"><Plus className="w-3.5 h-3.5" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-rose-600 flex items-center gap-1.5 text-sm"><Trash2 className="w-4 h-4" />Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <aside className="bg-white rounded-2xl border border-slate-200 p-6 h-fit sticky top-32">
                <h2 className="font-bold text-slate-900 mb-4">Order Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-600">Subtotal ({items.length} items)</span><span className="font-semibold">{format(totalPrice)}</span></div>
                  {proAssist && <div className="flex justify-between"><span className="text-slate-600">ProAssist Installation</span><span className="font-semibold">{format(PRO_ASSIST_PRICE)}</span></div>}
                  <div className="flex justify-between pt-3 border-t border-slate-100"><span className="font-bold">Total</span><span className="font-bold text-blue-700 text-lg">{format(finalTotal)}</span></div>
                </div>
                <Button onClick={proceed} className="w-full mt-5 bg-blue-600 hover:bg-blue-700 h-12 font-semibold">Proceed to Checkout</Button>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />Genuine License</span>
                  <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-blue-500" />SSL Secured</span>
                  <span className="flex items-center gap-1"><Headphones className="w-3.5 h-3.5 text-purple-500" />24/7 Support</span>
                  <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-500" />180-Day Refund</span>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <Dialog open={showProAssist} onOpenChange={setShowProAssist}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add ProAssist Premium Installation</DialogTitle>
            <DialogDescription className="sr-only">Optional remote installation service upsell</DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white"><Headphones className="w-6 h-6" /></div>
              <div><div className="font-bold text-slate-900">ProAssist Premium</div><div className="text-sm text-slate-600">Installation</div></div>
            </div>
            <p className="text-sm text-slate-700">Let us install it for you. ProAssist includes:</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {["Our team will remotely install the software for you.", "Secure end-to-end encrypted connection.", "Installation within the same business day.", "Backed by our money-back guarantee."].map((x) => (
                <li key={x} className="flex items-start gap-2"><span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] mt-0.5">✓</span>{x}</li>
              ))}
            </ul>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={skipAndGo} className="flex-1">No thanks, Continue to Cart</Button>
              <Button onClick={addProAndGo} className="flex-1 bg-blue-600 hover:bg-blue-700">Add ProAssist {cur.symbol}{(PRO_ASSIST_PRICE * cur.rate).toFixed(2)}</Button>
            </div>
            <div className="mt-4 text-[11px] text-slate-500 space-y-1">
              <p><sup>1</sup>Installation service guaranteed within business hours (Monday-Saturday 9AM-5PM EST).</p>
              <p><sup>2</sup>We guarantee a successful installation of your software or we refund you for the service.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Cart;
