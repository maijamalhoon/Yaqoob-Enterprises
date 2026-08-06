"use client";

import { FormEvent, useMemo, useState } from "react";
import type { ServiceCategory } from "@/lib/types";

export function RequestForm({
  categories,
  whatsappNumber,
}: {
  categories: ServiceCategory[];
  whatsappNumber: string;
}) {
  const [categorySlug, setCategorySlug] = useState("");
  const [serviceSlug, setServiceSlug] = useState("");
  const selectedCategory = useMemo(
    () => categories.find((category) => category.slug === categorySlug),
    [categories, categorySlug],
  );
  const selectedService = selectedCategory?.services?.find((service) => service.slug === serviceSlug);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = [
      "Hello Yaqoob Enterprises,",
      "",
      `Name: ${String(data.get("name") || "")}`,
      `Service: ${selectedService?.title || selectedCategory?.title || "General enquiry"}`,
      `Preferred option: ${String(data.get("mode") || "Not sure")}`,
      `Location: ${String(data.get("location") || "")}`,
      `Requirement: ${String(data.get("details") || "")}`,
      "",
      "Please confirm availability, requirements and exact charges before starting.",
    ];
    const number = whatsappNumber.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
  }

  const availableModes = [
    { value: "Visit the shop", show: !selectedService || selectedService.available_at_shop },
    { value: "Shop pickup", show: !!selectedService?.pickup_available },
    { value: "Delivery", show: !!selectedService?.delivery_available },
    { value: "Doorstep appointment", show: !!selectedService?.doorstep_available },
    { value: "Not sure", show: true },
  ].filter((mode) => mode.show);

  return (
    <form className="request-form" onSubmit={submit}>
      <label>
        Your name
        <input name="name" autoComplete="name" required />
      </label>
      <label>
        Service category
        <select
          name="category"
          value={categorySlug}
          onChange={(event) => {
            setCategorySlug(event.target.value);
            setServiceSlug("");
          }}
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => <option key={category.id} value={category.slug}>{category.title}</option>)}
        </select>
      </label>
      {selectedCategory && (
        <label>
          Specific service
          <select name="service" value={serviceSlug} onChange={(event) => setServiceSlug(event.target.value)} required>
            <option value="">Select a service</option>
            {selectedCategory.services?.map((service) => <option key={service.id} value={service.slug}>{service.title}</option>)}
          </select>
        </label>
      )}
      <label>
        Preferred option
        <select name="mode" required>
          {availableModes.map((mode) => <option key={mode.value}>{mode.value}</option>)}
        </select>
      </label>
      <label>
        Your area
        <input name="location" placeholder="DHA, PECHS, Dhoraji…" />
      </label>
      <label>
        Requirement
        <textarea name="details" placeholder="Tell us what you need, quantity and preferred timing." required />
      </label>
      {selectedService?.important_note && <p className="form-note"><strong>Important:</strong> {selectedService.important_note}</p>}
      <button className="button button--primary" type="submit">Prepare WhatsApp request</button>
      <p className="field-help">This form does not upload or store your details. It prepares a WhatsApp message on your device.</p>
    </form>
  );
}
