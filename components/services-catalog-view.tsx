"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  X,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
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
      <section className="services-directory-hero bg-slate-900 text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-teal-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-teal-400 font-semibold">Services</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl">
            Services
          </h1>

          <p className="mt-2 text-base text-slate-300 max-w-3xl leading-relaxed">
            Printing, e-Sahulat and business services in Akhtar Colony, Karachi.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              Authorized e-Sahulat franchise
            </span>
            {statusText && <span>{statusText}</span>}
          </div>

          {/* Search Box */}
          <div className="mt-8 sm:mt-10 max-w-3xl">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                id="services-search-input"
                type="text"
                value={searchQuery}
                aria-label="Search services"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services..."
                className="w-full bg-slate-800/95 border border-slate-700 text-white placeholder-slate-400 text-sm sm:text-base rounded-xl pl-12 pr-14 py-3.5 sm:py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/80 focus:border-cyan-500 transition shadow-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Main Catalog Content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        {/* Filters Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Pills */}
            <div role="group" aria-label="Filter by category" className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              <button
                type="button"
                aria-pressed={selectedCategoryId === "all"}
                onClick={() => setSelectedCategoryId("all")}
                className={`min-h-11 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition ${
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
                    aria-pressed={selectedCategoryId === cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`min-h-11 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition ${
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
              <label htmlFor="service-mode-filter" className="text-xs font-bold text-slate-500">
                Available via
              </label>
              <select
                id="service-mode-filter"
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="min-h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All options</option>
                <option value="shop">At shop</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="doorstep">Home visit</option>
                <option value="delivery">Delivery</option>
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
                className="inline-flex min-h-11 items-center px-2 text-cyan-700 hover:text-cyan-900 font-semibold hover:underline"
              >
                Reset all filters
              </button>
            )}
          </div>
        </div>

        {/* Empty state if no match */}
        {filteredServices.length === 0 && (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-10 sm:p-16 text-center max-w-2xl mx-auto my-12">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {searchQuery
                ? <>No services match &ldquo;{searchQuery}&rdquo;</>
                : "No services match these filters"}
            </h3>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              Try another search or ask us about your request.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategoryId("all");
                  setSelectedMode("all");
                }}
                className="min-h-11 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition"
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
                className="min-h-11 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-500 transition"
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredServices.map((service) => {
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
                  <div className="flex items-center justify-end gap-2 mb-3.5">
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
                    <div className="min-w-0">
                      <h2 className="min-w-0 break-words text-base sm:text-lg font-bold text-slate-900 group-hover:text-cyan-800 transition-colors leading-snug">
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
                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Requirements</span>
                      </div>
                      <ul className="text-xs text-slate-600 space-y-1.5">
                        {service.requirements.slice(0, 2).map((req, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-snug">
                            <span className="text-emerald-700" aria-hidden="true">•</span>
                            <span className="min-w-0">{req}</span>
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

                  <p className="mb-4 text-xs text-slate-600">
                    {[service.available_at_shop && "At shop", service.whatsapp_request && "WhatsApp", service.doorstep_available && "Doorstep service", service.delivery_available && "Delivery"]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>

                {/* The title opens details; WhatsApp starts an inquiry. */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={detailUrl}
                    className="inline-flex min-h-11 items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 group-hover:text-cyan-700 hover:text-cyan-800 transition"
                    aria-label={`View details for ${service.title}`}
                  >
                    <span>Details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1 px-3 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                    title="Inquire on WhatsApp"
                  >
                    <span>WhatsApp</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <section className="mt-12 border-t border-slate-200 pt-8">
          <h2 className="mb-3 text-xl sm:text-2xl font-bold text-slate-900">
            Browse service categories
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {categories.map((category) => (
              <li key={category.id} className="border-b border-slate-200">
                <Link
                  href={`/services/${category.slug}`}
                  className="flex min-h-16 items-center justify-between gap-4 py-3 text-slate-900 hover:text-cyan-800"
                >
                  <span className="min-w-0">
                    <span className="block font-semibold">{category.title}</span>
                    {category.description && (
                      <span className="mt-0.5 block text-sm text-slate-600 line-clamp-1">
                        {category.description}
                      </span>
                    )}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Assisted Request Help Box */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-7">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Need help with another service?
              </h2>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                Tell us what you need. We’ll confirm availability and next steps.
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
                className="min-h-11 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition"
              >
                <span>Ask on WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/contact"
                className="min-h-11 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm border border-slate-300 transition"
              >
                <span>Contact and directions</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
