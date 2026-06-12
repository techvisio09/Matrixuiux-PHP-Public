import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supportPages } from "../data/supportPages";
import { COMPANY } from "../data/company";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { useToast } from "../hooks/use-toast";
import {
  ArrowRight, Check, X, Phone, Mail, MessageCircle, MapPin, Clock, Zap, Info, Star, BadgeCheck,
} from "lucide-react";

/* ---------- Section renderers ---------- */

const toBarRows = (bars) => bars.map((pct, i) => ({ star: 5 - i, pct }));

const RatingSummary = ({ s }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 grid md:grid-cols-2 gap-8 items-center" data-testid="rating-summary">
    <div className="text-center md:border-r md:border-slate-200">
      <div className="text-5xl font-bold text-slate-900">{s.score}</div>
      <div className="flex justify-center mt-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} className={`w-5 h-5 ${n <= Math.round(s.score) ? "fill-yellow-400 text-yellow-400" : "text-slate-200 fill-slate-200"}`} />
        ))}
      </div>
      <p className="text-sm text-slate-500 mt-2">Based on {s.total} reviews</p>
      <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mt-2"><BadgeCheck className="w-4 h-4" />{s.verifiedBy}</p>
    </div>
    <div className="space-y-2">
      {toBarRows(s.bars).map((b) => (
        <div key={b.star} className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-600 w-8">{b.star} ★</span>
          <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${b.pct}%` }} />
          </div>
          <span className="text-xs text-slate-500 w-10 text-right">{b.pct}%</span>
        </div>
      ))}
    </div>
  </div>
);

const ReviewGrid = ({ s }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="review-grid">
    {s.items.map((r, i) => (
      <div key={`${r.name}-${r.date}`} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col" data-testid={`customer-review-${i}`}>
        <div className="flex items-center justify-between">
          <div className="flex">{[1, 2, 3, 4, 5].map((n) => <Star key={n} className={`w-3.5 h-3.5 ${n <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200 fill-slate-200"}`} />)}</div>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600"><BadgeCheck className="w-3.5 h-3.5" />Verified</span>
        </div>
        <p className="text-[11px] font-semibold text-blue-700 bg-blue-50 rounded-md px-2 py-1 mt-3 self-start">Verified Purchase: {r.product}</p>
        <p className="text-sm text-slate-700 mt-3 leading-relaxed flex-1">"{r.text}"</p>
        <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-slate-100">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">{r.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{r.name}</p>
            <p className="text-xs text-slate-500">{r.location} · {r.date}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const AffiliateForm = ({ s }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", website: "", promo: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    toast({ title: "Application submitted!", description: "We'll review it and get back to you within 1–2 business days." });
    setForm({ name: "", email: "", website: "", promo: "" });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8">
      <h2 className="text-xl font-bold text-slate-900">{s.title}</h2>
      <p className="text-sm text-slate-500 mt-1 mb-6">{s.subtitle}</p>
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4" data-testid="affiliate-form">
        <div><label className="text-sm font-medium text-slate-700">Full Name *</label><Input required value={form.name} onChange={set("name")} placeholder="Jane Smith" className="mt-1.5" data-testid="affiliate-name-input" /></div>
        <div><label className="text-sm font-medium text-slate-700">Email Address *</label><Input required type="email" value={form.email} onChange={set("email")} placeholder="jane@example.com" className="mt-1.5" data-testid="affiliate-email-input" /></div>
        <div className="sm:col-span-2"><label className="text-sm font-medium text-slate-700">Website / Social Profile</label><Input value={form.website} onChange={set("website")} placeholder="https://yourwebsite.com" className="mt-1.5" data-testid="affiliate-website-input" /></div>
        <div className="sm:col-span-2"><label className="text-sm font-medium text-slate-700">How will you promote our products?</label><Textarea value={form.promo} onChange={set("promo")} rows={4} placeholder="e.g. Tech blog, YouTube channel, email newsletter..." className="mt-1.5" data-testid="affiliate-promo-input" /></div>
        <div className="sm:col-span-2 flex items-center justify-between flex-wrap gap-3">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-full h-11 px-8" data-testid="affiliate-submit-btn">Submit Application<ArrowRight className="w-4 h-4 ml-1.5" /></Button>
          <p className="text-sm text-slate-500">Questions? Email us at <a href={`mailto:${s.contactEmail}`} className="text-blue-700 font-semibold hover:underline">{s.contactEmail}</a></p>
        </div>
      </form>
    </div>
  );
};

const Stats = ({ s }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {s.items.map((st) => (
      <div key={st.label} className="bg-white border border-slate-200 rounded-2xl p-6 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
        <div className="text-2xl lg:text-3xl font-bold text-blue-700">{st.value}</div>
        <div className="text-sm text-slate-500 mt-1">{st.label}</div>
      </div>
    ))}
  </div>
);

const Cta = ({ s }) => (
  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 lg:p-12 text-center">
    <h2 className="text-2xl lg:text-3xl font-bold text-white">{s.title}</h2>
    <p className="mt-3 text-blue-100 max-w-xl mx-auto">{s.text}</p>
    <Link to={s.to}>
      <Button size="lg" className="mt-7 bg-white text-blue-700 hover:bg-blue-50 rounded-full h-12 px-9 font-semibold" data-testid="support-cta-shop">{s.btnLabel}<ArrowRight className="w-4 h-4 ml-1.5" /></Button>
    </Link>
  </div>
);

const Cards = ({ s }) => (
  <div>
    <h2 className="text-xl font-bold text-slate-900 mb-5">{s.title}</h2>
    <div className={`grid sm:grid-cols-2 ${s.cols === 4 ? "lg:grid-cols-4" : ""} gap-4`}>
      {s.items.map((c) => {
        const inner = (
          <>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3"><c.icon className="w-5 h-5" /></div>
            <h3 className="font-semibold text-slate-900">{c.title}</h3>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{c.text}</p>
            {c.to && <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 mt-3">Open<ArrowRight className="w-3.5 h-3.5" /></span>}
          </>
        );
        return c.to ? (
          <Link key={c.title} to={c.to} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all" data-testid={`support-card-${c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>{inner}</Link>
        ) : (
          <div key={c.title} className="bg-white border border-slate-200 rounded-2xl p-5">{inner}</div>
        );
      })}
    </div>
  </div>
);

const ListCards = ({ s }) => (
  <div>
    <h2 className="text-xl font-bold text-slate-900 mb-5">{s.title}</h2>
    <div className="grid md:grid-cols-2 gap-4">
      {s.items.map((c) => (
        <div key={c.title} className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center"><c.icon className="w-5 h-5" /></div>
            <h3 className="font-semibold text-slate-900">{c.title}</h3>
          </div>
          <ul className="space-y-2">
            {c.list.map((x) => (
              <li key={x} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="w-5 h-5 mt-0.5 shrink-0 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Check className="w-3 h-3" /></span>{x}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

const Steps = ({ s }) => (
  <div>
    <h2 className="text-xl font-bold text-slate-900 mb-5">{s.title}</h2>
    <div className="space-y-4">
      {s.groups.map((g, gi) => (
        <div key={g.heading} className="bg-white border border-slate-200 rounded-2xl p-6 flex gap-5">
          <div className="w-10 h-10 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">{gi + 1}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-2">{g.heading}</h3>
            <ul className="space-y-1.5">
              {g.steps.map((st) => (
                <li key={st} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                  <span className="w-1.5 h-1.5 mt-2 shrink-0 rounded-full bg-blue-400" />{st}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Faq = ({ s, idx }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8">
    <h2 className="text-xl font-bold text-slate-900">{s.title}</h2>
    {s.subtitle && <p className="text-sm text-slate-500 mt-1">{s.subtitle}</p>}
    <Accordion type="single" collapsible className="w-full mt-2">
      {s.items.map((f, i) => (
        <AccordionItem key={f.q} value={`s${idx}-${i}`}>
          <AccordionTrigger className="text-left text-sm font-semibold text-slate-900 hover:text-blue-700" data-testid={`support-faq-${idx}-${i}`}>{f.q}</AccordionTrigger>
          <AccordionContent className="text-sm text-slate-600 leading-relaxed">{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

const Table = ({ s }) => (
  <div>
    <h2 className="text-xl font-bold text-slate-900 mb-5">{s.title}</h2>
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead><tr className="bg-slate-50 text-left">{s.headers.map((h) => <th key={h} className="px-5 py-3 font-semibold text-slate-900">{h}</th>)}</tr></thead>
        <tbody>
          {s.rows.map((r) => (
            <tr key={r[0]} className="border-t border-slate-100">{r.map((c, j) => <td key={s.headers[j]} className={`px-5 py-3 ${j === 0 ? "font-medium text-slate-900" : "text-slate-600"}`}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
    {s.note && <p className="text-sm text-slate-500 mt-3">{s.note}</p>}
  </div>
);

const CheckList = ({ s }) => {
  const styles = {
    good: { box: "bg-emerald-50/60 border-emerald-200", icon: <Check className="w-3 h-3" />, chip: "bg-emerald-100 text-emerald-600" },
    bad: { box: "bg-rose-50/60 border-rose-200", icon: <X className="w-3 h-3" />, chip: "bg-rose-100 text-rose-600" },
    info: { box: "bg-blue-50/60 border-blue-200", icon: <Info className="w-3 h-3" />, chip: "bg-blue-100 text-blue-600" },
  }[s.variant || "info"];
  return (
    <div className={`border rounded-2xl p-6 ${styles.box}`}>
      <h2 className="text-lg font-bold text-slate-900 mb-4">{s.title}</h2>
      <ul className="space-y-2.5">
        {s.items.map((x) => (
          <li key={x} className="flex items-start gap-2.5 text-sm text-slate-700">
            <span className={`w-5 h-5 mt-0.5 shrink-0 rounded-full flex items-center justify-center ${styles.chip}`}>{styles.icon}</span>{x}
          </li>
        ))}
      </ul>
    </div>
  );
};

const ContactMethods = () => (
  <div className="grid sm:grid-cols-3 gap-4">
    {[
      { icon: Mail, badge: "Recommended", title: "Email Support", text: "Response within 24 hours", value: COMPANY.email, href: `mailto:${COMPANY.email}` },
      { icon: MessageCircle, badge: "Instant", title: "Live Chat", text: "Chat with our support team", value: COMPANY.hours, href: null },
      { icon: Phone, badge: null, title: "Phone Support", text: "Talk to a specialist", value: COMPANY.phone, href: `tel:${COMPANY.phone}` },
    ].map((m) => {
      const inner = (
        <>
          {m.badge && <span className="absolute top-4 right-4 text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">{m.badge}</span>}
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3"><m.icon className="w-5 h-5" /></div>
          <h3 className="font-semibold text-slate-900">{m.title}</h3>
          <p className="text-sm text-slate-500 mt-1">{m.text}</p>
          <p className="text-sm font-semibold text-blue-700 mt-2 break-all">{m.value}</p>
        </>
      );
      const cls = "relative bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition";
      return m.href ? <a key={m.title} href={m.href} className={cls} data-testid={`contact-method-${m.title.toLowerCase().replace(/\s+/g, "-")}`}>{inner}</a> : <div key={m.title} className={cls}>{inner}</div>;
    })}
  </div>
);

const ContactForm = ({ s }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", order: "", subject: "", message: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    toast({ title: "Message sent!", description: "Our team will get back to you within 24 hours." });
    setForm({ name: "", email: "", phone: "", order: "", subject: "", message: "" });
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8">
      <h2 className="text-xl font-bold text-slate-900">{s.title}</h2>
      <p className="text-sm text-slate-500 mt-1 mb-6">{s.subtitle}</p>
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4" data-testid="contact-form">
        <div><label className="text-sm font-medium text-slate-700">Full Name *</label><Input required value={form.name} onChange={set("name")} placeholder="John Smith" className="mt-1.5" data-testid="contact-name-input" /></div>
        <div><label className="text-sm font-medium text-slate-700">Email Address *</label><Input required type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" className="mt-1.5" data-testid="contact-email-input" /></div>
        <div><label className="text-sm font-medium text-slate-700">Phone Number (Optional)</label><Input value={form.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" className="mt-1.5" data-testid="contact-phone-input" /></div>
        <div><label className="text-sm font-medium text-slate-700">Order Number (Optional)</label><Input value={form.order} onChange={set("order")} placeholder="#12345" className="mt-1.5" data-testid="contact-order-input" /></div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-slate-700">Subject *</label>
          <select required value={form.subject} onChange={set("subject")} className="mt-1.5 w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm" data-testid="contact-subject-select">
            <option value="">Select a subject</option>
            {["General Inquiry", "Order Support", "Technical Support", "Billing Question", "Refund Request", "License Activation Help", "Other"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2"><label className="text-sm font-medium text-slate-700">Message *</label><Textarea required value={form.message} onChange={set("message")} rows={5} placeholder="Tell us how we can help..." className="mt-1.5" data-testid="contact-message-input" /></div>
        <div className="sm:col-span-2"><Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-full h-11 px-8" data-testid="contact-submit-btn">Send Message<ArrowRight className="w-4 h-4 ml-1.5" /></Button></div>
      </form>
    </div>
  );
};

const ContactInfo = () => (
  <div className="grid sm:grid-cols-3 gap-4">
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <MapPin className="w-5 h-5 text-blue-600 mb-2" />
      <h3 className="font-semibold text-slate-900 mb-1.5">Our Office</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{COMPANY.legal}<br />{COMPANY.address}<br />{COMPANY.city}, {COMPANY.state} {COMPANY.zip}<br />United States</p>
    </div>
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <Clock className="w-5 h-5 text-blue-600 mb-2" />
      <h3 className="font-semibold text-slate-900 mb-1.5">Business Hours</h3>
      <div className="text-sm text-slate-600 space-y-1">
        <div className="flex justify-between"><span>Mon – Fri</span><span className="font-medium text-slate-900">9 AM – 6 PM EST</span></div>
        <div className="flex justify-between"><span>Saturday</span><span className="font-medium text-slate-900">10 AM – 4 PM EST</span></div>
        <div className="flex justify-between"><span>Sunday</span><span className="font-medium text-slate-900">Closed</span></div>
      </div>
    </div>
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <Zap className="w-5 h-5 text-amber-500 mb-2" />
      <h3 className="font-semibold text-slate-900 mb-1.5">Quick Response</h3>
      <p className="text-sm text-slate-600 leading-relaxed">We typically reply to all inquiries within 24 hours. For urgent matters, call us or use live chat for immediate assistance.</p>
    </div>
  </div>
);

/* ---------- Page ---------- */

export default function SupportPage({ slug }) {
  const page = supportPages[slug];
  React.useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  return (
    <>
      <Header />
      <section className="bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-14" data-testid={`support-page-${slug}`}>
          <div className="text-sm text-slate-500 mb-3"><Link to="/" className="hover:text-blue-700">Home</Link> / <span className="text-slate-900">{page.title}</span></div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">{page.heading || page.title}</h1>
          <p className="mt-3 text-slate-600 max-w-2xl text-base">{page.subtitle}</p>
          {page.heroChips.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {page.heroChips.map((c) => <span key={c} className="text-xs font-semibold bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full">{c}</span>)}
            </div>
          )}
        </div>
      </section>

      <main className="bg-slate-50 py-12">
        <div className="max-w-5xl mx-auto px-4 space-y-10">
          {page.sections.map((s, i) => {
            const key = `${s.type}-${s.title || i}`;
            switch (s.type) {
              case "intro": return <p key={key} className="text-slate-700 text-lg leading-relaxed max-w-3xl">{s.text}</p>;
              case "stats": return <Stats key={key} s={s} />;
              case "cta": return <Cta key={key} s={s} />;
              case "ratingSummary": return <RatingSummary key={key} s={s} />;
              case "reviewGrid": return <ReviewGrid key={key} s={s} />;
              case "affiliateForm": return <AffiliateForm key={key} s={s} />;
              case "cards": return <Cards key={key} s={s} />;
              case "listCards": return <ListCards key={key} s={s} />;
              case "steps": return <Steps key={key} s={s} />;
              case "accordion": return <Faq key={key} s={s} idx={i} />;
              case "table": return <Table key={key} s={s} />;
              case "check": return <CheckList key={key} s={s} />;
              case "contactMethods": return <ContactMethods key={key} />;
              case "contactForm": return <ContactForm key={key} s={s} />;
              case "contactInfo": return <ContactInfo key={key} />;
              default: return null;
            }
          })}

          {/* Common CTA */}
          <div className="p-6 lg:p-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="font-bold text-white text-lg">Still need help?</div>
              <div className="text-sm text-blue-100 mt-0.5">Our support team is available {COMPANY.hours}</div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={`tel:${COMPANY.phone}`}><Button className="bg-white text-blue-700 hover:bg-blue-50 rounded-full font-semibold" data-testid="support-cta-call"><Phone className="w-4 h-4 mr-1.5" />{COMPANY.phone}</Button></a>
              {slug !== "contact-us" && <Link to="/page/contact-us"><Button variant="outline" className="rounded-full border-white/60 text-white bg-transparent hover:bg-white/10 hover:text-white" data-testid="support-cta-contact">Contact Support<ArrowRight className="w-4 h-4 ml-1.5" /></Button></Link>}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
