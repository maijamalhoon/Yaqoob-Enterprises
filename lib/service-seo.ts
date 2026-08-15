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
  commonRequests?: string[];
  officialContext?: OfficialContext;
};

type CategoryOverride = {
  heading: (location: string) => string;
  title: (businessName: string) => string;
  description: (location: string, businessName: string) => string;
};

const categoryOverrides: Record<string, CategoryOverride> = {
  "printing-photos": {
    heading: (location) => `Printing, Photocopy, Scanning & Photos in ${location}`,
    title: (businessName) => `Printing, Photocopy & Passport Photos Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Printing, photocopy, document scanning and passport-size photo services at ${businessName} in ${location}. Send your file or requirement first to confirm availability and charges.`,
  },
  "typing-online": {
    heading: (location) => `Typing, CV & Online Form Services in ${location}`,
    title: (businessName) => `Online Forms, Typing & CV Services Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Urdu and English typing, CV preparation, online applications and FBR registration assistance at ${businessName} in ${location}. Confirm the required documents before visiting.`,
  },
  documents: {
    heading: (location) => `Agreements & Document Preparation in ${location}`,
    title: (businessName) => `Agreement & Document Preparation Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Document typing, formatting, agreement preparation and printing assistance at ${businessName} in ${location}. Share the document type and required details before visiting.`,
  },
  biometric: {
    heading: (location) => `Biometric & NADRA e-Sahulat Services in ${location}`,
    title: (businessName) => `NADRA e-Sahulat & Biometric Verification Karachi | ${businessName}`,
    description: (location, businessName) =>
      `NADRA e-Sahulat, FBR Sales Tax, PSW, vehicle and supported biometric verification services at ${businessName} in ${location}. Check requirements and availability before visiting.`,
  },
  payments: {
    heading: (location) => `Cash Deposit, Withdrawal & Transfer Services in ${location}`,
    title: (businessName) => `Cash Deposit, Withdrawal & Transfer Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Supported cash deposit, withdrawal and domestic transfer assistance at ${businessName} in ${location}. Confirm the service, limits and current availability before visiting.`,
  },
  tickets: {
    heading: (location) => `Railway, Bus & Airline Ticket Assistance in ${location}`,
    title: (businessName) => `Railway, Bus & Airline Ticket Booking Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Railway, bus and airline ticket search and booking assistance at ${businessName} in ${location}. Share route, date and passenger details to confirm available options.`,
  },
  retail: {
    heading: (location) => `Stationery & Mobile Accessories in ${location}`,
    title: (businessName) => `Stationery & Mobile Accessories Akhtar Colony | ${businessName}`,
    description: (location, businessName) =>
      `Everyday stationery and selected mobile accessories available at ${businessName} in ${location}. Ask on WhatsApp to confirm a specific item before visiting.`,
  },
  laptop: {
    heading: (location) => `Laptop, Windows & Software Support in ${location}`,
    title: (businessName) => `Laptop, Windows & Software Support Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Windows setup, drivers, software installation and basic laptop troubleshooting at ${businessName} in ${location}. Send the device issue first to confirm support.`,
  },
};

const serviceOverrides: Record<string, ServiceOverride> = {
  "colour-black-white-printing": {
    heading: (location) => `Colour & Black-and-White Printing in ${location}`,
    title: (businessName) => `Colour & Black and White Printing Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Colour and black-and-white document printing at ${businessName} in ${location}. Send PDFs, documents or images and confirm paper size, quantity and colour requirements before visiting.`,
    intro:
      "Print documents, PDFs and images for everyday personal, study and office needs. Share the file and quantity first when timing, paper size or colour output matters.",
    commonRequests: [
      "A4 black-and-white printouts",
      "Colour document and image printing",
      "PDF or WhatsApp file printouts",
      "Small-batch urgent printing",
    ],
  },
  "photocopy-scanning": {
    heading: (location) => `Photocopy & Document Scanning in ${location}`,
    title: (businessName) => `Photocopy & Document Scanning Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Photocopy and document scanning services at ${businessName} in ${location}. Confirm page quantity, colour requirements and whether scanned files are needed by PDF, email or WhatsApp.`,
    intro:
      "Copy paper documents or convert physical pages into digital files. For larger sets, double-sided pages or a specific output format, confirm the requirement first.",
    commonRequests: [
      "Black-and-white photocopies",
      "Document scanning to PDF",
      "Scan and send by WhatsApp or email",
      "Multi-page document copying",
    ],
  },
  "passport-size-photos": {
    heading: (location) => `Passport-Size Photos in ${location}`,
    title: (businessName) => `Passport Size Photos Akhtar Colony Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Passport-size photo preparation and printing at ${businessName} in ${location}. Confirm the required photo size, background and number of copies before visiting.`,
    intro:
      "Get small-format identity photos prepared and printed for applications and documents. Requirements can vary, so share the intended use if a specific size or background is required.",
    commonRequests: [
      "Passport-size photo printing",
      "White-background ID photos",
      "Application and form photos",
      "Multiple photo copies from one image",
    ],
  },
  "urdu-english-typing": {
    heading: (location) => `Urdu & English Typing Services in ${location}`,
    title: (businessName) => `Urdu & English Typing Services Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Urdu and English typing, formatting and document preparation at ${businessName} in ${location}. Share handwritten, image or draft content and confirm the required file format.`,
    intro:
      "Turn handwritten notes, images or rough drafts into clean Urdu or English documents. Formatting can be adjusted for letters, applications, forms and general office documents.",
    commonRequests: [
      "English document typing",
      "Urdu typing",
      "Application and letter typing",
      "Typing from handwritten pages or images",
    ],
  },
  "online-forms-applications": {
    heading: (location) => `Online Forms & Application Assistance in ${location}`,
    title: (businessName) => `Online Form & Application Assistance Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Online form and application assistance at ${businessName} in ${location}. Bring the required documents, active mobile number and email where the relevant portal requires them.`,
    intro:
      "Get practical help entering information, uploading documents and completing supported online applications. Official approval, eligibility and processing remain with the relevant portal or authority.",
    commonRequests: [
      "Online application form assistance",
      "Document upload and resize help",
      "Portal account and form guidance",
      "Application printout or PDF preparation",
    ],
  },
  "cv-preparation": {
    heading: (location) => `CV Preparation & Formatting in ${location}`,
    title: (businessName) => `CV Preparation & Resume Formatting Karachi | ${businessName}`,
    description: (location, businessName) =>
      `CV preparation, resume formatting and updates at ${businessName} in ${location}. Bring or send your education, experience and contact details for a clean editable CV.`,
    intro:
      "Create a clear CV from your information or improve an existing resume. Content can be organized into a professional structure and prepared for print or digital sharing.",
    commonRequests: [
      "New CV or resume preparation",
      "Existing CV update",
      "Professional CV formatting",
      "CV PDF and print copy",
    ],
  },
  "fbr-registration-assistance": {
    heading: (location) => `FBR Registration & Online Assistance in ${location}`,
    title: (businessName) => `FBR Registration Assistance Karachi | ${businessName}`,
    description: (location, businessName) =>
      `FBR registration and supported online portal assistance at ${businessName} in ${location}. Confirm the specific registration task and required personal or business details before visiting.`,
    intro:
      "Get assistance with supported FBR registration and online steps. Requirements differ by taxpayer and registration type, and official acceptance remains with FBR.",
    commonRequests: [
      "FBR registration assistance",
      "IRIS portal form guidance",
      "Tax registration document preparation",
      "FBR application printouts and uploads",
    ],
  },
  "agreements-document-preparation": {
    heading: (location) => `Agreement & Document Preparation in ${location}`,
    title: (businessName) => `Agreement & Document Preparation Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Agreement typing, document preparation, formatting and printing assistance at ${businessName} in ${location}. Share the document type, parties and required details before visiting.`,
    intro:
      "Prepare clean documents and agreements from the information you provide. This service covers typing, formatting and document preparation; legal advice should be taken from a qualified professional where required.",
    commonRequests: [
      "Agreement typing and formatting",
      "General document preparation",
      "Draft cleanup and print-ready formatting",
      "Document printing after preparation",
    ],
  },
  "general-biometric-esahulat": {
    heading: (location) => `NADRA e-Sahulat & Biometric Verification in ${location}`,
    title: (businessName) => `NADRA e-Sahulat & Biometric Verification Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Check supported NADRA e-Sahulat and biometric verification services at ${businessName} in ${location}. Confirm the verification type, required documents and system availability before visiting.`,
    intro:
      "Biometric and e-Sahulat requirements vary by the official service being used. Confirm the exact verification type and required documents before you travel.",
    commonRequests: [
      "NADRA e-Sahulat biometric verification",
      "Fingerprint or thumb biometric verification",
      "Biometric verification near Akhtar Colony",
      "Supported identity verification at e-Sahulat",
    ],
    officialContext: {
      source: "NADRA",
      title: "About NADRA biometric verification",
      body:
        "NADRA describes biometric verification as electronic identity verification using biometric data and states that biometric verification services are extended through the e-Sahulat franchise network.",
      url: "https://www.nadra.gov.pk/verification",
    },
  },
  "fbr-sales-tax-biometric": {
    heading: (location) => `FBR Sales Tax Biometric Verification in ${location}`,
    title: (businessName) => `FBR Sales Tax Biometric Verification Karachi | ${businessName}`,
    description: (location, businessName) =>
      `FBR Sales Tax biometric verification support at ${businessName} in ${location}. Check CNIC requirements, current e-Sahulat system availability and the relevant registration details before visiting.`,
    intro:
      "For eligible FBR Sales Tax cases, confirm the reference details and the person who must complete biometric verification before visiting.",
    commonRequests: [
      "FBR Sales Tax biometric verification",
      "Sales Tax biometric at NADRA e-Sahulat",
      "FBR biometric verification near Akhtar Colony",
      "Post-registration biometric verification",
    ],
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
      `Pakistan Single Window biometric verification support at ${businessName} in ${location}. Confirm CNIC, Application ID, mobile details and current e-Sahulat availability before visiting.`,
    intro:
      "PSW biometric verification is tied to the subscriber and the relevant PSW application. Confirm the current requirements before visiting or requesting an eligible appointment.",
    commonRequests: [
      "PSW biometric verification",
      "Pakistan Single Window subscription biometric",
      "PSW NADRA e-Sahulat biometric",
      "PSW renewal biometric verification",
    ],
    officialContext: {
      source: "Pakistan Single Window",
      title: "PSW subscription biometric step",
      body:
        "PSW states that biometric verification is the final subscription step and directs the subscriber to a NADRA e-Sahulat franchise. Its guidance lists CNIC, Application ID and the relevant mobile phone details for the biometric visit.",
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
    commonRequests: [
      "Vehicle transfer biometric verification",
      "ETO biometric verification Karachi",
      "Buyer or seller vehicle biometric",
      "NADRA biometric for vehicle transfer",
    ],
    officialContext: {
      source: "NADRA",
      title: "Vehicle transfer biometric verification",
      body:
        "NADRA lists biometric verification for vehicle transfer among the services supported through its Multi Biometric Verification System.",
      url: "https://www.nadra.gov.pk/registrationServicesOP",
    },
  },
  "cash-deposit-withdrawal-transfer": {
    heading: (location) => `Cash Deposit, Withdrawal & Transfer in ${location}`,
    title: (businessName) => `Cash Deposit, Withdrawal & Transfer Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Supported cash deposit, withdrawal and domestic transfer services at ${businessName} in ${location}. Confirm the transaction type, amount limits and current service availability before visiting.`,
    intro:
      "Use supported payment and transfer channels for eligible cash deposits, withdrawals and domestic transfers. Limits, identification requirements and availability can vary by provider.",
    commonRequests: [
      "Cash deposit assistance",
      "Cash withdrawal service",
      "Domestic money transfer",
      "Payment and transfer availability check",
    ],
  },
  "railway-airline-bus-tickets": {
    heading: (location) => `Railway, Bus & Airline Ticket Assistance in ${location}`,
    title: (businessName) => `Railway, Bus & Airline Ticket Booking Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Railway, bus and airline ticket search and booking assistance at ${businessName} in ${location}. Send travel date, route and passenger details to check supported options.`,
    intro:
      "Get help checking supported travel options and preparing a booking request. Fares, schedules, seat availability and booking conditions are controlled by the relevant operator.",
    commonRequests: [
      "Pakistan railway ticket assistance",
      "Bus ticket booking assistance",
      "Airline ticket search and booking help",
      "Travel fare and availability check",
    ],
  },
  "stationery-mobile-accessories": {
    heading: (location) => `Stationery & Mobile Accessories in ${location}`,
    title: (businessName) => `Stationery & Mobile Accessories Akhtar Colony | ${businessName}`,
    description: (location, businessName) =>
      `Everyday stationery and selected mobile accessories at ${businessName} in ${location}. Ask for a specific item, model or quantity on WhatsApp before visiting.`,
    intro:
      "Find everyday stationery plus selected mobile accessories in one local stop. Stock changes regularly, so confirm a specific item or phone model before travelling.",
    commonRequests: [
      "Pens, files, registers and paper",
      "Office and school stationery",
      "Mobile chargers and cables",
      "Selected handsfree and phone accessories",
    ],
  },
  "windows-software-support": {
    heading: (location) => `Laptop, Windows & Software Support in ${location}`,
    title: (businessName) => `Laptop, Windows & Software Support Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Windows setup, drivers, software installation and basic laptop troubleshooting at ${businessName} in ${location}. Send the laptop model and issue first to confirm support.`,
    intro:
      "Get practical help with common Windows, driver and software setup issues. Share the laptop model and exact problem first so the required work can be confirmed before you visit.",
    commonRequests: [
      "Windows installation and setup",
      "Driver installation",
      "Software installation and configuration",
      "Basic laptop troubleshooting",
    ],
  },
};

function clean(value: string | null | undefined) {
  return String(value || "").trim();
}

export function getCategorySeo(category: ServiceCategory, settings: BusinessSettings) {
  const location = businessLocationLabel(settings.address);
  const override = categoryOverrides[category.slug];
  const isBiometric = category.slug === "biometric";
  const heading = override?.heading(location) || category.title;
  const title = override?.title(settings.business_name) || `${category.title} in Karachi | ${settings.business_name}`;
  const description = override?.description(location, settings.business_name) ||
    `${category.description} Available from ${settings.business_name} in ${location}. Check requirements, availability and the correct next step before visiting.`;

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
    commonRequests: override?.commonRequests || [],
    location,
    officialContext: override?.officialContext || null,
    isBiometric: category.slug === "biometric",
    canonicalPath: `/services/${category.slug}/${service.slug}`,
  };
}
