"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import type { BusinessSettings, Service } from "@/lib/types";

interface StitchQuickRequestProps {
  settings: BusinessSettings;
  services?: Service[];
}

const FALLBACK_SERVICE_OPTIONS = [
  "Printing",
  "Photocopying",
  "Color printing",
  "Notes and assignments",
  "Bulk printing",
  "Passport photos",
  "NADRA e-Sahulat",
  "Other",
];

export function StitchQuickRequest({ settings, services = [] }: StitchQuickRequestProps) {
  const serviceOptions = services
    .filter((service) => service.status !== "hidden")
    .map((service) => service.title);
  const options = serviceOptions.length > 0 ? serviceOptions : FALLBACK_SERVICE_OPTIONS;
  const defaultService =
    serviceOptions.find((title) => title.toLowerCase().includes("printing")) ||
    options[0] ||
    "Printing";
  const [userName, setUserName] = useState("");
  const [userService, setUserService] = useState("");
  const [userRequirement, setUserRequirement] = useState("");
  const selectedService = options.includes(userService) ? userService : defaultService;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const phone = (settings.whatsapp_e164 || "+923492568864").replace(/[^0-9]/g, "");
    const payload = JSON.stringify({
      eventName: "whatsapp_click",
      pagePath: window.location.pathname,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
    } else {
      void fetch("/api/analytics", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }

    const message = [
      "Hello Yaqoob Enterprises, I need help with " + selectedService + ".",
      "Name: " + userName.trim(),
      "Requirement: " + userRequirement.trim(),
    ].join("\n");

    window.location.href = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
  }

  return (
    <section
      id="quick-request"
      className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200"
      data-purpose="quick-request"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Request on WhatsApp
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2">
              Add your name, choose a service and describe what you need. Review the message before sending.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7">
              <form id="whatsappForm" className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-semibold text-slate-800 mb-1.5"
                      htmlFor="userName"
                    >
                      Your name
                    </label>
                    <input
                      id="userName"
                      name="name"
                      autoComplete="name"
                      maxLength={100}
                      className="w-full min-h-12 rounded-xl border border-slate-300 text-base text-slate-900 bg-white placeholder:text-slate-400 focus:border-[#0E7490] focus:ring-1 focus:ring-[#0E7490] px-3.5 transition"
                      placeholder="Your name"
                      required
                      type="text"
                      value={userName}
                      onChange={(event) => setUserName(event.target.value)}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold text-slate-800 mb-1.5"
                      htmlFor="userService"
                    >
                      Service
                    </label>
                    <select
                      id="userService"
                      name="service"
                      className="w-full min-h-12 rounded-xl border border-slate-300 text-base text-slate-900 bg-white focus:border-[#0E7490] focus:ring-1 focus:ring-[#0E7490] px-3.5 transition cursor-pointer"
                      required
                      value={selectedService}
                      onChange={(event) => setUserService(event.target.value)}
                    >
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold text-slate-800 mb-1.5"
                    htmlFor="userRequirement"
                  >
                    What do you need?
                  </label>
                  <textarea
                    id="userRequirement"
                    name="requirement"
                    maxLength={1200}
                    className="w-full min-h-32 rounded-xl border border-slate-300 text-base text-slate-900 bg-white placeholder:text-slate-400 focus:border-[#0E7490] focus:ring-1 focus:ring-[#0E7490] p-3.5 transition resize-y"
                    placeholder="Add the quantity, deadline or other useful details."
                    required
                    rows={4}
                    value={userRequirement}
                    onChange={(event) => setUserRequirement(event.target.value)}
                  />
                  <p className="text-xs text-slate-600 mt-2">
                    Attach files in WhatsApp. This form does not upload files.
                  </p>
                </div>

                <button
                  id="whatsapp-form-submit-btn"
                  className="w-full min-h-12 inline-flex items-center justify-center gap-2.5 px-5 text-base font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition touch-action-btn"
                  type="submit"
                >
                  <span>Continue on WhatsApp</span>
                  <ArrowRight className="w-4 h-4 text-white" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
