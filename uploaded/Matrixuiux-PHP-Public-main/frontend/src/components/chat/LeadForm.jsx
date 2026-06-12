import React, { useState } from "react";
import { Phone, PhoneCall } from "lucide-react";
import { COMPANY } from "../../data/company";
import { getSessionId, submitLead } from "./chatApi";

// Inline lead-capture form shown inside the chat before the conversation starts
const LeadForm = ({ onSubmitted }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.name.trim() && /\S+@\S+\.\S+/.test(form.email) && form.phone.trim().length >= 7;

  const submit = async (callback) => {
    if (!valid || busy) return;
    setBusy(true);
    try {
      await submitLead({ session_id: getSessionId(), ...form, callback_requested: callback });
    } catch (err) {
      // Lead capture is best-effort; the chat flow continues regardless.
      console.warn("Lead capture failed:", err);
    }
    localStorage.setItem("ucode_lead_done", "1");
    onSubmitted(callback, form);
    setBusy(false);
  };

  return (
    <div className="bg-white border border-blue-100 rounded-xl p-3 shadow-sm" data-testid="chat-lead-form">
      <div className="text-[12px] font-semibold text-slate-900 mb-2">Let's get you connected — fill in your details:</div>
      <div className="space-y-2">
        <input value={form.name} onChange={set("name")} placeholder="Full name" className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" data-testid="lead-name-input" />
        <input value={form.email} onChange={set("email")} type="email" placeholder="Email address" className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" data-testid="lead-email-input" />
        <input value={form.phone} onChange={set("phone")} placeholder="Phone number" className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" data-testid="lead-phone-input" />
      </div>
      <div className="mt-2.5 grid grid-cols-1 gap-1.5">
        <button onClick={() => submit(true)} disabled={!valid || busy}
          className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-semibold rounded-lg py-2 transition" data-testid="lead-callback-btn">
          <PhoneCall className="w-3.5 h-3.5" />Request a Callback
        </button>
        <a href={`tel:${COMPANY.phone}`} onClick={() => valid && submit(false)}
          className="flex items-center justify-center gap-1.5 border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-semibold rounded-lg py-2 transition" data-testid="lead-call-btn">
          <Phone className="w-3.5 h-3.5" />Call {COMPANY.phone}
        </a>
      </div>
      <button onClick={() => { localStorage.setItem("ucode_lead_done", "1"); onSubmitted(null, null); }}
        className="mt-1.5 w-full text-[10px] text-slate-400 hover:text-slate-600" data-testid="lead-skip-btn">Skip — just ask a question</button>
    </div>
  );
};

export default LeadForm;
