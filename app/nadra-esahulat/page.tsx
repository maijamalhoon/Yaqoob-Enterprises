import type { Metadata } from "next";
import Link from "next/link";
import {
  Fingerprint,
  Phone,
  MessageCircle,
  Navigation,
  CheckCircle2,
  Car,
  FileCheck,
  ShieldCheck,
  Globe2,
  ChevronDown,
} from "lucide-react";
import { StitchHeader } from "@/components/stitch-header";
import { StitchFooter } from "@/components/stitch-footer";
import { StitchFloatingActions } from "@/components/stitch-floating-actions";
import { TrackedLink } from "@/components/tracked-link";
import { getCurrentBusinessStatus, getSiteData } from "@/lib/data";
import { SITE_URL } from "@/lib/env";

export const metadata: Metadata = {
  title: "NADRA e-Sahulat Biometric Verification in Akhtar Colony, Karachi | Yaqoob Enterprises",
  description:
    "Authorized local NADRA e-Sahulat franchise in Akhtar Colony, Karachi. Biometric verification for Vehicle / ETO transfers, FBR Sales Tax biometric, Pakistan Single Window (PSW), and general biometric verification.",
  alternates: {
    canonical: `${SITE_URL}/nadra-esahulat`,
  },
  openGraph: {
    title: "NADRA e-Sahulat Biometric Verification in Akhtar Colony, Karachi | Yaqoob Enterprises",
    description:
      "Authorized NADRA e-Sahulat biometric verification in Akhtar Colony, Karachi. Vehicle transfer biometric, FBR, and PSW verifications. Call before visiting.",
    url: `${SITE_URL}/nadra-esahulat`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NADRA e-Sahulat Biometric Verification in Akhtar Colony, Karachi | Yaqoob Enterprises",
    description:
      "Authorized NADRA e-Sahulat biometric verification in Akhtar Colony, Karachi. Vehicle transfer biometric, FBR, and PSW verifications.",
  },
};

const ESAHULAT_FAQS = [
  {
    q: "Is Yaqoob Enterprises the official NADRA head office or registration centre?",
    a: "No. Yaqoob Enterprises is an authorized local NADRA e-Sahulat franchise counter operated in Akhtar Colony, Karachi. We provide biometric verification and payment services permitted under the official e-Sahulat network. We do not issue new CNICs, NICOPs, or family registration certificates (which require an official NADRA Mega Center / Executive Office).",
  },
  {
    q: "What should I bring for Vehicle / ETO biometric verification?",
    a: "Please bring your original physical CNIC (or Smart Card) in readable condition, the registered vehicle's registration number, and the active SIM card/phone registered in your name to receive the OTP if required by the provincial excise authority.",
  },
  {
    q: "Can biometric verification fail due to authority server downtime?",
    a: "Yes. Biometric verification relies on live network connectivity with the central NADRA and respective departmental servers (e.g. Excise ETO, FBR IRIS, or PSW). Server outages or scheduled maintenance can occasionally cause temporary delays. We strongly recommend messaging or calling us before you visit to check current server status.",
  },
  {
    q: "Do you guarantee government approval of my case?",
    a: "No. Our role is solely to authenticate fingerprints and transmit biometric verification signals through the authorized e-Sahulat terminal. Final regulatory approval, tax status, or vehicle ownership transfer is determined strictly by the relevant department (Excise, FBR, Customs PSW).",
  },
];

export default async function NadraEsahulatPage() {
  const { settings, hours } = await getSiteData();
  const statusText = getCurrentBusinessStatus(hours);
  const phone = settings.phone_e164 || "+923492568864";
  const callUrl = `tel:${phone}`;
  const whatsappUrl = `https://wa.me/${phone.replace(/\+/g, "")}?text=${encodeURIComponent(
    "Hello Yaqoob Enterprises, I want to confirm biometric verification / e-Sahulat server status. My case is: "
  )}`;
  const directionsUrl =
    settings.map_url ||
    "https://maps.app.goo.gl/uvWeMqEFYYPrEzw9A";
  const pageUrl = `${SITE_URL}/nadra-esahulat`;

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "NADRA e-Sahulat", item: pageUrl },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "NADRA e-Sahulat Biometric Verification in Akhtar Colony, Karachi",
    serviceType: "Biometric Verification Services",
    description:
      "Authorized local NADRA e-Sahulat biometric verification assistance covering general biometric, Vehicle/ETO transfer, FBR Sales Tax, and PSW cases in Akhtar Colony, Karachi.",
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
    mainEntity: ESAHULAT_FAQS.map((faq) => ({
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
                <span className="text-[#0E7490]">NADRA e-Sahulat</span>
              </nav>

              <div className="inline-flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2">
                <Fingerprint className="w-4 h-4 text-emerald-700" />
                <span>Authorized e-Sahulat Franchise Counter • Akhtar Colony</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                NADRA e-Sahulat &amp; Biometric Verification in Akhtar Colony
              </h1>

              <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
                Yaqoob Enterprises provides authorized local biometric verification assistance through the NADRA e-Sahulat network in Sector B, Akhtar Colony, Karachi.
              </p>

              {/* Factual Disclaimer Banner */}
              <div className="mt-4 p-4 bg-slate-100 border border-slate-300 rounded-2xl flex items-start gap-3 text-slate-800">
                <ShieldCheck className="w-5 h-5 text-[#0E7490] shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong className="block font-bold mb-0.5">Authorization &amp; Role Notice:</strong>
                  Yaqoob Enterprises is an authorized local NADRA e-Sahulat service counter, not NADRA head office. We authenticate fingerprints for eligible external authority workflows (Vehicle ETO, FBR, PSW). System availability and final approvals depend strictly on the respective authority.
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
                  <span>CALL BEFORE VISITING</span>
                </TrackedLink>

                <TrackedLink
                  eventName="whatsapp_click"
                  href={whatsappUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm transition active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>CHECK STATUS ON WHATSAPP</span>
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
                <span>Counter Open: {statusText || "Open daily until 11:00 PM"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Biometric Services */}
        <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
                Supported Services
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Biometric Verifications Offered
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Supported services executed through our official e-Sahulat biometric terminal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition">
                <div className="w-11 h-11 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1.5">General Biometric Verification</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Basic citizen identity biometric verification supported across general e-Sahulat services and citizen authentication requests.
                </p>
                <div className="mt-3 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <strong>Requirements:</strong> Original CNIC/Smart Card and active phone number.
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition">
                <div className="w-11 h-11 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <Car className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1.5">Vehicle / ETO Biometric Verification</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Biometric verification for motor vehicle ownership transfer (buyer / seller verification) required by the provincial Excise, Taxation &amp; Narcotics Department.
                </p>
                <div className="mt-3 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <strong>Requirements:</strong> Buyer/seller original CNIC, vehicle registration number, and excise transaction tracking ID.
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition">
                <div className="w-11 h-11 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1.5">FBR Sales Tax Biometric Verification</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Biometric verification for new FBR Sales Tax registration, business individuals, and company directors as mandated by Federal Board of Revenue regulations.
                </p>
                <div className="mt-3 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <strong>Requirements:</strong> Principal individual/director original CNIC, NTN number, and FBR IRIS reference.
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition">
                <div className="w-11 h-11 rounded-xl bg-slate-100 text-[#0E7490] flex items-center justify-center mb-3">
                  <Globe2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1.5">Pakistan Single Window (PSW) Biometric</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Biometric verification required for Pakistan Single Window (PSW) subscription, trader profiles, importers, and exporters.
                </p>
                <div className="mt-3 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <strong>Requirements:</strong> Subscribed user original CNIC, PSW reference/challan number, and registered mobile.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements Checklist */}
        <section className="py-12 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-8">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                What to Bring When Visiting for Biometric Services
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Please ensure you have these items ready so your biometric verification is completed without delay.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-2" />
                <h3 className="font-bold text-sm text-slate-900 mb-1">1. Original Physical CNIC</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You must have your original NADRA CNIC or Smart Card with you. Expired or unreadable cards cannot be processed by the scanner.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-2" />
                <h3 className="font-bold text-sm text-slate-900 mb-1">2. Registered Mobile Phone</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The active SIM card registered in your name to receive the one-time passcode (OTP) required by the verification authority.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-2" />
                <h3 className="font-bold text-sm text-slate-900 mb-1">3. Relevant Tracking Number</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Vehicle registration number, FBR IRIS registration ID, or PSW challan number depending on your case.
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
                NADRA e-Sahulat Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {ESAHULAT_FAQS.map((faq, idx) => (
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
              Other Counter Services
            </h3>
            <div className="flex flex-wrap gap-2.5 text-xs font-semibold">
              <Link href="/printing" className="px-3.5 py-2 bg-white hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200 transition">
                Laser Printing (B&amp;W &amp; Color) →
              </Link>
              <Link href="/photocopying" className="px-3.5 py-2 bg-white hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200 transition">
                Photocopying Services →
              </Link>
              <Link href="/photo-printing" className="px-3.5 py-2 bg-white hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200 transition">
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
