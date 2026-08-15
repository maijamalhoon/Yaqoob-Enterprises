import { SITE_URL } from "@/lib/env";
import { businessCity, businessLocationLabel } from "@/lib/business-display";
import { getHourPeriods } from "@/lib/data";
import { OFFICIAL_PROFILE_URLS } from "@/lib/official-profiles";
import type { BusinessHour, BusinessSettings, CoverageArea, ServiceCategory } from "@/lib/types";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function LocalBusinessSchema({
  settings,
  hours,
  coverage,
  categories,
  imageUrl,
}: {
  settings: BusinessSettings;
  hours: BusinessHour[];
  coverage: CoverageArea[];
  categories: ServiceCategory[];
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
  const sameAs = OFFICIAL_PROFILE_URLS;
  const publicCategories = categories
    .filter((category) => category.is_active)
    .map((category) => ({
      ...category,
      services: (category.services || []).filter((service) => service.status !== "hidden"),
    }))
    .filter((category) => category.services.length > 0);

  const serviceCatalog = publicCategories.length > 0
    ? {
        "@type": "OfferCatalog",
        name: `${settings.business_name} services`,
        itemListElement: publicCategories.map((category) => ({
          "@type": "OfferCatalog",
          name: category.title,
          url: `${SITE_URL}/services/${category.slug}`,
          itemListElement: category.services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              "@id": `${SITE_URL}/services/${category.slug}/${service.slug}#service`,
              name: service.title,
              description: service.short_description,
              url: `${SITE_URL}/services/${category.slug}/${service.slug}`,
            },
          })),
        })),
      }
    : undefined;

  const businessData = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Store"],
    "@id": businessId,
    name: settings.business_name,
    url: SITE_URL,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    logo: `${SITE_URL}/brand/logo-horizontal.svg`,
    image: imageUrl.startsWith("http") ? imageUrl : `${SITE_URL}${imageUrl}`,
    telephone: settings.phone_e164,
    description: `${settings.tagline}. NADRA e-Sahulat and biometric verification, printing, online forms, documents and everyday local services in ${locationLabel}.`,
    priceRange: "PKR",
    currenciesAccepted: "PKR",
    hasMap: settings.map_url,
    hasOfferCatalog: serviceCatalog,
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
