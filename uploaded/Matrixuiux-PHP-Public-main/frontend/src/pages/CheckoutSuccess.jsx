import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { CheckCircle2, Loader2, AlertTriangle, Mail, Phone, MessageCircle, BookOpen } from "lucide-react";
import api from "../lib/api";
import { COMPANY } from "../data/company";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";

const MAX_ATTEMPTS = 8;
const POLL_INTERVAL = 2000;

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const { clear } = useCart();
  const { format } = useCurrency();
  const [state, setState] = useState({ phase: "checking", order: null });
  const cleared = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setState({ phase: "error", order: null });
      return;
    }
    let cancelled = false;
    const poll = async (attempt) => {
      if (cancelled) return;
      if (attempt >= MAX_ATTEMPTS) {
        setState({ phase: "timeout", order: null });
        return;
      }
      try {
        const { data } = await api.get(`/api/payments/checkout/status/${sessionId}`);
        if (cancelled) return;
        if (data.payment_status === "paid") {
          if (!cleared.current) { cleared.current = true; clear(); }
          setState({ phase: "paid", order: data.order });
          return;
        }
        if (data.status === "expired") {
          setState({ phase: "expired", order: null });
          return;
        }
        setTimeout(() => poll(attempt + 1), POLL_INTERVAL);
      } catch (e) {
        console.error("Payment status check failed:", e);
        if (!cancelled) setState({ phase: "error", order: null });
      }
    };
    poll(0);
    return () => { cancelled = true; };
  }, [sessionId, clear]);

  return (
    <>
      <Header />
      <main className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4 py-14">
        <div className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          {state.phase === "checking" && (
            <div data-testid="payment-checking">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
              <h1 className="text-xl font-bold text-slate-900 mt-4">Confirming your payment…</h1>
              <p className="text-sm text-slate-500 mt-1">This usually takes a few seconds. Please don't close this page.</p>
            </div>
          )}
          {state.phase === "paid" && state.order && (
            <div data-testid="payment-success">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
              <h1 className="text-2xl font-bold text-slate-900 mt-4">Thanks for purchasing with us, {state.order.customer?.first_name}!</h1>
              <p className="text-sm text-slate-600 mt-2">
                📧 Please check your email — we've sent <strong>further instructions and your product key details</strong> to <strong>{state.order.email}</strong>.
              </p>
              <div className="mt-5 bg-slate-50 rounded-xl p-4 text-left space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Order Number</span><span className="font-bold" data-testid="order-number">#{state.order.order_number}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="font-semibold">{state.order.email}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Total Paid</span><span className="font-bold text-blue-700">{format(state.order.total)}</span></div>
              </div>
              <p className="mt-4 text-xs text-slate-500">The charge will appear as <strong>UCODE SOFTTECH LLC</strong> on your card statement.</p>

              <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4 text-left">
                <p className="text-sm font-semibold text-slate-900">Having trouble installing or activating?</p>
                <p className="text-xs text-slate-600 mt-1">Follow our step-by-step installation guide for further assistance:</p>
                <Link to="/page/installation-guide">
                  <Button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 rounded-full" data-testid="installation-guide-btn">
                    <BookOpen className="w-4 h-4 mr-1.5" />Installation Guide
                  </Button>
                </Link>
              </div>

              <div className="mt-4 text-left">
                <p className="text-xs font-semibold text-slate-700 mb-2">Still having problems? Connect with us:</p>
                <div className="grid grid-cols-3 gap-2">
                  <a href={`tel:${COMPANY.phone}`} className="flex flex-col items-center gap-1 border border-slate-200 rounded-xl py-3 hover:border-blue-300 hover:bg-blue-50/50 transition" data-testid="success-call-btn">
                    <Phone className="w-4 h-4 text-blue-600" /><span className="text-[11px] font-semibold text-slate-700">Phone</span>
                  </a>
                  <Link to="/page/contact-us" className="flex flex-col items-center gap-1 border border-slate-200 rounded-xl py-3 hover:border-blue-300 hover:bg-blue-50/50 transition" data-testid="success-email-btn">
                    <Mail className="w-4 h-4 text-blue-600" /><span className="text-[11px] font-semibold text-slate-700">Email</span>
                  </Link>
                  <button onClick={() => window.dispatchEvent(new Event("ucode-open-chat"))} className="flex flex-col items-center gap-1 border border-slate-200 rounded-xl py-3 hover:border-blue-300 hover:bg-blue-50/50 transition" data-testid="success-chat-btn">
                    <MessageCircle className="w-4 h-4 text-blue-600" /><span className="text-[11px] font-semibold text-slate-700">Chat</span>
                  </button>
                </div>
              </div>

              <Link to="/shop"><Button variant="outline" className="mt-6 rounded-full px-8">Continue Shopping</Button></Link>
            </div>
          )}
          {(state.phase === "expired" || state.phase === "error" || state.phase === "timeout") && (
            <div data-testid="payment-failed">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
              <h1 className="text-xl font-bold text-slate-900 mt-4">
                {state.phase === "expired" ? "Payment session expired" : state.phase === "timeout" ? "Still processing…" : "We couldn't confirm your payment"}
              </h1>
              <p className="text-sm text-slate-500 mt-2">
                {state.phase === "timeout"
                  ? "Your payment may still be processing. Check your email for confirmation, or contact support."
                  : "No charge was made if the payment didn't complete. You can try again."}
              </p>
              <div className="mt-6 flex gap-3 justify-center">
                <Link to="/checkout"><Button variant="outline" className="rounded-full px-6">Back to Checkout</Button></Link>
                <Link to="/cart"><Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-6">View Cart</Button></Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
