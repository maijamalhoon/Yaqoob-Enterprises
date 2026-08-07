"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { ServiceCategory } from "@/lib/types";

const unsureServiceValue = "__unsure__";

export function RequestForm({
  categories,
  whatsappNumber,
}: {
  categories: ServiceCategory[];
  whatsappNumber: string;
}) {
  const [categorySlug, setCategorySlug] = useState("");
  const [serviceSlug, setServiceSlug] = useState("");
  const [mode, setMode] = useState("");
  const selectedCategory = useMemo(
    () => categories.find((category) => category.slug === categorySlug),
    [categories, categorySlug],
  );
  const isUnsureService = serviceSlug === unsureServiceValue;
  const selectedService = isUnsureService
    ? undefined
    : selectedCategory?.services?.find((service) => service.slug === serviceSlug);
  const hasExactServiceStep = Boolean(selectedCategory);
  const modeStep = hasExactServiceStep ? 4 : 3;
  const requestedService = isUnsureService && selectedCategory
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
      "Please confirm what is required, the expected time and the total charges before starting.",
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

  const availableModes = [
    { value: "Visit the shop", label: "Visit the shop", show: isUnsureService || !selectedService || selectedService.available_at_shop },
    { value: "Shop pickup", label: "Collect from the shop", show: !isUnsureService && !!selectedService?.pickup_available },
    { value: "Delivery", label: "Request delivery", show: !isUnsureService && !!selectedService?.delivery_available },
    { value: "Doorstep appointment", label: "Request a home visit", show: !isUnsureService && !!selectedService?.doorstep_available },
    { value: "Not sure", label: "Not sure — please guide me", show: true },
  ].filter((option) => option.show);
  const locationRequired = mode === "Delivery" || mode === "Doorstep appointment";
  const locationStep = modeStep + 1;
  const detailsStep = locationRequired ? locationStep + 1 : modeStep + 1;

  return (
    <form className="request-form request-form--guided" onSubmit={submit}>
      <label>
        <span className="field-label"><small>01</small>Your name</span>
        <input name="name" autoComplete="name" enterKeyHint="next" placeholder="e.g. Jamal Arain" required />
      </label>
      <label>
        <span className="field-label"><small>02</small>Service category</span>
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
          <option value="">Choose a service category</option>
          {categories.map((category) => <option key={category.id} value={category.slug}>{category.title}</option>)}
        </select>
      </label>
      {selectedCategory && (
        <label>
          <span className="field-label"><small>03</small>Exact service</span>
          <select
            name="service"
            value={serviceSlug}
            onChange={(event) => {
              setServiceSlug(event.target.value);
              setMode("");
            }}
            required
          >
            <option value="">Choose the exact service</option>
            <option value={unsureServiceValue}>I’m not sure — please guide me</option>
            {selectedCategory.services?.map((service) => <option key={service.id} value={service.slug}>{service.title}</option>)}
          </select>
        </label>
      )}
      <label>
        <span className="field-label"><small>{String(modeStep).padStart(2, "0")}</small>How do you want it?</span>
        <select name="mode" value={mode} onChange={(event) => setMode(event.target.value)} required>
          <option value="">Choose an option</option>
          {availableModes.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
      {locationRequired && (
        <>
          <label>
            <span className="field-label"><small>{String(locationStep).padStart(2, "0")}</small>Area / location — required</span>
            <input
              name="location"
              autoComplete="address-level2"
              enterKeyHint="next"
              placeholder="e.g. DHA, PECHS or Dhoraji"
              required
              aria-describedby="location-requirement"
            />
          </label>
          <p className="field-help field-help--notice" id="location-requirement" role="status" aria-live="polite">
            Add your area so we can check delivery or home-visit availability.
          </p>
        </>
      )}
      <label>
        <span className="field-label"><small>{String(detailsStep).padStart(2, "0")}</small>What do you need?</span>
        <textarea
          name="details"
          enterKeyHint="send"
          placeholder="Quantity, deadline, preferred time or any useful detail."
          required
        />
      </label>
      {selectedService?.important_note && <p className="form-note"><strong>Please note:</strong> {selectedService.important_note}</p>}
      <button className="button button--primary request-submit" type="submit">
        <MessageCircle size={18} /> Open in WhatsApp <ArrowRight size={17} />
      </button>
      <p className="field-help field-help--privacy">Review it in WhatsApp before sending.</p>
    </form>
  );
}
