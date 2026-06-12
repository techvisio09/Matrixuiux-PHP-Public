import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Mail } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { faqs } from "../../mock";

const FAQ = () => (
  <section className="py-20 bg-slate-50">
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-900">Frequently Asked Questions</h2>
        <p className="mt-3 text-slate-600">Get answers to common questions about our authentic Microsoft Office licenses</p>
      </div>
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem key={f.q} value={`item-${i}`} className="bg-white border border-slate-200 rounded-xl px-5">
            <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline">{f.q}</AccordionTrigger>
            <AccordionContent className="text-slate-600 text-sm leading-relaxed">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-12 text-center bg-white border border-slate-200 rounded-2xl p-8">
        <p className="text-slate-700">Still have questions? We're here to help.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link to="/page/contact-us"><Button className="bg-blue-600 hover:bg-blue-700">Contact Support</Button></Link>
          <Link to="/page/contact-us"><Button variant="outline"><Mail className="w-4 h-4 mr-1.5" />Email Us</Button></Link>
        </div>
      </div>
    </div>
  </section>
);

export default FAQ;
