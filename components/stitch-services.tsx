"use client";

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
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "nadra-biometric",
    title: "NADRA e-Sahulat Biometric Verifications",
    description: "General biometric, FBR Sales Tax, PSW and Vehicle / ETO biometric verification assistance.",
    categoryTag: "Biometric & e-Sahulat",
    badge: "● Instant verify",
    iconName: "fingerprint",
  },
  {
    id: "printing-scanning",
    title: "Printing, Photocopy & Document Scanning",
    description: "Colour and black-and-white printing, photocopying and document scanning for everyday requirements.",
    categoryTag: "Print, Copy & Photos",
    badge: "High-speed laser",
    iconName: "printer",
  },
  {
    id: "passport-photos",
    title: "Passport-Size Photos",
    description: "Standard and urgent passport-size photo preparation with crisp white or blue background.",
    categoryTag: "Print, Copy & Photos",
    badge: "5 Min Delivery",
    iconName: "camera",
  },
  {
    id: "online-jobs-forms",
    title: "Online Jobs, Forms & Applications",
    description: "Online job applications, admissions, registrations and other web-based forms and submissions.",
    categoryTag: "Typing & Online Forms",
    badge: "Error-free filing",
    iconName: "file-text",
  },
  {
    id: "typing-cv",
    title: "Urdu & English Typing & CV Preparation",
    description: "Urdu and English typing plus clean CV preparation for jobs, applications and formal documents.",
    categoryTag: "Typing, CV & Online Forms",
    badge: "ATS-Friendly",
    iconName: "pen-tool",
  },
  {
    id: "agreements-documents",
    title: "Agreements & Document Preparation",
    description: "Urdu and English sale, rent and other document preparation assistance formatted for legal validity.",
    categoryTag: "Agreements & Documents",
    badge: "Rent & Sale",
    iconName: "scroll",
  },
  {
    id: "cash-transfer",
    title: "Cash Deposit, Withdrawal & Money Transfer",
    description: "Supported cash deposit, withdrawal and domestic transfer services safely executed on spot.",
    categoryTag: "Payments & Transfer",
    badge: "● Fast Receipt",
    iconName: "banknote",
  },
  {
    id: "ticket-booking",
    title: "Railway, Airline & Bus Tickets",
    description: "Search and booking assistance for supported routes and operators with e-ticket printouts.",
    categoryTag: "Tickets & Booking",
    badge: "All Major Routes",
    iconName: "ticket",
  },
  {
    id: "stationery-accessories",
    title: "Stationery & Mobile Accessories",
    description: "Confirm availability on WhatsApp, then collect or request eligible local delivery.",
    categoryTag: "Stationery & Accessories",
    badge: "In-Stock Check",
    iconName: "shopping-bag",
  },
  {
    id: "web-dev-seo",
    title: "Website Development, Full-Stack & SEO Services",
    description: "Business websites, full-stack development, redesign, maintenance and practical SEO support.",
    categoryTag: "Web Development & SEO",
    badge: "Digital Growth",
    iconName: "globe",
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
  // Convert Supabase dynamic services if present, otherwise default
  const displayServices: ServiceItem[] =
    services && services.length > 0
      ? services
          .filter((s) => s.status !== "hidden")
          .map((s) => {
            const cat = categories?.find((c) => c.id === s.category_id);
            return {
              id: s.id,
              title: s.title,
              description: s.short_description || s.detailed_description || "Available at shop counter & online inquiry.",
              categoryTag: cat?.title || "Counter Service",
              badge: s.appointment_required
                ? "Appointment Only"
                : s.status === "coming_soon"
                ? "Coming Soon"
                : s.whatsapp_request
                ? "WhatsApp Pre-Check"
                : "● Instant Service",
              iconName: resolveIconForService(s.title),
            };
          })
      : DEFAULT_SERVICES;
  const handleServiceClick = (serviceTitle: string) => {
    if (typeof window !== "undefined") {
      const selectElement = document.getElementById("userService") as HTMLSelectElement | null;
      if (selectElement) {
        // Look for matching option or add if needed
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
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-[#0E7490] font-bold text-xs uppercase tracking-wider mb-2">
            <span className="w-4 h-0.5 bg-[#0E7490]"></span>
            <span>Services</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            What can we help with?
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
            All major government portal verifications, documentation, ticketing, and everyday digital services in one place.
          </p>
        </div>

        {/* Services List (Single column mobile, 2 cols on md) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5" id="services-container">
          {displayServices.map((service) => (
            <article
              id={`service-card-${service.id}`}
              key={service.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 hover:shadow-md hover:border-slate-300 transition-all duration-200 active:scale-[0.99] group flex items-start justify-between cursor-pointer"
              onClick={() => handleServiceClick(service.title)}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-[#0E7490] group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  {renderServiceIcon(service.iconName)}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#0E7490] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                      {service.categoryTag}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        service.badge.includes("●") ? "text-emerald-600" : "text-slate-500 font-medium"
                      }`}
                    >
                      {service.badge}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                aria-label={`Inquire about ${service.title}`}
                className="p-2 -mr-1 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all shrink-0 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  handleServiceClick(service.title);
                }}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
