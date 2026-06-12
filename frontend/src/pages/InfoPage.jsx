import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supportContent, COMPANY } from "../data/company";
import { supportPages } from "../data/supportPages";
import SupportPage from "./SupportPage";
import CategoryPage, { categoryFilters } from "./CategoryPage";
import LegalPage from "./LegalPage";
import { legalPages } from "../data/legalPages";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "../components/ui/button";

const InfoPage = () => {
  const { slug } = useParams();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  // Category pages (platform filter / grid-list view / sorting)
  if (categoryFilters[slug]) return <CategoryPage slug={slug} />;

  // Legal / policy pages
  if (legalPages[slug]) return <LegalPage slug={slug} />;

  // Rich support pages (My Account, Help Center, Installation Guide, etc.)
  if (supportPages[slug]) return <SupportPage slug={slug} />;

  // Support / Company info pages
  const content = supportContent[slug];
  if (!content) {
    return (<><Header /><div className="max-w-3xl mx-auto px-4 py-20 text-center"><h1 className="text-3xl font-bold text-slate-900">Page Not Found</h1><Link to="/"><Button className="mt-5 bg-blue-600 hover:bg-blue-700">Back to Home</Button></Link></div><Footer /></>);
  }

  return (
    <>
      <Header />
      <section className="bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-14">
          <div className="text-sm text-slate-500 mb-3"><Link to="/" className="hover:text-blue-700">Home</Link> / <span className="text-slate-900">{content.title}</span></div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">{content.title}</h1>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 text-lg leading-relaxed">{content.body}</p>
          </div>
          {(slug === "contact-us" || slug === "help-center") && (
            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              <a href={`tel:${COMPANY.phone}`} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition"><Phone className="w-5 h-5 text-blue-600 mb-2" /><div className="font-semibold text-slate-900">Call Us</div><div className="text-sm text-slate-600">{COMPANY.phone}</div></a>
              <a href={`mailto:${COMPANY.email}`} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition"><Mail className="w-5 h-5 text-blue-600 mb-2" /><div className="font-semibold text-slate-900">Email Us</div><div className="text-sm text-slate-600 break-all">{COMPANY.email}</div></a>
              <div className="bg-white border border-slate-200 rounded-xl p-5"><MapPin className="w-5 h-5 text-blue-600 mb-2" /><div className="font-semibold text-slate-900">Visit Us</div><div className="text-sm text-slate-600">{COMPANY.address}<br />{COMPANY.city}, {COMPANY.state} {COMPANY.zip}</div></div>
            </div>
          )}
          <div className="mt-10 p-6 bg-blue-50 rounded-xl flex items-center justify-between flex-wrap gap-3">
            <div><div className="font-semibold text-slate-900">Need more help?</div><div className="text-sm text-slate-600">Our support team is available {COMPANY.hours}</div></div>
            <Link to="/page/contact-us"><Button className="bg-blue-600 hover:bg-blue-700">Contact Support <ArrowRight className="w-4 h-4 ml-1.5" /></Button></Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default InfoPage;
