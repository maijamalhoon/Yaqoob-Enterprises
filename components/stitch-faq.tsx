"use client";

import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/faq-data";

export function StitchFAQ() {
  return (
    <section
      id="faq"
      className="py-12 sm:py-16 bg-slate-50/60 border-b border-slate-200"
      data-purpose="faq"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 text-[#0E7490] font-bold text-xs uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4 text-[#0E7490]" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Common questions about printing &amp; services
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            Practical answers for residents, students, and businesses visiting Yaqoob Enterprises in Akhtar Colony.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, idx) => (
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
