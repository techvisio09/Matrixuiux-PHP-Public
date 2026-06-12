import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Star, Phone, Lock, ShieldCheck, ArrowLeft, CreditCard, Mail, Headphones, Loader2 } from "lucide-react";
import { COMPANY } from "../data/company";
import { VisaIcon, MasterCardIcon, AmexIcon, DiscoverIcon, PayPalIcon } from "../components/PaymentIcons";
import Logo from "../components/Logo";
import api, { formatApiErrorDetail } from "../lib/api";

const Checkout = () => {
  const { items, totalPrice } = useCart();
  const { format, cur } = useCurrency();
  const { user } = useAuth();
  const [params] = useSearchParams();
  const proAssist = params.get("pro") === "1";
  const PRO = 47;
  const subtotal = totalPrice;
  const total = subtotal + (proAssist ? PRO : 0);
  const savings = items.reduce((acc, i) => acc + Math.max(0, (i.originalPrice || i.price) - i.price) * i.qty, 0);
  const [coupon, setCoupon] = useState("");
  const [payMethod, setPayMethod] = useState("card");
  const [card, setCard] = useState({ number: "", exp: "", cvv: "" });
  const setCardField = (k) => (e) => setCard((c) => ({ ...c, [k]: e.target.value }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: user?.email || "", first_name: "", last_name: "", phone: "",
    address: "", address2: "", country: "US", city: "", state: "", zip: "",
  });
  const [phoneCode, setPhoneCode] = useState("+1");
  const PHONE_CODES = [
    { code: "+1", label: "🇺🇸 +1" }, { code: "+1 ", label: "🇨🇦 +1" }, { code: "+44", label: "🇬🇧 +44" },
    { code: "+61", label: "🇦🇺 +61" }, { code: "+49", label: "🇩🇪 +49" }, { code: "+33", label: "🇫🇷 +33" },
    { code: "+34", label: "🇪🇸 +34" }, { code: "+39", label: "🇮🇹 +39" }, { code: "+31", label: "🇳🇱 +31" },
    { code: "+91", label: "🇮🇳 +91" }, { code: "+971", label: "🇦🇪 +971" }, { code: "+64", label: "🇳🇿 +64" },
  ];
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const placeOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) { setError("Your cart is empty."); return; }
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post("/api/payments/checkout/session", {
        items: items.map((i) => ({ id: i.id, qty: i.qty })),
        pro_assist: proAssist,
        payment_method: payMethod,
        origin_url: window.location.origin,
        customer: { ...form, phone: `${phoneCode.trim()} ${form.phone}`.trim() },
      });
      window.location.href = data.url; // Redirect to secure Stripe checkout
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Minimal checkout header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
          <Link to="/" className="flex items-center gap-2.5"><Logo className="w-10 h-10" status={false} /><div className="font-bold text-slate-900">{COMPANY.brand}</div></Link>
          <div className="flex items-center gap-3 sm:gap-5 text-xs text-slate-600 flex-wrap">
            <div className="hidden sm:block"><div className="font-semibold text-slate-900">Shopper Approved</div><div>5,519+ verified reviews</div></div>
            <div className="flex items-center gap-1"><div className="flex">{[1, 2, 3, 4, 5].map((n) => <Star key={n} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}</div><span className="font-bold text-slate-900">4.6</span></div>
            <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-1.5 font-semibold text-slate-900"><Phone className="w-4 h-4 text-blue-600" />+1 {COMPANY.phone.replace(/^1-/, "")}</a>
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold"><Lock className="w-4 h-4" />Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-7xl mx-auto px-4 py-5 flex items-center gap-2 text-sm flex-wrap">
        <div className="flex items-center gap-2 text-slate-400"><span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[11px] font-bold">1</span>Cart</div>
        <div className="w-8 h-px bg-slate-300" />
        <div className="flex items-center gap-2 text-blue-700 font-semibold"><span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">2</span>Checkout</div>
        <div className="w-8 h-px bg-slate-300" />
        <div className="flex items-center gap-2 text-slate-400"><span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[11px] font-bold">3</span>Done</div>
        <Link to="/cart" className="ml-auto text-sm text-blue-700 hover:underline flex items-center gap-1"><ArrowLeft className="w-4 h-4" />Back to Cart</Link>
      </div>

      <form onSubmit={placeOrder} className="max-w-7xl mx-auto px-4 pb-16 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Mail className="w-5 h-5 text-blue-600" />Contact Information</h2>
            <Label>Email Address *</Label>
            <Input required type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" className="mt-1.5" data-testid="checkout-email" />
            <p className="text-xs text-slate-500 mt-1.5">License key delivered to this email within 15-30 minutes</p>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-bold text-slate-900 mb-4">Billing Address</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>First Name *</Label><Input required value={form.first_name} onChange={set("first_name")} placeholder="John" className="mt-1.5" data-testid="checkout-first-name" /></div>
              <div><Label>Last Name *</Label><Input required value={form.last_name} onChange={set("last_name")} placeholder="Doe" className="mt-1.5" data-testid="checkout-last-name" /></div>
              <div className="col-span-2">
                <Label>Phone Number *</Label>
                <div className="mt-1.5 flex gap-2">
                  <Select value={phoneCode} onValueChange={setPhoneCode}>
                    <SelectTrigger className="w-[110px] shrink-0" data-testid="phone-code-select"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PHONE_CODES.map((c) => <SelectItem key={c.label} value={c.code}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input required value={form.phone} onChange={set("phone")} placeholder="555 123 4567" className="flex-1" data-testid="checkout-phone" />
                </div>
                <label className="mt-2 flex items-start gap-2 text-xs text-slate-600"><Checkbox className="mt-0.5" /><span>By checking this box, you agree to receive SMS messages from {COMPANY.brand}.</span></label>
              </div>
              <div className="col-span-2"><Label>Address *</Label><Input required value={form.address} onChange={set("address")} placeholder="123 Main Street, Apt 4B" className="mt-1.5" data-testid="checkout-address" /></div>
              <div className="col-span-2"><Label>Address Line 2 (Optional)</Label><Input value={form.address2} onChange={set("address2")} placeholder="Suite, building, floor, etc." className="mt-1.5" /></div>
              <div><Label>Country *</Label><Select value={form.country} onValueChange={(v) => setForm((f) => ({ ...f, country: v }))}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="US">United States</SelectItem><SelectItem value="CA">Canada</SelectItem><SelectItem value="UK">United Kingdom</SelectItem><SelectItem value="AU">Australia</SelectItem></SelectContent></Select></div>
              <div><Label>City *</Label><Input required value={form.city} onChange={set("city")} placeholder="New York" className="mt-1.5" data-testid="checkout-city" /></div>
              <div><Label>State *</Label><Input required value={form.state} onChange={set("state")} placeholder="NY" className="mt-1.5" data-testid="checkout-state" /></div>
              <div><Label>ZIP Code *</Label><Input required value={form.zip} onChange={set("zip")} placeholder="10001" className="mt-1.5" data-testid="checkout-zip" /></div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2"><Lock className="w-5 h-5 text-emerald-600" />Secure Payment</h2>
            <p className="text-sm text-slate-500 mb-4">Choose your preferred payment method</p>

            {/* Card option */}
            <div
              data-testid="pay-method-card"
              role="radio"
              aria-checked={payMethod === "card"}
              onClick={() => setPayMethod("card")}
              className={`w-full cursor-pointer rounded-xl p-4 mb-3 border-2 transition-colors ${payMethod === "card" ? "border-blue-600 bg-blue-50/30" : "border-slate-200 bg-white hover:border-slate-300"}`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${payMethod === "card" ? "border-blue-600" : "border-slate-300"}`}>
                    {payMethod === "card" && <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                  </span>
                  <CreditCard className="w-5 h-5 text-blue-700" /><span className="font-semibold text-slate-900">Pay with Credit/Debit Card</span>
                </div>
                <div className="flex gap-1.5 flex-wrap"><VisaIcon /><MasterCardIcon /><AmexIcon /><DiscoverIcon /></div>
              </div>
              {payMethod === "card" && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <Label>Card Number</Label>
                      <Input value={card.number} onChange={setCardField("number")} inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" maxLength={19} className="mt-1.5" data-testid="card-number-input" />
                    </div>
                    <div>
                      <Label>Expiry</Label>
                      <Input value={card.exp} onChange={setCardField("exp")} autoComplete="cc-exp" placeholder="MM/YY" maxLength={5} className="mt-1.5" data-testid="card-exp-input" />
                    </div>
                    <div>
                      <Label>CVV</Label>
                      <Input value={card.cvv} onChange={setCardField("cvv")} inputMode="numeric" autoComplete="cc-csc" type="password" placeholder="123" maxLength={4} className="mt-1.5" data-testid="card-cvv-input" />
                    </div>
                  </div>
                  <p className="mt-2.5 text-xs text-slate-500 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />PCI DSS Compliant — your card is tokenized securely via Stripe. We never store card details.</p>
                </div>
              )}
            </div>

            {/* PayPal option */}
            <div
              data-testid="pay-method-paypal"
              role="radio"
              aria-checked={payMethod === "paypal"}
              onClick={() => setPayMethod("paypal")}
              className={`w-full cursor-pointer rounded-xl p-4 mb-4 border-2 transition-colors ${payMethod === "paypal" ? "border-blue-600 bg-blue-50/30" : "border-slate-200 bg-white hover:border-slate-300"}`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${payMethod === "paypal" ? "border-blue-600" : "border-slate-300"}`}>
                    {payMethod === "paypal" && <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                  </span>
                  <span className="font-semibold text-slate-900">Pay with PayPal</span>
                </div>
                <PayPalIcon />
              </div>
              {payMethod === "paypal" && (
                <p className="mt-3 text-sm text-slate-600">You'll be redirected to complete your purchase securely. Pay with your PayPal balance, bank, or linked card — no card details required here.</p>
              )}
            </div>

            {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2" data-testid="checkout-error">{error}</div>}

            <Button data-testid="checkout-pay-button" type="submit" disabled={busy} size="lg"
              className={`w-full font-bold text-base h-12 ${payMethod === "paypal" ? "bg-[#FFC439] hover:bg-[#f0b72c] text-slate-900" : "bg-blue-600 hover:bg-blue-700"}`}>
              {busy
                ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Redirecting to secure checkout…</>)
                : payMethod === "paypal"
                  ? (<><span className="italic font-extrabold" style={{ color: "#003087" }}>Pay</span><span className="italic font-extrabold mr-1.5" style={{ color: "#0070BA" }}>Pal</span>· Continue {format(total)}</>)
                  : (<>Pay Securely · {format(total)}</>)}
            </Button>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-500"><span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" />256-bit SSL</span><span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" />Powered by Stripe</span></div>
            {cur.code !== "USD" && <p className="text-[11px] text-slate-400 text-center mt-2">Payment is processed in USD (${total.toFixed(2)}). Displayed prices in {cur.code} are estimates.</p>}
            <p className="text-[11px] text-slate-500 text-center mt-3">By placing your order, you agree to our Terms and Privacy Policy</p>
          </section>
        </div>

        <aside className="bg-white rounded-2xl border border-slate-200 p-6 h-fit">
          <h2 className="font-bold text-slate-900">Order Summary</h2>
          <p className="text-xs text-slate-500 mb-4">{items.length} item{items.length !== 1 ? "s" : ""}</p>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map((i) => (
              <div key={i.id} className="flex gap-3">
                <img src={i.image} alt={i.name} className="w-14 h-14 object-contain bg-slate-50 rounded" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 line-clamp-2">{i.name}</p>
                  <div className="flex items-center justify-between mt-1"><span className="text-[11px] text-slate-500">Qty {i.qty}</span><span className="text-sm font-bold text-blue-700">{format(i.price * i.qty)}</span></div>
                </div>
              </div>
            ))}
            {proAssist && (
              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white"><Headphones className="w-6 h-6" /></div>
                <div className="flex-1"><p className="text-xs font-semibold">ProAssist Premium Installation</p><div className="flex justify-between mt-1"><span className="text-[11px] text-slate-500">Qty 1</span><span className="text-sm font-bold text-blue-700">{format(PRO)}</span></div></div>
              </div>
            )}
          </div>
          <div className="mt-5 flex gap-2"><Input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code" className="h-10" /><Button type="button" variant="outline" className="h-10">Apply</Button></div>
          <div className="mt-5 space-y-2 text-sm border-t border-slate-100 pt-4">
            <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span className="font-semibold">{format(subtotal + (proAssist ? PRO : 0))}</span></div>
            {savings > 0 && <div className="flex justify-between text-emerald-600"><span>You Save</span><span>-{format(savings)}</span></div>}
            <div className="flex justify-between pt-2 border-t border-slate-100"><span className="font-bold">Total</span><span className="font-bold text-blue-700 text-lg" data-testid="checkout-total">{format(total)}</span></div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-xl text-sm">
            <div className="font-semibold text-slate-900 mb-1">Need Assistance?</div>
            <p className="text-xs text-slate-600">We're here to help</p>
            <div className="mt-2 space-y-1.5 text-xs">
              <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-1.5 text-blue-700 font-semibold"><Phone className="w-3.5 h-3.5" />+1 {COMPANY.phone.replace(/^1-/, "")}</a>
              <div className="text-slate-600">{COMPANY.hours}</div>
              <a href={`mailto:${COMPANY.email}`} className="text-blue-700 hover:underline break-all">{COMPANY.email}</a>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default Checkout;
