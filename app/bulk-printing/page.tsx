import type { Metadata } from "next";
import Link from "next/link";
import {
  Layers,
  Phone,
  MessageCircle,
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
import { getCurrentBusinessStatus, getSiteData } from "@/lib/data";
import { SITE_URL } from "@/lib/env";

export const metadata: Metadata = {
  title: "Bulk Printing & Bulk Photocopy in Akhtar Colony, Karachi | Yaqoob Enterprises",
  description:
    "High-volume bulk printing and bulk photocopying in Akhtar Colony, Karachi. For offices, schools, colleges, institutes, and organizations. Contact us ahead on WhatsApp for scheduled completion and volume quotations.",
  alternates: {
    canonical: `${SITE_URL}/bulk-printing`,
  },
  openGraph: {
    title: "Bulk Printing & Bulk Photocopy in Akhtar Colony, Karachi | Yaqoob Enterprises",
    description:
      "Bulk printing & bulk photocopying in Akhtar Colony, Karachi. For schools, offices, and institutes. Contact before visiting for large orders.",
    url: `${SITE_URL}/bulk-printing`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulk Printing & Bulk Photocopy in Akhtar Colony, Karachi | Yaqoob Enterprises",
    description:
      "Bulk printing & bulk photocopying in Akhtar Colony, Karachi. For schools, offices, and institutes.",
  },
};

const BULK_FAQS = [
  {
    q: "Why should customers contact you before visiting for bulk orders?",
    a: "Contacting us before visiting allows us to review your page count, reserve dedicated printer capacity, confirm paper stock (A4 or Legal, 75 or 80 GSM), and schedule your job so it is ready on time without unnecessary waiting at the counter.",
  },
  {
    q: "What counts as a bulk printing or photocopying order?",
    a: "Orders starting from 100 to several thousand pages—such as training manuals, student syllabus packages, exam past paper books, and organizational paperwork—qualify as bulk orders.",
  },
  {
    q: "How do you calculate bulk pricing?",
    a: "Our bulk rates are determined transparently based on total page volume, paper specification (75 GSM vs 80 GSM), single vs double-sided printing, and whether color pages or stapling are required. We give you a clear, fixed quote before printing begins.",
  },
  {
    q: "Can you deliver bulk printing orders within Akhtar Colony or nearby areas?",
    a: "Yes! For large institutional orders in Akhtar Colony, Defence View, Mehmoodabad, or nearby DHA sectors, local delivery or pre-arranged pickup can be coordinated over WhatsApp.",
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
      "Bulk printing and bulk photocopying for offices, schools, colleges, and organizations in Akhtar Colony, Karachi.",
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
                <span className="text-[#0E7490]">Bulk Printing</span>
              </nav>

              <div className="inline-flex items-center gap-2 text-[#0E7490] font-bold text-xs uppercase tracking-wider mb-2">
                <Layers className="w-4 h-4" />
                <span>Volume Printing &amp; Copying • Sector B, Akhtar Colony</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Bulk Printing &amp; Bulk Photocopying in Akhtar Colony, Karachi
              </h1>

              <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
                Reliable, high-speed document runs for local schools, colleges, institutes, corporate offices, and organizations. Clear contrast, accurate collation, and straightforward volume pricing.
              </p>

              {/* Strong Callout Notice */}
              <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-950">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <strong className="block font-bold">Contact us before visiting for larger orders.</strong>
                  Please message or call ahead on WhatsApp so we can confirm paper availability, exact turnaround timing, and provide you with an accurate quotation.
                </div>
              </div>

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
                  <span>GET BULK QUOTE ON WHATSAPP</span>
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

        {/* Target Audience */}
        <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
                Who We Serve
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Bulk Printing Tailored for Local Organizations
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <Building2 className="w-8 h-8 text-[#0E7490] mb-3" />
                <h3 className="font-bold text-base text-slate-900 mb-1">Corporate &amp; Local Offices</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Annual reports, employee handbooks, contracts, compliance documents, and multi-page board presentations.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <GraduationCap className="w-8 h-8 text-[#0E7490] mb-3" />
                <h3 className="font-bold text-base text-slate-900 mb-1">Schools &amp; Coaching Centers</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Monthly test papers, term examination sheets, parent notices, syllabus booklets, and student worksheets.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <Users className="w-8 h-8 text-[#0E7490] mb-3" />
                <h3 className="font-bold text-base text-slate-900 mb-1">Universities &amp; Colleges</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Department handouts, conference proceedings, seminar booklets, and large batch research materials.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <Briefcase className="w-8 h-8 text-[#0E7490] mb-3" />
                <h3 className="font-bold text-base text-slate-900 mb-1">Institutes &amp; Welfare Organizations</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Community brochures, membership forms, project surveys, and organizational documentation.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <CheckCircle2 className="w-8 h-8 text-[#0E7490] mb-3" />
                <h3 className="font-bold text-base text-slate-900 mb-1">Students with Large Documents</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Multi-volume thesis drafts, reference book photocopies, and class course packs for study groups.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <Layers className="w-8 h-8 text-[#0E7490] mb-3" />
                <h3 className="font-bold text-base text-slate-900 mb-1">Large Document Orders</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Any job over 100 pages, with consistent laser toner density and neatly organized sets.
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

        {/* Contextual Links */}
        <section className="py-10 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Related Services
            </h3>
            <div className="flex flex-wrap gap-2.5 text-xs font-semibold">
              <Link href="/printing" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                Laser Printing (B&amp;W &amp; Color) →
              </Link>
              <Link href="/photocopying" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                Photocopying Services →
              </Link>
              <Link href="/office-printing" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                Office &amp; Organizational Printing →
              </Link>
              <Link href="/notes-printing" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                Notes &amp; Assignment Printing →
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
