import type {
  Announcement,
  BusinessHour,
  BusinessSettings,
  CoverageArea,
  GalleryImage,
  Service,
  ServiceCategory,
} from "./types";

/**
 * Conservative, published 2026 service baseline (seed_business_content +
 * final_public_service_set migrations). Used ONLY when live CMS reads fail.
 * This is not a backup of today's availability, and it must never claim
 * prices, opening hours, delivery options or a successful government service.
 * Hidden/retired service slugs are deliberately excluded.
 */
const publicBaseline = [
  {
    slug: "printing-photos",
    title: "Printing, Photocopy & Photos",
    description: "Printing, photocopy, scanning and passport photos.",
    icon: "printer",
    services: [
      { slug: "colour-black-white-printing", title: "Printing, Photocopy & Document Scanning", summary: "Colour and black-and-white printing, photocopying and document scanning for everyday requirements." },
      { slug: "passport-size-photos", title: "Passport-Size Photos", summary: "Passport-size photo preparation. Confirm current options before visiting." },
    ],
  },
  {
    slug: "typing-online",
    title: "Typing, CV & Online Applications",
    description: "Typing, CVs and online form assistance.",
    icon: "file-text",
    services: [
      { slug: "online-forms-applications", title: "Online Jobs, Forms & Applications", summary: "Online job applications, admissions, registrations and other web-based forms and submissions." },
      { slug: "urdu-english-typing", title: "Urdu & English Typing & CV Preparation", summary: "Urdu and English typing plus clean CV preparation for jobs, applications and documents." },
    ],
  },
  {
    slug: "documents",
    title: "Agreements & Document Preparation",
    description: "Document drafting, formatting and printing assistance.",
    icon: "scroll-text",
    services: [
      { slug: "agreements-document-preparation", title: "Agreements & Document Preparation", summary: "Urdu and English sale, rent and other document preparation assistance." },
    ],
  },
  {
    slug: "biometric",
    title: "Biometric & NADRA e-Sahulat",
    description: "Supported biometric and e-Sahulat enquiries.",
    icon: "fingerprint",
    services: [
      { slug: "general-biometric-esahulat", title: "NADRA e-Sahulat Biometric Verifications", summary: "General, FBR Sales Tax, PSW and vehicle biometric enquiries. Official system availability must be confirmed." },
    ],
  },
  {
    slug: "payments",
    title: "Payments & Money Transfer",
    description: "Payment and transfer enquiries.",
    icon: "wallet-cards",
    services: [
      { slug: "cash-deposit-withdrawal-transfer", title: "Cash Deposit, Withdrawal & Money Transfer", summary: "Supported cash deposit, withdrawal and domestic transfer services." },
    ],
  },
  {
    slug: "tickets",
    title: "Train, Bus & Airline Tickets",
    description: "Travel booking assistance.",
    icon: "ticket",
    services: [
      { slug: "railway-airline-bus-tickets", title: "Railway, Airline & Bus Tickets", summary: "Search and booking assistance for supported routes and operators." },
    ],
  },
  {
    slug: "retail",
    title: "Stationery & Mobile Accessories",
    description: "Everyday shop essentials.",
    icon: "shopping-bag",
    services: [
      { slug: "stationery-mobile-accessories", title: "Stationery & Mobile Accessories", summary: "Everyday stationery and selected mobile accessories. Confirm stock before visiting." },
    ],
  },
  {
    slug: "web-development-seo",
    title: "Web Development & SEO",
    description: "Business websites and technical support.",
    icon: "laptop",
    services: [
      { slug: "website-development-full-stack-seo", title: "Website Development, Full-Stack & SEO Services", summary: "Business websites, full-stack development, redesign, maintenance and practical SEO support." },
    ],
  },
] as const;

export function buildPublicFallbackData(settings: BusinessSettings) {
  const services: Service[] = [];
  const categories: ServiceCategory[] = publicBaseline.map((item, categoryIndex) => {
    const id = `fallback-${item.slug}`;
    const categoryServices: Service[] = item.services.map((entry, serviceIndex) => ({
      id: `fallback-${entry.slug}`,
      category_id: id,
      slug: entry.slug,
      title: entry.title,
      short_description: entry.summary,
      detailed_description: entry.summary,
      // Never imply an online check has confirmed this service is operational.
      status: "temporarily_unavailable",
      available_at_shop: false,
      whatsapp_request: true,
      pickup_available: false,
      delivery_available: false,
      doorstep_available: false,
      appointment_required: false,
      requirements: [],
      important_note: "Live availability could not be checked. Please contact the shop before visiting.",
      display_order: serviceIndex,
      is_featured: false,
      seo_title: null,
      seo_description: null,
      updated_at: "",
    }));
    services.push(...categoryServices);
    return {
      id,
      slug: item.slug,
      title: item.title,
      description: item.description,
      icon_key: item.icon,
      display_order: categoryIndex,
      is_active: true,
      updated_at: "",
      services: categoryServices,
    };
  });

  return {
    settings,
    categories,
    services,
    // Missing CMS data must not be represented as current hours or coverage.
    hours: [] as BusinessHour[],
    coverage: [] as CoverageArea[],
    gallery: [] as GalleryImage[],
    announcements: [] as Announcement[],
    isFallback: true as const,
  };
}
