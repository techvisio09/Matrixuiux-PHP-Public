import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { RefreshCw } from "lucide-react";
import api from "../../lib/api";
import { Th, Td, TabSpinner } from "./TableBits";

const STATUSES = ["pending_payment", "paid", "delivered", "refunded", "cancelled"];
const STATUS_COLORS = { paid: "bg-emerald-100 text-emerald-700", pending_payment: "bg-amber-100 text-amber-700", delivered: "bg-blue-100 text-blue-700", refunded: "bg-purple-100 text-purple-700", cancelled: "bg-slate-100 text-slate-500" };

const OrdersTab = ({ toast }) => {
  const [rows, setRows] = useState(null);
  const load = useCallback(() => api.get("/api/admin/orders").then(({ data }) => setRows(data)), []);
  useEffect(() => { load(); }, [load]);

  const setStatus = async (o, status) => {
    try { await api.patch(`/api/admin/orders/${o.order_id}`, { status }); toast({ title: `Order #${o.order_number} → ${status}` }); load(); }
    catch (err) { toast({ title: "Failed", description: err.response?.data?.detail || err.message }); }
  };
  const resend = async (o) => {
    try { await api.post(`/api/admin/orders/${o.order_id}/resend-email`); toast({ title: "Email queued/sent", description: `Order #${o.order_number}` }); }
    catch (err) { toast({ title: "Failed", description: err.response?.data?.detail || err.message }); }
  };

  if (!rows) return <TabSpinner />;
  if (rows.length === 0) return <p className="text-sm text-slate-500 py-8 text-center">No orders yet.</p>;
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
      <table className="w-full" data-testid="admin-orders-table">
        <thead className="border-b border-slate-100"><tr><Th>Order</Th><Th>Customer</Th><Th>Items</Th><Th>Total</Th><Th>Status</Th><Th>Email</Th></tr></thead>
        <tbody className="divide-y divide-slate-50">
          {rows.map((o) => (
            <tr key={o.order_id}>
              <Td><div className="font-bold text-xs">#{o.order_number}</div><div className="text-[11px] text-slate-400">{new Date(o.created_at).toLocaleString()}</div></Td>
              <Td><div className="text-xs">{o.customer?.first_name} {o.customer?.last_name}</div><div className="text-[11px] text-slate-400">{o.email}</div></Td>
              <Td className="max-w-[260px]"><div className="text-[11px] text-slate-500 line-clamp-2">{o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</div></Td>
              <Td><span className="font-bold text-xs">${Number(o.total).toFixed(2)}</span></Td>
              <Td>
                <select value={o.status} onChange={(e) => setStatus(o, e.target.value)}
                  className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${STATUS_COLORS[o.status] || "bg-slate-100"}`} data-testid={`admin-order-status-${o.order_number}`}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Td>
              <Td><Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => resend(o)} data-testid={`admin-resend-${o.order_number}`}><RefreshCw className="w-3 h-3 mr-1" />Resend</Button></Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTab;
