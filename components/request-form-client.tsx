"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { getCustomerServiceModes, serviceNeedsAvailabilityConfirmation } from "@/lib/service-availability";
import type { RequestFormCategory } from "@/lib/client-data";

const unsureCategoryValue = "__unsure_category__";
const unsureServiceValue = "__unsure__";
const requestLimits = {
  name: 100,
  location: 160,
  details: 1600,
};

const visuallyHiddenStyle = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
} as const;

export function RequestFormClient({
  categories,
  whatsappNumber,
}: {
  categories: RequestFormCategory[];
  whatsappNumber: string;
}) {
  const [categorySlug, setCategorySlug] = useState("");
  const [serviceSlug, setServiceSlug] = useState("");
  const [mode, setMode] = useState("");
  const isUnsureCategory = categorySlug === unsureCategoryValue;
  const selectedCategory = useMemo(
    () => categories.find((category) => category.slug === categorySlug),
    [categories, categorySlug],
  );
  const isUnsureService = serviceSlug === unsureServiceValue;
  const selectedService = isUnsureService
    ? undefined
    : selectedCategory?.services?.find((service) => service.slug === serviceSlug);
  const requestedService = isUnsureCategory
    ? "Please guide me to the right service"
    : isUnsureService && selectedCategory
      ? `${selectedCategory.title} — please guide me to the exact service`
      : selectedService?.title || selectedCategory?.title || "General enquiry";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = [
      "Hello Yaqoob Enterprises,",
      "",
      `Customer name: ${String(data.get("name") || "")}`,
      `Requested service: ${requestedService}`,
      `Preferred service option: ${String(data.get("mode") || "Not sure")}`,
      `Area / location: ${String(data.get("location") || "") || "Not provided"}`,
      `Details: ${String(data.get("details") || "")}`,
      "",
      "Please confirm current availability, what is required, the expected time and the total charges before starting.",
    ];
    const number = whatsappNumber.replace(/[^0-9]/g, "");
    const url = `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;

    void fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ eventName: "whatsapp_click", pagePath: window.location.pathname }),
      keepalive: true,
    }).catch(() => undefined);

    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) window.location.assign(url);
  }

  const selectedModes = selectedService ? getCustomerServiceModes(selectedService) : [];
  const availabilityOnly = Boolean(selectedService && serviceNeedsAvailabilityConfirmation(selectedService));
  const availableModes = [
    { value: "Visit the shop", label: "Visit the shop", show: isUnsureCategory || isUnsureService || !selectedService || selectedModes.includes("Visit the shop") },
    { value: "Shop pickup", label: "Collect from the shop", show: selectedModes.includes("Shop pickup") },
    { value: "Delivery", label: "Request delivery", show: selectedModes.includes("Delivery") },
    { value: "Doorstep appointment", label: "Request a home visit", show: selectedModes.includes("Doorstep appointment") },
    {
      value: "Not sure",
      label: availabilityOnly ? "Ask about current availability" : "Not sure — please guide me",
      show: true,
    },
  ].filter((option) => option.show);
  const locationRequired = mode === "Delivery" || mode === "Doorstep appointment";
  const dynamicUpdate = locationRequired
    ? "Area or location is now required for this service option."
    : isUnsureCategory
      ? "Describe what you need and we’ll guide you to the right service."
      : selectedCategory && !serviceSlug
        ? "Exact service options are now available."
        : availabilityOnly
          ? "This service needs an availability check before fulfilment can be confirmed."
          : "";

  return (
    <form className="request-form request-form--guided" onSubmit={submit}>
      <p style={visuallyHiddenStyle} role="status" aria-live="polite" aria-atomic="true">{dynamicUpdate}</p>
      <label>
        <span className="field-label">Service</span>
        <select
          name="category"
          value={categorySlug}
          onChange={(event) => {
            setCategorySlug(event.target.value);
            setServiceSlug("");
            setMode("");
          }}
          required
        >
          <option value="">Choose a service</option>
          <option value={unsureCategoryValue}>I’m not sure which service I need</option>
          {categories.map((category) => <option key={category.id} value={category.slug}>{category.title}</option>)}
        </select>
      </label>
      {selectedCategory && (
        <label>
          <span className="field-label">Exact service</span>
          <select
            name="service"
            value={serviceSlug}
            onChange={(event) => {
              setServiceSlug(event.target.value);
              setMode("");
            }}
            required
          >
            <option value="">Choose exact service</option>
            <option value={unsureServiceValue}>I’m not sure — please guide me</option>
            {selectedCategory.services?.map((service) => <option key={service.id} value={service.slug}>{service.title}</option>)}
          </select>
        </label>
      )}
      <label>
        <span className="field-label">Service option</span>
        <select name="mode" value={mode} onChange={(event) => setMode(event.target.value)} required>
          <option value="">Choose an option</option>
          {availableModes.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
      {locationRequired && (
        <>
          <label>
            <span className="field-label">Area / location</span>
            <input
              name="location"
              autoComplete="address-level2"
              enterKeyHint="next"
              placeholder="Your area"
              maxLength={requestLimits.location}
              required
              aria-describedby="location-requirement"
            />
          </label>
          <p className="field-help field-help--notice" id="location-requirement">Required for delivery or home visit.</p>
        </>
      )}
      <label>
        <span className="field-label">Details</span>
        <textarea
          name="details"
          enterKeyHint="next"
          placeholder="Quantity, deadline or useful details"
          maxLength={requestLimits.details}
          required
        />
      </label>
      {selectedService?.important_note && <p className="form-note"><strong>Please note:</strong> {selectedService.important_note}</p>}
      <label>
        <span className="field-label">Name</span>
        <input
          name="name"
          autoComplete="name"
          enterKeyHint="send"
          placeholder="Your name"
          maxLength={requestLimits.name}
          required
        />
      </label>
      <button className="button button--primary request-submit" type="submit">
        <MessageCircle size={18} /> Continue on WhatsApp <ArrowRight size={17} />
      </button>
    </form>
  );
}
