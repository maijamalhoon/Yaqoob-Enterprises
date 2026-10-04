"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { BusinessSettings, Service } from "@/lib/types";

interface StitchQuickRequestProps {
  settings: BusinessSettings;
  services?: Service[];
}

export const WHATSAPP_SERVICE_OPTIONS = [
  "Printing",
  "Photocopying",
  "Color Printing",
  "Notes Printing",
  "Bulk Printing",
  "Photo Printing",
  "NADRA / Biometric",
  "Other",
] as const;

export function StitchQuickRequest({ settings }: StitchQuickRequestProps) {
  const [userName, setUserName] = useState("");
  const [userService, setUserService] = useState<string>("Printing");
  const [userRequirement, setUserRequirement] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = (settings.whatsapp_e164 || "+923492568864").replace(/\+/g, "");

    // Track analytics event
    const payload = JSON.stringify({
      eventName: "whatsapp_click",
      pagePath: typeof window !== "undefined" ? window.location.pathname : "/",
    });
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
    } else if (typeof fetch !== "undefined") {
      void fetch("/api/analytics", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }

    // Exact requested message format:
    // "Assalamualaikum, I want [Service] service.
    // Name: [Name]
    // Service: [Service]
    // Requirement: [Requirement]"
    const serviceName = userService || "Printing";
    const fullMessage = [
      `Assalamualaikum, I want ${serviceName.toLowerCase()} service.`,
      `Name: ${userName.trim() || "Customer"}`,
      `Service: ${serviceName}`,
      `Requirement: ${userRequirement.trim() || "Please confirm availability and charges."}`,
    ].join("\n");

    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(fullMessage)}`;

    if (typeof window !== "undefined") {
      window.location.href = waUrl;
    }
  };

  return (
    <section
      id="quick-request"
      className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200"
      data-purpose="quick-request"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Side Copy */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 text-[#0E7490] font-bold text-xs uppercase tracking-wider">
              <span className="w-4 h-0.5 bg-[#0E7490]"></span>
              <span>Fast WhatsApp Inquiry</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Send your request <br />
              directly on WhatsApp.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Select your service, fill in your name and brief requirement, and review the ready message in WhatsApp before sending. Our shop staff will respond promptly during business hours.
            </p>
            <div className="pt-2">
              <Link
                id="guided-request-link"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 hover:text-[#0E7490] transition"
                href="/contact"
              >
                <span>Visit our contact &amp; directions page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Trust card */}
            <div id="trust-card-direct-wa" className="mt-4 sm:mt-6 p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <span className="shrink-0 w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  <Check className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">Direct Shop Response</h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                    No automated bots. You communicate directly with our shop operators in Akhtar Colony.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side WhatsApp Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm">
              <form id="whatsappForm" className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                      htmlFor="userName"
                    >
                      Your Name
                    </label>
                    <input
                      id="userName"
                      className="w-full rounded-xl border border-slate-300 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:border-[#0E7490] focus:ring-1 focus:ring-[#0E7490] py-3 px-3.5 transition outline-none"
                      placeholder="e.g. Ahmed Raza"
                      required
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>

                  {/* Service Selector */}
                  <div>
                    <label
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                      htmlFor="userService"
                    >
                      Select Service
                    </label>
                    <select
                      id="userService"
                      className="w-full rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:border-[#0E7490] focus:ring-1 focus:ring-[#0E7490] py-3 px-3.5 transition outline-none cursor-pointer"
                      required
                      value={userService}
                      onChange={(e) => setUserService(e.target.value)}
                    >
                      {WHATSAPP_SERVICE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Requirement */}
                <div>
                  <label
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                    htmlFor="userRequirement"
                  >
                    Short Requirement
                  </label>
                  <textarea
                    id="userRequirement"
                    className="w-full rounded-xl border border-slate-300 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:border-[#0E7490] focus:ring-1 focus:ring-[#0E7490] p-3.5 transition resize-y outline-none"
                    placeholder="e.g. 120 pages, PDF attached, need double sided B&W print"
                    required
                    rows={3}
                    value={userRequirement}
                    onChange={(e) => setUserRequirement(e.target.value)}
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    You can attach your PDF or document once WhatsApp opens.
                  </p>
                </div>

                {/* Submit */}
                <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    id="whatsapp-form-submit-btn"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] rounded-xl transition shadow-sm touch-action-btn"
                    type="submit"
                  >
                    <svg className="w-4 h-4 text-emerald-400 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span className="font-bold text-white" style={{ color: "#ffffff" }}>SEND VIA WHATSAPP</span>
                    <ArrowRight className="w-4 h-4 text-white" style={{ color: "#ffffff" }} />
                  </button>
                  <span className="text-xs text-slate-500 text-center sm:text-left">
                    Opens WhatsApp with your details already written.
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
