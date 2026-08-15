import { businessLocationLabel } from "@/lib/business-display";
import type { BusinessSettings, Service, ServiceCategory } from "@/lib/types";

type OfficialContext = {
  source: string;
  title: string;
  body: string;
  url: string;
};

type ServiceOverride = {
  heading: (location: string) => string;
  title: (businessName: string) => string;
  description: (location: string, businessName: string) => string;
  intro: string;
  officialContext?: OfficialContext;
};

const serviceOverrides: Record<string, ServiceOverride> = {
  "general-biometric-esahulat": {
    heading: (location) => `NADRA e-Sahulat & Biometric Verification in ${location}`,
    title: (businessName) => `NADRA e-Sahulat & Biometric Verification Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Check supported NADRA e-Sahulat and biometric verification services at ${businessName} in ${location}. Confirm requirements, system availability and appointments before visiting.`,
    intro:
      "Biometric and e-Sahulat requirements vary by the official service being used. Confirm the exact verification type and required documents before you travel.",
    officialContext: {
      source: "NADRA",
      title: "About NADRA biometric verification",
      body:
        "NADRA describes its biometric verification service as electronic identity verification that matches fingerprints and a photograph with CNIC data. NADRA also provides a locator for e-Sahulat centres on its official website.",
      url: "https://www.nadra.gov.pk/verification",
    },
  },
  "fbr-sales-tax-biometric": {
    heading: (location) => `FBR Sales Tax Biometric Verification in ${location}`,
    title: (businessName) => `FBR Sales Tax Biometric Verification Karachi | ${businessName}`,
    description: (location, businessName) =>
      `FBR Sales Tax biometric verification support at ${businessName} in ${location}. Check CNIC requirements, current e-Sahulat system availability and appointment options before visiting.`,
    intro:
      "For eligible FBR Sales Tax cases, confirm the reference details and the person who must complete biometric verification before visiting.",
    officialContext: {
      source: "FBR",
      title: "FBR Sales Tax biometric requirement",
      body:
        "FBR states that a person registered for Sales Tax through Iris is required to visit a NADRA e-Sahulat Centre within 30 days for biometric verification.",
      url: "https://www.fbr.gov.pk/categ/check-active-taxpayer/51149/50848/101152",
    },
  },
  "fbr-psw-biometric": {
    heading: (location) => `PSW Biometric Verification in ${location}`,
    title: (businessName) => `PSW Biometric Verification at e-Sahulat Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Pakistan Single Window biometric verification support at ${businessName} in ${location}. Confirm CNIC, Application ID, mobile details and appointment availability before visiting.`,
    intro:
      "PSW biometric verification is tied to the subscriber and the relevant PSW application. Confirm the current requirements before visiting or requesting an eligible appointment.",
    officialContext: {
      source: "Pakistan Single Window",
      title: "PSW subscription biometric step",
      body:
        "PSW states that biometric verification is the final subscription step and directs the subscriber to a NADRA e-Sahulat franchise. Its current guidance lists CNIC, Application ID and mobile phone number for the biometric visit.",
      url: "https://psw.gov.pk/subscription",
    },
  },
  "eto-vehicle-biometric": {
    heading: (location) => `Vehicle & ETO Biometric Verification in ${location}`,
    title: (businessName) => `Vehicle & ETO Biometric Verification Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Vehicle transfer and supported ETO biometric verification at ${businessName} in ${location}. Confirm buyer or seller presence, CNIC and transaction details before visiting.`,
    intro:
      "Vehicle and ETO biometric cases depend on the transaction, required person and official system availability. Confirm the exact case before travelling.",
    officialContext: {
      source: "NADRA",
      title: "Vehicle transfer biometric verification",
      body:
        "NADRA lists biometric verification for vehicle transfer among the services supported through its Multi Biometric Verification System.",
      url: "https://www.nadra.gov.pk/registrationServicesOP",
    },
  },
};

function clean(value: string | null | undefined) {
  return String(value || "").trim();
}

export function getCategorySeo(category: ServiceCategory, settings: BusinessSettings) {
  const location = businessLocationLabel(settings.address);
  const isBiometric = category.slug === "biometric";
  const heading = isBiometric
    ? `Biometric & NADRA e-Sahulat Services in ${location}`
    : category.title;
  const title = isBiometric
    ? `NADRA e-Sahulat & Biometric Verification Karachi | ${settings.business_name}`
    : `${category.title} in Karachi | ${settings.business_name}`;
  const description = isBiometric
    ? `NADRA e-Sahulat, FBR Sales Tax, PSW, vehicle and supported biometric verification services at ${settings.business_name} in ${location}. Check requirements and availability before visiting.`
    : `${category.description} Available from ${settings.business_name} in ${location}. Check requirements, availability and the correct next step before visiting.`;

  return { heading, title, description, location, isBiometric };
}

export function getServiceSeo(
  category: ServiceCategory,
  service: Service,
  settings: BusinessSettings,
) {
  const location = businessLocationLabel(settings.address);
  const override = serviceOverrides[service.slug];
  const customTitle = clean(service.seo_title);
  const customDescription = clean(service.seo_description);
  const heading = override?.heading(location) || `${service.title} in ${location}`;
  const title = customTitle || override?.title(settings.business_name) || `${service.title} in Karachi | ${settings.business_name}`;
  const description = customDescription || override?.description(location, settings.business_name) ||
    `${service.short_description} Available from ${settings.business_name} in ${location}. Check requirements, current availability and service options before visiting.`;
  const intro = override?.intro || service.detailed_description || service.short_description;

  return {
    heading,
    title,
    description,
    intro,
    location,
    officialContext: override?.officialContext || null,
    isBiometric: category.slug === "biometric",
    canonicalPath: `/services/${category.slug}/${service.slug}`,
  };
}
