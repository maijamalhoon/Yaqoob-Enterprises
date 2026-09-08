"use client";

import { ChevronDown } from "lucide-react";

export function StitchFAQ() {
  const faqs = [
    {
      q: "What documents do I need for NADRA e-Sahulat Biometric Verification?",
      a: "Please bring your original CNIC (or Smart Card) along with your vehicle registration details, FBR Tax registration number, or PSW transaction ID depending on which verification you require. We confirm specific prerequisites on WhatsApp before you head over.",
    },
    {
      q: "Can I send PDFs or images via WhatsApp for printing?",
      a: "Yes! You can WhatsApp your documents directly to +92 349 2568864. Let us know whether you need B&W or color laser prints, page orientation, and quantity. Your prints will be ready for instant pickup when you arrive.",
    },
    {
      q: "Do you draft rental and sale agreements on stamp paper?",
      a: "Yes, we provide bilingual (Urdu and English) typing and document preparation for residential rental agreements, commercial contracts, vehicle sale deeds, and basic affidavits compliant with local requirements.",
    },
  ];

  return (
    <section
      id="faq"
      className="py-12 sm:py-16 bg-slate-50/60 border-b border-slate-200"
      data-purpose="faq"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 text-[#0E7490] font-bold text-xs uppercase tracking-wider mb-2">
            <span>Common Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently asked by our visitors
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <details
              id={`faq-item-${idx + 1}`}
              key={idx}
              className="group bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm transition-all duration-200"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none select-none font-bold text-slate-900 text-sm sm:text-base">
                <span>{faq.q}</span>
                <span className="ml-4 shrink-0 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-open:bg-slate-900 group-open:text-white transition">
                  <ChevronDown className="chevron-icon w-4 h-4 transition-transform duration-200" />
                </span>
              </summary>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed border-t border-slate-100 pt-3">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
