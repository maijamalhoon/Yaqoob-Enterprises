"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { BusinessSettings, Service } from "@/lib/types";

interface StitchQuickRequestProps {
  settings: BusinessSettings;
  services?: Service[];
}

const DEFAULT_SERVICES = [
  "NADRA e-Sahulat Biometric Verifications",
  "Printing, Photocopy & Document Scanning",
  "Passport-Size Photos",
  "Online Jobs, Forms & Applications",
  "Urdu & English Typing & CV Preparation",
  "Agreements & Document Preparation",
  "Cash Deposit, Withdrawal & Money Transfer",
  "Railway, Airline & Bus Tickets",
  "Stationery & Mobile Accessories",
  "Website Development, Full-Stack & SEO Services",
];

export function StitchQuickRequest({ settings, services }: StitchQuickRequestProps) {
  const [userName, setUserName] = useState("");
  const [userService, setUserService] = useState("");
  const [userMessage, setUserMessage] = useState("");

  const availableServices =
    services && services.length > 0
      ? services.filter((s) => s.status !== "hidden")
      : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = (settings.whatsapp_e164 || "+923492568864").replace(/\+/g, "");
    const business = settings.business_name || "Yaqoob Enterprises";

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

    const messageParts = [
      `Hello ${business},`,
      userName ? `My name is ${userName.trim()}.` : "",
      userService ? `Service required: ${userService}.` : "",
      userMessage ? `Details: ${userMessage.trim()}` : "",
    ].filter(Boolean);

    const fullMessage = messageParts.join("\n");
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(fullMessage)}`;

    if (typeof window !== "undefined") {
      // Use direct navigation to prevent mobile popup blocking
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
              <span>Quick Request</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Tell us what <br />
              you need.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Choose a service, add a short note, then review the prepared message in WhatsApp before sending. Our team replies in minutes during open hours.
            </p>
            <div className="pt-2">
              <Link
                id="guided-request-link"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 hover:text-[#0E7490] transition"
                href="/contact"
              >
                <span>Need more guidance? Use the guided request</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Trust card */}
            <div id="trust-card-direct-wa" className="mt-4 sm:mt-8 p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <span className="shrink-0 w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  <Check className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">Direct WhatsApp Assistance</h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                    No automated bots. Real staff members respond directly from the shop.
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
                      Your name
                    </label>
                    <input
                      id="userName"
                      className="w-full rounded-xl border border-slate-300 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 py-3 px-3.5 transition outline-none"
                      placeholder="e.g. Tariq Ahmed"
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
                      Service
                    </label>
                    <select
                      id="userService"
                      className="w-full rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 py-3 px-3.5 transition outline-none cursor-pointer"
                      required
                      value={userService}
                      onChange={(e) => setUserService(e.target.value)}
                    >
                      <option disabled value="">
                        Choose a service
                      </option>
                      {availableServices
                        ? availableServices.map((service) => (
                            <option key={service.id} value={service.title}>
                              {service.title}
                            </option>
                          ))
                        : DEFAULT_SERVICES.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                      <option value="General Inquiry">General Question / Other</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                    htmlFor="userMessage"
                  >
                    What do you need?
                  </label>
                  <textarea
                    id="userMessage"
                    className="w-full rounded-xl border border-slate-300 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 p-3.5 transition resize-y outline-none"
                    placeholder="Tell us briefly what you need, quantity or deadline."
                    required
                    rows={3}
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                  />
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
                    <span className="font-bold text-white" style={{ color: "#ffffff" }}>Continue on WhatsApp</span>
                    <ArrowRight className="w-4 h-4 text-white" style={{ color: "#ffffff" }} />
                  </button>
                  <span className="text-xs text-slate-500 text-center sm:text-left">
                    Opens WhatsApp directly with your message.
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
