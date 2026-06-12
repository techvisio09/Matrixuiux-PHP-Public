import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  ShieldCheck, Zap, Headphones, BadgeDollarSign, Check, ArrowRight, Users, Star, RotateCcw, Clock, Phone, Mail,
} from "lucide-react";
import { COMPANY } from "../data/company";

const STATS = [
  { icon: Users, value: "50,000+", label: "Happy Customers", c: "text-blue-600 bg-blue-50" },
  { icon: Star, value: "4.8/5", label: "Average Rating", c: "text-amber-500 bg-amber-50" },
  { icon: RotateCcw, value: "180-Day", label: "Money-Back Guarantee", c: "text-emerald-600 bg-emerald-50" },
  { icon: Clock, value: "24/7", label: "Expert Support", c: "text-purple-600 bg-purple-50" },
];

const VALUES = [
  { icon: ShieldCheck, title: "Authenticity First", text: "We source all licenses through authorized channels. Every key is verified before delivery — no exceptions.", c: "text-emerald-600 bg-emerald-50" },
  { icon: Zap, title: "Speed & Reliability", text: "Our automated delivery system ensures you receive your license key within 15–30 minutes, every time.", c: "text-amber-600 bg-amber-50" },
  { icon: Headphones, title: "Customer-First Support", text: "We go beyond selling products. Our team is available 24/7 to help with installation, activation, and any issue you face.", c: "text-blue-600 bg-blue-50" },
  { icon: BadgeDollarSign, title: "Unbeatable Value", text: "We negotiate directly to bring you genuine Microsoft software at up to 80% off retail — savings you can count on.", c: "text-rose-600 bg-rose-50" },
];

const CHECKLIST = [
  "Verified genuine Microsoft license keys",
  "Instant email delivery in 15–30 minutes",
  "Lifetime perpetual licenses — no renewal fees",
  "180-day money-back guarantee",
  "24/7 free installation support",
  "Up to 80% off Microsoft retail prices",
  "Trusted by 50,000+ customers worldwide",
  "Secure 256-bit SSL checkout",
];

export const AboutStats = () => (
  <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="about-stats">
    {STATS.map((s) => (
      <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-6 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
        <div className={`w-11 h-11 mx-auto rounded-xl flex items-center justify-center ${s.c}`}><s.icon className="w-5 h-5" /></div>
        <div className="text-2xl lg:text-3xl font-bold text-slate-900 mt-3">{s.value}</div>
        <div className="text-sm text-slate-500 mt-1">{s.label}</div>
      </div>
    ))}
  </div>
);

export const MissionSection = () => (
  <section className="py-16 bg-white" data-testid="about-mission">
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <div className="text-xs font-bold tracking-[0.25em] text-blue-700 mb-3">OUR MISSION</div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-snug">Making Genuine Software Accessible to Everyone</h2>
          <div className="mt-5 space-y-4 text-slate-600 leading-relaxed">
            <p>
              We believe everyone deserves access to genuine, full-featured Microsoft software without paying retail prices.
              Founded in 2020, UCODE SOFTTECH LLC was built on a simple idea: you shouldn't have to choose between
              authenticity and affordability.
            </p>
            <p>
              We go beyond simply selling products. Our philosophy revolves around problem-solving — ensuring we address
              any challenges our customers encounter with installation, activation, or usage.
            </p>
            <p>
              Today, over 50,000 customers worldwide trust us for their Microsoft software needs. We're proud of every
              5-star review and every customer who saved hundreds of dollars on software they own for life.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4" data-testid="about-values">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:shadow-md transition">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${v.c}`}><v.icon className="w-5 h-5" /></div>
              <h3 className="font-semibold text-slate-900 mt-3">{v.title}</h3>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const WhyChooseSection = () => (
  <section className="py-16 bg-slate-50" data-testid="about-why-choose">
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8">
          <div className="grid sm:grid-cols-1 gap-3">
            {CHECKLIST.map((x) => (
              <div key={x} className="flex items-center gap-3 text-sm text-slate-700">
                <span className="w-6 h-6 shrink-0 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Check className="w-3.5 h-3.5" /></span>
                <span className="font-medium">{x}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-bold tracking-[0.25em] text-blue-700 mb-3">WHY CHOOSE US</div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-snug">The Smarter Way to Buy Microsoft Software</h2>
          <div className="mt-5 space-y-4 text-slate-600 leading-relaxed">
            <p>
              We're not just a software reseller — we're a team of professionals dedicated to helping you get the most
              out of your Microsoft experience. From the moment you purchase to long after you're up and running,
              we're here for you.
            </p>
            <p>
              With our 180-day money-back guarantee, you take zero risk. If something doesn't work as expected,
              we make it right — no questions asked.
            </p>
          </div>
          <Link to="/shop">
            <Button size="lg" className="mt-7 bg-blue-600 hover:bg-blue-700 rounded-full h-12 px-8" data-testid="about-shop-now-btn">
              Shop Now<ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export const HelpCta = () => (
  <section className="py-16 bg-white" data-testid="about-help-cta">
    <div className="max-w-6xl mx-auto px-4">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 lg:p-12 text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-white">Have Questions? We're Here to Help.</h2>
        <p className="mt-3 text-blue-100 max-w-xl mx-auto">Our support team is available 24/7 — reach out by email, phone, or live chat.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/page/contact-us">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 rounded-full h-12 px-8 font-semibold" data-testid="about-contact-btn">Contact Us<ArrowRight className="w-4 h-4 ml-1.5" /></Button>
          </Link>
          <a href={`tel:${COMPANY.phone}`}>
            <Button size="lg" variant="outline" className="rounded-full h-12 px-8 border-white/60 text-white bg-transparent hover:bg-white/10 hover:text-white" data-testid="about-call-btn"><Phone className="w-4 h-4 mr-1.5" />{COMPANY.phone}</Button>
          </a>
          <Link to="/page/contact-us">
            <Button size="lg" variant="outline" className="rounded-full h-12 px-8 border-white/60 text-white bg-transparent hover:bg-white/10 hover:text-white" data-testid="about-email-btn"><Mail className="w-4 h-4 mr-1.5" />Email Us</Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);
