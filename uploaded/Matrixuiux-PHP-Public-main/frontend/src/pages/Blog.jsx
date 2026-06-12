import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const CATEGORIES = ["All", "Product Guides", "How-To Guides", "Buying Guides", "Comparisons"];

const POSTS = [
  {
    id: "office-2024-vs-2021",
    category: "Product Guides",
    title: "Microsoft Office 2024 vs 2021: What's New and Is It Worth Upgrading?",
    excerpt: "Office 2024 brings refreshed dark mode support, improved collaboration features, and better performance on Apple Silicon. We break down the key differences to help you decide.",
    date: "May 20, 2026",
    readTime: "5 min read",
    featured: true,
    image: "https://images.pexels.com/photos/2102416/pexels-photo-2102416.jpeg",
  },
  {
    id: "activate-office-5-steps",
    category: "How-To Guides",
    title: "How to Activate Microsoft Office in 5 Easy Steps (2024 Guide)",
    excerpt: "Whether you're activating Office for the first time or moving a license to a new computer, this step-by-step guide walks you through the entire process.",
    date: "April 30, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1649433391420-542fcd3835ea?q=80&w=870&auto=format&fit=crop",
  },
  {
    id: "office-for-mac-2026",
    category: "Product Guides",
    title: "Microsoft Office for Mac: Everything You Need to Know in 2026",
    excerpt: "Office for Mac now runs natively on Apple Silicon. Learn about compatibility, available editions, and why the Mac version is better than ever.",
    date: "April 10, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1632239776255-0a7f24814df2?q=80&w=871&auto=format&fit=crop",
  },
  {
    id: "best-antivirus-2026",
    category: "Comparisons",
    title: "Best Antivirus Software for 2026: Norton vs McAfee vs Bitdefender vs Kaspersky",
    excerpt: "We compared the top antivirus solutions head-to-head on detection rates, performance impact, and value. Here's what we found.",
    date: "March 22, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1614064642639-e398cf05badb?q=80&w=870&auto=format&fit=crop",
  },
  {
    id: "lifetime-vs-365",
    category: "Buying Guides",
    title: "Office Lifetime License vs Microsoft 365 Subscription: Which is Better?",
    excerpt: "Breaking down the true cost of a lifetime Office license against a Microsoft 365 subscription over 3, 5, and 10 years.",
    date: "March 5, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=870&auto=format&fit=crop",
  },
  {
    id: "proplus-vs-home-business",
    category: "Buying Guides",
    title: "Office Professional Plus vs Home & Business: Which Should You Buy?",
    excerpt: "Access and Publisher are only in Professional Plus — but do you actually need them? We explain the differences to help you pick the right edition.",
    date: "February 18, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=870&auto=format&fit=crop",
  },
];

const Blog = () => {
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? POSTS : POSTS.filter((p) => p.category === cat);
  const [featured, ...rest] = list;

  return (
    <>
      <Header />
      <section className="bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-sm text-slate-500 mb-3"><Link to="/" className="hover:text-blue-700">Home</Link> / <span className="text-slate-900">Blog</span></div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">Software Tips & Guides</h1>
          <p className="mt-3 text-slate-600">Expert advice on Microsoft Office, Windows, antivirus, and more.</p>

          {/* Category tabs */}
          <div className="mt-6 flex flex-wrap gap-2" data-testid="blog-category-tabs">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                data-testid={`blog-tab-${c.toLowerCase().replace(/\s+/g, "-")}`}
                className={`text-sm font-medium px-4 py-2 rounded-full border transition ${
                  cat === c ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-300 text-slate-700 hover:border-blue-400"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4">
          {!featured ? (
            <div className="text-center py-20 text-slate-500">No articles in this category yet.</div>
          ) : (
            <>
              {/* Featured post */}
              <Link to="/blog" className="group grid lg:grid-cols-2 bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all mb-8" data-testid="blog-featured">
                <div className="aspect-[16/10] lg:aspect-auto lg:min-h-[320px] overflow-hidden bg-slate-100">
                  <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-7 lg:p-10 flex flex-col justify-center">
                  <span className="self-start text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">{featured.category}</span>
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mt-3 leading-snug group-hover:text-blue-700 transition">{featured.title}</h2>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{featured.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{featured.readTime}</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 mt-5">Read Article<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></span>
                </div>
              </Link>

              {/* Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="blog-grid">
                {rest.map((p) => (
                  <Link key={p.id} to="/blog" className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all" data-testid={`blog-card-${p.id}`}>
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                      <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">{p.category}</span>
                      <h3 className="font-bold text-slate-900 leading-snug mt-2.5 group-hover:text-blue-700 transition line-clamp-2">{p.title}</h3>
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2">{p.excerpt}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{p.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{p.readTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Blog;
