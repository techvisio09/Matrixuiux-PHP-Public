import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/sections/Hero";
import Discover from "../components/sections/Discover";
import FeaturesBar from "../components/sections/FeaturesBar";
import BestSellers from "../components/sections/BestSellers";
import Recommended from "../components/sections/Recommended";
import Business from "../components/sections/Business";
import HowItWorks from "../components/sections/HowItWorks";
import WhyChoose from "../components/sections/WhyChoose";
import Testimonials from "../components/sections/Testimonials";
import AboutSection from "../components/sections/AboutSection";
import FAQ from "../components/sections/FAQ";
import CTA from "../components/sections/CTA";
import BlogSection from "../components/sections/BlogSection";
import Newsletter from "../components/sections/Newsletter";

const Home = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Discover />
        <FeaturesBar />
        <BestSellers />
        <Recommended />
        <Business />
        <HowItWorks />
        <WhyChoose />
        <Testimonials />
        <AboutSection />
        <FAQ />
        <CTA />
        <BlogSection />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
};

export default Home;
