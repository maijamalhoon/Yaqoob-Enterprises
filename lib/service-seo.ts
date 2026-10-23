import { businessLocationLabel } from "@/lib/business-display";
import type { BusinessSettings, Service, ServiceCategory } from "@/lib/types";

export type OfficialContext = {
  source: string;
  title: string;
  body: string;
  url: string;
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

type ServiceOverride = {
  heading: (location: string) => string;
  title: (businessName: string) => string;
  description: (location: string, businessName: string) => string;
  commonRequests?: string[];
  officialContext?: OfficialContext;
  keywords?: string[];
  faqs?: ServiceFaq[];
};

type CategoryOverride = {
  heading: (location: string) => string;
  title: (businessName: string) => string;
  description: (location: string, businessName: string) => string;
  keywords?: string[];
};

const categoryOverrides: Record<string, CategoryOverride> = {
  "printing-photos": {
    heading: () => "Printing, Photocopy & Photos",
    title: (businessName) => `Printing, Copy & Photos Karachi | ${businessName}`,
    description: (location) =>
      `Printing, photocopying, photo printing and document scanning in ${location}. Bulk notes and assignments are discounted.`,
    keywords: [
      "color print akhtar colony",
      "photocopy near me karachi",
      "document scan pdf karachi",
      "printing shop near jamia masjid muhammadi",
      "urgent color printout akhtar colony",
      "bulk notes and assignment printing karachi",
      "late night printing akhtar colony",
    ],
  },
  "typing-online": {
    heading: () => "Online Forms, Typing & CVs",
    title: (businessName) => `Online Forms, Typing & CVs Karachi | ${businessName}`,
    description: (location) =>
      `Help with job and admission forms, Urdu and English typing, and CVs in ${location}.`,
    keywords: [
      "online job apply karachi",
      "spsc fpsc form apply akhtar colony",
      "urdu typing service karachi",
      "cv maker akhtar colony",
      "admission form online submission karachi",
    ],
  },
  documents: {
    heading: () => "Agreements & Document Typing",
    title: (businessName) => `Agreement Typing Karachi | ${businessName}`,
    description: (location) =>
      `Typing and formatting for rental agreements, vehicle sale documents and affidavits in ${location}.`,
    keywords: [
      "rent agreement typing akhtar colony",
      "kirayanama karachi",
      "stamp paper typing karachi",
      "sale agreement typing akhtar colony",
      "affidavit bayan e halfi typing karachi",
    ],
  },
  biometric: {
    heading: () => "NADRA e-Sahulat Biometrics",
    title: (businessName) => `NADRA e-Sahulat & Biometrics Karachi | ${businessName}`,
    description: (location) =>
      `Biometric verification for supported e-Sahulat, FBR, PSW and vehicle-transfer cases in ${location}.`,
    keywords: [
      "nadra e-sahulat akhtar colony",
      "biometric verification karachi",
      "vehicle transfer biometric karachi",
      "car bike transfer biometric karachi",
      "fbr sales tax biometric",
      "psw biometric center karachi",
    ],
  },
  payments: {
    heading: () => "Cash, Bills & Money Transfers",
    title: (businessName) => `Cash & Money Transfer Karachi | ${businessName}`,
    description: (location) =>
      `Supported cash deposits, withdrawals, bill payments and domestic transfers in ${location}.`,
    keywords: [
      "cash deposit withdrawal akhtar colony",
      "money transfer karachi",
      "utility bill payment akhtar colony",
      "easypaisa jazzcash shop near me",
    ],
  },
  tickets: {
    heading: () => "Train, Bus & Airline Tickets",
    title: (businessName) => `Train, Bus & Air Tickets Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Ticket booking assistance for train, bus and air travel at ${businessName} in ${location}.`,
    keywords: [
      "pakistan railway ticket booking karachi",
      "train ticket akhtar colony",
      "bus ticket booking karachi",
      "air ticket booking akhtar colony",
    ],
  },
  retail: {
    heading: () => "Stationery & Mobile Accessories",
    title: (businessName) => `Stationery & Mobile Accessories Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Everyday office and school stationery, registers, files, plus mobile phone chargers, data cables, and handsfree accessories at ${businessName} in ${location}.`,
    keywords: [
      "stationery shop akhtar colony",
      "mobile charger cable shop akhtar colony",
      "office stationery karachi",
      "school registers pens akhtar colony",
    ],
  },
  laptop: {
    heading: (location) => `Laptop, Windows & Software Support in ${location}`,
    title: (businessName) => `Laptop & Windows Support Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Windows 10/11 installation, hardware drivers, essential software setup, and laptop troubleshooting at ${businessName} in ${location}.`,
    keywords: [
      "windows installation akhtar colony",
      "laptop repair software support karachi",
      "computer drivers setup akhtar colony",
    ],
  },
  "web-development-seo": {
    heading: () => "Website Development & SEO",
    title: (businessName) => `Web Development & SEO Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Business websites, web apps, redesign, maintenance and SEO support from ${businessName} in ${location}.`,
    keywords: [
      "website developer karachi",
      "seo services karachi",
      "local business website pakistan",
      "nextjs developer karachi",
      "google business profile optimization karachi",
    ],
  },
};

const serviceOverrides: Record<string, ServiceOverride> = {
  "colour-black-white-printing": {
    heading: () => "Printing, Copies & Scanning",
    title: (businessName) => `Color & B&W Printing, Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Color and black-and-white printing, photocopying, bulk notes and assignments at discounted rates, and document scanning at ${businessName} in ${location}.`,
    commonRequests: [
      "A4 and Legal black-and-white & high-resolution color laser prints",
      "Bulk notes and assignments for schools, colleges, and universities",
      "Photocopies of CNIC, forms, certificates, and academic documents",
      "Multi-page document scans saved as PDF",
      "WhatsApp document printing requests",
    ],
    keywords: [
      "color print akhtar colony",
      "photocopy shop akhtar colony karachi",
      "a4 color printing near me",
      "document scan to pdf karachi",
      "urgent printing shop near jamia masjid muhammadi",
      "whatsapp print out akhtar colony",
      "legal paper printing karachi",
    ],
    faqs: [
      {
        question: "Can I send documents on WhatsApp for printing before visiting?",
        answer: "Send your file, color, paper size, and quantity on WhatsApp. We will confirm the price and pickup time.",
      },
      {
        question: "What printing sizes and paper qualities are available?",
        answer: "A4 and Legal sizes are available for black-and-white and color printing. Ask us to confirm paper options for your order.",
      },
      {
        question: "Where is Yaqoob Enterprises located for printing in Akhtar Colony?",
        answer: "Find us at Plot 7, Street 1, Sector B, near Jamia Masjid Muhammadi, Akhtar Colony, Karachi.",
      },
      {
        question: "Is late-night printing available?",
        answer: "Late-night printing is available until closing. Message us on WhatsApp to confirm availability and pickup time.",
      },
    ],
  },
  "photocopy-scanning": {
    heading: (location) => `Photocopy & Document Scanning in ${location}`,
    title: (businessName) => `Photocopy & Scanning Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Photocopy and document scanning services at ${businessName} in ${location}. Clear double-sided copies and PDF conversion delivered via WhatsApp or email.`,
    commonRequests: [
      "Clear CNIC and document photocopies",
      "High-resolution multi-page PDF scanning",
      "Scan and share directly to WhatsApp or email",
      "Enlargement or reduction of documents",
    ],
    keywords: [
      "photocopy akhtar colony",
      "document scanner karachi",
      "pdf scan shop near me",
      "cnic copy akhtar colony",
    ],
    faqs: [
      {
        question: "Can scanned documents be sent directly to my email or WhatsApp?",
        answer: "Yes, we scan documents directly into high-quality PDF or JPG formats and immediately send them to your WhatsApp number or email address.",
      },
    ],
  },
  "passport-size-photos": {
    heading: () => "Passport-Size Photos",
    title: (businessName) => `Passport Photos in Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Passport-size photos with white or blue backgrounds for CNICs, passports, visas and applications at ${businessName} in ${location}.`,
    commonRequests: [
      "Urgent passport-size photos with crisp white background",
      "Standard blue-background photos for admissions and government forms",
      "Digital soft copy sent to WhatsApp or email for online job portals",
      "Multiple photo sets (4, 8, or 12 copies) printed on photo paper",
    ],
    keywords: [
      "passport size photo akhtar colony",
      "urgent passport photo karachi",
      "white background photo print karachi",
      "blue background id photo akhtar colony",
      "driving license photo akhtar colony",
      "visa photo size karachi",
      "photo studio near jamia masjid muhammadi",
    ],
    faqs: [
      {
        question: "Can I send a portrait before visiting?",
        answer: "Send a clear portrait and required size on WhatsApp. Confirm the photo and timing before visiting.",
      },
      {
        question: "Can I get both white and blue background photos?",
        answer: "White and blue backgrounds are available. Ask which suits your form; a digital copy can also be sent on WhatsApp.",
      },
    ],
  },
  "urdu-english-typing": {
    heading: () => "Urdu & English Typing and CVs",
    title: (businessName) => `Urdu & English Typing, Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Urdu and English typing, document formatting, CVs and application letters at ${businessName} in ${location}.`,
    commonRequests: [
      "Professional CV and resume creation for local and Gulf job applications",
      "Urdu typing for official applications, notifications, and poetry",
      "English formal letter, complaint, and application drafting",
      "Print-ready PDF delivery and editable file sharing",
    ],
    keywords: [
      "urdu typing service akhtar colony",
      "cv maker akhtar colony karachi",
      "resume drafting karachi",
      "english application typing karachi",
      "job cv designer akhtar colony",
      "urdu inpage typing near me",
    ],
    faqs: [
      {
        question: "Can you prepare a CV from my details?",
        answer: "Share your education, work history and contact details, or bring your current CV. Printed and PDF copies are available.",
      },
      {
        question: "Do you type Urdu applications and official letters?",
        answer: "Yes. We type Urdu in InPage or Unicode for letters, notices and applications.",
      },
    ],
  },
  "online-forms-applications": {
    heading: () => "Online Forms & Job Applications",
    title: (businessName) => `Online Forms & Applications Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Help with job and admission forms, document resizing and fee challans at ${businessName} in ${location}.`,
    commonRequests: [
      "FPSC, SPSC, STS, NTS and PTS job applications",
      "Original CNIC and relevant certificates for job applications",
      "College and university admissions portal submissions",
      "Document, signature, and photograph resizing to exact pixel/KB limits",
      "Fee challan generation, online payment assistance, and slip printing",
    ],
    keywords: [
      "online job application apply akhtar colony",
      "sts sindh jobs form fill karachi",
      "fpsc online apply karachi",
      "spsc challan form online apply",
      "university admission form akhtar colony",
      "online challan print karachi",
    ],
    faqs: [
      {
        question: "What documents should I bring when applying for an online job?",
        answer: "Bring your original CNIC, education certificates, any relevant experience letters, a photo and a mobile number for SMS codes.",
      },
      {
        question: "Do you help resize photos and documents for portals?",
        answer: "Yes. We resize, crop and compress files to match the portal's stated requirements.",
      },
    ],
  },
  "cv-preparation": {
    heading: (location) => `CV Preparation & Formatting in ${location}`,
    title: (businessName) => `CV Preparation in Karachi | ${businessName}`,
    description: (location, businessName) =>
      `CV preparation, resume formatting, and modern template design at ${businessName} in ${location}. Clean, job-ready CVs printed and shared via WhatsApp.`,
    commonRequests: [
      "New CV creation for fresh graduates and experienced professionals",
      "Updating existing CV with new job history and contact info",
      "Formatting CVs for Gulf and overseas job applications",
    ],
    keywords: ["cv preparation karachi", "resume formatting akhtar colony", "cv printing karachi"],
  },
  "fbr-registration-assistance": {
    heading: (location) => `FBR Filer & Tax Assistance in ${location}`,
    title: (businessName) => `FBR NTN & Filer Help Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Assistance with FBR NTN registration, Iris portal guidance, and tax filing documentation support at ${businessName} in ${location}.`,
    commonRequests: [
      "FBR NTN registration assistance",
      "Iris portal login guidance",
      "Tax filing document preparation",
    ],
    keywords: ["fbr ntn registration akhtar colony", "filer assistance karachi", "iris portal help karachi"],
  },
  "agreements-document-preparation": {
    heading: () => "Agreements & Document Preparation",
    title: (businessName) => `Rent Agreement Typing Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Typing for rental agreements, vehicle sale documents, affidavits and related paperwork at ${businessName} in ${location}.`,
    commonRequests: [
      "House, flat, and shop rental agreements (Kirayanama) in Urdu or English",
      "Car and motorcycle sale/purchase agreement typing",
      "Affidavits, undertakings, and Bayan-e-Halfi drafting",
      "Direct printing on official stamp paper with correct margins",
    ],
    keywords: [
      "rent agreement typing akhtar colony",
      "kirayanama karachi akhtar colony",
      "stamp paper typing karachi",
      "house rent agreement typing near me",
      "vehicle sale agreement karachi",
      "affidavit typing akhtar colony",
      "bayan e halfi typing karachi",
    ],
    faqs: [
      {
        question: "What details are needed for a rent agreement?",
        answer: "Bring CNIC copies for both parties and witnesses, the property address, rent, deposit and tenancy period.",
      },
      {
        question: "Can you print directly on legal stamp paper?",
        answer: "We can format documents for stamp paper. Confirm the required paper size before printing.",
      },
    ],
  },
  "general-biometric-esahulat": {
    heading: () => "NADRA e-Sahulat Biometric Verification",
    title: (businessName) => `NADRA Biometric Verification Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Biometric verification for supported general, FBR, PSW and vehicle-transfer cases at ${businessName} in ${location}.`,
    commonRequests: [
      "NADRA e-Sahulat general biometric verification",
      "Vehicle (car/motorcycle) transfer biometric for buyer and seller",
      "FBR Sales Tax post-registration biometric verification within 30 days",
      "Pakistan Single Window (PSW) subscription and renewal biometric",
    ],
    officialContext: {
      source: "NADRA",
      title: "About NADRA biometric verification",
      body:
        "NADRA describes biometric verification as electronic identity verification using biometric data and states that biometric verification services are extended through the e-Sahulat franchise network.",
      url: "https://www.nadra.gov.pk/verification",
    },
    keywords: [
      "nadra e-sahulat akhtar colony",
      "nadra biometric verification karachi",
      "vehicle transfer biometric karachi",
      "car transfer biometric akhtar colony",
      "fbr sales tax biometric nadra",
      "psw biometric karachi",
      "biometric verification near jamia masjid muhammadi",
      "nadra biometric dha phase 1 karachi",
    ],
    faqs: [
      {
        question: "What is required for vehicle transfer biometric verification?",
        answer: "The person whose biometric is due must visit with an original CNIC, registered mobile number and vehicle registration details.",
      },
      {
        question: "How long does a NADRA biometric verification take?",
        answer: "When the NADRA system is available, the fingerprint scan usually takes under two minutes.",
      },
      {
        question: "Do you handle FBR Sales Tax and PSW biometrics?",
        answer: "We handle supported FBR Sales Tax and PSW cases. Confirm requirements before visiting.",
      },
    ],
  },
  "fbr-sales-tax-biometric": {
    heading: (location) => `FBR Sales Tax Biometric Verification in ${location}`,
    title: (businessName) => `FBR Sales Tax Biometrics Karachi | ${businessName}`,
    description: (location, businessName) =>
      `FBR Sales Tax biometric verification support at ${businessName} in ${location}. Complete your mandatory 30-day post-registration biometric verification at our NADRA e-Sahulat counter.`,
    commonRequests: [
      "FBR Sales Tax 30-day biometric compliance",
      "NADRA e-Sahulat biometric verification for Iris registration",
      "Verification receipt confirmation",
    ],
    officialContext: {
      source: "FBR",
      title: "FBR Sales Tax biometric requirement",
      body:
        "FBR states that a person registered for Sales Tax through Iris is required to visit a NADRA e-Sahulat Centre within 30 days for biometric verification.",
      url: "https://www.fbr.gov.pk/categ/sales-tax-payment/51147/50848/101152",
    },
    keywords: [
      "fbr sales tax biometric karachi",
      "sales tax biometric verification akhtar colony",
      "fbr biometric nadra e sahulat karachi",
    ],
    faqs: [
      {
        question: "When should I get my FBR Sales Tax biometric done?",
        answer: "FBR mandates that you visit a NADRA e-Sahulat counter within 30 days of registration on Iris. Failing to complete biometric verification may lead to temporary suspension of your Sales Tax registration.",
      },
    ],
  },
  "fbr-psw-biometric": {
    heading: (location) => `PSW Biometric Verification in ${location}`,
    title: (businessName) => `PSW Biometrics Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Pakistan Single Window (PSW) subscription and renewal biometric verification at ${businessName} in ${location}. Fast e-Sahulat counter verification.`,
    commonRequests: [
      "PSW subscriber biometric verification",
      "Pakistan Single Window account renewal biometric",
      "Authorized representative verification check",
    ],
    officialContext: {
      source: "Pakistan Single Window",
      title: "PSW subscription biometric step",
      body:
        "PSW states that biometric verification is the final subscription step and directs the subscriber to a NADRA e-Sahulat franchise.",
      url: "https://psw.gov.pk/subscription",
    },
    keywords: ["psw biometric verification karachi", "pakistan single window biometric akhtar colony"],
  },
  "eto-vehicle-biometric": {
    heading: (location) => `Vehicle & ETO Biometric Verification in ${location}`,
    title: (businessName) => `Vehicle Transfer Biometrics Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Car and motorcycle transfer biometric verification for buyer and seller at ${businessName} in ${location}. Authorized NADRA e-Sahulat system verification.`,
    commonRequests: [
      "Car transfer biometric verification",
      "Motorcycle ownership transfer biometric",
      "Buyer and seller e-Sahulat verification",
    ],
    officialContext: {
      source: "NADRA",
      title: "Vehicle transfer biometric verification",
      body:
        "NADRA lists biometric verification for vehicle transfer among the services supported through its Multi Biometric Verification System.",
      url: "https://www.nadra.gov.pk/registrationServicesOP",
    },
    keywords: [
      "vehicle transfer biometric karachi",
      "car transfer biometric akhtar colony",
      "bike biometric transfer karachi",
      "eto biometric verification karachi",
    ],
    faqs: [
      {
        question: "Do both buyer and seller need to visit together?",
        answer: "No, buyer and seller can visit separately at their convenience. Each party completes their biometric verification using their CNIC and vehicle transaction tracking number.",
      },
    ],
  },
  "cash-deposit-withdrawal-transfer": {
    heading: () => "Cash Deposits, Withdrawals & Transfers",
    title: (businessName) => `Cash Deposit & Transfer Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Supported cash deposits, withdrawals, utility bill payments and domestic transfers at ${businessName} in ${location}.`,
    commonRequests: [
      "Domestic money transfer across Pakistan",
      "Supported mobile wallet and cash deposit assistance",
      "Electricity, gas, water, and internet utility bill payments",
      "Instant computerized receipt for every transaction",
    ],
    keywords: [
      "cash deposit withdrawal akhtar colony",
      "money transfer shop akhtar colony karachi",
      "utility bill payment akhtar colony",
      "easypaisa cash point akhtar colony",
      "jazzcash agent akhtar colony",
    ],
    faqs: [
      {
        question: "Can I pay my utility bills here?",
        answer: "We process supported electricity, gas, water, phone and internet bills. Ask us to confirm your biller.",
      },
    ],
  },
  "railway-airline-bus-tickets": {
    heading: () => "Train, Bus & Airline Tickets",
    title: (businessName) => `Train, Bus & Airline Tickets Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Booking assistance for Pakistan Railways, intercity buses and airline tickets at ${businessName} in ${location}.`,
    commonRequests: [
      "Pakistan Railway ticket booking (AC Sleeper, AC Business, AC Standard, Economy)",
      "Intercity luxury bus booking (Faisal Movers, Daewoo Express, Kainat Travels)",
      "Domestic flight ticket inquiries and e-ticket printouts",
      "Live schedule, train timing, and fare verification",
    ],
    keywords: [
      "pakistan railway ticket booking karachi",
      "train ticket booking akhtar colony",
      "faisal movers ticket booking karachi",
      "daewoo express booking akhtar colony",
      "railway seat reservation karachi",
      "bus ticket karachi to lahore rawalpindi",
    ],
    faqs: [
      {
        question: "What details do I need to book a Pakistan Railway train ticket?",
        answer: "Share the passenger's name, CNIC, mobile number, travel date, route and preferred class.",
      },
      {
        question: "Can you check train seat availability before booking?",
        answer: "Yes. We can check current seat availability and fares before booking.",
      },
    ],
  },
  "stationery-mobile-accessories": {
    heading: () => "Stationery & Mobile Accessories",
    title: (businessName) => `Stationery & Mobile Accessories Karachi | ${businessName}`,
    description: (location, businessName) =>
      `School and office stationery, chargers, cables and mobile accessories at ${businessName} in ${location}.`,
    commonRequests: [
      "Office stationery: box files, clear bags, clip files, staplers, registers",
      "A4 printing paper reams and envelopes",
      "Fast Type-C and iPhone Lightning charging cables and power adapters",
      "Handsfree earphones, OTG adapters, and mobile accessories",
    ],
    keywords: [
      "stationery shop akhtar colony",
      "mobile charger cable shop akhtar colony",
      "office supplies akhtar colony",
      "type c cable akhtar colony",
    ],
  },
  "windows-software-support": {
    heading: (location) => `Laptop, Windows & Software Support in ${location}`,
    title: (businessName) => `Windows & Laptop Setup Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Clean Windows 10/11 installation, hardware driver updates, MS Office setup, and basic laptop software troubleshooting at ${businessName} in ${location}.`,
    commonRequests: [
      "Clean Windows 10 and Windows 11 installation and activation",
      "Display, Wi-Fi, audio, and printer driver installations",
      "Microsoft Office, PDF readers, and essential business software setup",
      "Basic virus cleanup and slow laptop troubleshooting",
    ],
    keywords: [
      "windows installation akhtar colony",
      "laptop software repair karachi",
      "computer drivers setup akhtar colony",
      "ms office setup akhtar colony",
    ],
  },
  "website-development-full-stack-seo": {
    heading: () => "Website Development & SEO",
    title: (businessName) => `Web Development & SEO Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Business websites, web apps, redesign, maintenance and SEO support from ${businessName} in ${location}.`,
    commonRequests: [
      "Responsive business websites with WhatsApp ordering and inquiry forms",
      "Full-stack Next.js and Supabase web applications with secure admin portals",
      "Google Maps and Google Business Profile verification and ranking optimization",
      "Technical SEO, fast page speed, and schema markup integration",
    ],
    keywords: [
      "website development karachi",
      "local seo services karachi",
      "business website maker pakistan",
      "nextjs developer karachi",
      "google business profile ranking akhtar colony",
      "web design shop karachi",
    ],
    faqs: [
      {
        question: "How long does it take to develop a business website?",
        answer: "A 4 to 8 page business website with WhatsApp enquiries usually takes 5 to 7 working days.",
      },
      {
        question: "Will my website rank on Google for local searches?",
        answer: "We include structured data, local keywords, mobile optimization and fast pages to support search visibility.",
      },
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
  const description =
    override?.description(location, settings.business_name) ||
    `${category.description} Available from ${settings.business_name} in ${location}. Check requirements, availability and the correct next step before visiting.`;
  const keywords = override?.keywords || [
    `${category.title.toLowerCase()} akhtar colony`,
    `${category.title.toLowerCase()} karachi`,
    "yaqoob enterprises akhtar colony",
  ];

  return { heading, title, description, location, isBiometric, keywords };
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
  const title =
    customTitle ||
    override?.title(settings.business_name) ||
    `${service.title} in Karachi | ${settings.business_name}`;
  const description =
    customDescription ||
    override?.description(location, settings.business_name) ||
    `${service.short_description} Available from ${settings.business_name} in ${location}. Check requirements, current availability and service options before visiting.`;
  const defaultKeywords = [
    `${service.title.toLowerCase()} akhtar colony`,
    `${service.title.toLowerCase()} karachi`,
    "nadra e sahulat akhtar colony",
    "yaqoob enterprises karachi",
    "akhtar colony sector b",
    "near jamia masjid muhammadi",
  ];

  return {
    heading,
    title,
    description,
    commonRequests: override?.commonRequests || [],
    location,
    officialContext: override?.officialContext || null,
    isBiometric: category.slug === "biometric",
    canonicalPath: `/services/${category.slug}/${service.slug}`,
    keywords: override?.keywords || defaultKeywords,
    faqs: override?.faqs || [],
  };
}
