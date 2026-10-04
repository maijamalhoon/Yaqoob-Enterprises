import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Phone,
  MessageCircle,
  Navigation,
  CheckCircle2,
  MapPin,
  Printer,
  Copy,
  Fingerprint,
  Star,
  ExternalLink,
} from "lucide-react";
import { StitchHeader } from "@/components/stitch-header";
import { StitchFooter } from "@/components/stitch-footer";
import { StitchFloatingActions } from "@/components/stitch-floating-actions";
import { TrackedLink } from "@/components/tracked-link";
import { getCurrentBusinessStatus, getSiteData } from "@/lib/data";
import { SITE_URL } from "@/lib/env";

export const metadata: Metadata = {
  title: "About Yaqoob Enterprises | Print, Copy & Biometrics in Akhtar Colony, Karachi",
  description:
    "Learn about Yaqoob Enterprises, an established physical print, photocopy, and NADRA e-Sahulat biometric shop located at Plot 7, Street 1, Sector B, Near Jamia Masjid Muhammadi, Akhtar Colony, Karachi.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About Yaqoob Enterprises | Print, Copy & Biometrics in Akhtar Colony, Karachi",
    description:
      "Physical shop details, services, equipment, and location of Yaqoob Enterprises in Akhtar Colony, Karachi.",
    url: `${SITE_URL}/about`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Yaqoob Enterprises | Print, Copy & Biometrics in Akhtar Colony, Karachi",
    description:
      "Physical shop details, services, equipment, and location of Yaqoob Enterprises in Akhtar Colony, Karachi.",
  },
};

export default async function AboutPage() {
  const { settings, hours } = await getSiteData();
  const statusText = getCurrentBusinessStatus(hours);
  const phone = settings.phone_e164 || "+923492568864";
  const callUrl = `tel:${phone}`;
  const whatsappUrl = `https://wa.me/${phone.replace(/\+/g, "")}?text=${encodeURIComponent(
    "Hello Yaqoob Enterprises, I would like to inquire about your services."
  )}`;
  const directionsUrl =
    settings.map_url ||
    "https://maps.app.goo.gl/uvWeMqEFYYPrEzw9A";
  const gbpUrl =
    settings.google_business_profile_url ||
    settings.map_url ||
    "https://maps.app.goo.gl/uvWeMqEFYYPrEzw9A";
  const pageUrl = `${SITE_URL}/about`;

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "About", item: pageUrl },
    ],
  };

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.business_name,
    telephone: phone,
    url: pageUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Karachi",
      addressRegion: "Sindh",
      postalCode: "75500",
      addressCountry: "PK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 24.8427,
      longitude: 67.0735,
    },
    openingHours: "Mo-Sa 09:00-23:00, Su 16:00-22:30",
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
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
                <span className="text-[#0E7490]">About</span>
              </nav>

              <div className="inline-flex items-center gap-2 text-[#0E7490] font-bold text-xs uppercase tracking-wider mb-2">
                <Building2 className="w-4 h-4" />
                <span>Local Business Profile • Akhtar Colony, Karachi</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                About Yaqoob Enterprises
              </h1>

              <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
                Yaqoob Enterprises is a walk-in local business located in Sector B, Akhtar Colony, Karachi, dedicated to providing high-speed printing, clear photocopying, urgent passport photography, and authorized NADRA e-Sahulat biometric verification.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-6">
                <TrackedLink
                  eventName="call_click"
                  href={callUrl}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-sm transition active:scale-95"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>CALL: +92 349 2568864</span>
                </TrackedLink>

                <TrackedLink
                  eventName="whatsapp_click"
                  href={whatsappUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm transition active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>CHAT ON WHATSAPP</span>
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

        {/* Core Principles */}
        <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
                    Our Shop &amp; Operations
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                    Serving Akhtar Colony and Surrounding Karachi Areas
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Located steps away from Jamia Masjid Muhammadi on Street 1 in Sector B, Yaqoob Enterprises was established to bring dependable everyday digital and documentation services into our neighborhood.
                </p>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Rather than traveling across town for a simple document print, vehicle transfer biometric, or passport photo, local students, parents, and business owners have an accessible, professional counter right in their community.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-sm font-bold text-slate-900">Modern Digital Equipment</strong>
                      <span className="text-xs sm:text-sm text-slate-600">
                        High-capacity laser printers and digital copiers delivering crisp text and durable prints on 75/80 GSM paper.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-sm font-bold text-slate-900">Verified NADRA e-Sahulat Terminal</strong>
                      <span className="text-xs sm:text-sm text-slate-600">
                        Official biometric terminal for verified excise vehicle transfers, FBR registrations, and PSW trader verifications.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-sm font-bold text-slate-900">Pre-Order WhatsApp Convenience</strong>
                      <span className="text-xs sm:text-sm text-slate-600">
                        Send PDFs or requirements on WhatsApp before leaving home so prints are prepared and ready when you walk into the shop.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Physical Entity Details */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#0E7490]" />
                    <span>Exact Physical Location</span>
                  </h3>

                  <div className="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed">
                    <p>
                      <strong>Business Name:</strong> Yaqoob Enterprises
                    </p>
                    <p>
                      <strong>Address:</strong> Plot No. 7, Street No. 1, Sector B, Near Jamia Masjid Muhammadi, Akhtar Colony, Karachi, Pakistan.
                    </p>
                    <p>
                      <strong>Phone / WhatsApp:</strong> +92 349 2568864
                    </p>
                    <p>
                      <strong>Operating Hours:</strong> Monday – Saturday: 9:00 AM – 11:00 PM (Friday prayer break) • Sunday: 4:00 PM – 10:30 PM
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E7490] hover:underline"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Open on Google Maps</span>
                    </a>

                    <a
                      href={gbpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900"
                    >
                      <span>Google Reviews</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-amber-500 mb-1">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Neighborhood Reputation</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Trusted daily by students, families, and neighborhood offices for straightforward, reliable service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Navigation to Services */}
        <section className="py-12 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-6 text-center">
              Explore What We Offer
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
              <Link href="/printing" className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm transition">
                <Printer className="w-5 h-5 text-[#0E7490] mx-auto mb-2" />
                <strong className="block text-xs sm:text-sm font-bold text-slate-900">Printing</strong>
                <span className="text-[11px] text-slate-500">Laser B&amp;W and Color</span>
              </Link>

              <Link href="/photocopying" className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm transition">
                <Copy className="w-5 h-5 text-[#0E7490] mx-auto mb-2" />
                <strong className="block text-xs sm:text-sm font-bold text-slate-900">Photocopying</strong>
                <span className="text-[11px] text-slate-500">Single and Bulk Sets</span>
              </Link>

              <Link href="/notes-printing" className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm transition">
                <CheckCircle2 className="w-5 h-5 text-[#0E7490] mx-auto mb-2" />
                <strong className="block text-xs sm:text-sm font-bold text-slate-900">Notes Printing</strong>
                <span className="text-[11px] text-slate-500">School &amp; University</span>
              </Link>

              <Link href="/nadra-esahulat" className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm transition">
                <Fingerprint className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                <strong className="block text-xs sm:text-sm font-bold text-slate-900">NADRA e-Sahulat</strong>
                <span className="text-[11px] text-slate-500">Biometric Verification</span>
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
