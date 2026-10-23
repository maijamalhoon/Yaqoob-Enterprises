"use client";

import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/faq-data";

export function StitchFAQ() {
  return (
    <section
      id="faq"
      className="py-12 sm:py-16 bg-slate-50/60 border-b border-slate-200"
      data-purpose="faq"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-7 sm:mb-9">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Questions about our services
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, index) => (
            <details
              id={"faq-item-" + (index + 1)}
              key={faq.q}
              className="group bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 transition"
            >
              <summary className="flex min-h-11 items-center justify-between gap-4 cursor-pointer list-none select-none font-semibold text-slate-900 text-sm sm:text-base">
                <span>{faq.q}</span>
                <span className="shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 group-open:bg-slate-900 group-open:text-white transition">
                  <ChevronDown
                    className="chevron-icon w-4 h-4 transition-transform"
                    aria-hidden="true"
                  />
                </span>
              </summary>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed border-t border-slate-100 pt-3">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
