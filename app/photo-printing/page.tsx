import type { Metadata } from "next";
import Link from "next/link";
import {
  Camera,
  Phone,
  MessageCircle,
  Navigation,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { StitchHeader } from "@/components/stitch-header";
import { StitchFooter } from "@/components/stitch-footer";
import { StitchFloatingActions } from "@/components/stitch-floating-actions";
import { TrackedLink } from "@/components/tracked-link";
import { getCurrentBusinessStatus, getSiteData } from "@/lib/data";
import { SITE_URL } from "@/lib/env";

export const metadata: Metadata = {
  title: "Photo Printing & Passport Size Photos Karachi | Yaqoob Enterprises",
  description:
    "Urgent passport-size photos (white or blue background) ready in 5 minutes in Akhtar Colony, Karachi. High-resolution photo prints for CNIC, passports, visas, licenses, and school admissions.",
  alternates: {
    canonical: `${SITE_URL}/photo-printing`,
  },
  openGraph: {
    title: "Photo Printing & Passport Size Photos Karachi | Yaqoob Enterprises",
    description:
      "5-minute urgent passport-size photos with white or blue background in Akhtar Colony, Karachi. Standard high-resolution photo prints.",
    url: `${SITE_URL}/photo-printing`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Photo Printing & Passport Size Photos Karachi | Yaqoob Enterprises",
    description:
      "5-minute urgent passport-size photos with white or blue background in Akhtar Colony, Karachi.",
  },
};

const PHOTO_FAQS = [
  {
    q: "How fast can I get my passport-size photos?",
    a: "Standard sets of passport-size photos are typically ready in approximately 5 minutes. You can either take a fresh photograph at our shop counter or WhatsApp an existing clear portrait for background adjustment and printing.",
  },
  {
    q: "Do you provide both white and blue background options?",
    a: "Yes. Pakistani CNIC and passport renewals generally require a white background, while certain school admissions, visa forms, and licenses specify a blue background. We format your photos to meet the exact specification.",
  },
  {
    q: "Can I send an existing phone picture on WhatsApp for passport photo printing?",
    a: "Yes! If you already have a well-lit, front-facing portrait on your smartphone, you can send it to us via WhatsApp at +92 349 2568864. We will digitally replace the background with clean white or blue, adjust the aspect ratio, and print the sheets.",
  },
  {
    q: "Do you offer standard high-resolution photo prints for memories or frames?",
    a: "Yes. In addition to ID and passport photos, we produce standard photo prints on glossy and semi-gloss photo media for personal frames, certificates, and memory albums.",
  },
];

export default async function PhotoPrintingPage() {
  const { settings, hours } = await getSiteData();
  const statusText = getCurrentBusinessStatus(hours);
  const phone = settings.phone_e164 || "+923492568864";
  const callUrl = `tel:${phone}`;
  const whatsappUrl = `https://wa.me/${phone.replace(/\+/g, "")}?text=${encodeURIComponent(
    "Hello Yaqoob Enterprises, I need passport-size photos / photo printing. Details: "
  )}`;
  const directionsUrl =
    settings.map_url ||
    "https://maps.app.goo.gl/uvWeMqEFYYPrEzw9A";
  const pageUrl = `${SITE_URL}/photo-printing`;

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Photo Printing", item: pageUrl },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Photo Printing & Passport Photos in Akhtar Colony, Karachi",
    serviceType: "Passport and Photo Printing",
    description:
      "Urgent passport-size photos and high-resolution photo printing in Akhtar Colony, Karachi.",
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
    mainEntity: PHOTO_FAQS.map((faq) => ({
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
                <span className="text-[#0E7490]">Photo Printing</span>
              </nav>

              <div className="inline-flex items-center gap-2 text-[#0E7490] font-bold text-xs uppercase tracking-wider mb-2">
                <Camera className="w-4 h-4" />
                <span>Urgent 5-Minute Photos • Sector B, Akhtar Colony</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Photo Printing &amp; Passport Photos in Akhtar Colony
              </h1>

              <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
                Standard and urgent passport-size photos with white or blue background, ready in approximately 5 minutes. Crisp, smudge-resistant photo prints for CNIC, passports, visas, licenses, job applications, and school admissions.
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
                  <span>WHATSAPP INQUIRY</span>
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
                <span>Photo Counter Active: {statusText || "Open daily until 11:00 PM"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
                Photo Counter Offerings
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Standard &amp; Urgent Photo Preparation
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">Passport-Size Photos (White BG)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Clean white background formatted for Pakistani passport renewal, CNIC/NICOP updates, and international visa applications.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">Passport-Size Photos (Blue BG)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Standard blue background for local school, college, university admissions, government recruitment forms, and driving licenses.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">5-Minute Urgent Service</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fast counter processing, cropping, and instant drying photographic prints while you wait.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">Standard Photo Prints</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  High-resolution photo printing on glossy photo paper for family pictures, project presentations, and photo albums.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">Digital Background Editing</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Send your smartphone photo over WhatsApp; we clean shadows, set the official background, and print ready sheets.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">Multiple Size Sheets</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Available in sets of 4, 8, or 12 photos per sheet to fulfill multi-application requirements cost-effectively.
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
                Photo Printing Questions &amp; Answers
              </h2>
            </div>

            <div className="space-y-3">
              {PHOTO_FAQS.map((faq, idx) => (
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
              <Link href="/color-printing" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                Color Document Printing →
              </Link>
              <Link href="/printing" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                Black &amp; White Printing →
              </Link>
              <Link href="/nadra-esahulat" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition">
                NADRA e-Sahulat Biometrics →
              </Link>
              <Link href="/contact" className="px-3.5 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition">
                Visit Counter &amp; Map →
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
