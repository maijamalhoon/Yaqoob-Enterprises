import type { Metadata } from "next";
import {
  Layers,
  Phone,
  Navigation,
  CheckCircle2,
  Building2,
  GraduationCap,
  Users,
  Briefcase,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { StitchHeader } from "@/components/stitch-header";
import { StitchFooter } from "@/components/stitch-footer";
import { StitchFloatingActions } from "@/components/stitch-floating-actions";
import { TrackedLink } from "@/components/tracked-link";
import { BrandIcon } from "@/components/brand-icon";
import { getCurrentBusinessStatus, getSiteData } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { serializeJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Bulk Printing & Photocopying in Karachi",
  description:
    "Quality bulk printing and photocopying in Akhtar Colony, Karachi. Discounted rates for school, college, and university notes and assignments.",
  alternates: {
    canonical: `${SITE_URL}/bulk-printing`,
  },
  openGraph: {
    title: "Bulk Printing & Copying in Karachi | Yaqoob Enterprises",
    description:
      "Bulk notes and assignment printing for schools, colleges, and universities at discounted rates compared with market prices.",
    url: `${SITE_URL}/bulk-printing`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulk Printing & Copying in Karachi | Yaqoob Enterprises",
    description:
      "Quality bulk printing and photocopying in Akhtar Colony, Karachi, at discounted rates.",
  },
};

const BULK_FAQS = [
  {
    q: "Why should customers contact you before visiting for bulk orders?",
    a: "Send your file, quantity, and print options on WhatsApp. We will confirm the rate and pickup time before you visit.",
  },
  {
    q: "What counts as a bulk printing or photocopying order?",
    a: "Bulk orders include notes, assignments, handouts, and office documents. Send us the quantity and we will confirm the price.",
  },
  {
    q: "How do you calculate bulk pricing?",
    a: "Bulk rates are discounted compared with market prices. The final quote depends on quantity and print options; we confirm it before printing.",
  },
  {
    q: "How can I collect a bulk order?",
    a: "Message us to confirm the pickup time. You can also ask whether delivery is available for your location.",
  },
];

export default async function BulkPrintingPage() {
  const { settings, hours } = await getSiteData();
  const statusText = getCurrentBusinessStatus(hours);
  const phone = settings.phone_e164 || "+923492568864";
  const callUrl = `tel:${phone}`;
  const whatsappUrl = `https://wa.me/${phone.replace(/\+/g, "")}?text=${encodeURIComponent(
    "Hello Yaqoob Enterprises, I have a bulk printing / photocopying requirement. Total pages and details: "
  )}`;
  const directionsUrl =
    settings.map_url ||
    "https://maps.app.goo.gl/uvWeMqEFYYPrEzw9A";
  const pageUrl = `${SITE_URL}/bulk-printing`;

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Bulk Printing", item: pageUrl },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Bulk Printing & Bulk Photocopy in Akhtar Colony, Karachi",
    serviceType: "Commercial Volume Printing",
    description:
      "Quality bulk printing and photocopying for schools, colleges, and universities in Akhtar Colony, Karachi, at discounted rates.",
    url: pageUrl,
    provider: {
      "@type": "LocalBusiness",
      name: settings.business_name,
      telephone: phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.address,
        addressLocality: "Karachi",
        addressRegion: "Sindh",
        postalCode: "75500",
        addressCountry: "PK",
      },
    },
    areaServed: {
      "@type": "Place",
      name: "Akhtar Colony, Karachi",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: BULK_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <div className="public-site public-site--service-landing min-h-screen bg-white text-slate-900 pb-20 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />

      <StitchHeader settings={settings} statusText={statusText} />

      <main id="main-content">
        {/* Page Hero */}
        <section className="bg-slate-50 border-b border-slate-200 py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
<h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Bulk Printing &amp; Photocopying
              </h1>

              {/* Strong Callout Notice */}
              <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-950">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <strong className="block font-bold">Late-night printing is available until closing.</strong>
                  Message us with your file and quantity. We will confirm the rate and pickup time.
                </div>
              </div>

              {/* 3 Prominent CTAs */}
              <div className="mobile-hero-actions flex flex-wrap items-center gap-3 pt-6">
                <TrackedLink
                  eventName="call_click"
                  href={callUrl} className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-sm transition active:scale-95">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>{settings.phone_display || phone}</span>
                </TrackedLink>

                <TrackedLink
                  eventName="whatsapp_click"
                  href={whatsappUrl}
                  rel="noopener noreferrer"
                  target="_blank" className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm transition active:scale-95">
                  <BrandIcon name="whatsapp" size={16} badge={false} />
                  <span>GET BULK QUOTE ON WHATSAPP</span>
                </TrackedLink>

                <TrackedLink
                  eventName="directions_click"
                  href={directionsUrl}
                  rel="noopener noreferrer"
                  target="_blank" className="inline-flex items-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-sm transition active:scale-95">
                  <Navigation className="w-4 h-4 text-[#0E7490]" />
                  <span>GET DIRECTIONS</span>
                </TrackedLink>
              </div>
            </div>
          </div>
        </section>

        {/* Target Audience */}
        <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Bulk Printing for Study and Work
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <Building2 className="w-8 h-8 text-[#0E7490] mb-3" />
                <h3 className="font-bold text-base text-slate-900 mb-1">Corporate &amp; Local Offices</h3>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <GraduationCap className="w-8 h-8 text-[#0E7490] mb-3" />
                <h3 className="font-bold text-base text-slate-900 mb-1">Schools &amp; Coaching Centers</h3>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <Users className="w-8 h-8 text-[#0E7490] mb-3" />
                <h3 className="font-bold text-base text-slate-900 mb-1">Universities &amp; Colleges</h3>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <Briefcase className="w-8 h-8 text-[#0E7490] mb-3" />
                <h3 className="font-bold text-base text-slate-900 mb-1">Institutes &amp; Welfare Organizations</h3>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <CheckCircle2 className="w-8 h-8 text-[#0E7490] mb-3" />
                <h3 className="font-bold text-base text-slate-900 mb-1">Students with Large Documents</h3>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <Layers className="w-8 h-8 text-[#0E7490] mb-3" />
                <h3 className="font-bold text-base text-slate-900 mb-1">Large Document Orders</h3>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 bg-slate-50 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Bulk Printing Questions &amp; Answers
              </h2>
            </div>

            <div className="space-y-3">
              {BULK_FAQS.map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-slate-900 text-sm sm:text-base">
                    <span>{faq.q}</span>
                    <span className="ml-4 shrink-0 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-open:bg-slate-900 group-open:text-white transition">
                      <ChevronDown className="w-4 h-4 transition-transform duration-200 group-open:rotate-180" />
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
      </main>

      <StitchFooter settings={settings} statusText={statusText} />
      <StitchFloatingActions settings={settings} />
    </div>
  );
}
