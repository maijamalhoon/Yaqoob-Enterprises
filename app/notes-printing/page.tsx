import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Phone,
  MessageCircle,
  Navigation,
  CheckCircle2,
  GraduationCap,
  FileText,
  Paperclip,
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
  title: "Notes & Assignment Printing in Karachi",
  description:
    "Bulk school, college, and university notes and assignment printing in Akhtar Colony, Karachi, at discounted rates. Late-night printing until closing.",
  alternates: {
    canonical: `${SITE_URL}/notes-printing`,
  },
  openGraph: {
    title: "Notes & Assignment Printing in Karachi | Yaqoob Enterprises",
    description:
      "Quality bulk notes and assignment printing for schools, colleges, and universities at discounted rates. Late-night printing until closing.",
    url: `${SITE_URL}/notes-printing`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Notes & Assignment Printing in Karachi | Yaqoob Enterprises",
    description:
      "Quality bulk notes and assignment printing for schools, colleges, and universities at discounted rates.",
  },
};

const NOTES_FAQS = [
  {
    q: "How can students send their notes or assignment PDF?",
    a: "Send your PDF on WhatsApp and tell us the quantity, color, and single- or double-sided options. We will confirm the cost and pickup time.",
  },
  {
    q: "Do you offer double-sided (duplex) printing to reduce cost and weight?",
    a: "Yes. Double-sided printing uses fewer sheets and can reduce cost.",
  },
  {
    q: "Can you staple or organize multi-page assignment sets?",
    a: "Yes. Stapling and set collation are available for multi-page assignments.",
  },
  {
    q: "Do you also photocopy physical handwritten notes or study booklets?",
    a: "Yes. Bring your original notes, handouts, or booklet to the shop for photocopying.",
  },
  {
    q: "Are there student discounts for large semester course packs?",
    a: "Yes. Bulk orders are available at discounted rates compared with market prices. Send us the page count for a quote.",
  },
  {
    q: "Is late-night printing available for notes and assignments?",
    a: "Late-night printing is available until closing. Message us on WhatsApp to confirm availability and pickup time.",
  },
];

export default async function NotesPrintingPage() {
  const { settings, hours } = await getSiteData();
  const statusText = getCurrentBusinessStatus(hours);
  const phone = settings.phone_e164 || "+923492568864";
  const callUrl = `tel:${phone}`;
  const whatsappUrl = `https://wa.me/${phone.replace(/\+/g, "")}?text=${encodeURIComponent(
    "Hello Yaqoob Enterprises, I want student notes / assignment printing. Here are my file details: "
  )}`;
  const directionsUrl =
    settings.map_url ||
    "https://maps.app.goo.gl/uvWeMqEFYYPrEzw9A";
  const pageUrl = `${SITE_URL}/notes-printing`;

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Notes Printing", item: pageUrl },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Notes & Assignment Printing in Akhtar Colony, Karachi",
    serviceType: "Academic Document Printing",
    description:
      "School, college, and university notes printing, assignment printing, and past papers in Akhtar Colony, Karachi.",
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
    mainEntity: NOTES_FAQS.map((faq) => ({
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
                <span className="text-[#0E7490]">Notes Printing</span>
              </nav>

              <div className="inline-flex items-center gap-2 text-[#0E7490] font-bold text-xs uppercase tracking-wider mb-2">
                <GraduationCap className="w-4 h-4" />
                <span>Student Printing Hub • Sector B, Akhtar Colony</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Notes &amp; Assignment Printing
              </h1>

              <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
                Discounted printing for school, college and university notes and assignments. Open late, until closing.
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
                  <span>SEND PDF ON WHATSAPP</span>
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
                <span>Ready for Student Walk-ins: {statusText || "Hours available on WhatsApp"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* What We Print for Students */}
        <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
                Academic Services
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Notes &amp; Assignments for Every Level
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Send your file and quantity on WhatsApp for a quote.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">School Notes &amp; Worksheets</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Notes, worksheets, and handouts for school students.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">College Notes &amp; Past Papers</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Course notes, assignments, and past papers for college students.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">University Handouts &amp; Slides</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Lecture notes, slides, assignments, and reports for university students.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <Paperclip className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">Assignment Printing</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Single- or double-sided assignment printing. Stapling is available.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">Bulk Notes Photocopying</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bulk copies of class notes and study booklets.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">Thesis &amp; Final Year Projects</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thesis drafts, project reports, and research documents.
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
                Student Notes FAQ
              </h2>
            </div>

            <div className="space-y-3">
              {NOTES_FAQS.map((faq, idx) => (
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
              Related Services for Students
            </h3>
            <div className="flex flex-wrap gap-2.5 text-xs font-semibold">
              <Link href="/printing" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                Printing Services →
              </Link>
              <Link href="/photocopying" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                Photocopying Services →
              </Link>
              <Link href="/color-printing" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                Color Cover &amp; Graph Printing →
              </Link>
              <Link href="/bulk-printing" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                Bulk Printing for Class Sets →
              </Link>
              <Link href="/contact" className="px-3.5 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition">
                Shop Location &amp; Map →
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
