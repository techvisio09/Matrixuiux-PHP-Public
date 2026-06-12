import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { legalPages } from "../data/legalPages";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";

const OptOutForm = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const submit = (e) => {
    e.preventDefault();
    toast({ title: "Opt-out request submitted", description: "We'll process your request within 15 business days and confirm by email." });
    setEmail("");
  };
  return (
    <form onSubmit={submit} className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-5 max-w-md" data-testid="opt-out-form">
      <label className="text-sm font-medium text-slate-700">Email Address *</label>
      <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1.5" data-testid="opt-out-email-input" />
      <p className="text-xs text-slate-500 mt-1.5">Enter the email address associated with your account or purchases.</p>
      <Button type="submit" className="mt-3 bg-blue-600 hover:bg-blue-700 rounded-full" data-testid="opt-out-submit-btn">Submit Opt-Out Request</Button>
    </form>
  );
};

export default function LegalPage({ slug }) {
  const page = legalPages[slug];
  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-screen" data-testid={`legal-page-${slug}`}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-12">
            <div className="text-sm text-slate-500 mb-4"><Link to="/" className="hover:text-blue-700">Home</Link> / <span className="text-slate-900">{page.title}</span></div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">{page.title}</h1>
            <p className="text-sm text-slate-500 mt-2">Last updated: {page.updated}</p>

            {page.sections.map((s) => (
              <section key={s.h} className="mt-8">
                <h2 className="text-lg font-bold text-slate-900 mb-3">{s.h}</h2>
                {(s.paras || []).map((p) => (
                  <p key={p} className="text-sm text-slate-600 leading-relaxed mb-3">{p}</p>
                ))}
                {s.list && (
                  <ul className="space-y-2 mb-3">
                    {s.list.map((x) => (
                      <li key={x} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
                        <span className="w-1.5 h-1.5 mt-2 shrink-0 rounded-full bg-blue-500" />{x}
                      </li>
                    ))}
                  </ul>
                )}
                {(s.after || []).map((p) => (
                  <p key={p} className="text-sm text-slate-600 leading-relaxed mb-3">{p}</p>
                ))}
                {s.optOutForm && <OptOutForm />}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
