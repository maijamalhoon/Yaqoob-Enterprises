import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { featuredRates } from "@/lib/rate-list";

export function RatesPreview() {
  return (
    <section id="rates-preview" className="public-section border-b border-slate-200 bg-white" aria-labelledby="rates-preview-title">
      <div className="public-container">
        <div className="public-section__heading">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#0E7490]">2026 rate list</p>
            <h2 id="rates-preview-title">Popular prices</h2>
          </div>
          <Link href="/rates" className="text-link">
            All rates <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <dl className="grid grid-cols-1 gap-x-10 md:grid-cols-2 lg:grid-cols-3">
          {featuredRates.map((item) => (
            <div key={item.label} className="flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 py-3">
              <dt className="text-sm font-medium leading-snug text-slate-700">{item.previewLabel || item.label}</dt>
              <dd className="shrink-0 whitespace-nowrap text-base font-bold tabular-nums text-[#203c60]">
                Rs. {item.price}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-slate-600">Bulk discounts available. Confirm final price before ordering.</p>
      </div>
    </section>
  );
}
