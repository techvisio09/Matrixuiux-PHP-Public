import React from "react";
import { Link } from "react-router-dom";
import { COMPANY } from "../data/company";
import { Stars } from "./ProductDetailSections";
import {
  ShieldCheck, Zap, RotateCcw, Check, Monitor, Cpu, MemoryStick, HardDrive, Tv, Wifi, Phone, Mail, BadgeCheck, Laptop,
} from "lucide-react";

export const APP_LABELS = { word: "Word", excel: "Excel", powerpoint: "PowerPoint", outlook: "Outlook", access: "Access", publisher: "Publisher" };

const optionClass = (active, available) => {
  const base = "text-sm font-medium px-4 py-2 rounded-lg border transition ";
  if (active) return base + "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600";
  if (available) return base + "border-slate-300 text-slate-700 hover:border-blue-400";
  return base + "border-slate-200 text-slate-400 opacity-50 blur-[0.6px] cursor-not-allowed";
};

const slugify = (s) => String(s).toLowerCase().replace(/\s+/g, "-");

/* Generic variant selector row (Version / Edition / Operating system) */
export const OptionSelector = ({ title, testPrefix, currentValue, currentLabel, options, isAvailable, onPick, getLabel = (o) => o, btnClass = "", className = "mt-4" }) => (
  <div className={className} data-testid={`${testPrefix}-selector`}>
    <p className="text-sm font-semibold text-slate-700 mb-2">{title}: <span className="font-normal text-slate-500">{currentLabel}</span></p>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const avail = isAvailable(opt);
        return (
          <button
            key={opt}
            onClick={() => onPick(opt)}
            disabled={!avail}
            title={avail ? undefined : "Not available for this configuration"}
            data-testid={`${testPrefix}-option-${slugify(opt)}`}
            className={optionClass(currentValue === opt, avail) + btnClass}
          >
            {getLabel(opt)}
          </button>
        );
      })}
    </div>
  </div>
);

const TRUST_CHIPS = [
  { i: Laptop, t: "1 Device" },
  { i: Zap, t: "Instant Delivery" },
  { i: ShieldCheck, t: "100% Genuine" },
  { i: RotateCcw, t: "30-Day Guarantee" },
];

export const TrustChips = () => (
  <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-5 border-t border-slate-200">
    {TRUST_CHIPS.map((f) => (
      <div key={f.t} className="flex flex-col items-center gap-1.5 bg-slate-50 rounded-xl py-3 px-2 text-center">
        <f.i className="w-5 h-5 text-blue-600" />
        <span className="text-xs font-medium text-slate-700">{f.t}</span>
      </div>
    ))}
  </div>
);

export const VerifiedReviewsBox = () => (
  <div className="mt-4 flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" data-testid="verified-reviews-box">
    <div className="flex items-center gap-2">
      <BadgeCheck className="w-6 h-6 text-emerald-600" />
      <div>
        <p className="text-sm font-semibold text-slate-900">Verified Reviews</p>
        <p className="text-xs text-slate-500">5,519 reviews</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xl font-bold text-slate-900">4.6</span>
      <Stars value={4.6} size="w-3.5 h-3.5" />
    </div>
  </div>
);

export const DescriptionSection = ({ product, isMac, curOs }) => {
  const descBullets = [
    "One-time purchase — no monthly or yearly fees",
    "Lifetime license with free security updates",
    "Official product key delivered instantly by email",
    "Free customer support for installation and activation",
    `Compatible with ${isMac ? "macOS" : "Windows"} operating system`,
  ];
  return (
    <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 lg:p-10" data-testid="description-section">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Product Description</h2>
      <p className="text-slate-700 leading-relaxed">
        {product.name} is a genuine one-time-purchase license with lifetime validity — no subscription costs, ever.
        {product.apps && product.apps.length > 0 && ` It includes ${product.apps.map((a) => APP_LABELS[a] || a).join(", ")} — everything you need to stay productive at home, school or work.`}
        {" "}Fully compatible with {isMac ? "macOS Big Sur and later" : "Windows 10 and Windows 11"}. Your official product key is emailed
        within minutes of purchase along with download links and activation instructions, backed by our free expert support.
      </p>
      <ul className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
        {descBullets.map((x) => (
          <li key={x} className="flex items-start gap-2 text-sm text-slate-700">
            <span className="w-5 h-5 mt-0.5 shrink-0 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Check className="w-3 h-3" /></span>{x}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        {["1-Time Purchase", "1 Desktop", curOs].map((c) => (
          <span key={c} className="text-sm font-semibold bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">{c}</span>
        ))}
      </div>
    </div>
  );
};

const SYS_REQ_MAC = [
  { icon: Monitor, k: "Operating System", v: "macOS 11 Big Sur or later" },
  { icon: Cpu, k: "Processor", v: "Intel or Apple Silicon (M1/M2/M3)" },
  { icon: MemoryStick, k: "RAM", v: "4 GB RAM" },
  { icon: HardDrive, k: "Storage", v: "10 GB available disk space" },
  { icon: Tv, k: "Display", v: "1280 x 800 screen resolution" },
  { icon: Wifi, k: "Internet", v: "Internet connectivity for activation" },
];

const SYS_REQ_WIN = [
  { icon: Monitor, k: "Operating System", v: "Windows 10 or Windows 11" },
  { icon: Cpu, k: "Processor", v: "1.6 GHz or faster, 2-core processor" },
  { icon: MemoryStick, k: "RAM", v: "4 GB RAM (64-bit)" },
  { icon: HardDrive, k: "Storage", v: "4 GB available disk space" },
  { icon: Tv, k: "Display", v: "1280 x 768 screen resolution" },
  { icon: Wifi, k: "Internet", v: "Internet connectivity for activation" },
];

export const SystemRequirementsSection = ({ isMac }) => {
  const sysReq = isMac ? SYS_REQ_MAC : SYS_REQ_WIN;
  return (
    <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 lg:p-10" data-testid="system-requirements-section">
      <h2 className="text-xl font-bold text-slate-900 mb-5">System Requirements</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {sysReq.map((r) => (
          <div key={r.k} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3.5">
            <r.icon className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">{r.k}</p>
              <p className="text-sm font-medium text-slate-900">{r.v}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WHY_BUY = [
  { i: ShieldCheck, t: "100% Genuine", s: "Official products", c: "text-emerald-600 bg-emerald-50" },
  { i: Zap, t: "Instant Delivery", s: "Key in minutes", c: "text-amber-600 bg-amber-50" },
  { i: RotateCcw, t: "30-Day Guarantee", s: "Full refund", c: "text-rose-600 bg-rose-50" },
];

export const HelpAndWhyBuy = () => (
  <div className="mt-8 grid lg:grid-cols-2 gap-6">
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 lg:p-8 text-white" data-testid="need-help-card">
      <h3 className="text-lg font-bold">Need help?</h3>
      <p className="text-blue-100 text-sm mt-1.5">Our dedicated support team is ready to take your call</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-2 bg-white text-blue-700 font-semibold text-sm px-4 py-2.5 rounded-full hover:bg-blue-50 transition" data-testid="call-us-btn"><Phone className="w-4 h-4" />Call us at {COMPANY.phone}</a>
        <Link to="/page/contact-us" className="flex items-center gap-2 border border-white/50 text-white font-semibold text-sm px-4 py-2.5 rounded-full hover:bg-white/10 transition" data-testid="email-us-btn"><Mail className="w-4 h-4" />Email us</Link>
      </div>
    </div>
    <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8" data-testid="why-buy-card">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Why Buy From Us?</h3>
      <div className="grid grid-cols-3 gap-3">
        {WHY_BUY.map((f) => (
          <div key={f.t} className="text-center">
            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${f.c}`}><f.i className="w-5 h-5" /></div>
            <p className="text-sm font-semibold text-slate-900 mt-2">{f.t}</p>
            <p className="text-xs text-slate-500">{f.s}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
