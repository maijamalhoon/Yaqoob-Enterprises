import type { Metadata } from "next";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Navigation,
  MapPin,
  Clock,
  Store,
} from "lucide-react";
import { StitchHeader } from "@/components/stitch-header";
import { StitchFooter } from "@/components/stitch-footer";
import { StitchFloatingActions } from "@/components/stitch-floating-actions";
import { StitchQuickRequest } from "@/components/stitch-quick-request";
import { CopyableAddress } from "@/components/copyable-address";
import { TrackedLink } from "@/components/tracked-link";
import { formatBusinessHours, getCurrentBusinessStatus, getSiteData } from "@/lib/data";
import { SITE_URL } from "@/lib/env";

export const metadata: Metadata = {
  title: "Contact & Location | Yaqoob Enterprises Karachi",
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

  const exactAddress =
    "Plot No. 7, Street No. 1, Sector B, Near Jamia Masjid Muhammadi, Akhtar Colony, Karachi, Pakistan";

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
    <div className="min-h-screen bg-white text-slate-900 pb-20 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
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

              <div className="inline-flex items-center gap-2 text-[#0E7490] font-bold text-xs uppercase tracking-wider mb-2">
                <Store className="w-4 h-4" />
                <span>Shop Counter &amp; Direct Assistance</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Contact Yaqoob Enterprises
              </h1>

              <p className="text-base sm:text-lg text-slate-600 mt-2 leading-relaxed">
                Visit our physical shop in Sector B, Akhtar Colony, call our counter directly, or send documents in advance on WhatsApp.
              </p>
            </div>
          </div>
        </section>

        {/* Primary Contact Cards Grid */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Business Details & CTAs */}
              <div className="lg:col-span-6 space-y-6">
                {/* Physical Location Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490] block mb-1">
                    Physical Address
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Yaqoob Enterprises
                  </h2>

                  <div className="mt-3 text-sm text-slate-700 leading-relaxed">
                    <p className="font-semibold text-slate-900">
                      Plot No. 7, Street No. 1, Sector B,
                    </p>
                    <p className="text-slate-700">
                      Near Jamia Masjid Muhammadi,
                    </p>
                    <p className="text-slate-700">
                      Akhtar Colony, Karachi, Pakistan
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <CopyableAddress address={exactAddress} />
                    <span className="text-xs text-slate-500 font-medium">
                      Landmark: Jamia Masjid Muhammadi
                    </span>
                  </div>

                  {/* 3 Prominent CTAs: CALL NOW, WHATSAPP, GET DIRECTIONS */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-4 border-t border-slate-200">
                    <TrackedLink
                      eventName="call_click"
                      href={callUrl}
                      className="inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition active:scale-95 text-center"
                    >
                      <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>CALL NOW</span>
                    </TrackedLink>

                    <TrackedLink
                      eventName="whatsapp_click"
                      href={whatsappUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition active:scale-95 text-center"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>WHATSAPP</span>
                    </TrackedLink>

                    <TrackedLink
                      eventName="directions_click"
                      href={directionsUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 shadow-sm transition active:scale-95 text-center"
                    >
                      <Navigation className="w-4 h-4 text-[#0E7490] shrink-0" />
                      <span>GET DIRECTIONS</span>
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
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      {statusText || "Open daily until 11:00 PM"}
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
                      <>
                        <div className="py-2.5 flex justify-between">
                          <span className="font-semibold text-slate-800">Monday – Saturday</span>
                          <span className="font-bold text-slate-900">9:00 AM – 11:00 PM</span>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <span className="font-semibold text-slate-800">Friday Prayer Break</span>
                          <span className="text-slate-600">1:00 PM – 2:30 PM</span>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <span className="font-semibold text-slate-800">Sunday</span>
                          <span className="font-bold text-slate-900">4:00 PM – 10:30 PM</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Map & Landmark Guide */}
              <div className="lg:col-span-6 space-y-6">
                {/* Map Embed Frame */}
                <div className="bg-slate-100 border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                  <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <strong className="text-xs sm:text-sm font-bold text-slate-900 block">
                        Interactive Google Maps Location
                      </strong>
                      <span className="text-[11px] text-slate-500">
                        Sector B, Street 1, Akhtar Colony, Karachi
                      </span>
                    </div>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#0E7490] hover:underline flex items-center gap-1"
                    >
                      <span>Full Map</span>
                      <Navigation className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Embedded Map iframe */}
                  <div className="relative w-full h-[320px] sm:h-[380px] bg-slate-200">
                    <iframe
                      title="Yaqoob Enterprises Map Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.480062491223!2d67.0735!3d24.8427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33c66f7f6f147%3A0x8e8c897f1f9e8a8a!2sYaqoob%20Enterprises!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                    />
                  </div>
                </div>

                {/* Helpful Directions Tips */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs sm:text-sm text-slate-700 space-y-2">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0E7490]" />
                    <span>How to Reach Us</span>
                  </h3>
                  <p>
                    • <strong>By Motorcycle / Car:</strong> Enter Akhtar Colony from Korangi Road or Defence View. Head toward Jamia Masjid Muhammadi in Sector B. Street 1 is immediately adjacent with street parking.
                  </p>
                  <p>
                    • <strong>On Foot:</strong> Ask anyone near Jamia Masjid Muhammadi for Yaqoob Enterprises (Plot No. 7, Street 1).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guided WhatsApp Request Component */}
        <StitchQuickRequest settings={settings} services={services} />
      </main>

      <StitchFooter settings={settings} />
      <StitchFloatingActions settings={settings} />
    </div>
  );
}
