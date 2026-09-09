"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  X,
  ArrowRight,
  ShieldCheck,
  Store,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  FileCheck2,
  FileText,
  Printer,
  Ticket,
  Fingerprint,
  PenTool,
  Scroll,
  Banknote,
  Camera,
} from "lucide-react";
import type { BusinessSettings, Service, ServiceCategory } from "@/lib/types";
import { whatsappUrl } from "@/lib/data";

interface ServicesCatalogViewProps {
  categories: ServiceCategory[];
  services: Service[];
  settings: BusinessSettings;
  statusText: string;
}

export function ServicesCatalogView({
  categories,
  services,
  settings,
  statusText,
}: ServicesCatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedMode, setSelectedMode] = useState<string>("all");

  // Map each service to its category for URL generation
  const categoryMap = useMemo(() => {
    const map = new Map<string, ServiceCategory>();
    for (const cat of categories) {
      map.set(cat.id, cat);
    }
    return map;
  }, [categories]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      // 1. Status check: ignore hidden
      if (service.status === "hidden") return false;

      // 2. Category check
      if (selectedCategoryId !== "all" && service.category_id !== selectedCategoryId) {
        return false;
      }

      // 3. Delivery / Fulfillment Mode
      if (selectedMode === "shop" && !service.available_at_shop) return false;
      if (selectedMode === "whatsapp" && !service.whatsapp_request) return false;
      if (selectedMode === "doorstep" && !service.doorstep_available) return false;
      if (selectedMode === "delivery" && !service.delivery_available) return false;

      // 4. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const cat = categoryMap.get(service.category_id);
        const matchTitle = service.title.toLowerCase().includes(query);
        const matchShortDesc = (service.short_description || "").toLowerCase().includes(query);
        const matchDetailDesc = (service.detailed_description || "").toLowerCase().includes(query);
        const matchReqs = (service.requirements || []).some((r) => r.toLowerCase().includes(query));
        const matchCat = (cat?.title || "").toLowerCase().includes(query);

        // Aliases / common search terms
        const aliases = [
          "nadra", "fbr", "psw", "eto", "police", "biometric", "passport", "photo",
          "ticket", "train", "flight", "airline", "bus", "railway", "print", "photocopy",
          "scan", "typing", "cv", "resume", "stamp", "affidavit", "rent", "agreement",
          "bill", "money", "cash", "admission", "job", "challan"
        ];
        const matchesAlias = aliases.some(
          (alias) => alias.includes(query) && (service.title.toLowerCase().includes(alias) || (service.short_description || "").toLowerCase().includes(alias))
        );

        return matchTitle || matchShortDesc || matchDetailDesc || matchReqs || matchCat || matchesAlias;
      }

      return true;
    });
  }, [services, selectedCategoryId, selectedMode, searchQuery, categoryMap]);

  function getServiceUrl(service: Service) {
    const cat = categoryMap.get(service.category_id);
    const catSlug = cat?.slug || "general";
    return `/services/${catSlug}/${service.slug}`;
  }

  function getServiceWhatsAppLink(service: Service) {
    const msg = `Hello ${settings.business_name}, I want to ask about "${service.title}". Please provide requirements and process details.`;
    return whatsappUrl(settings.whatsapp_e164, msg);
  }

  function getStatusBadge(status: string) {
    if (status === "active") {
      return {
        label: "Available",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      };
    }
    if (status === "appointment_only") {
      return {
        label: "Book First",
        className: "bg-amber-50 text-amber-700 border-amber-200/80",
      };
    }
    if (status === "coming_soon") {
      return {
        label: "Coming Soon",
        className: "bg-blue-50 text-blue-700 border-blue-200/80",
      };
    }
    return {
      label: "Check First",
      className: "bg-slate-100 text-slate-700 border-slate-200",
    };
  }

  function getServiceIconComponent(title: string) {
    const t = title.toLowerCase();
    if (t.includes("biometric") || t.includes("nadra") || t.includes("sahulat")) return Fingerprint;
    if (t.includes("print") || t.includes("scan") || t.includes("copy") || t.includes("photocopy")) return Printer;
    if (t.includes("photo") || t.includes("passport")) return Camera;
    if (t.includes("form") || t.includes("job") || t.includes("application")) return FileText;
    if (t.includes("typing") || t.includes("cv") || t.includes("resume")) return PenTool;
    if (t.includes("agreement") || t.includes("stamp") || t.includes("legal") || t.includes("rent")) return Scroll;
    if (t.includes("money") || t.includes("cash") || t.includes("transfer") || t.includes("bank") || t.includes("bill")) return Banknote;
    if (t.includes("ticket") || t.includes("train") || t.includes("air") || t.includes("flight") || t.includes("bus")) return Ticket;
    return FileCheck2;
  }

  return (
    <div className="w-full pb-20">
      {/* Hero Header Section */}
      <section className="bg-gradient-to-b from-slate-900 via-[#0B192C] to-slate-900 text-white pt-12 sm:pt-16 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-teal-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-teal-400 font-semibold">Services</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-semibold tracking-wide uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Complete Service Directory &amp; Verification Center</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl">
            What can we help with?
          </h1>

          <p className="mt-4 text-base sm:text-xl text-slate-300 max-w-3xl leading-relaxed">
            All major government portal verifications, documentation, ticketing, and everyday digital services in one place.
          </p>

          {/* Quick stats pills */}
          <div className="mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>NADRA e-Sahulat Verified</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-cyan-300 font-medium">
              <Store className="w-4 h-4 text-cyan-400" />
              <span>Counter in Akhtar Colony, Karachi</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-slate-300 font-medium">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{statusText || "Open Today · Walk-ins Welcome"}</span>
            </span>
          </div>

          {/* Search Box */}
          <div className="mt-8 sm:mt-10 max-w-3xl">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                id="services-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services (e.g., NADRA, FBR, Passport photo, Ticket, Rental agreement, CV, Printing)..."
                className="w-full bg-slate-800/95 border border-slate-700 text-white placeholder-slate-400 text-sm sm:text-base rounded-2xl pl-12 pr-11 py-3.5 sm:py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/80 focus:border-cyan-500 transition shadow-lg"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick search tags */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
              <span className="text-slate-500">Popular:</span>
              {["NADRA Biometric", "Passport Photos", "FBR Tax", "Railway Tickets", "Rental Agreement", "Urdu Typing", "Job Forms"].map(
                (tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSearchQuery(tag)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition"
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        {/* Filters Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={selectedCategoryId === "all"}
                onClick={() => setSelectedCategoryId("all")}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition ${
                  selectedCategoryId === "all"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All Categories ({services.filter((s) => s.status !== "hidden").length})
              </button>

              {categories.map((cat) => {
                const count = services.filter(
                  (s) => s.category_id === cat.id && s.status !== "hidden"
                ).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={selectedCategoryId === cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition ${
                      selectedCategoryId === cat.id
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {cat.title} ({count})
                  </button>
                );
              })}
            </div>

            {/* Mode / Fulfillment Filter */}
            <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Fulfillment:
              </span>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Methods</option>
                <option value="shop">At Shop Counter</option>
                <option value="whatsapp">WhatsApp Remote</option>
                <option value="doorstep">Doorstep / Home Visit</option>
                <option value="delivery">Local Delivery</option>
              </select>
            </div>
          </div>

          {/* Active filters & Results counter */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div>
              Showing <strong className="text-slate-900">{filteredServices.length}</strong> services
              {searchQuery && (
                <span>
                  {" "}matching &ldquo;<span className="text-cyan-700 font-semibold">{searchQuery}</span>&rdquo;
                </span>
              )}
            </div>

            {(searchQuery || selectedCategoryId !== "all" || selectedMode !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategoryId("all");
                  setSelectedMode("all");
                }}
                className="text-cyan-700 hover:text-cyan-900 font-semibold hover:underline"
              >
                Reset all filters
              </button>
            )}
          </div>
        </div>

        {/* Empty state if no match */}
        {filteredServices.length === 0 && (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-10 sm:p-16 text-center max-w-2xl mx-auto my-12">
            <div className="w-14 h-14 mx-auto bg-slate-200 rounded-2xl flex items-center justify-center text-slate-500 mb-4">
              <HelpCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              No matching service found for &ldquo;{searchQuery}&rdquo;
            </h3>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              We handle hundreds of specialized portals, forms, and custom government paperwork that may not be listed under this exact keyword.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategoryId("all");
                  setSelectedMode("all");
                }}
                className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition"
              >
                View all services
              </button>
              <a
                href={whatsappUrl(
                  settings.whatsapp_e164,
                  `Hello ${settings.business_name}, I am looking for assistance with: ${searchQuery}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-500 transition"
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredServices.map((service) => {
            const cat = categoryMap.get(service.category_id);
            const statusInfo = getStatusBadge(service.status);
            const IconComponent = getServiceIconComponent(service.title);
            const detailUrl = getServiceUrl(service);
            const waLink = getServiceWhatsAppLink(service);

            return (
              <article
                key={service.id}
                id={`service-card-${service.slug}`}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group relative"
              >
                <div>
                  {/* Card Header: Category badge + Status */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200/70">
                      {cat?.title || "Everyday Service"}
                    </span>

                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-800 group-hover:bg-[#0B192C] group-hover:text-teal-400 transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-cyan-800 transition-colors leading-snug">
                        <Link href={detailUrl} className="focus:outline-none">
                          {service.title}
                        </Link>
                      </h2>
                    </div>
                  </div>

                  {/* Short description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {service.short_description || service.detailed_description}
                  </p>

                  {/* Requirements Preview (if available) */}
                  {service.requirements && service.requirements.length > 0 && (
                    <div className="mb-4 bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Key Requirements:</span>
                      </div>
                      <ul className="text-xs text-slate-600 space-y-1">
                        {service.requirements.slice(0, 2).map((req, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 truncate">
                            <span className="text-slate-400">•</span>
                            <span className="truncate">{req}</span>
                          </li>
                        ))}
                        {service.requirements.length > 2 && (
                          <li className="text-[11px] text-cyan-700 font-semibold pt-0.5">
                            +{service.requirements.length - 2} more requirement{service.requirements.length - 2 > 1 ? "s" : ""}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Fulfillment Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-5 text-[11px] text-slate-500 font-medium">
                    {service.available_at_shop && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        <Store className="w-3 h-3 text-slate-500" /> Shop Counter
                      </span>
                    )}
                    {service.whatsapp_request && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                        WhatsApp Request
                      </span>
                    )}
                    {service.doorstep_available && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                        Doorstep Biometric
                      </span>
                    )}
                    {service.delivery_available && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-800">
                        <Truck className="w-3 h-3 text-purple-600" /> Rider Delivery
                      </span>
                    )}
                  </div>
                </div>

                {/* Explicit Click Actions: "See more about service" + WhatsApp */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={detailUrl}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 group-hover:text-cyan-700 hover:text-cyan-800 transition"
                    aria-label={`See more about ${service.title}`}
                  >
                    <span>See more about service</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-100 rounded-lg transition"
                    title="Inquire on WhatsApp"
                  >
                    <span>WhatsApp</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Categories Overview Pillar Showcase */}
        <section className="mt-16 sm:mt-24 pt-12 border-t border-slate-200">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
              Core Service Pillars
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Browse services by department
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Explore our full range of public services categorized by government, legal, ticketing, printing, and digital support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const catServices = services.filter(
                (s) => s.category_id === category.id && s.status !== "hidden"
              );
              return (
                <div
                  key={category.id}
                  className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      {category.title}
                    </h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      {catServices.length} {catServices.length === 1 ? "service" : "services"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  <ul className="space-y-2 mb-5">
                    {catServices.slice(0, 4).map((srv) => (
                      <li key={srv.id}>
                        <Link
                          href={`/services/${category.slug}/${srv.slug}`}
                          className="text-xs font-semibold text-slate-800 hover:text-cyan-700 flex items-center justify-between group/link"
                        >
                          <span className="truncate pr-2">• {srv.title}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover/link:text-cyan-700 group-hover/link:translate-x-0.5 transition shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/services/${category.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-800 hover:text-cyan-900 hover:underline"
                  >
                    <span>View all {category.title} services</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Assisted Request Help Box */}
        <section className="mt-16 bg-gradient-to-r from-[#0B192C] to-slate-900 rounded-3xl p-6 sm:p-10 text-white border border-slate-800 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-400">
                Custom Paperwork &amp; Portals
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Don&apos;t see the exact form, portal, or verification you need?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                We assist with specialized Sindh Government portals, university challans, job registries, embassy appointment booking, and urgent stamp papers. Send your requirements directly on WhatsApp or visit our shop counter in Akhtar Colony.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 w-full sm:w-auto">
              <a
                href={whatsappUrl(
                  settings.whatsapp_e164,
                  `Hello ${settings.business_name}, I need help with a custom service or portal inquiry.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition shadow-md"
              >
                <span>Chat on WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition"
              >
                <span>Guided Online Request</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
