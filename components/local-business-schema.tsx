import { SITE_URL } from "@/lib/env";
import { businessCity, businessLocationLabel } from "@/lib/business-display";
import { getHourPeriods } from "@/lib/data";
import type { BusinessHour, BusinessSettings, CoverageArea } from "@/lib/types";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function LocalBusinessSchema({
  settings,
  hours,
  coverage,
  imageUrl,
}: {
  settings: BusinessSettings;
  hours: BusinessHour[];
  coverage: CoverageArea[];
  imageUrl: string;
}) {
  const openingHoursSpecification = hours.flatMap((hour) =>
    getHourPeriods(hour).map((period) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${dayNames[hour.weekday]}`,
      opens: period.opens_at,
      closes: period.closes_at,
    })),
  );

  const locationLabel = businessLocationLabel(settings.address);
  const city = businessCity(settings.address);
  const businessId = `${SITE_URL}/#business`;
  const businessData = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Store"],
    "@id": businessId,
    name: settings.business_name,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-horizontal.svg`,
    image: imageUrl.startsWith("http") ? imageUrl : `${SITE_URL}${imageUrl}`,
    telephone: settings.phone_e164,
    description: `${settings.tagline}. Local services in ${locationLabel}.`,
    priceRange: "PKR",
    currenciesAccepted: "PKR",
    hasMap: settings.map_url,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: city,
      addressRegion: "Sindh",
      addressCountry: "PK",
    },
    areaServed: coverage.map((area) => ({ "@type": "Place", name: area.name })),
    openingHoursSpecification,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.phone_e164,
      contactType: "customer service",
      availableLanguage: ["English", "Urdu"],
    },
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: settings.business_name,
    url: SITE_URL,
    publisher: { "@id": businessId },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(businessData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(websiteData) }} />
    </>
  );
}
