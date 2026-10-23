import type { Metadata } from "next";
import {
  Phone,
  Navigation,
  CheckCircle2,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { StitchHeader } from "@/components/stitch-header";
import { StitchFooter } from "@/components/stitch-footer";
import { StitchFloatingActions } from "@/components/stitch-floating-actions";
import { TrackedLink } from "@/components/tracked-link";
import { BrandIcon } from "@/components/brand-icon";
import { formatGroupedHours, getCurrentBusinessStatus, getHourPeriods, getSiteData } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { serializeJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "About the Shop | Printing & Biometrics",
  description:
    "About Yaqoob Enterprises, a printing, photocopy and NADRA e-Sahulat shop in Akhtar Colony, Karachi.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About Yaqoob Enterprises | Print, Copy & Biometrics in Akhtar Colony, Karachi",
    description:
      "Printing, photocopy and NADRA e-Sahulat services at Yaqoob Enterprises in Akhtar Colony, Karachi.",
    url: `${SITE_URL}/about`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Yaqoob Enterprises | Print, Copy & Biometrics in Akhtar Colony, Karachi",
    description:
      "Printing, photocopy and NADRA e-Sahulat services at Yaqoob Enterprises in Akhtar Colony, Karachi.",
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
  const gbpUrl = settings.google_business_profile_url;
  const pageUrl = `${SITE_URL}/about`;
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const groupedHours = hours.length > 0 ? formatGroupedHours(hours) : [];
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
    openingHoursSpecification,
  };

  return (
    <div className="public-site min-h-screen bg-white text-slate-900 pb-20 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(aboutSchema) }}
      />

      <StitchHeader settings={settings} statusText={statusText} />

      <main id="main-content">
        {/* Page Hero */}
        <section className="bg-slate-50 border-b border-slate-200 py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
<h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                About {settings.business_name}
              </h1>

              {/* CTAs */}
              <div className="mobile-hero-actions flex flex-wrap items-center gap-3 pt-6">
                <TrackedLink
                  eventName="call_click"
                  href={callUrl} className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-sm transition active:scale-95">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>{settings.phone_display || phone}</span>
                </TrackedLink>

                <TrackedLink
                  eventName="whatsapp_click"
                  href={whatsappUrl}
                  rel="noopener noreferrer"
                  target="_blank" className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm transition active:scale-95">
                  <BrandIcon name="whatsapp" size={16} badge={false} />
                  <span>CHAT ON WHATSAPP</span>
                </TrackedLink>

                <TrackedLink
                  eventName="directions_click"
                  href={directionsUrl}
                  rel="noopener noreferrer"
                  target="_blank" className="inline-flex items-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-sm transition active:scale-95">
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
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                    Printing and e-Sahulat in Akhtar Colony
                  </h2>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-sm font-bold text-slate-900">Printing equipment</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-sm font-bold text-slate-900">NADRA e-Sahulat terminal</strong>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column: Physical Entity Details */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#0E7490]" />
                    <span>Shop details</span>
                  </h3>

                  <div className="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed">
                    <p>
                      <strong>Address:</strong> {settings.address}
                    </p>
                    <p>
                      <strong>Phone / WhatsApp:</strong> {settings.phone_display}
                    </p>
                    <p>
                      <strong>Operating hours:</strong>{" "}
                      {groupedHours.length > 0
                        ? groupedHours.map((group) => group.label + ": " + group.time).join(" · ")
                        : "Confirm today's hours before visiting."}
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

                    {gbpUrl && (
                      <a
                        href={gbpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900"
                      >
                        <span>Google Business Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

      </main>

      <StitchFooter settings={settings} statusText={statusText} />
      <StitchFloatingActions settings={settings} />
    </div>
  );
}
