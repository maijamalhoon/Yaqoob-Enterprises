import { SITE_URL } from "@/lib/env";
import { businessCity, businessLocationLabel } from "@/lib/business-display";
import { getHourPeriods } from "@/lib/data";
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
    description: `${settings.tagline}. NADRA e-Sahulat and biometric verification, printing, online forms, documents and everyday local services in ${locationLabel}.`,
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
      "NADRA e-Sahulat Akhtar Colony, Biometric Verification Karachi, Vehicle Biometric Transfer, Color Laser Printing, Photocopy, Document Scanning, Passport Size Photos, Online Job Apply, Urdu English Typing, Rent Agreement, Money Transfer, Railway Ticket Booking, Web Development SEO",
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
    mainEntity: [
      {
        "@type": "Question",
        name: "What documents do I need for NADRA e-Sahulat Biometric Verification?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Please bring your original CNIC (or Smart Card) along with your vehicle registration details, FBR Tax registration number, or PSW transaction ID depending on which verification you require. We confirm specific prerequisites on WhatsApp before you head over.",
        },
      },
      {
        "@type": "Question",
        name: "Can I send PDFs or images via WhatsApp for printing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! You can WhatsApp your documents directly to +92 349 2568864. Let us know whether you need B&W or color laser prints, page orientation, and quantity. Your prints will be ready for instant pickup when you arrive.",
        },
      },
      {
        "@type": "Question",
        name: "Do you draft rental and sale agreements on stamp paper?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we provide bilingual (Urdu and English) typing and document preparation for residential rental agreements, commercial contracts, vehicle sale deeds, and basic affidavits compliant with local requirements.",
        },
      },
      {
        "@type": "Question",
        name: "Where is Yaqoob Enterprises located in Karachi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We are located at Plot No. 7, Street No. 1, Sector B, Near Jamia Masjid Muhammadi, Akhtar Colony, Karachi.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(businessData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(websiteData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqData) }} />
    </>
  );
}
