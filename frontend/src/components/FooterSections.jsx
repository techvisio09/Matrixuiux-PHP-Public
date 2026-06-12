import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Star, ShieldCheck, Zap, Users, Headphones } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { COMPANY } from "../data/company";
import { useToast } from "../hooks/use-toast";
import PaymentRow from "./PaymentIcons";

export const NewsletterBand = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: "Subscribed!", description: "You'll receive exclusive deals soon." });
    setEmail("");
  };
  return (
    <div className="border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h3 className="text-3xl lg:text-4xl font-bold text-white">Join our list and save up to <span className="text-blue-400">81%</span></h3>
        <p className="mt-2 text-slate-400">Subscribe and receive exclusive weekly deals straight to your inbox!</p>
        <form onSubmit={submit} className="mt-5 max-w-md mx-auto flex gap-2">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Enter your email" className="h-12 rounded-full px-5 bg-white text-slate-900" />
          <Button type="submit" className="h-12 px-6 rounded-full bg-blue-600 hover:bg-blue-700 font-semibold">Join</Button>
        </form>
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />Genuine Products</span>
          <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" />Instant Delivery</span>
          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-blue-400" />50,000+ Customers</span>
          <span className="flex items-center gap-1.5"><Headphones className="w-3.5 h-3.5 text-purple-400" />Expert Support</span>
        </div>
      </div>
    </div>
  );
};

const LEGAL_LINKS = [
  ["Disclaimer", "/disclaimer"],
  ["Privacy Policy", "/page/privacy-policy"],
  ["Terms of Service", "/page/terms-of-service"],
  ["Refund Policy", "/page/refund-policy"],
  ["Shipping & Delivery", "/page/shipping-delivery"],
  ["Payment Policy", "/page/payment-policy"],
  ["Cookie Policy", "/page/cookie-policy"],
  ["Do Not Sell My Info", "/page/do-not-sell"],
  ["Sitemap", "/sitemap"],
];

export const FooterBottom = () => (
  <>
    <div className="mt-10 pt-6 border-t border-slate-800 grid md:grid-cols-3 gap-6 items-center">
      <div>
        <div className="text-white text-sm font-semibold mb-2">Secure Payments</div>
        <div className="flex items-center gap-3 text-xs text-slate-400"><span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-emerald-400" />SSL Encrypted Checkout</span><span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-blue-400" />100% Secure</span></div>
        <div className="mt-3"><PaymentRow /></div>
      </div>
      <div className="md:text-center">
        <div className="inline-flex items-center gap-2"><div className="flex">{[1, 2, 3, 4, 5].map((n) => <Star key={n} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div><span className="text-white font-bold">4.6/5</span></div>
        <div className="text-xs text-slate-400">5,519+ verified reviews</div>
        <a href="#reviews" className="text-xs text-blue-400 hover:underline">See all reviews →</a>
      </div>
      <div className="md:text-right text-xs text-slate-400">
        <div className="flex md:justify-end gap-2 mb-2">
          <span className="px-2 py-1 bg-slate-800 rounded text-[10px]">Microsoft Verified</span>
          <span className="px-2 py-1 bg-slate-800 rounded text-[10px]">PCI Compliant</span>
        </div>
        <div>Authorized Reseller • 5+ Years</div>
      </div>
    </div>

    <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400 space-y-3 text-center">
      <p className="max-w-3xl mx-auto">Microsoft®, Office®, and Windows® are trademarks of Microsoft Corporation. {COMPANY.legal} is independent of and not affiliated with Microsoft Corporation.</p>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-2">
        {LEGAL_LINKS.map(([label, to], i) => (
          <React.Fragment key={label}>
            <Link to={to} className="hover:text-white" data-testid={`footer-legal-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>{label}</Link>
            {i < LEGAL_LINKS.length - 1 && <span className="text-slate-600">|</span>}
          </React.Fragment>
        ))}
      </div>
      <div>© {new Date().getFullYear()} {COMPANY.legal}. All rights reserved.</div>
    </div>
  </>
);
