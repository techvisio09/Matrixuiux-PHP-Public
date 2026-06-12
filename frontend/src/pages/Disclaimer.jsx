import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { COMPANY } from "../data/company";

const SECTIONS = [
  {
    title: "Trademark Notice",
    paras: [
      "Microsoft®, Windows®, Office®, Outlook®, Xbox®, and other Microsoft product names are trademarks or registered trademarks of Microsoft Corporation in the United States and/or other countries.",
      "Trademarks, logos, brand names, product names, and company names mentioned on this website are the property of their respective owners and are used solely for identification and informational purposes. Use of these names, trademarks, and brands does not imply endorsement or affiliation.",
    ],
  },
  {
    title: "Independent Service Provider",
    paras: [
      "The information, support, and services provided on this website are offered independently by UCODE SOFTTECH LLC. Any references to Microsoft products or services are made solely to describe compatibility, support, troubleshooting, or informational content.",
      "By using this website, you acknowledge and agree that UCODE SOFTTECH LLC operates as an independent entity and does not represent Microsoft Corporation or any of its subsidiaries, affiliates, or partners.",
      "UCODE SOFTTECH LLC is an independent service provider and is not affiliated with, endorsed by, sponsored by, authorized by, or associated with Microsoft Corporation in any way.",
    ],
  },
  {
    title: "Advertising & Google Ads Policy Compliance",
    paras: [
      "Any paid advertisements (including Google Ads / PPC campaigns) operated by or on behalf of this website clearly identify us as an independent reseller and service provider. We do not claim to be Microsoft Corporation, an official Microsoft sales channel, or Microsoft-operated support in any advertising material.",
      "In accordance with Google Ads policies on misrepresentation and third-party consumer technical support, we disclose that all software licenses sold and all support services offered on this website are provided independently. Customers may also obtain support directly from the original software manufacturer.",
    ],
  },
  {
    title: "Accuracy of Information",
    paras: [
      "We strive to ensure all product descriptions, pricing, and availability information on this website are accurate. However, we reserve the right to correct any errors or inaccuracies and to update information at any time without prior notice. Prices and availability are subject to change without notice.",
    ],
  },
  {
    title: "No Warranty",
    paras: [
      'The content on this website is provided "as is" without any warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. UCODE SOFTTECH LLC does not warrant that this website will be uninterrupted or error-free.',
    ],
  },
  {
    title: "Limitation of Liability",
    paras: [
      "To the fullest extent permitted by applicable law, UCODE SOFTTECH LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of this website or any products or services purchased through it.",
      "Some states within the United States do not allow the exclusion or limitation of certain damages; in such jurisdictions, our liability is limited to the maximum extent permitted by law.",
    ],
  },
  {
    title: "Third-Party Links",
    paras: [
      "This website may contain links to third-party websites. These links are provided solely for your convenience. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.",
    ],
  },
];

export default function Disclaimer() {
  React.useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-screen" data-testid="disclaimer-page">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">Disclaimer</h1>
            <p className="text-sm text-slate-500 mt-2">Last updated: January 1, 2026</p>

            {SECTIONS.map((s) => (
              <section key={s.title} className="mt-8">
                <h2 className="text-lg font-bold text-slate-900 mb-3">{s.title}</h2>
                {s.paras.map((p) => (
                  <p key={p} className="text-sm text-slate-600 leading-relaxed mb-3">{p}</p>
                ))}
              </section>
            ))}

            <section className="mt-8">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Contact</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                If you have any questions about this Disclaimer, please contact us at{" "}
                <a href={`mailto:${COMPANY.email}`} className="text-blue-700 hover:underline" data-testid="disclaimer-email">{COMPANY.email}</a>{" "}
                or call{" "}
                <a href={`tel:${COMPANY.phone}`} className="text-blue-700 hover:underline" data-testid="disclaimer-phone">{COMPANY.phone}</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
