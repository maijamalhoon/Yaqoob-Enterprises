"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";
import { CustomSelect } from "@/components/custom-select";
import styles from "./home-contact-form.module.css";

type HomeContactCategory = {
  id: string;
  slug: string;
  title: string;
};

export function HomeContactFormClient({
  categories,
  whatsappNumber,
  businessName,
}: {
  categories: HomeContactCategory[];
  whatsappNumber: string;
  businessName: string;
}) {
  const [serviceSlug, setServiceSlug] = useState("");
  const [serviceInvalid, setServiceInvalid] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!serviceSlug) {
      setServiceInvalid(true);
      const form = event.currentTarget;
      window.requestAnimationFrame(() => form.querySelector<HTMLButtonElement>(".custom-select__trigger")?.focus());
      return;
    }
    setServiceInvalid(false);
    const data = new FormData(event.currentTarget);
    const categorySlug = String(data.get("service") || "");
    const selectedCategory = categories.find((category) => category.slug === categorySlug);
    const service = categorySlug === "__unsure__"
      ? "Please guide me to the right service"
      : selectedCategory?.title || "General enquiry";
    const lines = [
      `Hello ${businessName},`,
      "",
      `Name: ${String(data.get("name") || "")}`,
      `Service: ${service}`,
      `Requirement: ${String(data.get("details") || "")}`,
      "",
      "Please confirm the next step, expected time and total charges.",
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

  return (
    <form className={styles.form} onSubmit={submit} data-home-contact-form>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>Your name</span>
          <input name="name" autoComplete="name" maxLength={100} required />
        </label>
        <div className={styles.field}>
          <span id="home-contact-service-label">Service</span>
          <CustomSelect
            id="home-contact-service"
            name="service"
            value={serviceSlug}
            labelledBy="home-contact-service-label"
            placeholder="Choose a service"
            required
            invalid={serviceInvalid}
            onChange={(value) => {
              setServiceSlug(value);
              setServiceInvalid(false);
            }}
            options={[
              { value: "__unsure__", label: "I’m not sure — guide me" },
              ...categories.map((category) => ({ value: category.slug, label: category.title })),
            ]}
          />
        </div>
      </div>

      <label className={styles.field}>
        <span>What do you need?</span>
        <textarea
          name="details"
          maxLength={1200}
          required
        />
      </label>

      <div className={styles.submitRow}>
        <button className={styles.submit} type="submit">
          <BrandIcon name="whatsapp" size={18} /> Continue on WhatsApp <ArrowRight size={17} />
        </button>
      </div>
    </form>
  );
}
