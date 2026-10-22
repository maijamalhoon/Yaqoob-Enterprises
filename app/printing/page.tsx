import type { Metadata } from "next";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Navigation,
  CheckCircle2,
  ArrowRight,
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
  title: "Printing Services in Akhtar Colony, Karachi",
  description:
    "Black-and-white and color printing in Akhtar Colony, Karachi. Bulk school, college, and university notes and assignments at discounted rates.",
  alternates: {
    canonical: `${SITE_URL}/printing`,
  },
  openGraph: {
    title: "Printing Services in Akhtar Colony, Karachi | Yaqoob Enterprises",
    description:
      "Print notes and assignments for schools, colleges, and universities. Ask about discounted bulk rates and late-night printing until closing.",
    url: `${SITE_URL}/printing`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Printing Services in Akhtar Colony, Karachi | Yaqoob Enterprises",
    description:
      "Print notes and assignments for schools, colleges, and universities. Ask about discounted bulk rates and late-night printing until closing.",
  },
};

const PRINTING_FAQS = [
  {
    q: "Can I send my documents on WhatsApp before visiting?",
    a: "Send your file, print options, and quantity on WhatsApp. We will confirm the cost and pickup time.",
  },
  {
    q: "What paper sizes and weights do you support?",
    a: "A4 and Legal paper in 75 GSM and 80 GSM is available.",
  },
  {
    q: "Do you offer both black & white and color printing?",
    a: "Yes. We offer black-and-white and color printing.",
  },
  {
    q: "Do you print notes and assignments for schools, colleges, and universities?",
    a: "Yes. We print school, college, and university notes and assignments in bulk, with quality printing at discounted rates compared with market prices. Send your file and quantity for a quote.",
  },
  {
    q: "Is late-night printing available?",
    a: "Late-night printing is available until closing. Message us on WhatsApp to confirm availability and pickup time.",
  },
];

export default async function PrintingPage() {
  const { settings, hours } = await getSiteData();
  const statusText = getCurrentBusinessStatus(hours);
  const phone = settings.phone_e164 || "+923492568864";
  const callUrl = `tel:${phone}`;
  const whatsappUrl = `https://wa.me/${phone.replace(/\+/g, "")}?text=${encodeURIComponent(
    "Hello Yaqoob Enterprises, I want to print a document. Here is my requirement: "
  )}`;
  const directionsUrl =
    settings.map_url ||
    "https://maps.app.goo.gl/uvWeMqEFYYPrEzw9A";
  const pageUrl = `${SITE_URL}/printing`;

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Printing", item: pageUrl },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Printing Services in Akhtar Colony, Karachi",
    serviceType: "Laser Printing Services",
    description:
      "Black-and-white and color printing, plus quality bulk notes and assignment printing at discounted rates in Akhtar Colony, Karachi.",
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
    mainEntity: PRINTING_FAQS.map((faq) => ({
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
              {/* Breadcrumb text */}
              <nav className="text-xs text-slate-500 font-semibold mb-3 flex items-center gap-1.5" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-slate-900">Home</Link>
                <span>/</span>
                <span className="text-[#0E7490]">Printing</span>
              </nav>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Printing in Akhtar Colony
              </h1>

              <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
                Color and black-and-white prints for school, study and office documents. Bulk discounts are available.
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

        {/* WhatsApp Pre-order Workflow */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                Send Your File Before You Visit
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed mb-6">
                Send your file and print options on WhatsApp. We will confirm the cost and pickup time.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center mb-3">
                    01
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Send Your File</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    WhatsApp your PDF, Word file, or image to <strong>+92 349 2568864</strong>.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="w-8 h-8 rounded-full bg-[#0E7490] text-white font-bold text-xs flex items-center justify-center mb-3">
                    02
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Choose Print Options</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tell us color or black-and-white, single- or double-sided, and how many copies.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                    03
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Confirm &amp; Collect</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    We will confirm the pickup time and shop location.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Types of Printing Covered */}
        <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Printing for Study, Work &amp; Everyday Needs
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Black-and-white, color, notes, assignments, and bulk printing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
                  <span>Black &amp; White Laser Printing</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Black-and-white prints for forms, records, and everyday documents.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
                  <span>Color Printing</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Color prints for slides, charts, certificates, and covers.
                </p>
                <Link href="/color-printing" className="inline-flex items-center gap-1 text-xs font-bold text-[#0E7490] mt-2 hover:underline">
                  <span>Color printing details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
                  <span>School, College &amp; University Notes</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  School, college, and university notes and assignments in bulk at discounted rates.
                </p>
                <Link href="/notes-printing" className="inline-flex items-center gap-1 text-xs font-bold text-[#0E7490] mt-2 hover:underline">
                  <span>Student notes guide</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
                  <span>Assignment &amp; Project Printing</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Single- or double-sided printing for assignments and projects.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
                  <span>Office &amp; Organizational Printing</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Documents and forms for local businesses.
                </p>
                <Link href="/office-printing" className="inline-flex items-center gap-1 text-xs font-bold text-[#0E7490] mt-2 hover:underline">
                  <span>Office printing details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
                  <span>Bulk Document Orders</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Quality bulk printing at rates discounted compared with market prices. Message us for a quote.
                </p>
                <Link href="/bulk-printing" className="inline-flex items-center gap-1 text-xs font-bold text-[#0E7490] mt-2 hover:underline">
                  <span>Bulk printing details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 bg-slate-50 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Frequently Asked Questions About Printing
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Clear answers about print options and bulk orders.
              </p>
            </div>

            <div className="space-y-3">
              {PRINTING_FAQS.map((faq, idx) => (
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

        {/* Contextual Internal Links Section */}
        <section className="py-10 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Related Services in Akhtar Colony
            </h3>
            <div className="flex flex-wrap gap-2.5 text-xs font-semibold">
              <Link href="/photocopying" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                Photocopying Services →
              </Link>
              <Link href="/notes-printing" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                Notes &amp; Assignment Printing →
              </Link>
              <Link href="/color-printing" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                Color Laser Printing →
              </Link>
              <Link href="/bulk-printing" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                Bulk Printing &amp; Copying →
              </Link>
              <Link href="/photo-printing" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                Passport Size Photos →
              </Link>
              <Link href="/contact" className="px-3.5 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition">
                Shop Location &amp; Contact →
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
