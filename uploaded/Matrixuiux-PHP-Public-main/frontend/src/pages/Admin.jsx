import React, { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Loader2, LayoutDashboard, Package, ShoppingBag, Users, KeyRound, Mail, ShieldAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { useToast } from "../hooks/use-toast";
import DashboardTab from "../components/admin/DashboardTab";
import ProductsTab from "../components/admin/ProductsTab";
import OrdersTab from "../components/admin/OrdersTab";
import LeadsTab from "../components/admin/LeadsTab";
import KeysTab from "../components/admin/KeysTab";
import EmailsTab from "../components/admin/EmailsTab";

const TABS = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "products", label: "Products", Icon: Package },
  { id: "orders", label: "Orders", Icon: ShoppingBag },
  { id: "leads", label: "Leads", Icon: Users },
  { id: "keys", label: "Key Inventory", Icon: KeyRound },
  { id: "emails", label: "Emails", Icon: Mail },
];

const StatsRow = ({ stats }) => (
  <div className="max-w-7xl mx-auto px-4 pt-6 grid grid-cols-2 md:grid-cols-6 gap-3" data-testid="admin-stats">
    {[["Products", stats.products], ["Orders", stats.orders], ["Paid", stats.paid_orders], ["Leads", stats.leads], ["Keys Avail.", stats.keys_available], ["Emails Queued", stats.emails_queued]].map(([label, value]) => (
      <div key={label} className="bg-white rounded-xl border border-slate-200 p-3 text-center">
        <div className="text-xl font-extrabold text-slate-900">{value}</div>
        <div className="text-[11px] text-slate-500">{label}</div>
      </div>
    ))}
  </div>
);

const AccessDenied = () => (
  <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
    <ShieldAlert className="w-12 h-12 text-amber-500" />
    <h1 className="text-xl font-bold text-slate-900 mt-3">Admin access required</h1>
    <p className="text-sm text-slate-500 mt-1">Your account doesn't have permission to view this page.</p>
    <Link to="/"><Button className="mt-5 bg-blue-600 hover:bg-blue-700 rounded-full px-6">Back to Store</Button></Link>
  </div>
);

const AdminHeader = ({ user, logout }) => (
  <header className="bg-slate-900 text-white">
    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center font-extrabold">U</div>
        <div><div className="font-bold text-sm">UCODE SOFTTECH — Admin</div><div className="text-[11px] text-slate-400">{user.email}</div></div>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/" className="text-xs text-slate-300 hover:text-white px-3 py-1.5">← Back to Store</Link>
        <Button size="sm" variant="outline" className="h-8 border-slate-600 bg-transparent text-slate-200 hover:bg-slate-800 hover:text-white" onClick={logout}>Sign Out</Button>
      </div>
    </div>
  </header>
);

export default function Admin() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState("dashboard");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user && user.role === "admin") api.get("/api/admin/stats").then(({ data }) => setStats(data));
  }, [user, tab]);

  if (user === null) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;
  if (user === false) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <AccessDenied />;

  return (
    <div className="min-h-screen bg-slate-50" data-testid="admin-page">
      <AdminHeader user={user} logout={logout} />
      {stats && <StatsRow stats={stats} />}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-1.5 mb-5 flex-wrap">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition ${tab === t.id ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"}`}
              data-testid={`admin-tab-${t.id}`}>
              <t.Icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>
        {tab === "dashboard" && <DashboardTab />}
        {tab === "products" && <ProductsTab toast={toast} />}
        {tab === "orders" && <OrdersTab toast={toast} />}
        {tab === "leads" && <LeadsTab />}
        {tab === "keys" && <KeysTab toast={toast} />}
        {tab === "emails" && <EmailsTab />}
      </div>
    </div>
  );
}
