import React, { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { DollarSign, ShoppingBag, Receipt, TrendingUp } from "lucide-react";
import api from "../../lib/api";
import { TabSpinner } from "./TableBits";

const usd = (n) => `$${Number(n).toFixed(2)}`;

const STAT_CARDS = [
  { key: "total_revenue", label: "Total Revenue", Icon: DollarSign, fmt: usd, cls: "text-emerald-600 bg-emerald-50" },
  { key: "paid_orders", label: "Paid Orders", Icon: ShoppingBag, fmt: (n) => n, cls: "text-blue-600 bg-blue-50" },
  { key: "avg_order_value", label: "Avg Order Value", Icon: Receipt, fmt: usd, cls: "text-indigo-600 bg-indigo-50" },
  { key: "revenue_7d", label: "Revenue (7 days)", Icon: TrendingUp, fmt: usd, cls: "text-amber-600 bg-amber-50" },
];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <div className="font-semibold text-slate-900">{label}</div>
      <div className="text-emerald-600 font-bold">{usd(row.revenue)}</div>
      <div className="text-slate-500">{row.orders} order{row.orders !== 1 ? "s" : ""}</div>
    </div>
  );
};

const BestSellerRow = ({ rank, item }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0" data-testid={`dashboard-best-seller-${rank}`}>
    <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold ${rank <= 3 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}>{rank}</span>
    {item.image && <img src={item.image} alt="" className="w-9 h-9 object-contain rounded bg-slate-50 shrink-0" />}
    <span className="text-xs font-medium text-slate-700 line-clamp-2 flex-1">{item.name}</span>
    <div className="text-right shrink-0">
      <div className="text-xs font-bold text-slate-900">{item.units} sold</div>
      <div className="text-[11px] text-emerald-600 font-semibold">{usd(item.revenue)}</div>
    </div>
  </div>
);

const DashboardTab = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    api.get("/api/admin/dashboard").then(({ data }) => setData(data)).catch((e) => {
      console.error("Dashboard load failed:", e);
      setError(true);
    });
  }, []);
  if (error) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center" data-testid="dashboard-error">
        <p className="text-sm text-slate-500">Couldn't load the sales dashboard. Please refresh the page.</p>
      </div>
    );
  }
  if (!data) return <TabSpinner />;

  const chartData = data.revenue_by_day.map((d) => ({ ...d, day: d.date.slice(5).replace("-", "/") }));

  return (
    <div className="space-y-5" data-testid="admin-dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STAT_CARDS.map(({ key, label, Icon, fmt, cls }) => (
          <div key={key} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3" data-testid={`dashboard-stat-${key}`}>
            <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${cls}`}><Icon className="w-5 h-5" /></div>
            <div>
              <div className="text-lg font-extrabold text-slate-900">{fmt(data.summary[key])}</div>
              <div className="text-[11px] text-slate-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5" data-testid="dashboard-revenue-chart">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Revenue per Day — Last 30 Days</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height={256} minWidth={0}>
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} interval={4} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(37,99,235,0.06)" }} />
                <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5" data-testid="dashboard-best-sellers">
          <h3 className="font-bold text-slate-900 text-sm mb-2">Best-Selling Products</h3>
          {data.best_sellers.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">No paid orders yet — sales will appear here.</p>
          ) : (
            data.best_sellers.map((item, i) => <BestSellerRow key={item.id} rank={i + 1} item={item} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
