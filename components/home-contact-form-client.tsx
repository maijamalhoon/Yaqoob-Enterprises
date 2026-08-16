"use client";

import { FormEvent } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { ANALYTICS_ENABLED } from "@/lib/env";
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
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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

    if (ANALYTICS_ENABLED) {
      void fetch("/api/analytics", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ eventName: "whatsapp_click", pagePath: window.location.pathname }),
        keepalive: true,
      }).catch(() => undefined);
    }

    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) window.location.assign(url);
  }

  return (
    <form className={styles.form} onSubmit={submit} data-home-contact-form>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>Your name</span>
          <input name="name" autoComplete="name" maxLength={100} placeholder="Your name" required />
        </label>
        <label className={styles.field}>
          <span>Service</span>
          <select name="service" defaultValue="" required>
            <option value="" disabled>Choose a service</option>
            <option value="__unsure__">I’m not sure — guide me</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>{category.title}</option>
            ))}
          </select>
        </label>
      </div>

      <label className={styles.field}>
        <span>What do you need?</span>
        <textarea
          name="details"
          maxLength={1200}
          placeholder="Tell us briefly what you need, quantity or deadline."
          required
        />
      </label>

      <div className={styles.submitRow}>
        <button className={styles.submit} type="submit">
          <MessageCircle size={18} /> Continue on WhatsApp <ArrowRight size={17} />
        </button>
      </div>
    </form>
  );
}
