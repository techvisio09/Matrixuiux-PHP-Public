import React from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowRight } from "lucide-react";
import { blogPosts } from "../../mock";

const Blog = () => (
  <section className="py-20 bg-slate-50">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-10">
        <div>
          <div className="text-xs font-bold tracking-[0.2em] text-blue-700 mb-2">FROM OUR BLOG</div>
          <h2 className="text-4xl font-bold text-slate-900">Tips & Guides</h2>
          <p className="mt-2 text-slate-600">Get the most out of your Microsoft software with our helpful articles and guides.</p>
        </div>
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:gap-2 transition-all">View All Articles <ArrowRight className="w-4 h-4" /></Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {blogPosts.map((p) => (
          <Link key={p.id} to="/blog" className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="aspect-[16/10] overflow-hidden bg-slate-100">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>{p.date}</span><span>•</span><span>{p.readTime}</span>
              </div>
              <h3 className="font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition line-clamp-2">{p.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default Blog;
