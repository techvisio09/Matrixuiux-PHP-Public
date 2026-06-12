import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AboutStats, MissionSection, WhyChooseSection, HelpCta } from "./AboutSections";

const AboutUs = () => {
  React.useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <Header />

      {/* ===== Hero ===== */}
      <section className="bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 border-b border-slate-200" data-testid="about-hero">
        <div className="max-w-6xl mx-auto px-4 pt-12 pb-16">
          <div className="text-sm text-slate-500 mb-6"><Link to="/" className="hover:text-blue-700">Home</Link> / <span className="text-slate-900">About Us</span></div>
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-xs font-bold tracking-[0.25em] text-blue-700 mb-3">OUR STORY</div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">About UCODE SOFTTECH LLC</h1>
            <p className="mt-4 text-slate-600 text-base leading-relaxed">
              We're UCODE SOFTTECH LLC — your trusted source for genuine Microsoft Office licenses at unbeatable prices.
              Instant delivery, lifetime licenses, and professional support since 2020.
            </p>
          </div>
          <AboutStats />
        </div>
      </section>

      <MissionSection />
      <WhyChooseSection />
      <HelpCta />

      <Footer />
    </>
  );
};

export default AboutUs;
