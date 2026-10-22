import type { Metadata } from "next";
import Link from "next/link";
import {
  Briefcase,
  Phone,
  MessageCircle,
  Navigation,
  CheckCircle2,
  FileSpreadsheet,
  Building2,
  FileCheck,
  ShieldCheck,
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
  title: "Office & Institutional Printing in Karachi",
  description:
    "Bulk office printing and photocopying in Akhtar Colony, Karachi. Discounted rates for schools, colleges, universities, and business orders.",
  alternates: {
    canonical: `${SITE_URL}/office-printing`,
  },
  openGraph: {
    title: "Office & Institutional Printing in Karachi | Yaqoob Enterprises",
    description:
      "Office documents, notes, and assignments printed in bulk for local organizations at discounted rates.",
    url: `${SITE_URL}/office-printing`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Office & Institutional Printing in Karachi | Yaqoob Enterprises",
    description:
      "Bulk printing for schools, colleges, universities, and offices in Akhtar Colony, Karachi.",
  },
};

const OFFICE_FAQS = [
  {
    q: "Can businesses establish ongoing printing and photocopy accounts?",
    a: "Message us to discuss repeat printing or photocopying orders and confirm the schedule and rate.",
  },
  {
    q: "How soon can I collect a large office order?",
    a: "Send the file and quantity on WhatsApp. We will confirm the estimated pickup time before printing.",
  },
  {
    q: "Can you print legal and business documents?",
    a: "Yes. Send the document and quantity on WhatsApp, and we will confirm the print options and rate.",
  },
  {
    q: "Do you supply both standard A4 and Legal size paper for office documents?",
    a: "Yes. A4 and Legal paper in 75 GSM and 80 GSM is available.",
  },
];

export default async function OfficePrintingPage() {
  const { settings, hours } = await getSiteData();
  const statusText = getCurrentBusinessStatus(hours);
  const phone = settings.phone_e164 || "+923492568864";
  const callUrl = `tel:${phone}`;
  const whatsappUrl = `https://wa.me/${phone.replace(/\+/g, "")}?text=${encodeURIComponent(
    "Hello Yaqoob Enterprises, I have an office / organizational printing requirement. Details: "
  )}`;
  const directionsUrl =
    settings.map_url ||
    "https://maps.app.goo.gl/uvWeMqEFYYPrEzw9A";
  const pageUrl = `${SITE_URL}/office-printing`;

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Office Printing", item: pageUrl },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Office & Organizational Printing in Akhtar Colony, Karachi",
    serviceType: "Corporate Document Printing",
    description:
      "Bulk printing and photocopying for local offices, schools, colleges, and universities in Akhtar Colony, Karachi.",
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
    mainEntity: OFFICE_FAQS.map((faq) => ({
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
                <span className="text-[#0E7490]">Office Printing</span>
              </nav>

              <div className="inline-flex items-center gap-2 text-[#0E7490] font-bold text-xs uppercase tracking-wider mb-2">
                <Briefcase className="w-4 h-4" />
                <span>Commercial Document Services • Sector B, Akhtar Colony</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Office &amp; Institutional Printing
              </h1>

              <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
                Printing and photocopying for business documents, forms and reports. Bulk discounts are available.
              </p>

              {/* 3 Prominent CTAs */}
              <div className="mobile-hero-actions flex flex-wrap items-center gap-3 pt-6">
                <TrackedLink
                  eventName="call_click"
                  href={callUrl}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-sm transition active:scale-95"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>CALL FOR LARGER REQUIREMENTS</span>
                </TrackedLink>

                <TrackedLink
                  eventName="whatsapp_click"
                  href={whatsappUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm transition active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>DISCUSS ON WHATSAPP</span>
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

        {/* What We Print for Offices */}
        <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
                Commercial Scope
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Office Paperwork &amp; Organizational Documents
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <FileCheck className="w-8 h-8 text-[#0E7490] mb-3" />
                <h3 className="font-bold text-base text-slate-900 mb-1">Contracts &amp; Legal Agreements</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Clean prints on A4 or Legal paper for commercial contracts, vendor agreements, and non-disclosure deeds.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <FileSpreadsheet className="w-8 h-8 text-[#0E7490] mb-3" />
                <h3 className="font-bold text-base text-slate-900 mb-1">Proposals &amp; Presentation Folders</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Client proposals, quotations, budget estimates, and pitch presentations printed with color covers.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <Building2 className="w-8 h-8 text-[#0E7490] mb-3" />
                <h3 className="font-bold text-base text-slate-900 mb-1">Employee &amp; HR Forms</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Staff joining forms, employee files, attendance sheets, NDAs, and company policy manuals.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <ShieldCheck className="w-8 h-8 text-[#0E7490] mb-3" />
                <h3 className="font-bold text-base text-slate-900 mb-1">Invoices, Vouchers &amp; Receipts</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Batch printing of internal payment vouchers, goods receipt notes, billing summaries, and accounting files.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <CheckCircle2 className="w-8 h-8 text-[#0E7490] mb-3" />
                <h3 className="font-bold text-base text-slate-900 mb-1">Bulk Administrative Copying</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Duplicating multi-page official records, tax documentation, and regulatory submissions.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <Briefcase className="w-8 h-8 text-[#0E7490] mb-3" />
                <h3 className="font-bold text-base text-slate-900 mb-1">Meeting Handouts &amp; Agendas</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Collated sets for board meetings, committee discussions, and stakeholder reviews.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 bg-slate-50 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Office Printing Questions &amp; Answers
              </h2>
            </div>

            <div className="space-y-3">
              {OFFICE_FAQS.map((faq, idx) => (
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

        {/* Contextual Links */}
        <section className="py-10 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Related Services for Businesses
            </h3>
            <div className="flex flex-wrap gap-2.5 text-xs font-semibold">
              <Link href="/bulk-printing" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                Bulk Printing &amp; Volume Runs →
              </Link>
              <Link href="/printing" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                Standard Laser Printing →
              </Link>
              <Link href="/photocopying" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                Photocopying Services →
              </Link>
              <Link href="/contact" className="px-3.5 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition">
                Contact &amp; Location →
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
