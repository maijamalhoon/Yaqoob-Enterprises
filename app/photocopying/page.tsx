import type { Metadata } from "next";
import {
  Phone,
  Navigation,
  CheckCircle2,
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
  title: "Photocopy & Color Copy in Karachi",
  description:
    "Black-and-white and color photocopying in Akhtar Colony, Karachi. Bulk notes and assignments for schools, colleges, and universities at discounted rates.",
  alternates: {
    canonical: `${SITE_URL}/photocopying`,
  },
  openGraph: {
    title: "Photocopy & Color Copy in Karachi | Yaqoob Enterprises",
    description:
      "Color and black-and-white copies for documents, notes, and assignments. Ask about discounted rates for bulk school, college, and university orders.",
    url: `${SITE_URL}/photocopying`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Photocopy & Color Copy in Karachi | Yaqoob Enterprises",
    description:
      "Color and black-and-white copies for documents, notes, and assignments. Ask about discounted bulk rates.",
  },
};

const PHOTOCOPY_FAQS = [
  {
    q: "Do you offer both black-and-white and color photocopying?",
    a: "Yes. We offer black-and-white and color photocopying.",
  },
  {
    q: "Can I get double-sided (back-to-back) photocopying?",
    a: "Yes. Single-sided and double-sided photocopying are available.",
  },
  {
    q: "Do you handle high-volume bulk photocopying for schools or offices?",
    a: "Yes. Bulk notes and assignments for schools, colleges, and universities are available at discounted rates. Message us with the quantity for a quote.",
  },
  {
    q: "What paper do you use for photocopying?",
    a: "A4 and Legal paper in 75 GSM and 80 GSM is available.",
  },
  {
    q: "Can I bring original documents, books, or identity cards for instant copying?",
    a: "Yes. Bring your document, ID, certificate, or book page to the counter.",
  },
];

export default async function PhotocopyingPage() {
  const { settings, hours } = await getSiteData();
  const statusText = getCurrentBusinessStatus(hours);
  const phone = settings.phone_e164 || "+923492568864";
  const callUrl = `tel:${phone}`;
  const whatsappUrl = `https://wa.me/${phone.replace(/\+/g, "")}?text=${encodeURIComponent(
    "Hello Yaqoob Enterprises, I need photocopying services. Details: "
  )}`;
  const directionsUrl =
    settings.map_url ||
    "https://maps.app.goo.gl/uvWeMqEFYYPrEzw9A";
  const pageUrl = `${SITE_URL}/photocopying`;

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Photocopying", item: pageUrl },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Photocopying Services in Akhtar Colony, Karachi",
    serviceType: "Document Photocopying",
    description:
      "Black-and-white and color photocopying for documents, notes, and assignments in Akhtar Colony, Karachi, including discounted bulk orders.",
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
    mainEntity: PHOTOCOPY_FAQS.map((faq) => ({
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
                Photocopying in Akhtar Colony
              </h1>

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
                  <span>SEND ON WHATSAPP</span>
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

        {/* Photocopying Types */}
        <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Quality Photocopying for Every Requirement
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
                  <span>Black &amp; White Photocopying</span>
                </h3>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
                  <span>Color Photocopying</span>
                </h3>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
                  <span>Document Photocopying</span>
                </h3>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
                  <span>Notes Photocopying</span>
                </h3>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
                  <span>Bulk Photocopying</span>
                </h3>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
                  <span>Office Photocopying</span>
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Photocopying Questions &amp; Answers
              </h2>
            </div>

            <div className="space-y-3">
              {PHOTOCOPY_FAQS.map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-slate-900 text-sm sm:text-base">
                    <span>{faq.q}</span>
                    <span className="ml-4 shrink-0 w-7 h-7 rounded-full bg-white flex items-center justify-center text-slate-600 group-open:bg-slate-900 group-open:text-white transition">
                      <ChevronDown className="w-4 h-4 transition-transform duration-200 group-open:rotate-180" />
                    </span>
                  </summary>
                  <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed border-t border-slate-200 pt-3">
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
