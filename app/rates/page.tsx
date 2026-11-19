import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { StitchFloatingActions } from "@/components/stitch-floating-actions";
import { StitchFooter } from "@/components/stitch-footer";
import { StitchHeader } from "@/components/stitch-header";
import { TrackedLink } from "@/components/tracked-link";
import { getCurrentBusinessStatus, getSiteData, whatsappUrl } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { rateGroups } from "@/lib/rate-list";

export const metadata: Metadata = {
  title: "Printing & Photocopy Rates 2026 in Karachi",
  description: "View 2026 prices for photocopy, printing, photos, lamination, binding and scanning at Yaqoob Enterprises, Akhtar Colony.",
  alternates: { canonical: SITE_URL + "/rates" },
  openGraph: {
    title: "2026 Rate List | Yaqoob Enterprises",
    description: "Printing, photocopy, colour prints, photos, binding and scanning prices in Karachi.",
    url: SITE_URL + "/rates",
    type: "website",
  },
};

export default async function RatesPage() {
  const { settings, hours } = await getSiteData();
  const statusText = getCurrentBusinessStatus(hours);
  const quoteLink = whatsappUrl(
    settings.whatsapp_e164 || "+923492568864",
    "Hello " + settings.business_name + ", please confirm the price for: ",
  );

  return (
    <div className="public-site min-h-screen bg-white text-slate-900">
      <StitchHeader settings={settings} statusText={statusText} />
      <main id="main-content">
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#0E7490]">Rate list · 2026</p>
            <div className="flex items-end justify-between gap-4">
              <h1 className="font-black text-slate-900">Service prices</h1>
              <span className="mb-1 shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
                PKR
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-600">Printing, photos & finishing.</p>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2 lg:gap-6">
              {rateGroups.map((group) => (
                <section key={group.id} id={group.id} aria-labelledby={group.id + "-title"} className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <h2 id={group.id + "-title"} className="border-b border-slate-200 bg-slate-50 px-4 py-4 text-base font-bold text-[#203c60] sm:px-5">
                    {group.title}
                  </h2>
                  <dl className="px-4 sm:px-5">
                    {group.items.map((item) => (
                      <div key={item.label} className="flex min-h-14 items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0">
                        <dt className="min-w-0 text-sm leading-snug text-slate-700">{item.label}</dt>
                        <dd className="shrink-0 whitespace-nowrap text-sm font-bold tabular-nums text-[#203c60] sm:text-base">
                          Rs. {item.price}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="max-w-xl text-sm leading-relaxed text-slate-600">
                <p>* Ranges depend on colour coverage and print quality. Photo paper is available in glossy and matte.</p>
                <p className="mt-2 font-medium text-slate-700">Bulk discounts available. Confirm final rates before work starts.</p>
              </div>
              <TrackedLink
                eventName="whatsapp_click"
                href={quoteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
              >
                Ask for a quote <ArrowRight size={16} aria-hidden="true" />
              </TrackedLink>
            </div>
          </div>
        </section>
      </main>
      <StitchFooter settings={settings} statusText={statusText} />
      <StitchFloatingActions settings={settings} />
    </div>
  );
}
