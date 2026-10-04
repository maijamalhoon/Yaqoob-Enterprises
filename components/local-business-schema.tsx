import { SITE_URL } from "@/lib/env";
import { businessCity, businessLocationLabel } from "@/lib/business-display";
import { getHourPeriods } from "@/lib/data";
import { FAQ_ITEMS } from "@/lib/faq-data";
import type { BusinessHour, BusinessSettings, CoverageArea, ServiceCategory } from "@/lib/types";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const socialProfiles = [
  "https://www.facebook.com/yaqoobenterprises1",
  "https://www.instagram.com/yaqoobenterprises1/",
];

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
  const sameAs = [settings.google_business_profile_url, ...socialProfiles].filter(Boolean);
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
    description: `Printing, Photocopying & NADRA e-Sahulat Services in Akhtar Colony, Karachi. Color & B&W Printing, Notes Printing, Photo Printing, Bulk Printing, and Biometric Services in ${locationLabel}.`,
    priceRange: "PKR",
    currenciesAccepted: "PKR",
    hasMap: settings.map_url,
    hasOfferCatalog: serviceCatalog,
    geo: {
      "@type": "GeoCoordinates",
      latitude: 24.8427,
      longitude: 67.0735,
    },
    keywords:
      "Printing in Akhtar Colony, Photocopy shop Akhtar Colony, Color printing Akhtar Colony, Notes printing Akhtar Colony, Bulk printing Akhtar Colony, Photo printing Akhtar Colony, Passport size photos Karachi, NADRA e-Sahulat Akhtar Colony, Biometric verification Akhtar Colony, Yaqoob Enterprises Karachi",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: city,
      addressRegion: "Sindh",
      postalCode: "75500",
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

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(businessData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(websiteData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqData) }} />
    </>
  );
}
