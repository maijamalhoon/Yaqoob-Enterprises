"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  X,
  ArrowRight,
  ShieldCheck,
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

  // Track only settled, non-identifying search terms. The analytics endpoint already
  // honours Do Not Track / Global Privacy Control and excludes authenticated admins.
  useEffect(() => {
    const query = searchQuery.trim().replace(/\s+/g, " ").slice(0, 24);
    if (query.length < 2 || /@/.test(query) || /\d{7,}/.test(query)) return;

    const timeout = window.setTimeout(() => {
      void fetch("/api/analytics", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          eventName: "service_view",
          pagePath: "/__analytics/search?q=" + encodeURIComponent(query),
        }),
        keepalive: true,
      }).catch(() => undefined);
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [searchQuery]);

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

      // Search query
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
  }, [services, searchQuery, categoryMap]);

  function getServiceUrl(service: Service) {
    const cat = categoryMap.get(service.category_id);
    const catSlug = cat?.slug || "general";
    return `/services/${catSlug}/${service.slug}`;
  }

  function getStatusBadge(status: string) {
    if (status === "active") {
      return null;
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
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl">
            Services
          </h1>

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
                placeholder="Search services"
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
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">

        {/* Empty state if no match */}
        {filteredServices.length === 0 && (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-10 sm:p-16 text-center max-w-2xl mx-auto my-12">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {searchQuery
                ? <>No services match &ldquo;{searchQuery}&rdquo;</>
              : "No services are available right now"}
            </h3>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              Try another search or ask us about your request.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setSearchQuery("")}
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

        {/* Service directory */}
        <div className="service-directory-list">
          {filteredServices.map((service) => {
            const statusInfo = getStatusBadge(service.status);
            const IconComponent = getServiceIconComponent(service.title);
            const detailUrl = getServiceUrl(service);

            return (
              <article
                key={service.id}
                id={`service-card-${service.slug}`}
                className="service-directory-item"
              >
                <span className="service-directory-item__icon" aria-hidden="true"><IconComponent size={20} /></span>
                <div className="service-directory-item__content">
                  <h2>{service.title}</h2>
                  {statusInfo && <span className={`status status--${service.status}`}>{statusInfo.label}</span>}
                  <Link href={detailUrl} className="service-directory-item__action">
                    Details <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Assisted Request Help Box */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-7">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Need help with another service?
              </h2>
            </div>

            <div className="flex shrink-0 items-center gap-3 w-full sm:w-auto">
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

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
