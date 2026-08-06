import { SITE_URL } from "@/lib/env";
import { getHourPeriods } from "@/lib/data";
import type { BusinessHour, BusinessSettings, CoverageArea } from "@/lib/types";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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

  const data = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Store"],
    name: settings.business_name,
    url: SITE_URL,
    image: imageUrl.startsWith("http") ? imageUrl : `${SITE_URL}${imageUrl}`,
    telephone: settings.phone_e164,
    description:
      "Printing, document preparation, online applications, biometric support, payments, ticket booking, stationery and laptop support in Akhtar Colony, Karachi.",
    priceRange: "PKR",
    currenciesAccepted: "PKR",
    hasMap: settings.map_url,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Karachi",
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
