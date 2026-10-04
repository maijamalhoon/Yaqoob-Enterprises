import type { Metadata } from "next";
import Link from "next/link";
import {
  Printer,
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

export const metadata: Metadata = {
  title: "Printing Services in Akhtar Colony, Karachi | Yaqoob Enterprises",
  description:
    "Laser printing services in Akhtar Colony, Karachi. Black & white and color document printing, student assignments, university notes, office paperwork, and bulk printouts. Send your PDF on WhatsApp for zero-wait pickup.",
  alternates: {
    canonical: `${SITE_URL}/printing`,
  },
  openGraph: {
    title: "Printing Services in Akhtar Colony, Karachi | Yaqoob Enterprises",
    description:
      "High-speed laser printing in Akhtar Colony, Karachi. B&W and color printing for assignments, office documents, and study notes. Send documents on WhatsApp.",
    url: `${SITE_URL}/printing`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Printing Services in Akhtar Colony, Karachi | Yaqoob Enterprises",
    description:
      "High-speed laser printing in Akhtar Colony, Karachi. B&W and color printing for assignments, office documents, and study notes.",
  },
};

const PRINTING_FAQS = [
  {
    q: "Can I send my documents on WhatsApp before visiting?",
    a: "Yes! Simply send your PDF, Word file, or images to +92 349 2568864. Tell us whether you need black-and-white or color, single or double-sided, and the number of copies. We will print your document so it is ready for instant pickup when you arrive.",
  },
  {
    q: "What paper sizes and weights do you support?",
    a: "We standardly stock premium 75 GSM and 80 GSM paper in A4 and Legal sizes. These provide clean, jam-free, professional results for legal documents, academic submissions, and corporate reports.",
  },
  {
    q: "Do you offer both black & white and color printing?",
    a: "Yes. We have high-capacity monochrome laser printers for fast, economical black-and-white printouts and dedicated color laser printers for presentations, certificates, project covers, and graphs.",
  },
  {
    q: "Do you handle student assignment and university thesis printing?",
    a: "Yes. Many students from nearby schools, colleges, and Karachi universities print their semester assignments, slides, and project documentation with us. We also offer neat corner stapling and document clipping.",
  },
  {
    q: "Do you provide bulk printing discounts for offices or institutes?",
    a: "Yes. For larger orders (e.g. hundreds of pages of training manuals, syllabus handouts, or organizational paperwork), we provide clear volume rates. Message us on WhatsApp before visiting so we can schedule the run.",
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
      "Black & white and color laser document printing, student assignment printing, university notes, and bulk printing in Akhtar Colony, Karachi.",
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
              {/* Breadcrumb text */}
              <nav className="text-xs text-slate-500 font-semibold mb-3 flex items-center gap-1.5" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-slate-900">Home</Link>
                <span>/</span>
                <span className="text-[#0E7490]">Printing</span>
              </nav>

              <div className="inline-flex items-center gap-2 text-[#0E7490] font-bold text-xs uppercase tracking-wider mb-2">
                <Printer className="w-4 h-4" />
                <span>Local Laser Print Shop • Sector B, Akhtar Colony</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Printing Services in Akhtar Colony, Karachi
              </h1>

              <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
                Clean, high-speed digital laser printing for students, businesses, and local residents. From single-page urgent printouts to multi-hundred page documents and university notes.
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

              {/* Status Note */}
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Counter Open: {statusText || "Open daily until 11:00 PM"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* WhatsApp Pre-order Workflow */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                Save Time: Send Your Document on WhatsApp Before Visiting
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed mb-6">
                Avoid standing in line or waiting for files to download in the shop. Follow these 3 simple steps:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center mb-3">
                    01
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">WhatsApp Your File</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Send your PDF, Word document, or image to <strong>+92 349 2568864</strong>.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="w-8 h-8 rounded-full bg-[#0E7490] text-white font-bold text-xs flex items-center justify-center mb-3">
                    02
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Specify Your Options</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tell us: Black &amp; White or Color, Single-sided or Back-to-back, and number of copies.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                    03
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Instant Counter Pickup</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Walk in to Plot 7, Street 1, Sector B (Near Jamia Masjid Muhammadi) and collect your printed pages.
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
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
                Printing Services Covered
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Everything We Print at Our Akhtar Colony Counter
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                We handle everyday personal documents, institutional requirements, and student projects.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
                  <span>Black &amp; White Laser Printing</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fast monochrome printing on crisp white 75/80 GSM paper. Ideal for text documents, legal papers, forms, and general receipts.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
                  <span>Color Printing</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Vibrant laser color printouts for project title pages, charts, certificates, slides, and graphical documents.
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
                  Complete semester notes, lecture handouts, past papers, and university assignments printed neatly with stapling.
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
                  Single or double-sided formatting for university submissions, presentations, research proposals, and thesis drafts.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
                  <span>Office &amp; Organizational Printing</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Commercial documentation, company profiles, agreements, employee lists, and official forms for local businesses.
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
                  Hundreds or thousands of pages for coaching centers, institutes, or office archives, completed promptly with volume rates.
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
                Common questions from customers visiting Yaqoob Enterprises in Akhtar Colony.
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

      <StitchFooter settings={settings} />
      <StitchFloatingActions settings={settings} />
    </div>
  );
}
