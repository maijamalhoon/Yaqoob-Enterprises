import type { Metadata } from "next";
import Link from "next/link";
import {
  Palette,
  Phone,
  MessageCircle,
  Navigation,
  CheckCircle2,
  FileText,
  Award,
  Presentation,
  FileCheck,
  ChevronDown,
} from "lucide-react";
import { StitchHeader } from "@/components/stitch-header";
import { StitchFooter } from "@/components/stitch-footer";
import { StitchFloatingActions } from "@/components/stitch-floating-actions";
import { TrackedLink } from "@/components/tracked-link";
import { getCurrentBusinessStatus, getSiteData } from "@/lib/data";
import { SITE_URL } from "@/lib/env";

export const metadata: Metadata = {
  title: "Color Printing & Color Photocopy in Akhtar Colony, Karachi | Yaqoob Enterprises",
  description:
    "Color laser printing and color photocopying in Akhtar Colony, Karachi. Clear, vibrant printouts for project reports, certificates, presentations, official forms, and charts. Send files on WhatsApp for instant counter collection.",
  alternates: {
    canonical: `${SITE_URL}/color-printing`,
  },
  openGraph: {
    title: "Color Printing & Color Photocopy in Akhtar Colony, Karachi | Yaqoob Enterprises",
    description:
      "Vibrant color laser printing and color photocopy in Akhtar Colony, Karachi. For certificates, assignments, and presentations. Send files on WhatsApp.",
    url: `${SITE_URL}/color-printing`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Printing & Color Photocopy in Akhtar Colony, Karachi | Yaqoob Enterprises",
    description:
      "Vibrant color laser printing and color photocopy in Akhtar Colony, Karachi. For certificates, assignments, and presentations.",
  },
};

const COLOR_FAQS = [
  {
    q: "What digital formats are best for color printing?",
    a: "PDF files are the most reliable format because they preserve exact fonts, margins, page breaks, and color gamuts. High-resolution JPG or PNG images and Microsoft Word (.docx) files are also supported.",
  },
  {
    q: "Can you photocopy a color certificate or diagram?",
    a: "Yes. Our digital color copiers reproduce color certificates, official stamps, colored logos, and educational diagrams with clear, accurate tone separation.",
  },
  {
    q: "What paper do you recommend for color presentations and certificates?",
    a: "For standard documents and slides, our 80 GSM bright white paper is standard. For certificates or special title pages, we also have heavier cardstock options available on request.",
  },
  {
    q: "Can I print just one or two color pages from a large document?",
    a: "Yes! Many students and offices have documents that are mostly black & white with only a few color pages (such as graphs or cover pages). We can print specific pages in color and the rest in black & white to save costs.",
  },
];

export default async function ColorPrintingPage() {
  const { settings, hours } = await getSiteData();
  const statusText = getCurrentBusinessStatus(hours);
  const phone = settings.phone_e164 || "+923492568864";
  const callUrl = `tel:${phone}`;
  const whatsappUrl = `https://wa.me/${phone.replace(/\+/g, "")}?text=${encodeURIComponent(
    "Hello Yaqoob Enterprises, I need color printing / color photocopy. My requirement is: "
  )}`;
  const directionsUrl =
    settings.map_url ||
    "https://maps.app.goo.gl/uvWeMqEFYYPrEzw9A";
  const pageUrl = `${SITE_URL}/color-printing`;

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Color Printing", item: pageUrl },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Color Printing & Color Photocopy in Akhtar Colony, Karachi",
    serviceType: "Color Laser Printing",
    description:
      "Color laser printing and color photocopying for documents, presentations, certificates, and forms in Akhtar Colony, Karachi.",
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
    mainEntity: COLOR_FAQS.map((faq) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
                <span className="text-[#0E7490]">Color Printing</span>
              </nav>

              <div className="inline-flex items-center gap-2 text-[#0E7490] font-bold text-xs uppercase tracking-wider mb-2">
                <Palette className="w-4 h-4" />
                <span>Laser Color Center • Sector B, Akhtar Colony</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Color Printing &amp; Color Photocopying in Akhtar Colony
              </h1>

              <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
                Clean, vibrant color laser printing and sharp color photocopying for your important presentation slides, certificates, academic projects, and official color forms.
              </p>

              {/* 3 Prominent CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-6">
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
                  <span>SEND DOCUMENT ON WHATSAPP</span>
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

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Open for Walk-ins: {statusText || "Open daily until 11:00 PM"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Real Use Cases */}
        <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
                Applications
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Real Use Cases for Color Printing &amp; Copying
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                We produce clean color reproductions on high-grade paper for diverse personal and professional needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">Certificates &amp; Diplomas</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Clear color printing for completion certificates, training awards, and color reproductions of official diplomas.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <Presentation className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">Presentations &amp; Pitch Decks</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  PowerPoint slides, charts, infographics, and project proposals where color distinction is vital for readers.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">Assignments &amp; Thesis Projects</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Color diagrams, scientific illustrations, architectural layouts, and graphical figures for university assignments.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">Official Color Forms</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Visa applications, embassy submissions, color-coded medical reports, and registration vouchers.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <Palette className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">Color Photocopying</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Exact duplicate copies of colored documents, original stamps, identity cards, and colored brochures.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">Office Materials &amp; Manuals</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Company catalogs, training handouts, procedural guidelines, and client-facing flyers.
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
                Color Printing Questions &amp; Answers
              </h2>
            </div>

            <div className="space-y-3">
              {COLOR_FAQS.map((faq, idx) => (
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
              Related Services
            </h3>
            <div className="flex flex-wrap gap-2.5 text-xs font-semibold">
              <Link href="/printing" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                All Printing Services →
              </Link>
              <Link href="/photocopying" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                Photocopying Services →
              </Link>
              <Link href="/photo-printing" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                Photo Printing &amp; Passport Photos →
              </Link>
              <Link href="/notes-printing" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                Notes &amp; Assignment Printing →
              </Link>
              <Link href="/contact" className="px-3.5 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition">
                Contact &amp; Map →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <StitchFooter settings={settings} />
      <StitchFloatingActions settings={settings} />
    </div>
  );
}
