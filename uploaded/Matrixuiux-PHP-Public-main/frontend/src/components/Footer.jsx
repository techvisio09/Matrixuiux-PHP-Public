import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { COMPANY } from "../data/company";
import { useToast } from "../hooks/use-toast";
import Logo from "./Logo";
import { NewsletterBand, FooterBottom } from "./FooterSections";

const PRODUCT_LINKS = [{ n: "Microsoft Office 2024", s: "microsoft-office-2024" }, { n: "Microsoft Office 2021", s: "microsoft-office-2021" }, { n: "Microsoft Office 2019", s: "microsoft-office-2019" }, { n: "Microsoft Project", s: "microsoft-project" }, { n: "Microsoft Visio", s: "microsoft-visio" }, { n: "Office for Mac", s: "office-for-mac" }, { n: "Windows OS", s: "windows-os" }];
const SUPPORT_LINKS = [["my-account", "My Account"], ["help-center", "Help Center"], ["installation-guide", "Installation Guide"], ["activation-help", "Activation Help"], ["faqs", "FAQs"], ["contact-us", "Contact Us"], ["returns-refunds", "Returns & Refunds"]];
const COMPANY_LINKS = [{ n: "About Us", to: "/about-us" }, { n: "Why Choose Us", to: "/page/why-choose-us" }, { n: "Customer Reviews", to: "/page/customer-reviews" }, { n: "Blog", to: "/blog" }, { n: "Affiliate Program", to: "/page/affiliate-program" }, { n: "Disclaimer", to: "/disclaimer" }];
const SOCIALS = [["Facebook", Facebook], ["Twitter", Twitter], ["LinkedIn", Linkedin], ["Instagram", Instagram]];

const BrandColumn = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: "Subscribed!", description: "You'll receive exclusive deals soon." });
    setEmail("");
  };
  return (
    <div className="col-span-2">
      <Link to="/" className="flex items-center gap-2.5 mb-4">
        <Logo className="w-11 h-11" status={false} />
        <div className="leading-tight"><div className="font-bold text-white text-lg">{COMPANY.brand}</div><div className="text-[10px] text-slate-400 tracking-wider font-semibold">AUTHORIZED RESELLER</div></div>
      </Link>
      <p className="text-sm text-slate-400 mb-4 max-w-md">Your trusted source for genuine Microsoft Office licenses at unbeatable prices. Instant delivery, lifetime licenses, and professional support.</p>

      <div className="mb-5">
        <div className="text-white text-sm font-semibold mb-2">Subscribe for Deals</div>
        <form onSubmit={submit} className="flex gap-2 max-w-sm">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Enter your email" className="h-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
          <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 h-10"><ArrowRight className="w-4 h-4" /></Button>
        </form>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 text-blue-400" /><a href={`tel:${COMPANY.phone}`} className="hover:text-white">{COMPANY.phone}</a></div>
        <div className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 text-blue-400" /><a href={`mailto:${COMPANY.email}`} className="hover:text-white">{COMPANY.email}</a></div>
        <div className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-blue-400" /><span>{COMPANY.address}, {COMPANY.city}, {COMPANY.state} {COMPANY.zip}</span></div>
        <div className="flex items-start gap-2 text-slate-400"><span className="w-4" />{COMPANY.hours}</div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        {SOCIALS.map(([name, Icon]) => (
          <a key={name} href="#top" aria-label={name} className="w-9 h-9 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition"><Icon className="w-4 h-4" /></a>
        ))}
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="bg-[#0c1424] text-slate-300">
    <NewsletterBand />

    <div className="max-w-7xl mx-auto px-4 py-14">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <BrandColumn />

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Products</h4>
          <ul className="space-y-2 text-sm">{PRODUCT_LINKS.map((p) => (<li key={p.s}><Link to={`/page/${p.s}`} className="hover:text-white">{p.n}</Link></li>))}</ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Support</h4>
          <ul className="space-y-2 text-sm">{SUPPORT_LINKS.map(([s, label]) => (<li key={s}><Link to={`/page/${s}`} className="hover:text-white">{label}</Link></li>))}</ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
          <ul className="space-y-2 text-sm">{COMPANY_LINKS.map((c) => (<li key={c.n}><Link to={c.to} className="hover:text-white">{c.n}</Link></li>))}</ul>
        </div>
      </div>

      <FooterBottom />
    </div>
  </footer>
);

export default Footer;
