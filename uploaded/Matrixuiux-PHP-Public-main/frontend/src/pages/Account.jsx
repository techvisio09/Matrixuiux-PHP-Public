import React, { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Package, LogOut, Loader2, ShieldCheck, Clock, XCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import api from "../lib/api";

const STATUS_BADGE = {
  paid: { label: "Paid", cls: "bg-emerald-100 text-emerald-700", Icon: ShieldCheck },
  pending_payment: { label: "Pending Payment", cls: "bg-amber-100 text-amber-700", Icon: Clock },
  cancelled: { label: "Cancelled", cls: "bg-slate-100 text-slate-500", Icon: XCircle },
};

const OrderCard = ({ order, format }) => {
  const badge = STATUS_BADGE[order.status] || STATUS_BADGE.pending_payment;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5" data-testid={`order-${order.order_number}`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <span className="font-bold text-slate-900">#{order.order_number}</span>
          <span className="text-xs text-slate-400 ml-3">{new Date(order.created_at).toLocaleDateString()}</span>
        </div>
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${badge.cls}`}>
          <badge.Icon className="w-3.5 h-3.5" />{badge.label}
        </span>
      </div>
      <div className="mt-3 space-y-1.5">
        {order.items.map((i) => (
          <div key={i.id} className="flex justify-between text-sm">
            <span className="text-slate-600">{i.name} × {i.qty}</span>
            <span className="font-semibold text-slate-900">{format(i.price * i.qty)}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between">
        <span className="font-bold text-slate-900">Total</span>
        <span className="font-bold text-blue-700">{format(order.total)}</span>
      </div>
    </div>
  );
};

export default function Account() {
  const { user, logout } = useAuth();
  const { format } = useCurrency();
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    if (!user) return;
    api.get("/api/orders/my").then(({ data }) => setOrders(data)).catch(() => setOrders([]));
  }, [user]);

  if (user === null) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;
  }
  if (user === false) return <Navigate to="/login" replace />;

  return (
    <>
      <Header />
      <main className="min-h-[70vh] bg-slate-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between flex-wrap gap-4" data-testid="account-profile">
            <div className="flex items-center gap-4">
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  {(user.name || user.email)[0].toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-slate-900" data-testid="account-name">{user.name}</h1>
                <p className="text-sm text-slate-500">{user.email}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Signed in {user.auth_provider === "google" ? "with Google" : "with email"}</p>
              </div>
            </div>
            <Button variant="outline" onClick={logout} data-testid="logout-btn"><LogOut className="w-4 h-4 mr-1.5" />Sign Out</Button>
          </div>

          <h2 className="mt-8 mb-4 font-bold text-slate-900 text-lg flex items-center gap-2"><Package className="w-5 h-5 text-blue-600" />My Orders</h2>
          {orders === null ? (
            <div className="py-10 text-center"><Loader2 className="w-5 h-5 animate-spin text-blue-600 mx-auto" /></div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center" data-testid="orders-empty">
              <p className="text-slate-500">No orders yet.</p>
              <Link to="/shop"><Button className="mt-4 bg-blue-600 hover:bg-blue-700 rounded-full px-6">Start Shopping</Button></Link>
            </div>
          ) : (
            <div className="space-y-4" data-testid="orders-list">
              {orders.map((o) => <OrderCard key={o.order_id} order={o} format={format} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
