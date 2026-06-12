import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { Th, Td, TabSpinner } from "./TableBits";

const STATUS_CLS = { sent: "bg-emerald-100 text-emerald-700", queued: "bg-amber-100 text-amber-700" };

const EmailsTab = () => {
  const [rows, setRows] = useState(null);
  useEffect(() => { api.get("/api/admin/emails").then(({ data }) => setRows(data)); }, []);
  if (!rows) return <TabSpinner />;
  if (rows.length === 0) return <p className="text-sm text-slate-500 py-8 text-center">No emails yet. Emails are queued here when no Resend API key is configured.</p>;
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
      <table className="w-full" data-testid="admin-emails-table">
        <thead className="border-b border-slate-100"><tr><Th>To</Th><Th>Subject</Th><Th>Status</Th><Th>When</Th></tr></thead>
        <tbody className="divide-y divide-slate-50">
          {rows.map((e) => (
            <tr key={`${e.to}-${e.created_at}-${e.subject}`}>
              <Td className="text-xs">{e.to}</Td>
              <Td className="text-xs max-w-[300px] truncate">{e.subject}</Td>
              <Td><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_CLS[e.status] || "bg-red-100 text-red-600"}`}>{e.status}</span></Td>
              <Td className="text-[11px] text-slate-400">{new Date(e.created_at).toLocaleString()}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmailsTab;
