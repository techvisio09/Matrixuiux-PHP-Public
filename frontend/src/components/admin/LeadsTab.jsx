import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { Th, Td, TabSpinner } from "./TableBits";

const LeadsTab = () => {
  const [rows, setRows] = useState(null);
  useEffect(() => { api.get("/api/admin/leads").then(({ data }) => setRows(data)); }, []);
  if (!rows) return <TabSpinner />;
  if (rows.length === 0) return <p className="text-sm text-slate-500 py-8 text-center">No leads captured yet.</p>;
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
      <table className="w-full" data-testid="admin-leads-table">
        <thead className="border-b border-slate-100"><tr><Th>Name</Th><Th>Email</Th><Th>Phone</Th><Th>Callback?</Th><Th>When</Th></tr></thead>
        <tbody className="divide-y divide-slate-50">
          {rows.map((l, i) => (
            <tr key={l.session_id || `${l.email}-${i}`}>
              <Td className="text-xs font-semibold">{l.name || "—"}</Td>
              <Td className="text-xs">{l.email || "—"}</Td>
              <Td className="text-xs">{l.phone || "—"}</Td>
              <Td>{l.callback_requested ? <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">📞 Callback</span> : <span className="text-xs text-slate-400">No</span>}</Td>
              <Td className="text-[11px] text-slate-400">{l.ts ? new Date(l.ts).toLocaleString() : "—"}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTab;
