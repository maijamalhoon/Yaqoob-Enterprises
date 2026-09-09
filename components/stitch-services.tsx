"use client";

import Link from "next/link";
import {
  Fingerprint,
  Printer,
  Camera,
  FileText,
  PenTool,
  Scroll,
  Banknote,
  Ticket,
  ShoppingBag,
  Globe,
  ArrowRight,
} from "lucide-react";

import type { Service, ServiceCategory } from "@/lib/types";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  categoryTag: string;
  badge: string;
  iconName: string;
  url: string;
  urduTip?: string;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "nadra-biometric",
    title: "NADRA e-Sahulat Biometric Verifications",
    description: "General biometric, FBR Sales Tax, PSW and Vehicle / ETO biometric verification assistance.",
    categoryTag: "Biometric & e-Sahulat",
    badge: "● Instant verify",
    iconName: "fingerprint",
    url: "/services",
    urduTip: "اصل شناختی کارڈ اور موبائل ساتھ لائیں",
  },
  {
    id: "printing-scanning",
    title: "Printing, Photocopy & Document Scanning",
    description: "Colour and black-and-white printing, photocopying and document scanning for everyday requirements.",
    categoryTag: "Print, Copy & Photos",
    badge: "High-speed laser",
    iconName: "printer",
    url: "/services",
    urduTip: "واٹس ایپ پر فائل پہلے بھیجیں",
  },
  {
    id: "passport-photos",
    title: "Passport-Size Photos",
    description: "Standard and urgent passport-size photo preparation with crisp white or blue background.",
    categoryTag: "Print, Copy & Photos",
    badge: "5 Min Delivery",
    iconName: "camera",
    url: "/services",
    urduTip: "سفید و نیلا بیک گراؤنڈ 5 منٹ میں تیار",
  },
  {
    id: "online-jobs-forms",
    title: "Online Jobs, Forms & Applications",
    description: "Online job applications, admissions, registrations and other web-based forms and submissions.",
    categoryTag: "Typing & Online Forms",
    badge: "Error-free filing",
    iconName: "file-text",
    url: "/services",
    urduTip: "FPSC, SPSC, STS ملازمت و داخلہ فارمز",
  },
  {
    id: "typing-cv",
    title: "Urdu & English Typing & CV Preparation",
    description: "Urdu and English typing plus clean CV preparation for jobs, applications and formal documents.",
    categoryTag: "Typing, CV & Online Forms",
    badge: "ATS-Friendly",
    iconName: "pen-tool",
    url: "/services",
    urduTip: "انگلش و اردو ٹائپنگ اور پروفیشنل سی وی",
  },
  {
    id: "agreements-documents",
    title: "Agreements & Document Preparation",
    description: "Urdu and English sale, rent and other document preparation assistance formatted for legal validity.",
    categoryTag: "Agreements & Documents",
    badge: "Rent & Sale",
    iconName: "scroll",
    url: "/services",
    urduTip: "کرایہ نامہ، اقرار نامہ اور اسٹامپ پیپر",
  },
  {
    id: "cash-transfer",
    title: "Cash Deposit, Withdrawal & Money Transfer",
    description: "Supported cash deposit, withdrawal and domestic transfer services safely executed on spot.",
    categoryTag: "Payments & Transfer",
    badge: "● Fast Receipt",
    iconName: "banknote",
    url: "/services",
    urduTip: "کیش ڈپازٹ، ٹرانسفر اور یوٹیلیٹی بلز",
  },
  {
    id: "ticket-booking",
    title: "Railway, Airline & Bus Tickets",
    description: "Search and booking assistance for supported routes and operators with e-ticket printouts.",
    categoryTag: "Tickets & Booking",
    badge: "All Major Routes",
    iconName: "ticket",
    url: "/services",
    urduTip: "پاکستان ریلوے اور فیصل موورز ٹکٹ",
  },
  {
    id: "stationery-accessories",
    title: "Stationery & Mobile Accessories",
    description: "Confirm availability on WhatsApp, then collect or request eligible local delivery.",
    categoryTag: "Stationery & Accessories",
    badge: "In-Stock Check",
    iconName: "shopping-bag",
    url: "/services",
    urduTip: "اسٹیشنری، موبائل چارجر و کیبلز",
  },
  {
    id: "web-dev-seo",
    title: "Website Development, Full-Stack & SEO Services",
    description: "Business websites, full-stack development, redesign, maintenance and practical SEO support.",
    categoryTag: "Web Development & SEO",
    badge: "Digital Growth",
    iconName: "globe",
    url: "/services",
    urduTip: "بزنس ویب سائٹ اور لوکل SEO",
  },
];

interface StitchServicesProps {
  onSelectService?: (serviceName: string) => void;
  services?: Service[];
  categories?: ServiceCategory[];
}

function resolveIconForService(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("biometric") || t.includes("nadra") || t.includes("sahulat")) return "fingerprint";
  if (t.includes("print") || t.includes("scan") || t.includes("copy") || t.includes("photocopy")) return "printer";
  if (t.includes("photo") || t.includes("passport")) return "camera";
  if (t.includes("form") || t.includes("job") || t.includes("application")) return "file-text";
  if (t.includes("typing") || t.includes("cv") || t.includes("resume")) return "pen-tool";
  if (t.includes("agreement") || t.includes("stamp") || t.includes("legal") || t.includes("rent")) return "scroll";
  if (t.includes("money") || t.includes("cash") || t.includes("transfer") || t.includes("bank") || t.includes("bill")) return "banknote";
  if (t.includes("ticket") || t.includes("train") || t.includes("air") || t.includes("flight") || t.includes("bus")) return "ticket";
  if (t.includes("stationery") || t.includes("mobile") || t.includes("accessor")) return "shopping-bag";
  return "globe";
}

function resolveUrduTip(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("biometric") || t.includes("nadra")) return "اصل شناختی کارڈ اور رجسٹرڈ موبائل ساتھ لائیں";
  if (t.includes("print") || t.includes("scan") || t.includes("photocopy")) return "فائل واٹس ایپ پر پہلے بھیج سکتے ہیں";
  if (t.includes("photo") || t.includes("passport")) return "سفید و نیلا بیک گراؤنڈ 5 منٹ میں تیار";
  if (t.includes("form") || t.includes("job") || t.includes("application")) return "سرکاری و نجی آن لائن نوکری فارم بھریں";
  if (t.includes("typing") || t.includes("cv") || t.includes("resume")) return "اردو انگلش ٹائپنگ اور پروفیشنل سی وی";
  if (t.includes("agreement") || t.includes("stamp") || t.includes("rent")) return "کرایہ نامہ اور قانونی دستاویزات اسٹامپ پیپر پر";
  if (t.includes("cash") || t.includes("transfer") || t.includes("bill")) return "کیش ڈپازٹ، رقم کی منتقلی اور تمام بلز";
  if (t.includes("ticket") || t.includes("railway") || t.includes("train") || t.includes("bus")) return "پاکستان ریلوے اور بسوں کے کنفرم ای ٹکٹ";
  if (t.includes("stationery") || t.includes("mobile")) return "روزمرہ دفتری و اسکول اسٹیشنری اور موبائل کیبلز";
  if (t.includes("website") || t.includes("seo") || t.includes("development")) return "دکان و کاروبار کے لیے ویب سائٹ اور لوکل SEO";
  return "دکان کاؤنٹر پر دستیاب";
}

function renderServiceIcon(name: string) {
  const iconProps = { className: "w-5 h-5 sm:w-6 sm:h-6" };
  switch (name) {
    case "fingerprint":
      return <Fingerprint {...iconProps} />;
    case "printer":
      return <Printer {...iconProps} />;
    case "camera":
      return <Camera {...iconProps} />;
    case "file-text":
      return <FileText {...iconProps} />;
    case "pen-tool":
      return <PenTool {...iconProps} />;
    case "scroll":
      return <Scroll {...iconProps} />;
    case "banknote":
      return <Banknote {...iconProps} />;
    case "ticket":
      return <Ticket {...iconProps} />;
    case "shopping-bag":
      return <ShoppingBag {...iconProps} />;
    case "globe":
    default:
      return <Globe {...iconProps} />;
  }
}

export function StitchServices({ onSelectService, services, categories }: StitchServicesProps) {
  // Sort services: featured first, then display_order
  const displayServices: ServiceItem[] =
    services && services.length > 0
      ? [...services]
          .filter((s) => s.status !== "hidden")
          .sort((a, b) => {
            if (a.is_featured && !b.is_featured) return -1;
            if (!a.is_featured && b.is_featured) return 1;
            return a.display_order - b.display_order;
          })
          .map((s) => {
            const cat = categories?.find((c) => c.id === s.category_id);
            const serviceUrl = cat ? `/services/${cat.slug}/${s.slug}` : "/services";
            return {
              id: s.id,
              title: s.title,
              description: s.short_description || s.detailed_description || "Available at shop counter & online inquiry.",
              categoryTag: cat?.title || "Counter Service",
              badge: s.appointment_required
                ? "Appointment Only"
                : s.status === "coming_soon"
                ? "Coming Soon"
                : s.is_featured
                ? "★ Featured Service"
                : s.whatsapp_request
                ? "WhatsApp Pre-Check"
                : "● Instant Service",
              iconName: resolveIconForService(s.title),
              url: serviceUrl,
              urduTip: resolveUrduTip(s.title),
            };
          })
      : DEFAULT_SERVICES;

  const handleServiceClick = (serviceTitle: string) => {
    if (typeof window !== "undefined") {
      const selectElement = document.getElementById("userService") as HTMLSelectElement | null;
      if (selectElement) {
        let found = false;
        for (let i = 0; i < selectElement.options.length; i++) {
          if (selectElement.options[i].value.toLowerCase().includes(serviceTitle.toLowerCase().slice(0, 10))) {
            selectElement.selectedIndex = i;
            found = true;
            break;
          }
        }
        if (!found) {
          selectElement.value = serviceTitle;
        }
      }
      const quickReq = document.getElementById("quick-request");
      if (quickReq) {
        quickReq.scrollIntoView({ behavior: "smooth" });
        const msgField = document.getElementById("userMessage");
        if (msgField) msgField.focus();
      }
    }
    if (onSelectService) {
      onSelectService(serviceTitle);
    }
  };

  return (
    <section
      id="services"
      className="py-12 sm:py-20 bg-slate-50/70 border-b border-slate-200"
      data-purpose="services"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[#0E7490] font-bold text-xs uppercase tracking-wider mb-2">
              <span className="w-4 h-0.5 bg-[#0E7490]"></span>
              <span>Our Services · تمام سہولیات</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What can we help with?
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
              NADRA e-Sahulat biometrics, document printing, passport photos, online forms, rent agreements, ticketing, and web development in Akhtar Colony, Karachi.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-900 font-bold text-xs sm:text-sm shadow-sm transition hover:bg-slate-50"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-4 h-4 text-[#0E7490]" />
            </Link>
          </div>
        </div>

        {/* Services List (Single column mobile, 2 cols on md) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5" id="services-container">
          {displayServices.map((service) => (
            <article
              id={`service-card-${service.id}`}
              key={service.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 hover:shadow-md hover:border-slate-300 transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-3">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-[#0E7490] group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  {renderServiceIcon(service.iconName)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#0E7490] transition-colors">
                      <Link href={service.url}>
                        {service.title}
                      </Link>
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Urdu Tip Banner */}
                  {service.urduTip && (
                    <div className="mt-2 text-[11px] sm:text-xs text-slate-500 font-medium flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                      <span className="text-[#0E7490] font-bold">●</span>
                      <span>{service.urduTip}</span>
                    </div>
                  )}

                  <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                      {service.categoryTag}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        service.badge.includes("★")
                          ? "text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200"
                          : service.badge.includes("●")
                          ? "text-emerald-600 font-semibold"
                          : "text-slate-500 font-medium"
                      }`}
                    >
                      {service.badge}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                <Link
                  href={service.url}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0E7490] hover:underline"
                  aria-label={`See more about ${service.title}`}
                >
                  <span>See more about service</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <button
                  type="button"
                  aria-label={`Send fast request for ${service.title}`}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleServiceClick(service.title);
                  }}
                >
                  Quick Inquire
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Section bottom banner CTA */}
        <div className="mt-10 sm:mt-14 bg-gradient-to-r from-[#0B192C] to-slate-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div>
            <h3 className="text-lg sm:text-xl font-bold">
              Looking for a specific government portal, ticket or document?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Browse our complete service catalog with live search, requirements lists, and direct WhatsApp consultations.
            </p>
          </div>
          <Link
            href="/services"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow"
          >
            <span>Browse All Services &amp; Portals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
