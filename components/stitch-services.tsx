"use client";

import Link from "next/link";
import {
  Printer,
  Copy,
  Palette,
  BookOpen,
  Layers,
  Camera,
  Briefcase,
  Fingerprint,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import type { Service, ServiceCategory } from "@/lib/types";

interface StitchServicesProps {
  onSelectService?: (serviceName: string) => void;
  services?: Service[];
  categories?: ServiceCategory[];
}

interface PrimaryService {
  id: string;
  title: string;
  shortDesc: string;
  url: string;
  icon: typeof Printer;
  isPrimaryFeatured?: boolean;
  badge: string;
  whatsappMessage: string;
  urduTip: string;
}

const PRIMARY_SERVICES: PrimaryService[] = [
  {
    id: "printing",
    title: "Printing Services",
    shortDesc:
      "High-speed black & white and color laser printing for documents, assignments, office files, and reports. Send PDFs via WhatsApp for zero-wait pickup.",
    url: "/printing",
    icon: Printer,
    isPrimaryFeatured: true,
    badge: "Core Service • Fast Laser",
    whatsappMessage: "Hello Yaqoob Enterprises, I want document printing. Here are my details:",
    urduTip: "ہائی اسپیڈ بلیک اینڈ وائٹ و کلر لیزر پرنٹنگ",
  },
  {
    id: "photocopying",
    title: "Photocopying Services",
    shortDesc:
      "Crisp single and bulk black & white and color photocopying for documents, notes, books, and IDs. Sharp contrast on standard 75/80 GSM paper.",
    url: "/photocopying",
    icon: Copy,
    isPrimaryFeatured: true,
    badge: "Core Service • Bulk Ready",
    whatsappMessage: "Hello Yaqoob Enterprises, I need photocopying services. Details:",
    urduTip: "صاف اور معیاری فوٹو کاپی برائے اسکول، دفاتر و رہائشی",
  },
  {
    id: "color-printing",
    title: "Color Printing",
    shortDesc:
      "Vibrant full-color laser printing and color photocopy for presentation slides, certificates, project covers, and graphical documents.",
    url: "/color-printing",
    icon: Palette,
    badge: "High Resolution",
    whatsappMessage: "Hello Yaqoob Enterprises, I need color printing. My file details:",
    urduTip: "پروجیکٹس اور سرٹیفکیٹس کے لیے عمدہ کلر پرنٹ",
  },
  {
    id: "notes-printing",
    title: "Notes Printing",
    shortDesc:
      "Student handouts, school, college, and university syllabus notes and assignment printing. Single or double-sided with neat stapling.",
    url: "/notes-printing",
    icon: BookOpen,
    badge: "Students & Institutes",
    whatsappMessage: "Hello Yaqoob Enterprises, I want student notes printed. Pages and details:",
    urduTip: "اسکول، کالج و یونیورسٹی نوٹس و اسائنمنٹس",
  },
  {
    id: "bulk-printing",
    title: "Bulk Printing",
    shortDesc:
      "Large-volume document printing and bulk copying for offices, schools, colleges, and organizations. Contact us ahead for scheduled completion.",
    url: "/bulk-printing",
    icon: Layers,
    badge: "Volume Orders",
    whatsappMessage: "Hello Yaqoob Enterprises, I need a bulk printing / photocopy quote:",
    urduTip: "بڑے آرڈرز کے لیے پیشگی واٹس ایپ رابطہ کریں",
  },
  {
    id: "photo-printing",
    title: "Photo Printing & Passport Photos",
    shortDesc:
      "Urgent passport-size photos with white or blue background for CNIC, passports, visas, licenses, and admissions. Ready in 5 minutes.",
    url: "/photo-printing",
    icon: Camera,
    badge: "Ready in 5 Mins",
    whatsappMessage: "Hello Yaqoob Enterprises, I need passport photos / photo printing:",
    urduTip: "پاسپورٹ سائز تصاویر 5 منٹ میں تیار (سفید و نیلا بیک گراؤنڈ)",
  },
  {
    id: "office-printing",
    title: "Office Printing",
    shortDesc:
      "Corporate documentation, legal agreements, official forms, proposals, meeting handouts, and institutional paperwork for local businesses.",
    url: "/office-printing",
    icon: Briefcase,
    badge: "Commercial / Business",
    whatsappMessage: "Hello Yaqoob Enterprises, I have an office printing requirement:",
    urduTip: "دفتری دستاویزات، ایگریمنٹس اور فارمز پرنٹنگ",
  },
  {
    id: "nadra-esahulat",
    title: "NADRA e-Sahulat & Biometrics",
    shortDesc:
      "Authorized local biometric verification for General verification, Vehicle / ETO transfers, FBR Sales Tax, and Pakistan Single Window (PSW).",
    url: "/nadra-esahulat",
    icon: Fingerprint,
    badge: "Authorized Franchise",
    whatsappMessage: "Hello Yaqoob Enterprises, I need NADRA biometric verification. My case is:",
    urduTip: "بائیومیٹرک تصدیق (گاڑی ٹرانسفر، ایف بی آر، پی ایس ڈبلیو)",
  },
];

export function StitchServices({}: StitchServicesProps) {
  const whatsappUrl = (msg: string) =>
    `https://wa.me/923492568864?text=${encodeURIComponent(msg)}`;

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
              <span>Primary Services · پرائمری سہولیات</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Printing, Photocopying &amp; Biometric Center
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
              Everyday walk-in and online document services in Sector B, Akhtar Colony, Karachi. Select any service to explore options, paper specifications, and requirements.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-900 font-bold text-xs sm:text-sm shadow-sm transition hover:bg-slate-50"
            >
              <span>All Services Directory</span>
              <ArrowRight className="w-4 h-4 text-[#0E7490]" />
            </Link>
          </div>
        </div>

        {/* 1. HERO SERVICES: Printing and Photocopying (Strongest Visual Categories) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {PRIMARY_SERVICES.filter((s) => s.isPrimaryFeatured).map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.id}
                id={`featured-card-${service.id}`}
                className="relative bg-white border-2 border-[#0E7490]/30 hover:border-[#0E7490] rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-200 group flex flex-col justify-between"
              >
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 bg-[#0E7490]/10 text-[#0E7490] rounded-full border border-[#0E7490]/20">
                    {service.badge}
                  </span>
                </div>

                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#0E7490]/10 text-[#0E7490] group-hover:bg-[#0E7490] group-hover:text-white transition-colors flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#0E7490] transition-colors">
                    <Link href={service.url}>{service.title}</Link>
                  </h3>

                  <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  <div className="mt-3 text-xs text-slate-500 font-medium flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <span className="text-[#0E7490] font-bold">●</span>
                    <span>{service.urduTip}</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href={service.url}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-[#0E7490] hover:underline"
                  >
                    <span>Learn More &amp; Rates</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href={whatsappUrl(service.whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* 2. OTHER PRIMARY SERVICES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {PRIMARY_SERVICES.filter((s) => !s.isPrimaryFeatured).map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.id}
                id={`service-card-${service.id}`}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 text-[#0E7490] group-hover:bg-slate-900 group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0E7490] transition-colors">
                    <Link href={service.url}>{service.title}</Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  <div className="mt-2.5 text-[11px] text-slate-500 font-medium bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                    {service.urduTip}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={service.url}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 group-hover:text-[#0E7490] hover:underline"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href={whatsappUrl(service.whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                  >
                    <MessageCircle className="w-3 h-3 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* 3. SECONDARY SERVICES DISCOVERY BANNER */}
        <div className="mt-8 sm:mt-12 bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Also Available at our Counter
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              Online Job Forms • Typing &amp; CVs • Rent Agreements • Bus/Train Tickets • Stationery
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Government portals, legal agreements on stamp paper, document scanning, utility bills, and basic stationery accessories.
            </p>
          </div>
          <Link
            href="/services"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition shadow-sm"
          >
            <span>Browse All Services</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}
