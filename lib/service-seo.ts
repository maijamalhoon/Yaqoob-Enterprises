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
  intro: string;
  commonRequests?: string[];
  officialContext?: OfficialContext;
  urduNote?: string;
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
    heading: (location) => `Printing, Photocopy, Scanning & Photos in ${location}`,
    title: (businessName) => `Printing, Photocopy & Passport Photos Akhtar Colony Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Colour and black-and-white printing, photocopy, document scanning to PDF, and urgent 5-minute passport photos at ${businessName} in ${location}. Send files via WhatsApp for instant print.`,
    keywords: [
      "color print akhtar colony",
      "photocopy near me karachi",
      "document scan pdf karachi",
      "passport photos 5 minutes karachi",
      "printing shop near jamia masjid muhammadi",
      "urgent color printout akhtar colony",
    ],
  },
  "typing-online": {
    heading: (location) => `Online Jobs, Forms, Typing & CV Services in ${location}`,
    title: (businessName) => `Online Jobs, Forms, Typing & CV Preparation Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Online job applications, admissions, government forms, Urdu and English typing, and CV/resume preparation at ${businessName} in ${location}. Error-free application filing.`,
    keywords: [
      "online job apply karachi",
      "spsc fpsc form apply akhtar colony",
      "urdu typing service karachi",
      "cv maker akhtar colony",
      "admission form online submission karachi",
    ],
  },
  documents: {
    heading: (location) => `Agreements & Legal Document Preparation in ${location}`,
    title: (businessName) => `Rent Agreement & Stamp Paper Typing Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Residential rent agreements, commercial contracts, vehicle sale deeds, affidavits, and legal document typing on stamp paper at ${businessName} in ${location}.`,
    keywords: [
      "rent agreement typing akhtar colony",
      "kirayanama karachi",
      "stamp paper typing karachi",
      "sale agreement typing akhtar colony",
      "affidavit bayan e halfi typing karachi",
    ],
  },
  biometric: {
    heading: (location) => `NADRA e-Sahulat & Biometric Verification in ${location}`,
    title: (businessName) => `NADRA e-Sahulat & Biometric Verification Akhtar Colony Karachi | ${businessName}`,
    description: (location, businessName) =>
      `NADRA e-Sahulat biometric verification center in ${location}. General biometric, FBR Sales Tax, Pakistan Single Window (PSW), and Vehicle / ETO transfer biometrics at ${businessName}.`,
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
    heading: (location) => `Cash Deposit, Withdrawal & Money Transfer in ${location}`,
    title: (businessName) => `Cash Deposit, Withdrawal & Money Transfer Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Supported cash deposit, withdrawal, utility bill payments, and domestic money transfers at ${businessName} in ${location}. Fast and secure counter service.`,
    keywords: [
      "cash deposit withdrawal akhtar colony",
      "money transfer karachi",
      "utility bill payment akhtar colony",
      "easypaisa jazzcash shop near me",
    ],
  },
  tickets: {
    heading: (location) => `Railway, Bus & Airline Ticket Assistance in ${location}`,
    title: (businessName) => `Railway, Bus & Airline Ticket Booking Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Pakistan Railway train tickets, intercity bus bookings (Daewoo, Faisal Movers), and airline ticket reservation assistance at ${businessName} in ${location}.`,
    keywords: [
      "pakistan railway ticket booking karachi",
      "train ticket akhtar colony",
      "bus ticket booking karachi",
      "air ticket booking akhtar colony",
    ],
  },
  retail: {
    heading: (location) => `Stationery & Mobile Accessories in ${location}`,
    title: (businessName) => `Stationery & Mobile Accessories Akhtar Colony | ${businessName}`,
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
    title: (businessName) => `Laptop, Windows & Software Support Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Windows 10/11 installation, hardware drivers, essential software setup, and laptop troubleshooting at ${businessName} in ${location}.`,
    keywords: [
      "windows installation akhtar colony",
      "laptop repair software support karachi",
      "computer drivers setup akhtar colony",
    ],
  },
  "web-development-seo": {
    heading: (location) => `Web Development & Local SEO Services in ${location}`,
    title: (businessName) => `Website Development & Local SEO Services Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Professional business websites, Next.js web applications, Google Maps optimization, and local SEO services by ${businessName} in ${location}. Increase online business leads.`,
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
    heading: (location) => `Printing, Photocopy & Document Scanning in ${location}`,
    title: (businessName) => `Color & B&W Printing, Photocopy & Scanning Akhtar Colony | ${businessName}`,
    description: (location, businessName) =>
      `High-speed color and black-and-white laser printing, bulk photocopies, and multi-page document scanning to PDF at ${businessName} in ${location}. Send files via WhatsApp for instant print.`,
    intro:
      "Handle all your everyday printing, photocopying, and document scanning in one convenient local spot. Send digital files via WhatsApp for instant pickup, or bring physical originals for clean, high-resolution copying and scanning.",
    commonRequests: [
      "A4 and Legal black-and-white & high-resolution color laser prints",
      "Photocopies of CNIC, forms, certificates, and academic documents",
      "Multi-page document scanning converted to searchable PDF",
      "Direct WhatsApp document printing for zero wait time",
    ],
    urduNote: "واٹس ایپ پر فائل پہلے بھیج دیں تاکہ دکان پر پہنچتے ہی آپ کا پرنٹ تیار ملے۔ (A4 اور لیگل سائز، کلر اور بلیک اینڈ وائٹ دستیاب ہے)",
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
        answer: "Yes! You can WhatsApp your PDF or image files to +92 349 2568864. Tell us whether you need color or black & white, paper size (A4 or Legal), and quantity. Your printouts will be ready when you walk into the shop.",
      },
      {
        question: "What printing sizes and paper qualities are available?",
        answer: "We support standard A4 and Legal paper sizes for both black-and-white laser prints and high-density color prints, as well as bulk photocopies.",
      },
      {
        question: "Where is Yaqoob Enterprises located for printing in Akhtar Colony?",
        answer: "We are located at Plot No. 7, Street No. 1, Sector B, Near Jamia Masjid Muhammadi, Akhtar Colony, Karachi.",
      },
    ],
  },
  "photocopy-scanning": {
    heading: (location) => `Photocopy & Document Scanning in ${location}`,
    title: (businessName) => `Photocopy & Document Scanning Akhtar Colony Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Photocopy and document scanning services at ${businessName} in ${location}. Clear double-sided copies and PDF conversion delivered via WhatsApp or email.`,
    intro:
      "Fast, high-contrast photocopying and crystal-clear document scanning for all your official, business, and educational records.",
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
    heading: (location) => `Urgent Passport-Size Photos in ${location}`,
    title: (businessName) => `Passport Size Photos (5 Min) Akhtar Colony Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Instant 5-minute passport-size photos with white or blue backgrounds at ${businessName} in ${location}. Compliant with Pakistani passports, CNIC, driving license, and visa specs.`,
    intro:
      "Get crisp, studio-lit passport-size photos taken and printed in 5 to 10 minutes. Perfect for school and college admissions, driving license, job applications, government portals, and visa applications.",
    commonRequests: [
      "Urgent passport-size photos with crisp white background",
      "Standard blue-background photos for admissions and government forms",
      "Digital soft copy sent to WhatsApp or email for online job portals",
      "Multiple photo sets (4, 8, or 12 copies) printed on photo paper",
    ],
    urduNote: "ارجنٹ پاسپورٹ سائز فوٹو صرف 5 سے 10 منٹ میں تیار۔ سفید اور نیلا بیک گراؤنڈ، پاسپورٹ اور فارمز کے لیے دستیاب۔",
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
        question: "How long does it take to print passport-size photos?",
        answer: "Our standard turnaround time is just 5 to 10 minutes. Photos are captured, cropped to the required specifications, and printed on premium photo paper on the spot.",
      },
      {
        question: "Can I get both white and blue background photos?",
        answer: "Yes, we provide standard white background photos (for visas and modern passports) and blue background photos (for local government forms and education boards). We also send a soft copy to your WhatsApp for online portals.",
      },
    ],
  },
  "urdu-english-typing": {
    heading: (location) => `Urdu & English Typing & CV Preparation in ${location}`,
    title: (businessName) => `Urdu & English Typing & Professional CV Maker Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Professional Urdu inpage and English typing, resume and CV formatting, job application letters, and document typing at ${businessName} in ${location}.`,
    intro:
      "Convert rough handwritten notes, drafts, or photos into neat, professionally formatted Urdu and English documents. We also create modern, ATS-friendly CVs that help you stand out in job applications.",
    commonRequests: [
      "Professional CV and resume creation for local and Gulf job applications",
      "Urdu typing for official applications, notifications, and poetry",
      "English formal letter, complaint, and application drafting",
      "Print-ready PDF delivery and editable file sharing",
    ],
    urduNote: "اردو اور انگلش ٹائپنگ، نئی اور جدید سی وی (CV) بنوانے کی سہولت۔ پرانی سی وی کو اپڈیٹ بھی کیا جاتا ہے۔",
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
        question: "Can you create a professional CV from my existing experience details?",
        answer: "Yes! Simply share your educational qualifications, work history, and contact details (or bring your old CV). We will draft a modern, structured CV and provide both printed copies and an editable PDF.",
      },
      {
        question: "Do you type Urdu applications and official letters?",
        answer: "Yes, we type Urdu in InPage and Unicode fonts for official department letters, legal requests, notices, and applications.",
      },
    ],
  },
  "online-forms-applications": {
    heading: (location) => `Online Jobs, Forms & Admissions Assistance in ${location}`,
    title: (businessName) => `Online Job Apply, Forms & Admissions Akhtar Colony Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Complete assistance with online job applications (STS, PTS, FPSC, SPSC), university admissions, document resizing, and fee challan generation at ${businessName} in ${location}.`,
    intro:
      "Avoid errors, rejected submissions, or server timeout issues on government job portals. We assist with complete profile registration, picture and CNIC resizing, online challan generation, and final submission printouts.",
    commonRequests: [
      "FPSC, SPSC, STS (SIBA Testing Services), and PTS job applications",
      "College and university admissions portal submissions",
      "Document, signature, and photograph resizing to exact pixel/KB limits",
      "Fee challan generation, online payment assistance, and slip printing",
    ],
    urduNote: "سرکاری و پرائیویٹ ملازمتوں کے آن لائن فارم بھرنے کی مکمل سہولت (FPSC, SPSC, STS, NTS)۔ اصل شناختی کارڈ اور اسناد ساتھ لائیں۔",
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
        answer: "Please bring your original CNIC, educational certificates/degrees, experience letters (if applicable), passport photo, and an active mobile number that can receive SMS verification codes.",
      },
      {
        question: "Do you help resize photos and documents for portals?",
        answer: "Yes, most portals require files to be under 20KB or 50KB in specific pixel ratios. We scan, crop, and compress your documents to meet the exact portal requirements without loss of clarity.",
      },
    ],
  },
  "cv-preparation": {
    heading: (location) => `CV Preparation & Formatting in ${location}`,
    title: (businessName) => `Professional CV Preparation Akhtar Colony Karachi | ${businessName}`,
    description: (location, businessName) =>
      `CV preparation, resume formatting, and modern template design at ${businessName} in ${location}. Clean, job-ready CVs printed and shared via WhatsApp.`,
    intro:
      "Create a persuasive, well-structured CV tailored to your target job role. Available in print and digital PDF formats.",
    commonRequests: [
      "New CV creation for fresh graduates and experienced professionals",
      "Updating existing CV with new job history and contact info",
      "Formatting CVs for Gulf and overseas job applications",
    ],
    keywords: ["cv preparation karachi", "resume formatting akhtar colony", "cv printing karachi"],
  },
  "fbr-registration-assistance": {
    heading: (location) => `FBR Filer & Tax Assistance in ${location}`,
    title: (businessName) => `FBR NTN & Filer Assistance Akhtar Colony Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Assistance with FBR NTN registration, Iris portal guidance, and tax filing documentation support at ${businessName} in ${location}.`,
    intro:
      "Get guided assistance with official FBR Iris portal procedures, NTN registration documents, and verification requirements.",
    commonRequests: [
      "FBR NTN registration assistance",
      "Iris portal login guidance",
      "Tax filing document preparation",
    ],
    keywords: ["fbr ntn registration akhtar colony", "filer assistance karachi", "iris portal help karachi"],
  },
  "agreements-document-preparation": {
    heading: (location) => `Rental & Sale Agreements on Stamp Paper in ${location}`,
    title: (businessName) => `Rent Agreement & Stamp Paper Typing Akhtar Colony Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Residential rent agreements (Kirayanama), commercial shop agreements, vehicle sale deeds, affidavits (Bayan-e-Halfi), and legal document typing on stamp paper at ${businessName} in ${location}.`,
    intro:
      "Draft standard residential and commercial tenancy agreements, vehicle sale deeds, and general legal documentation with proper formatting and page margins suitable for legal stamp paper.",
    commonRequests: [
      "House, flat, and shop rental agreements (Kirayanama) in Urdu or English",
      "Car and motorcycle sale/purchase agreement typing",
      "Affidavits, undertakings, and Bayan-e-Halfi drafting",
      "Direct printing on official stamp paper with correct margins",
    ],
    urduNote: "کرایہ نامہ (رہائشی و کمرشل)، گاڑی اور موٹرسائیکل خرید و فروخت کا اقرار نامہ، اور بیان حلفی اسٹامپ پیپر پر ٹائپ کروانے کی سہولت۔",
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
        question: "What information is needed to draft a residential rent agreement (Kirayanama)?",
        answer: "You will need the CNIC copies of the landlord, tenant, and two witnesses, property address, monthly rent amount, security deposit figure, and tenancy duration (usually 11 months).",
      },
      {
        question: "Can you print directly on legal stamp paper?",
        answer: "Yes, our printers are configured for legal and stamp paper dimensions with exact top margins so the text aligns perfectly below the government revenue header.",
      },
    ],
  },
  "general-biometric-esahulat": {
    heading: (location) => `NADRA e-Sahulat Biometric Verifications in ${location}`,
    title: (businessName) => `NADRA e-Sahulat & Biometric Center Akhtar Colony Karachi | ${businessName}`,
    description: (location, businessName) =>
      `NADRA e-Sahulat biometric verification center in ${location}. General biometric, FBR Sales Tax biometric, Pakistan Single Window (PSW), and Vehicle / ETO biometric transfer at ${businessName}.`,
    intro:
      "We operate an authorized NADRA e-Sahulat biometric station assisting residents of Akhtar Colony, DHA, and nearby areas with electronic identity verification for vehicle transfers, FBR registrations, and trade portals.",
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
    urduNote: "نادرا ای سہولت بائیو میٹرک: گاڑی ٹرانسفر، FBR سیلز ٹیکس، اور PSW بائیو میٹرک دستیاب ہے۔ برائے مہربانی اصل شناختی کارڈ اور رجسٹرڈ موبائل ساتھ لائیں۔",
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
        answer: "The buyer or seller whose biometric is due must visit in person with their original CNIC (or Smart Card), registered mobile number, and vehicle registration book/card details.",
      },
      {
        question: "How long does a NADRA biometric verification take?",
        answer: "Once connected to the NADRA server, the fingerprint scan takes less than 2 minutes. We provide immediate verification confirmation on the spot.",
      },
      {
        question: "Do you handle FBR Sales Tax and PSW biometrics?",
        answer: "Yes, both FBR Sales Tax biometric verification (required within 30 days of registration) and Pakistan Single Window (PSW) subscription biometrics are fully supported at our counter.",
      },
    ],
  },
  "fbr-sales-tax-biometric": {
    heading: (location) => `FBR Sales Tax Biometric Verification in ${location}`,
    title: (businessName) => `FBR Sales Tax Biometric Verification Akhtar Colony Karachi | ${businessName}`,
    description: (location, businessName) =>
      `FBR Sales Tax biometric verification support at ${businessName} in ${location}. Complete your mandatory 30-day post-registration biometric verification at our NADRA e-Sahulat counter.`,
    intro:
      "Under FBR rules, businesses and individuals registered for Sales Tax via Iris must complete biometric verification within 30 days at an authorized NADRA e-Sahulat franchise.",
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
      url: "https://www.fbr.gov.pk/categ/check-active-taxpayer/51149/50848/101152",
    },
    urduNote: "FBR سیلز ٹیکس بائیو میٹرک: رجسٹریشن کے بعد 30 دن کے اندر نادرا ای سہولت سے تصدیق کروانا لازمی ہے۔ اصل شناختی کارڈ ساتھ لائیں۔",
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
    title: (businessName) => `PSW Pakistan Single Window Biometric Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Pakistan Single Window (PSW) subscription and renewal biometric verification at ${businessName} in ${location}. Fast e-Sahulat counter verification.`,
    intro:
      "Complete the final subscription step for Pakistan Single Window (PSW) with verified biometric authentication via our NADRA e-Sahulat terminal.",
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
    title: (businessName) => `Vehicle Transfer Biometric Verification Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Car and motorcycle transfer biometric verification for buyer and seller at ${businessName} in ${location}. Authorized NADRA e-Sahulat system verification.`,
    intro:
      "Electronic biometric verification for vehicle ownership transfer in Sindh and Punjab. Buyer or seller visits with original CNIC and registration information.",
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
    urduNote: "گاڑی اور بائیک ٹرانسفر بائیو میٹرک: خریدار یا فروخت کنندہ کا اصل شناختی کارڈ اور گاڑی کی تفصیلات لے کر تشریف لائیں۔",
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
    heading: (location) => `Cash Deposit, Withdrawal & Money Transfer in ${location}`,
    title: (businessName) => `Cash Deposit, Withdrawal & Money Transfer Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Supported cash deposits, cash withdrawals, utility bill payments, and domestic money transfers at ${businessName} in ${location}. Instant printed receipts.`,
    intro:
      "Reliable counter service for supported domestic money transfers, cash deposits, and withdrawals. Complete your transactions securely with instantaneous verification and receipts.",
    commonRequests: [
      "Domestic money transfer across Pakistan",
      "Supported mobile wallet and cash deposit assistance",
      "Electricity, gas, water, and internet utility bill payments",
      "Instant computerized receipt for every transaction",
    ],
    urduNote: "کیش ڈپازٹ، رقم کی منتقلی اور تمام یوٹیلیٹی بلز (بجلی، گیس، پانی، انٹرنیٹ) جمع کروانے کی تیز ترین سہولت۔",
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
        answer: "Yes, we accept electricity (K-Electric), SSGC gas, KWSB water, PTCL, and internet bills with instant confirmation stamp and receipts.",
      },
    ],
  },
  "railway-airline-bus-tickets": {
    heading: (location) => `Railway, Bus & Airline Ticket Booking in ${location}`,
    title: (businessName) => `Pakistan Railway, Bus & Airline Ticket Booking Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Pakistan Railway train tickets (Green Line, Tezgam, Karakoram, Awam Express), intercity bus tickets (Daewoo, Faisal Movers), and airline ticket booking at ${businessName} in ${location}.`,
    intro:
      "Find the best travel schedules, live seat availability, and confirmed ticket booking for Pakistan Railway and leading luxury intercity bus services. Get your confirmed e-ticket printed instantly.",
    commonRequests: [
      "Pakistan Railway ticket booking (AC Sleeper, AC Business, AC Standard, Economy)",
      "Intercity luxury bus booking (Faisal Movers, Daewoo Express, Kainat Travels)",
      "Domestic flight ticket inquiries and e-ticket printouts",
      "Live schedule, train timing, and fare verification",
    ],
    urduNote: "پاکستان ریلویز، فیصل موورز، ڈائیوو ایکسپریس کے تصدیق شدہ ٹکٹ اور ای ٹکٹ پرنٹ کی فوری سہولت۔",
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
        answer: "Please provide the passenger full name, CNIC number, mobile number, travel date, departure station, destination station, and preferred class (AC Business, AC Standard, Economy).",
      },
      {
        question: "Can you check train seat availability before booking?",
        answer: "Yes, we can check real-time seat availability and ticket fares for any train route across Pakistan.",
      },
    ],
  },
  "stationery-mobile-accessories": {
    heading: (location) => `Stationery & Mobile Accessories in ${location}`,
    title: (businessName) => `Stationery & Mobile Accessories Shop Akhtar Colony | ${businessName}`,
    description: (location, businessName) =>
      `Everyday office and school stationery, files, registers, pens, paper, plus high-speed mobile chargers, Type-C cables, handsfree, and phone accessories at ${businessName} in ${location}.`,
    intro:
      "Pick up school and office essentials along with reliable mobile phone charging cables, fast power adapters, and audio accessories at fair neighborhood prices.",
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
    title: (businessName) => `Windows Setup & Laptop Software Support Akhtar Colony | ${businessName}`,
    description: (location, businessName) =>
      `Clean Windows 10/11 installation, hardware driver updates, MS Office setup, and basic laptop software troubleshooting at ${businessName} in ${location}.`,
    intro:
      "Get prompt, practical help resolving slow laptop performance, operating system corruption, missing Wi-Fi/audio drivers, and essential software installations.",
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
    heading: (location) => `Website Development, Full-Stack & Local SEO Services in ${location}`,
    title: (businessName) => `Website Development & Local SEO Services Karachi | ${businessName}`,
    description: (location, businessName) =>
      `Modern business websites, full-stack Next.js web applications, Google Business Profile ranking, and local SEO services by ${businessName} in ${location}. Get more local and international clients.`,
    intro:
      "Build a high-performance, mobile-optimized website for your shop, clinic, trading firm, or agency. We specialize in fast web development and local SEO that puts your business at the top of Google Search and Google Maps.",
    commonRequests: [
      "Responsive business websites with WhatsApp ordering and inquiry forms",
      "Full-stack Next.js and Supabase web applications with secure admin portals",
      "Google Maps and Google Business Profile verification and ranking optimization",
      "Technical SEO, fast page speed, and schema markup integration",
    ],
    urduNote: "اپنی دکان یا کاروبار کے لیے جدید ویب سائٹ اور گوگل پر ٹاپ رینکنگ (SEO) حاصل کرنے کے لیے رابطہ کریں۔",
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
        answer: "A standard business website with 4 to 8 pages and WhatsApp inquiry integration is typically delivered in 5 to 7 business days.",
      },
      {
        question: "Will my website rank on Google for local searches?",
        answer: "Yes, every website we build includes structured Schema.org markup, localized keywords, mobile optimization, and fast loading speeds to rank high for local customer searches.",
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
  const intro = override?.intro || service.detailed_description || service.short_description;

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
    intro,
    commonRequests: override?.commonRequests || [],
    location,
    officialContext: override?.officialContext || null,
    isBiometric: category.slug === "biometric",
    canonicalPath: `/services/${category.slug}/${service.slug}`,
    urduNote: override?.urduNote || null,
    keywords: override?.keywords || defaultKeywords,
    faqs: override?.faqs || [],
  };
}
