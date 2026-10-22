import type { Metadata } from "next";
import Link from "next/link";
import {
  Copy,
  Phone,
  MessageCircle,
  Navigation,
  CheckCircle2,
  Users,
  Building2,
  GraduationCap,
  Home,
  ChevronDown,
} from "lucide-react";
import { StitchHeader } from "@/components/stitch-header";
import { StitchFooter } from "@/components/stitch-footer";
import { StitchFloatingActions } from "@/components/stitch-floating-actions";
import { TrackedLink } from "@/components/tracked-link";
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
    <div className="min-h-screen bg-white text-slate-900 pb-20 md:pb-0">
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
              <nav className="text-xs text-slate-500 font-semibold mb-3 flex items-center gap-1.5" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-slate-900">Home</Link>
                <span>/</span>
                <span className="text-[#0E7490]">Photocopying</span>
              </nav>

              <div className="inline-flex items-center gap-2 text-[#0E7490] font-bold text-xs uppercase tracking-wider mb-2">
                <Copy className="w-4 h-4" />
                <span>Walk-in Counter • Sector B, Akhtar Colony</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Photocopying in Akhtar Colony
              </h1>

              <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
                Color and black-and-white copies for documents, notes and assignments. Bulk discounts are available.
              </p>

              {/* 3 Prominent CTAs */}
              <div className="mobile-hero-actions flex flex-wrap items-center gap-3 pt-6">
                <TrackedLink
                  eventName="call_click"
                  href={callUrl}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-sm transition active:scale-95"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>CALL NOW</span>
                </TrackedLink>

                <TrackedLink
                  eventName="whatsapp_click"
                  href={whatsappUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm transition active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>SEND ON WHATSAPP</span>
                </TrackedLink>

                <TrackedLink
                  eventName="directions_click"
                  href={directionsUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-sm transition active:scale-95"
                >
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
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
                Photocopy Solutions
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Quality Photocopying for Every Requirement
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Bring an original or send your file on WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
                  <span>Black &amp; White Photocopying</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                    Copies of CNICs, forms, bills, and text documents.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
                  <span>Color Photocopying</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                    Color copies of certificates, maps, diagrams, and project pages.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
                  <span>Document Photocopying</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                    Copies of legal papers and official documents.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
                  <span>Notes Photocopying</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                    School, college, and university handouts, notes, and past papers.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
                  <span>Bulk Photocopying</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                    Bulk copying for study sets and office documents. Ask us for a quote.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
                  <span>Office Photocopying</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                    Copies of office forms, invoices, and records.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who This Service Is For */}
        <section className="py-12 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-6 text-center">
              Who We Serve in Akhtar Colony &amp; Nearby Areas
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-[#0E7490] flex items-center justify-center mx-auto mb-3">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Students</h3>
                <p className="text-xs text-slate-600">
                  School, college, and university students copying past papers, syllabus notes, and assignment sheets.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-[#0E7490] flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Offices &amp; Businesses</h3>
                <p className="text-xs text-slate-600">
                  Local commercial firms copying customer forms, financial records, vouchers, and contracts.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-[#0E7490] flex items-center justify-center mx-auto mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Organizations</h3>
                <p className="text-xs text-slate-600">
                  Institutes, clinics, welfare trusts, and schools needing batch copies of notices and booklets.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-[#0E7490] flex items-center justify-center mx-auto mb-3">
                  <Home className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Local Residents</h3>
                <p className="text-xs text-slate-600">
                  Neighborhood families copying CNICs, utility bills, birth certificates, and government applications.
                </p>
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
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Helpful details about photocopying at Yaqoob Enterprises.
              </p>
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

        {/* Contextual Links */}
        <section className="py-10 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Explore Related Services
            </h3>
            <div className="flex flex-wrap gap-2.5 text-xs font-semibold">
              <Link href="/printing" className="px-3.5 py-2 bg-white hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200 transition">
                Laser Printing (B&amp;W &amp; Color) →
              </Link>
              <Link href="/notes-printing" className="px-3.5 py-2 bg-white hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200 transition">
                Notes Printing &amp; Copying →
              </Link>
              <Link href="/bulk-printing" className="px-3.5 py-2 bg-white hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200 transition">
                Bulk Orders &amp; Discounts →
              </Link>
              <Link href="/office-printing" className="px-3.5 py-2 bg-white hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200 transition">
                Office &amp; Legal Printing →
              </Link>
              <Link href="/contact" className="px-3.5 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition">
                Directions &amp; Hours →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <StitchFooter settings={settings} statusText={statusText} />
      <StitchFloatingActions settings={settings} />
    </div>
  );
}
