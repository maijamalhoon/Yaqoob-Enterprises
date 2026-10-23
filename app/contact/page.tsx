import type { Metadata } from "next";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Navigation,
  Clock,
} from "lucide-react";
import { StitchHeader } from "@/components/stitch-header";
import { StitchFooter } from "@/components/stitch-footer";
import { StitchFloatingActions } from "@/components/stitch-floating-actions";
import { StitchQuickRequest } from "@/components/stitch-quick-request";
import { CopyableAddress } from "@/components/copyable-address";
import { TrackedLink } from "@/components/tracked-link";
import { formatBusinessHours, getCurrentBusinessStatus, getHourPeriods, getSiteData } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { serializeJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Contact & Location in Karachi",
  description:
    "Visit Yaqoob Enterprises at Plot No. 7, Street No. 1, Sector B, Near Jamia Masjid Muhammadi, Akhtar Colony, Karachi. Phone: +92 349 2568864. Call, WhatsApp, or get directions.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: "Contact & Location | Yaqoob Enterprises Karachi",
    description:
      "Visit Yaqoob Enterprises in Sector B, Akhtar Colony, Karachi. Call, WhatsApp, or get directions.",
    url: `${SITE_URL}/contact`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact & Location | Yaqoob Enterprises Karachi",
    description:
      "Visit Yaqoob Enterprises in Sector B, Akhtar Colony, Karachi. Call, WhatsApp, or get directions.",
  },
};

export default async function ContactPage() {
  const { settings, hours, services } = await getSiteData();
  const statusText = getCurrentBusinessStatus(hours);
  const phone = settings.phone_e164 || "+923492568864";
  const callUrl = `tel:${phone}`;
  const whatsappUrl = `https://wa.me/${phone.replace(/\+/g, "")}?text=${encodeURIComponent(
    "Hello Yaqoob Enterprises, I need help with: "
  )}`;
  const directionsUrl =
    settings.map_url ||
    "https://maps.app.goo.gl/uvWeMqEFYYPrEzw9A";

  const exactAddress = settings.address || "Plot No. 7, Street No. 1, Sector B, Akhtar Colony, Karachi, Pakistan";
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const openingHoursSpecification = hours.flatMap((hour) =>
    getHourPeriods(hour).map((period) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${dayNames[hour.weekday]}`,
      opens: period.opens_at,
      closes: period.closes_at,
    })),
  );

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Contact", item: `${SITE_URL}/contact` },
    ],
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.business_name,
    telephone: phone,
    url: `${SITE_URL}/contact`,
    hasMap: directionsUrl,
    openingHoursSpecification,
    address: {
      "@type": "PostalAddress",
      streetAddress: exactAddress,
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
  };

  return (
    <div className="public-site min-h-screen bg-white text-slate-900 pb-20 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(contactSchema) }}
      />

      <StitchHeader settings={settings} statusText={statusText} />

      <main id="main-content">
        {/* Page Hero */}
        <section className="bg-slate-50 border-b border-slate-200 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <nav className="text-xs text-slate-500 font-semibold mb-3 flex items-center gap-1.5" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-slate-900">Home</Link>
                <span>/</span>
                <span className="text-[#0E7490]">Contact &amp; Location</span>
              </nav>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Contact and directions
              </h1>

              <p className="text-base sm:text-lg text-slate-600 mt-2 leading-relaxed">
                Visit our Akhtar Colony shop or contact us by phone or WhatsApp.
              </p>
            </div>
          </div>
        </section>

        {/* Primary Contact Cards Grid */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 items-start">
              {/* Left Column: Business Details & CTAs */}
              <div className="space-y-6">
                {/* Physical Location Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490] block mb-1">
                    Physical Address
                  </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {settings.business_name}
                  </h2>

                  <div className="mt-3 text-sm text-slate-700 leading-relaxed">
                    <p className="text-slate-700">{exactAddress}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <CopyableAddress address={exactAddress} />
                  </div>

                  {/* 3 Prominent CTAs: CALL NOW, WHATSAPP, GET DIRECTIONS */}
                  <div className="mobile-hero-actions grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-4 border-t border-slate-200">
                    <TrackedLink
                      eventName="call_click"
                      href={callUrl}
                      className="inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition active:scale-95 text-center"
                    >
                      <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Call</span>
                    </TrackedLink>

                    <TrackedLink
                      eventName="whatsapp_click"
                      href={whatsappUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition active:scale-95 text-center"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                        <span>WhatsApp</span>
                    </TrackedLink>

                    <TrackedLink
                      eventName="directions_click"
                      href={directionsUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 shadow-sm transition active:scale-95 text-center"
                    >
                      <Navigation className="w-4 h-4 text-[#0E7490] shrink-0" />
                        <span>Directions</span>
                    </TrackedLink>
                  </div>
                </div>

                {/* Operating Hours Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#0E7490]" />
                      <span>Opening Hours</span>
                    </h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusText.startsWith("Open now") ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-slate-700 bg-slate-100 border-slate-200"}`}>
                      {statusText || "Hours available on WhatsApp"}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-200 text-xs sm:text-sm">
                    {hours && hours.length > 0 ? (
                      hours.map((hour) => (
                        <div key={hour.id} className="py-2.5 flex justify-between">
                          <span className="font-semibold text-slate-800">{hour.label}</span>
                          <span className="font-bold text-slate-900">{formatBusinessHours(hour)}</span>
                        </div>
                      ))
                    ) : (
                      <p className="py-2.5 text-slate-600">
                        Please message us to confirm today’s hours.
                      </p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Guided WhatsApp Request Component */}
        <StitchQuickRequest settings={settings} services={services} />
      </main>

      <StitchFooter settings={settings} statusText={statusText} />
      <StitchFloatingActions settings={settings} />
    </div>
  );
}
