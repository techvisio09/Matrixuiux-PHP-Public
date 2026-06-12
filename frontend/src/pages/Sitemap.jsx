import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { findProduct } from "../data/variants";
import { Home, ShoppingBag, FileText, Monitor, Apple, AppWindow, Bug } from "lucide-react";

// Each product entry: [label, name-slug-in-catalog, fallbackRoute]
const resolve = (slug, fallback) => {
  const p = findProduct(slug);
  return p ? `/product/${p.id}` : fallback;
};

export default function Sitemap() {
  const groups = [
    {
      icon: Home,
      title: "Main Pages",
      links: [
        ["Home", "/"],
        ["Shop All Products", "/shop"],
        ["Antivirus Software", "/category/bitdefender"],
        ["About Us", "/about-us"],
        ["FAQ", "/page/faqs"],
        ["Contact Us", "/page/contact-us"],
        ["Shopping Cart", "/cart"],
      ],
    },
    {
      icon: Monitor,
      title: "Microsoft Office for PC",
      links: [
        ["Office 2024 Professional Plus", resolve("microsoft-office-2024-professional-plus-windows", "/category/office-2024-pc")],
        ["Office 2024 Home & Business", resolve("microsoft-office-home-business-2024-pc", "/category/office-2024-pc")],
        ["Office 2024 Home", resolve("microsoft-office-home-2024-pc", "/category/office-2024-pc")],
        ["Office 2021 Professional Plus", resolve("microsoft-office-2021-professional-plus-windows", "/category/office-2021-pc")],
        ["Office 2021 Home & Business", resolve("microsoft-office-2021-home-business-windows", "/category/office-2021-pc")],
        ["Office 2021 Home & Student", resolve("microsoft-office-2021-home-student-windows", "/category/office-2021-pc")],
        ["Office 2019 Professional Plus", resolve("microsoft-office-2019-professional-plus-windows", "/category/office-2019-pc")],
        ["Office 2019 Home & Business", resolve("microsoft-office-2019-home-business-pc", "/category/office-2019-pc")],
        ["Office 2019 Home & Student", resolve("microsoft-office-2019-home-student-windows", "/category/office-2019-pc")],
      ],
    },
    {
      icon: Apple,
      title: "Microsoft Office for Mac",
      links: [
        ["Office 2024 for Mac (Home & Business)", resolve("microsoft-office-home-business-2024-mac", "/category/office-2024-mac")],
        ["Office 2024 Home for Mac", resolve("microsoft-office-home-2024-mac", "/category/office-2024-mac")],
        ["Office 2021 Home & Business (Mac)", resolve("microsoft-office-2021-home-business-mac", "/category/office-2021-mac")],
        ["Office 2021 Home & Student for Mac", resolve("microsoft-office-2021-home-student-mac", "/category/office-2021-mac")],
        ["Office 2019 for Mac", resolve("microsoft-office-home-and-business-2019-mac", "/category/office-2019-mac")],
        ["Office 2019 Home & Student for Mac", resolve("microsoft-office-home-and-student-2019-mac", "/category/office-2019-mac")],
      ],
    },
    {
      icon: AppWindow,
      title: "Windows Operating System",
      links: [
        ["Windows 11 Pro", resolve("windows-11-pro", "/category/windows-11")],
        ["Windows 11 Home", resolve("windows-11-home", "/category/windows-11")],
        ["Windows 10 Pro", resolve("windows-10-pro", "/category/windows-10")],
        ["Windows 10 Home", resolve("windows-10-home", "/category/windows-10")],
      ],
    },
    {
      icon: ShoppingBag,
      title: "Microsoft Apps",
      links: [
        ["Microsoft Project 2024 Professional", resolve("microsoft-project-2024-professional-pc", "/category/microsoft-project")],
        ["Microsoft Project 2021 Professional", resolve("microsoft-project-professional-2021-pc", "/category/microsoft-project")],
        ["Microsoft Visio 2024 Professional", resolve("microsoft-visio-2024-professional-windows-pc", "/category/microsoft-visio")],
        ["Microsoft Visio 2021 Professional", resolve("microsoft-visio-2021-professional-windows-pc", "/category/microsoft-visio")],
      ],
    },
    {
      icon: Bug,
      title: "Antivirus Software",
      links: [
        ["All McAfee Products", "/category/mcafee"],
        ["All Bitdefender Products", "/category/bitdefender"],
      ],
    },
    {
      icon: FileText,
      title: "Legal & Policies",
      links: [
        ["Privacy Policy", "/page/privacy-policy"],
        ["Terms of Service", "/page/terms-of-service"],
        ["Refund Policy", "/page/refund-policy"],
        ["Shipping & Delivery", "/page/shipping-delivery"],
        ["Payment Policy", "/page/payment-policy"],
        ["Cookie Policy", "/page/cookie-policy"],
        ["Do Not Sell My Info", "/page/do-not-sell"],
        ["Disclaimer", "/disclaimer"],
      ],
    },
  ];

  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-screen" data-testid="sitemap-page">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-sm text-slate-500 mb-4"><Link to="/" className="hover:text-blue-700">Home</Link> / <span className="text-slate-900">Sitemap</span></div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-8">Sitemap</h1>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.map((g) => (
              <div key={g.title} className="bg-white border border-slate-200 rounded-2xl p-6" data-testid={`sitemap-group-${g.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center"><g.icon className="w-5 h-5" /></div>
                  <h2 className="font-bold text-slate-900">{g.title}</h2>
                </div>
                <ul className="space-y-2">
                  {g.links.map(([label, to]) => (
                    <li key={label}>
                      <Link to={to} className="text-sm text-slate-600 hover:text-blue-700 hover:underline transition">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
