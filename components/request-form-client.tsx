"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";
import { CustomSelect } from "@/components/custom-select";
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
  businessName,
}: {
  categories: RequestFormCategory[];
  whatsappNumber: string;
  businessName: string;
}) {
  const [categorySlug, setCategorySlug] = useState("");
  const [serviceSlug, setServiceSlug] = useState("");
  const [mode, setMode] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
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
    if (!categorySlug || (selectedCategory && !serviceSlug) || !mode) {
      setSubmitAttempted(true);
      const form = event.currentTarget;
      window.requestAnimationFrame(() => {
        form.querySelector<HTMLButtonElement>('.custom-select__trigger[aria-invalid="true"]')?.focus();
      });
      return;
    }
    setSubmitAttempted(false);
    const data = new FormData(event.currentTarget);
    const lines = [
      `Hello ${businessName},`,
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
      <div className="request-form__field">
        <span className="field-label" id="request-category-label">Service</span>
        <CustomSelect
          id="request-category"
          name="category"
          labelledBy="request-category-label"
          placeholder="Choose a service"
          required
          invalid={submitAttempted && !categorySlug}
          value={categorySlug}
          onChange={(value) => {
            setCategorySlug(value);
            setServiceSlug("");
            setMode("");
          }}
          options={[
            { value: unsureCategoryValue, label: "I’m not sure which service I need" },
            ...categories.map((category) => ({ value: category.slug, label: category.title })),
          ]}
        />
      </div>
      {selectedCategory && (
        <div className="request-form__field">
          <span className="field-label" id="request-service-label">Exact service</span>
          <CustomSelect
            id="request-service"
            name="service"
            labelledBy="request-service-label"
            placeholder="Choose exact service"
            required
            invalid={submitAttempted && !serviceSlug}
            value={serviceSlug}
            onChange={(value) => {
              setServiceSlug(value);
              setMode("");
            }}
            options={[
              { value: unsureServiceValue, label: "I’m not sure — please guide me" },
              ...(selectedCategory.services || []).map((service) => ({ value: service.slug, label: service.title })),
            ]}
          />
        </div>
      )}
      <div className="request-form__field">
        <span className="field-label" id="request-mode-label">Service option</span>
        <CustomSelect
          id="request-mode"
          name="mode"
          labelledBy="request-mode-label"
          placeholder="Choose an option"
          required
          invalid={submitAttempted && !mode}
          value={mode}
          onChange={setMode}
          options={availableModes}
        />
      </div>
      {locationRequired && (
        <>
          <label>
            <span className="field-label">Area / location</span>
            <input
              name="location"
              autoComplete="address-level2"
              enterKeyHint="next"
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
          maxLength={requestLimits.name}
          required
        />
      </label>
      <button className="button button--primary request-submit" type="submit">
        <BrandIcon name="whatsapp" size={18} /> Continue on WhatsApp <ArrowRight size={17} />
      </button>
    </form>
  );
}
